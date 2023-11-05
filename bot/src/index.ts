import { Bot } from './structures/Bot';
import dotenv from 'dotenv';
dotenv.config();

const bot = new Bot();
bot.init();