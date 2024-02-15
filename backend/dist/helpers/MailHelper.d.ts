export declare class MailHelper {
    constructor();
    static emailHtml(description: any): Promise<string>;
    static sendMail(receiver_mail: any, subject: any, html: any): Promise<void>;
}
export default MailHelper;
