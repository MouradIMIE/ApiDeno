import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { config } from '../config/config.ts';


const sendMailInscription = async (email: string): Promise<void> => {
        const client = new SmtpClient();
    
        await client.connectTLS({
            hostname: "smtp.gmail.com",
            port: 465,
            username: "deno.api.eedsi@gmail.com",
            password: config.mailPassword,
        });
    
        await client.send({
            from: "deno.api.eedsi@gmail.com",
            to: email,
            subject: "Inscription",
            content: "Coucou",
        });
    
        await client.close();
}
const sendMailAddChild = async (email: string): Promise<void> => {
    const client = new SmtpClient();

    await client.connectTLS({
        hostname: "smtp.gmail.com",
        port: 465,
        username: "deno.api.eedsi@gmail.com",
        password: config.mailPassword,
    });

    await client.send({
        from: "deno.api.eedsi@gmail.com",
        to: email,
        subject: "Add Child",
        content: "Child succesfuly added",
    });

    await client.close();
}
const sendMailDeleteUser = async (email: string): Promise<void> => {
    const client = new SmtpClient();

    await client.connectTLS({
        hostname: "smtp.gmail.com",
        port: 465,
        username: "deno.api.eedsi@gmail.com",
        password: config.mailPassword,
    });

    await client.send({
        from: "deno.api.eedsi@gmail.com",
        to: email,
        subject: "Delete User",
        content: "Your account has been successfully deleted",
    });

    await client.close();
}
const sendMailSubscription = async (email: string): Promise<void> => {
    const client = new SmtpClient();

    await client.connectTLS({
        hostname: "smtp.gmail.com",
        port: 465,
        username: "deno.api.eedsi@gmail.com",
        password: config.mailPassword,
    });

    await client.send({
        from: "deno.api.eedsi@gmail.com",
        to: email,
        subject: "New Subscription",
        content: "Thanks for your subscription.You have 5min of free trial ! ",
    });

    await client.close();
}

const sendMailReSubscription = async (email: string): Promise<void> => {
    const client = new SmtpClient();

    await client.connectTLS({
        hostname: "smtp.gmail.com",
        port: 465,
        username: "deno.api.eedsi@gmail.com",
        password: config.mailPassword,
    });

    await client.send({
        from: "deno.api.eedsi@gmail.com",
        to: email,
        subject: "New Subscription",
        content: "Thanks for your subscription",
    });

    await client.close();
}


export { sendMailInscription, sendMailAddChild, sendMailDeleteUser, sendMailSubscription,sendMailReSubscription };