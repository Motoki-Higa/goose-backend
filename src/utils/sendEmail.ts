import { String } from "aws-sdk/clients/apigateway";

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendEmail(to: string, from: string, subject: string, text: String){
    const msg = {
        to,
        from,
        subject,
        html: text,
      };

    (async () => {
        try {
            await sgMail.send(msg);
        } catch (error) {
            console.error(error);
        
            if (error.response) {
            console.error(error.response.body)
            }
        }
    })();
}

module.exports = sendEmail;
