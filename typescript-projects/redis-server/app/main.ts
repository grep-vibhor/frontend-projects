import * as net from "net";
import Parser from 'respjs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';



console.log("Logs from your program will appear here!");



interface Cache<T> {
    [key: string]: T;
}

let cache_strs: Cache<string>= {}



const server_args = yargs(hideBin(process.argv))
    .option('dir', {
        alias: 'd',
        type: 'string',
        description: 'Directory name for persistence',
        demandOption: false,
    })
    .option('dbfilename', {
        alias: 'f',
        type: 'string',
        description: 'File name for persistence',
        demandOption: false,
    })
    .help()
    .argv;


function writeRESPArray(array: string[]): string {
    let resp = `*${array.length}\r\n`;
    for (const element of array) {
        resp += `$${element.length}\r\n${element}\r\n`;
    }
    return resp;
}

const server: net.Server = net.createServer((connection: net.Socket) => {

  const parser = new Parser();
    connection.on('data', (data: string) => {
        parser.write(data); // Feed raw data to the parser
        })

    parser.on('data', (command: string[]) => {
        const [commandName, ...args] = command;
        
        if (commandName.toUpperCase() === "PING"){
            connection.write(`+PONG\r\n`);
        }
        else if (commandName.toUpperCase() === "ECHO"){
            connection.write(`+${args}\r\n`);
        }

        else if (commandName.toUpperCase() === "SET"){

            /** SET STARTS */
            const key = args[0];
            const value = args[1];
            const options = args.slice(2); // Additional arguments (e.g. PX)

            let expiryTime: number | null = null;
            for (let i = 0; i < options.length; i += 2) {

                /** PX STARTS */
                if (options[i].toUpperCase() === 'PX') {
                    expiryTime = parseInt(options[i + 1], 10); 
                }
                /** PX ENDS */
                // Add other options handling as needed
            }

            cache_strs[key] = value;
            
            /** HANDLE PX */
            if (expiryTime) {
                setTimeout(() => delete cache_strs[key], expiryTime);
            }

            connection.write(`+OK\r\n`);

            /** SET ENDS */
        }
        else if (commandName.toUpperCase() === 'GET') {
            const key = args[0];
            const value = cache_strs[key];
            if (value !== undefined) {
                connection.write(value ? `+${value}\r\n` : `$-1\r\n`);
            }
            else {
                connection.write(`$-1\r\n`); // Proper Redis protocol for nil
            }
        }

        else if (commandName.toUpperCase() === 'CONFIG') {
            const whatConfig = args[0];
            
            if (whatConfig.toUpperCase() === "GET"){
                const whatConfigToGet = args[1];
                if(whatConfigToGet == "dir"){
                    connection.write(writeRESPArray(["dir", server_args.dir]));                  
                }
                else if(whatConfigToGet == "dbfilename"){
                    connection.write(writeRESPArray(["dbfilename", server_args.dbfilename]));                  
                }
                else{
                    connection.write(`+CONFIG NOT FOUND\r\n`);
                }
            }
            else{
                connection.write(`+CONFIG NOT FOUND\r\n`);
            }
        } 

        else{
            connection.write(`+COMMAND NOT FOUND\r\n`);
        }

    // const strData = data.toString()
    // if(strData === '*1\r\n$4\r\nPING\r\n'){
    //     connection.write(`+PONG\r\n`);
    // }
    // else if(strData.toUpperCase().includes("ECHO")) {
    //     const parts = strData.split('\r\n');
    //     const message = parts[parts.length - 2];
    //     console.log(message)
    //     connection.write(`+${message}\r\n`);
    // }

    // else if(strData.toUpperCase().includes("SET")) {
    //     const parts = strData.split('\r\n');
    //     console.log(parts)
    //     const key = parts[parts.length - 4];
    //     const value = parts[parts.length - 2];
    //     cache_strs[key] = value
    //     connection.write(`+OK\r\n`);
    // }

    // else if(strData.toUpperCase().includes("GET")) {
    //     const parts = strData.split('\r\n');
    //     const key = parts[parts.length - 2];
    //     if (Object.keys(cache_strs).includes(key)){
    //         const value = cache_strs[key]
    //         if (value !== undefined) {
    //             connection.write(`+${value}\r\n`);
    //         } else {
    //             connection.write(`$-1\r\n`); // Proper Redis protocol for nil
    //         }
    //     }
    //     else{
    //         console.log("Key does not exists")
    //         connection.write(`$-1\r\n`); // Proper Redis protocol for nil
    //     }     
    // }
    // else{
    //     console.log("Command Not Found")
    //     connection.write(`+Command Not Found\r\n`);
    // }
  })

  connection.on('error', (err: net.error) => {
    console.error('Connection error:', err);
  });

  connection.on('end', () => {
    console.log('Connection ended');
  });


});

server.listen(6379, "127.0.0.1");
