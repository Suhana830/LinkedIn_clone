import { MailtrapClient } from "mailtrap";
import dotenv from 'dotenv';

dotenv.config()





const TOKEN = "d196e4e412117136847dc06eda64bf28";


export const mailtrapClient = new MailtrapClient({ token: TOKEN });


export const sender = { name: "Mailtrap Test", email: "hello@demomailtrap.co" };