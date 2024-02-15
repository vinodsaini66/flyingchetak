"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESPONSE = void 0;
exports.RESPONSE = {
    get: {
        product: "Product Get Successfully",
        order: "Order Get Successfully",
        booking: "Booking Get Successfully",
        list: "List Get Successfully",
    },
    otp: {
        verified: "Otp Verification Success",
        sent: "Otp Send Successfully",
        invalid: "OTP Invalid, Verification Failed!",
    },
    complete: {
        order: "Order Complete Success",
        booking: "Job Complete Success",
    },
    statusChange: {
        job: "Job Status Change Success",
        order: "Order Status Change Success",
    },
    notFound: {
        product: "Product Not Found",
        variant: "Variant Not Found",
        order: "Order Not Found",
        booking: "Booking Not Found",
    },
    unexpected: {
        string: "Something Went Wrong",
    },
};
