import { Server } from './server';
const server: any = require('http').Server(new Server().app);
import socketObj from './services/SocketService';
let port = process.env.PORT || 8002;
server.listen(port, () => {
	console.log(`server is listening at port ${port}`);
	socketObj.init(server);
	socketObj.connect();
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

