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


export { sendMailInscription, sendMailAddChild };