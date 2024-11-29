A toy HTTP Server clone that's capable of handling
basic requests like:

* curl -v http://localhost:4221: return 200
* curl -v http://localhost:4221/abcdefg: return 200 or 404
* curl -v http://localhost:4221/echo/{str}: simply prints response with echo string
* curl -v http://localhost:4221/user-agent: reads User-Agent header from request

* File Handling
```
curl -v --data "12345" -H "Content-Type: application/octet-stream" http://localhost:4221/files/file_123

curl  http://localhost:4221/files/file_123
```



# Usage

The entry point for implementation is in `app/main.ts`. 

```sh
npm install
bun run app/main.ts
```

* For file handling endpoints
```
bun run app/main.ts  --directory /tmp
```

That's all!
