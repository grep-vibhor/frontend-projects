A toy Redis clone that's capable of handling
basic commands like `PING`, `SET` and `GET` using the Redis protocol and more.


# Usage

The entry point for Redis implementation is in `app/main.ts`. 

```sh
npm install
bun run app/main.ts --dir /tmp/vibhor-files --dbfilename dump.rdb
```

That's all!
