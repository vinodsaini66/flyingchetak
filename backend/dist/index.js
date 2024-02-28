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
// import { Server } from './server';
// const server: any = require('http').Server(new Server().app);
// import socketObj from './services/SocketService';
// import cluster from 'cluster';
// import * as os from 'os'
// const totalCpu = os.cpus().length;
// console.log(totalCpu)
// console.log("cluster",cluster)
// if(cluster.isPrimary){
//     for(let i = 0; i < totalCpu; i++){
//         cluster.fork();
//     }
// }else{  
// let port = process.env.PORT || 8002;
// server.listen(port, () => {
// 	console.log(`server is listening at port ${port}`);
// 	socketObj.init(server);
// 	socketObj.connect();
// 	console.log('Socket Connected');
// });
// }
