import * as net from "net";
import httpStringParser from 'http-string-parser';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { promises as fs } from 'fs';


console.log("Logs from your program will appear here!");


interface FileMetaData {
    exists: boolean
    contents: string | null
    sizeInBytes: number
}

let headers: Record<string,string> = {};
let method: string = '';
let path: string = '';
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

const server = net.createServer((socket: net.Socket) => {
  
    socket.on("data", async (data: string) => {

        const parsedRequest = httpStringParser.parseRequest(data.toString());
        method = parsedRequest.method
        headers = parsedRequest.headers
        path = parsedRequest.uri
        body = parsedRequest.body

        if (path === "/"){
            socket.write("HTTP/1.1 200 OK\r\n\r\n")
        }
        else if (path.startsWith("/echo")){

            const echoStr = path.split("/")[2]
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${echoStr.length}\r\n\r\n${echoStr}`)
        }

        else if (path.startsWith("/user-agent")){

            const userAgent: string | undefined = headers["User-Agent"]
            
            if (userAgent){
                socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`)
            }
            else{
                socket.write("HTTP/1.1 400 User Agent Not Found\r\n\r\n")
            }
        }

        else if (path.startsWith("/files")){

            const fileName: string = path.split("/")[2]

            const fileData: FileMetaData = await readFileDetails(`${server_args.directory}/${fileName}`)

            if (fileData.exists){
                socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${fileData.sizeInBytes}\r\n\r\n${fileData.contents}`)
            }
            else{
                socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
            }
        }

        else{
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
        }
    })
    
    socket.on("error", (err: net.error) => {
        console.error('Connection error:', err)
        socket.end();
      });

    
    socket.on("close", () => {
        socket.end();
    });
});

server.listen(4221, "localhost");
