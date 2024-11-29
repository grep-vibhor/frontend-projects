import * as net from "net";
import httpStringParser from 'http-string-parser';

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");



let headers: Record<string,string> = {};
let method: string = '';
let path: string = '';
let body: string = '';


const server = net.createServer((socket: net.Socket) => {
  
    socket.on("data", (data: string) => {

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

        else{
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n")
        }
    })
    
    socket.on("error", (err) => {
        console.error('Connection error:', err)
        socket.end();
      });

    
    socket.on("close", () => {
        socket.end();
    });
});

server.listen(4221, "localhost");
