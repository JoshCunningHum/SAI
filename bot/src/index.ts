import { Client } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

console.log("Bot is starting...");

const token = process.env.BOT_TOKEN;

const client = new Client({
    intents: []
});
client.login(token);

console.log(client);