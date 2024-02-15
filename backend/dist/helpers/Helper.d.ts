declare class Helper {
    admin: any;
    constructor();
    initializeAdmin(): Promise<void>;
    generateAlphaString(length: any): string;
    generatePassword(length: any, options: any): Promise<string>;
    generateRandomString(length: any, options: any): Promise<string>;
    sendSMS(to: any, body: any): Promise<boolean>;
    sendMultiCastNotification(from: any, to_id: any, title: any, description: any, notification_for: any, message: string, users: any): Promise<any>;
    getFileExtension(url: any): Promise<any>;
    sendNotification(from_id: any, to_id: any, title: any, description: any, data?: any): Promise<any>;
    sendNotificationToAdmin(from_id: any, to_id: any, title: any, description: any): Promise<void>;
    sendMultipleNotification(notifications: {
        to_id: string;
        from_id: string;
        title: string;
        description: string;
        is_read: string;
    }[]): Promise<void>;
}
declare const _default: Helper;
export default _default;
