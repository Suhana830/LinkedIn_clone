import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { createCommentNotificationEmailTemplate, createConnectionAcceptedEmailTemplate, createWelcomeEmailTemplate } from "./email_template.js";




export const sendWelcomeEmail = async (email, name, profileUrl) => {

    try {

        const response = mailtrapClient
            .send({
                from: sender,
                to: [{ email: email }],
                subject: "Welcome to Unlinked",
                html: createWelcomeEmailTemplate(name, profileUrl),
                category: "WELCOME",
            })
            .then(console.log)
            .catch(console.error);

        console.log("Welcome Email sent successfully ", response)

    } catch (error) {
        console.log("not send", error.message)
    }

}

export const sendCommentNotificationEmail = async (recipientEmail, recipientName, commenterName, postUrl, commentContent) => {

    try {

        const response = mailtrapClient
            .send({
                from: sender,
                to: [{ email: email }],
                subject: "Someone comment on your Post",
                html: createCommentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent),
                category: "COMMENT notification",
            })
            .then(console.log)
            .catch(console.error);

        console.log("Welcome Email sent successfully ", response)

    } catch (error) {
        console.log("not send", error.message)
    }
}

export const sendConnectionAcceptedEmail = async (senderEmail, senderName, recipientName, profileUrl) => {
    const recipient = [{ email: senderEmail }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: `${recipientName} Accept your Request`,
            html: createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl),
            category: "COMMENT notification",
        })
    } catch (error) {
        console.log("not send", error.message)
    }
}



