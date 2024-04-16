"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const Jwt = require("jsonwebtoken");
const socket_io_1 = require("socket.io");
// import { ChatController } from "../controllers/chat/ChatController";
const User_1 = require("../models/User");
class SocketService {
    constructor() {
        this.io;
        this.sockets = [];
        this.onlineUsers = [];
        this.blockData;
    }
    init(server) {
        this.io = new socket_io_1.Server(server, {
            maxHttpBufferSize: 100000000,
            connectTimeout: 5000,
            transports: ['websocket', 'polling'],
            pingInterval: 25 * 1000,
            pingTimeout: 5000,
        });
    }
    provideSocket(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Provide Socket For ID', id);
            let userSocket = this.sockets[id];
            return userSocket;
        });
    }
    globalSocket() {
        return this.io;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            //This middleware is used to validate the user using jwt token
            this.io.use((socket, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const query = socket.handshake.query;
                    const token = query.token;
                    console.log('query ', JSON.stringify(socket.handshake.query));
                    if (!token) {
                        console.log('if token not present');
                        // return next(new AppError('You are not logged in, please login again', RESPONSE.HTTP_UNAUTHORIZED));
                    }
                    Jwt.verify(token, 'game', (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            let currentUser = yield User_1.default.findById(decoded).lean();
                            socket.data.user = currentUser;
                            console.log('CurrentUser', currentUser);
                            next();
                        }
                    }));
                }
                catch (error) {
                    next(error);
                }
            }));
            this.io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
                console.log("socketworking==========>>>>>>>>>>");
                this.onlineUsers.push(socket.id);
                this.sockets[socket.data.user._id] = socket;
                socket.on('sendMessage', (data, callback) => {
                    let memberSocket = null;
                    data.senderId = socket.data.user._id;
                    memberSocket = data.receiverId || null;
                    // ChatController.sendMessage(data, callback, memberSocket, this.io);
                });
                // Second Method
                // *@api {emit} chatHistory Chat History
                /**
                 *@apiVersion 1.0.0
                 *@apiGroup Chat
                 *@apiParamExample Normal-Request-Body :
                 *{"receiverId":"622eec5075f7674b7cd5e86f"}
                 **/
                socket.on('chatHistory', (data, callback) => {
                    let memberSocket = null;
                    data.senderId = socket.data.user._id;
                    // ChatController.chatHistory(data, callback);
                });
                // Third Method
                // *@api {emit} chatList Chat List
                /**
                 *@apiVersion 1.0.0
                 *@apiGroup Chat
                 *@apiParamExample Normal-Request-Body :
                 * {"page":1,"limit":50,"search_text":"Hello"}
                 **/
                socket.on('chatList', (data, callback) => {
                    console.log('socketData', socket.data);
                    let memberSocket = null;
                    data.senderId = socket.data.user._id;
                    data.user = socket.data.user;
                    // ChatController.chatList(data, callback, socket);
                });
                // Fourth Method
                socket.on('readMessage', (data, callback) => {
                    console.log('socketData', socket.data);
                    // ChatController.readMessage(data, callback);
                });
                socket.on('disconnect', (data) => __awaiter(this, void 0, void 0, function* () {
                    console.log('User Disconnect.');
                    let socket_key = this.getKeyByValue(this.sockets, socket);
                    delete this.sockets[socket_key];
                    this.onlineUsers.splice(this.onlineUsers.indexOf(socket.id), 1);
                    console.log('Online Users After Disconnect', this.onlineUsers.length);
                }));
            }));
        });
    }
    getKeyByValue(object, value) {
        return Object.keys(object).find((key) => object[key] === value);
    }
}
exports.SocketService = SocketService;
SocketService.activeSockets = [];
let socketObj = new SocketService();
exports.default = socketObj;
