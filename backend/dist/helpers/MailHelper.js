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
exports.MailHelper = void 0;
const AdminSetting_1 = require("../models/AdminSetting");
const nodemailer = require('nodemailer');
class MailHelper {
    constructor() { }
    static emailHtml(description) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminSettings = yield AdminSetting_1.default.findOne();
            const email = adminSettings.email;
            const phone = '+ ' + (adminSettings === null || adminSettings === void 0 ? void 0 : adminSettings.country_code) + ' ' + (adminSettings === null || adminSettings === void 0 ? void 0 : adminSettings.mobile_number);
            const html = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, shrink-to-fit=no" />
            <title>Game</title>
            <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">
        </head>
        <body style="font-family: 'Lato', 'Merriweather', 'Roboto', sans-serif;">
            <div class="mainEmailWraper" style="max-width: 680px; margin: 0 auto;">
                <div class="emailHeader" style=" padding: 16px; background-color: #0089B6; border-radius: 8px 8px 0 0;">
                    <div class="logoOuter" style="width:120px; margin:0 auto;">
                        <img src=${process.env.BASE_URL + `img/Logo.png`} alt="" style="filter:brightness(1000);width:100%;" />
                    </div>
                </div>
        
                <div class="emailTempBody" style="margin-top: 16px;">
                    <div style="padding: 16px; background-color: #eaeeef; gap: 16px;">
                        ${description}
                    </div>
                </div>
        
                <div class="emailFooter" style="padding: 16px; background-color: #0089B6; border-radius: 0 0 8px 8px; text-align: center;">
                    <div class="title" style="font-size: 16px; color: #fff; font-weight: 500;">Please Email us or Call us if you have any queries.</div>
                    <div class="contactDetail" style="display: inline-block; margin-top: 8px;">
                        <span class="email" style="display: inline-block; align-items: center; gap: 4px;">
                            <span class="icon" style="width: 24px; height: 24px; flex:0 0 auto;display: inline-block;">
                                <img style="width: 100%; margin-bottom:-7px;" src=${process.env.BASE_URL +
                `img/icon/emailIcon.png`} alt="">
                            </span>
                            <a href="mailto:${email}"  style="text-decoration: none; color: #fff; font-size: 16px;">${email}</a>
                        </div>
                        <span class="phone" style="display: inline-block; align-items: center; gap: 4px;">
                            <span class="icon" style="width: 24px; height: 24px; flex:0 0 auto;display: inline-block;">
                                <img style="width: 100%; margin-bottom:-7px;" src=${process.env.BASE_URL + `img/icon/callIcon.png`} alt="">
                            </span>
                            <a href="tel:${phone} style="text-decoration: none; color: #fff; font-size: 16px;">${phone}</a>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    </html>`;
            return html;
        });
    }
    static sendMail(receiver_mail, subject, html) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD,
                },
            });
            let mailOptions = {
                from: 'Game <process.env.MAIL_USERNAME>',
                to: receiver_mail,
                subject: subject,
                html: yield MailHelper.emailHtml(html),
            };
            // Send the email
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error('Error while sending an email : ', error);
                    return false;
                }
                else {
                    console.log('An email has been sent successfully : ', info.response);
                    return true;
                }
            });
        });
    }
}
exports.MailHelper = MailHelper;
exports.default = MailHelper;
