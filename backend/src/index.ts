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

