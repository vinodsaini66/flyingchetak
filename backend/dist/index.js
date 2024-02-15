"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const server = require('http').Server(new server_1.Server().app);
const SocketService_1 = require("./services/SocketService");
let port = process.env.PORT || 8002;
server.listen(port, () => {
    console.log(`server is listening at port ${port}`);
    SocketService_1.default.init(server);
    SocketService_1.default.connect();
    console.log('Socket Connected');
});
