import { MailtrapClient } from "mailtrap"



const TOKEN = "d196e4e412117136847dc06eda64bf28";


const client = new MailtrapClient({ token: TOKEN });

const sender = { name: "Mailtrap Test", email: "hello@demomailtrap.co" };

client
    .send({
        from: sender,
        to: [{ email: 'suhanagupta809036@gmail.com' }],
        subject: "Hello from Mailtrap!",
        text: "Welcome to Mailtrap Sending!",
    })
    .then(console.log)
    .catch(console.error);