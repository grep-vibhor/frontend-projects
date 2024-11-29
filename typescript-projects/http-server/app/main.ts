import * as net from "net";
import httpStringParser from 'http-string-parser';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { promises as fs } from 'fs';
import path from 'path';

console.log("Logs from your program will appear here!");


interface FileMetaData {
    exists: boolean
    contents: string | null
    sizeInBytes: number
}

let headers: Record<string,string> = {};
let method: string = '';
let uri: string = '';
let body: string = '';

const server_args = yargs(hideBin(process.argv))
    .option('directory', {
        alias: 'd',
        type: 'string',
        description: 'Directory name to save file on server',
        demandOption: false,
    })
    .help()
    .argv;

async function readFileDetails(filePath: string): Promise<FileMetaData> {
    try {
        // Check if file exists
        await fs.access(filePath);
    
        // Get file stats
        const stats = await fs.stat(filePath);
    
        // Read file contents as a string
        const fileContents = await fs.readFile(filePath, 'utf-8');
    
        return {
            exists: true,
            contents: fileContents,
            sizeInBytes: stats.size
        };
    } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        // File does not exist
        return {
            exists: false,
            contents: null,
            sizeInBytes: 0
        };
        }
        
        throw error;
    }
}

async function createAndWriteFile(filePath: string, contents: string, options?: { 
    encoding?: BufferEncoding, 
    flag?: string 
  }) {
    try {
      // Ensure the directory exists
      const directory = path.dirname(filePath);
      await fs.access(directory);
  
      // Write contents to the file
      await fs.writeFile(filePath, contents, {
        encoding: options?.encoding ?? 'utf-8',
        flag: options?.flag ?? 'w' 
      });
  
      console.log(`File successfully created at: ${filePath}`);
  
      const stats = await fs.stat(filePath);
      return {
        path: filePath,
        size: stats.size
      };
    } catch (error) {
      console.error('Error creating/writing file:', error);
      throw error;
    }
}



const server = net.createServer((socket: net.Socket) => {
  
    socket.on("data", async (data: string) => {

        const parsedRequest = httpStringParser.parseRequest(data.toString());
        method = parsedRequest.method
        headers = parsedRequest.headers
        uri = parsedRequest.uri
        body = parsedRequest.body

        if (uri === "/"){
            socket.write("HTTP/1.1 200 OK\r\n\r\n")
        }
        else if (uri.startsWith("/echo")){

            const echoStr = uri.split("/")[2]
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${echoStr.length}\r\n\r\n${echoStr}`)
        }

        else if (uri.startsWith("/user-agent")){

            const userAgent: string | undefined = headers["User-Agent"]
            
            if (userAgent){
                socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`)
            }
            else{
                socket.write("HTTP/1.1 400 User Agent Not Found\r\n\r\n")
            }
        }

        else if (uri.startsWith("/files")){

            const fileName: string = uri.split("/")[2]

            if(method === "GET"){
                const fileData: FileMetaData = await readFileDetails(`${server_args.directory}/${fileName}`)

                if (fileData.exists){
                    socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${fileData.sizeInBytes}\r\n\r\n${fileData.contents}`)
                }
                else{
                    socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
                }
            }
            else{
                console.log(body)
                await createAndWriteFile(`${server_args.directory}/${fileName}`, body)
                socket.write("HTTP/1.1 201 Created\r\n\r\n")
            }
        }

        else{
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
        }
    })
    
    socket.on("error", (err: net.err) => {
        console.error('Connection error:', err)
        socket.end();
      });

    
    socket.on("close", () => {
        socket.end();
    });
});

server.listen(4221, "localhost");
