import dotenv from 'dotenv/config';


export async function sendSMS(message, phoneNumber) {
    const sms_data = {
        user_api_key: process.env.SMS_API_KEY,
        sms_message: message,
        sms_to_phone: phoneNumber
    };
    const formData = new URLSearchParams(sms_data).toString();
    await fetch(process.env.SMS_PROVIDER, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    });
}