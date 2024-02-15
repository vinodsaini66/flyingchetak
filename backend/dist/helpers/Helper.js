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
const firebase_1 = require("../config/firebase");
// import Notification from "../models/Notification";
const User_1 = require("../models/User");
const user_type_enum_1 = require("../constants/user-type.enum");
// import NotificationUser from "../models/NotificationUser";
const twilio = require('twilio');
class Helper {
    constructor() {
        this.initializeAdmin();
    }
    initializeAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            this.admin = yield User_1.default.findOne({ type: user_type_enum_1.USER_TYPE.admin });
        });
    }
    generateAlphaString(length) {
        var result = [];
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            var randomIndex = Math.floor(Math.random() * charactersLength);
            result.push(characters[randomIndex]);
        }
        return result.join('');
    }
    generatePassword(length, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsChars = {
                digits: '1234567890',
                lowercase: 'abcdefghijklmnopqrstuvwxyz',
                uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                symbols: '@$!%&',
            };
            const chars = [];
            for (let key in options) {
                if (options.hasOwnProperty(key) &&
                    options[key] &&
                    optionsChars.hasOwnProperty(key)) {
                    chars.push(optionsChars[key]);
                }
            }
            if (!chars.length)
                return '';
            let password = '';
            for (let j = 0; j < chars.length; j++) {
                password += chars[j].charAt(Math.floor(Math.random() * chars[j].length));
            }
            if (length > chars.length) {
                length = length - chars.length;
                for (let i = 0; i < length; i++) {
                    const index = Math.floor(Math.random() * chars.length);
                    password += chars[index].charAt(Math.floor(Math.random() * chars[index].length));
                }
            }
            return password;
        });
    }
    generateRandomString(length, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsChars = {
                digits: '1234567890',
                lowercase: 'abcdefghijklmnopqrstuvwxyz',
                uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            };
            const chars = [];
            for (let key in options) {
                if (options.hasOwnProperty(key) &&
                    options[key] &&
                    optionsChars.hasOwnProperty(key)) {
                    chars.push(optionsChars[key]);
                }
            }
            if (!chars.length)
                return '';
            let randomString = '';
            for (let j = 0; j < chars.length; j++) {
                randomString += chars[j].charAt(Math.floor(Math.random() * chars[j].length));
            }
            if (length > chars.length) {
                length = length - chars.length;
                for (let i = 0; i < length; i++) {
                    const index = Math.floor(Math.random() * chars.length);
                    randomString += chars[index].charAt(Math.floor(Math.random() * chars[index].length));
                }
            }
            return randomString;
        });
    }
    sendSMS(to, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountSid = process.env.TWILIO_ACCOUNT_SID;
            const authToken = process.env.TWILIO_AUTH_TOKEN;
            const twilioNumber = process.env.TWILIO_NUMBER
                ? process.env.TWILIO_NUMBER
                : '+18557611599';
            const client = new twilio(accountSid, authToken);
            try {
                const message = yield client.messages.create({
                    body: body,
                    to: '+' + to,
                    from: twilioNumber,
                });
                console.log('SMS has been sent successfully', message);
                return true;
            }
            catch (error) {
                console.error('Somthing went wrong, Error is', error);
                return false;
            }
        });
    }
    sendMultiCastNotification(from, to_id, title, description, notification_for, message, users) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get To User ID Token.
                const receiverToken = (yield User_1.default.find({ _id: { $in: to_id } }))
                    .filter((item) => item === null || item === void 0 ? void 0 : item.device_token)
                    .map((item) => item.device_token);
                // await Notification.create({
                //   notification_for: notification_for,
                //   title: title,
                //   message,
                //   description,
                //   users,
                //   send_by: from,
                // });
                /* if (receiverToken && receiverToken.length) {
    
                    const message = {
                        notification: {
                            title   : title,
                            body    : description,
                          },
                          token: receiverToken,
                        };
                        
                    firebaseAdmin.messaging().sendMulticast(message).then((response) => {
                        console.log("Notification sent successfully : ", response);
                      });
                    } */
            }
            catch (error) {
                return error;
            }
        });
    }
    getFileExtension(url) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the last part of the URL after the last '/'
            const filename = url.substring(url.lastIndexOf('/') + 1);
            // Get the file extension by getting the last part of the filename after the last '.'
            const extension = filename.substring(filename.lastIndexOf('.') + 1);
            return extension;
        });
    }
    sendNotification(from_id, to_id, title, description, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get To User ID Token.
                const receiver = yield User_1.default.findById(to_id);
                console.log(receiver, '----------------------------------------------------notification receiver');
                // const t = await new NotificationUser({
                //   from_id: from_id,
                //   to_id: to_id,
                //   title: title,
                //   description: description,
                //   is_read: false,
                //   data: !!data ? data : null
                // }).save();
                if (receiver && receiver.device_token) {
                    const message = {
                        notification: {
                            title: title,
                            body: description,
                        },
                        token: receiver.device_token,
                    };
                    firebase_1.default
                        .messaging()
                        .send(message)
                        .then((response) => {
                        console.log('Notification sent successfully : ', response);
                    })
                        .catch((error) => {
                        return error;
                    });
                }
                console.log('notifi sent successfully -----------------------');
                return true;
            }
            catch (error) {
                console.log('Error while sending notification : ', error);
                return error;
            }
        });
    }
    sendNotificationToAdmin(from_id, to_id, title, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get To User ID Token.
                const receiver = yield User_1.default.findOne({ type: user_type_enum_1.USER_TYPE.admin });
                // If user notification toggle is true then only send notification to receiver user.
                if (!!receiver && !!(receiver === null || receiver === void 0 ? void 0 : receiver._id)) {
                    // await new NotificationUser({
                    //   from_id: from_id,
                    //   to_id: receiver._id,
                    //   title: title,
                    //   description: description,
                    //   is_read: false,
                    // }).save();
                    if (receiver && receiver.device_token) {
                        const message = {
                            notification: {
                                title: title,
                                body: description,
                            },
                            token: receiver.device_token,
                        };
                        firebase_1.default
                            .messaging()
                            .send(message)
                            .then((response) => {
                            console.log('Notification sent successfully : ', response);
                        })
                            .catch((err) => console.log(err, 'Firebase ERROR'));
                    }
                }
            }
            catch (error) {
                console.log('Error while sending notification : ', error);
                // return error;
            }
        });
    }
    sendMultipleNotification(notifications) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = new Date().getTime();
                yield notifications.forEach((notification) => __awaiter(this, void 0, void 0, function* () {
                    const receiver = yield User_1.default.findById(notification.to_id);
                    if (receiver && receiver.device_token) {
                        const message = {
                            notification: {
                                title: notification.title,
                                body: notification === null || notification === void 0 ? void 0 : notification.description,
                            },
                            token: receiver.device_token,
                        };
                        firebase_1.default
                            .messaging()
                            .send(message)
                            .then((response) => {
                            console.log('Notification sent successfully : ', response);
                        })
                            .catch((error) => {
                            return error;
                        });
                    }
                }));
                // await NotificationUser.insertMany(notifications);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = new Helper();
