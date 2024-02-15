export declare class SocketService {
    io: any;
    sockets: any;
    onlineUsers: any;
    blockData: any;
    static activeSockets: any;
    constructor();
    init(server: any): void;
    provideSocket(id: any): Promise<any>;
    globalSocket(): any;
    connect(): Promise<void>;
    getKeyByValue(object: any, value: any): string;
}
declare let socketObj: SocketService;
export default socketObj;
