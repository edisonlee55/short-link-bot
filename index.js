const { Telegraf } = require('telegraf');
const { Application, Router } = require('@cfworker/web');
const createTelegrafMiddware = require('cfworker-middware-telegraf');
const { shorten } = require("./short.js")

const bot = new Telegraf(BOT_TOKEN);
const botOwners = BOT_OWNERS_ID.split(',');

bot.on('text', async (ctx) => {
    const userId = ctx.message.chat.id;
    const message = ctx.message.text;
    const ownerCheck = botOwners.includes(userId.toString());
    if (!ownerCheck)
        return await ctx.reply("You are not the bot owner!");
    if (message.startsWith("http")) {
        const result = await shorten(message);
        return await ctx.replyWithMarkdown(`Your [Link](${result}) is created!`)
    } else {
        return await ctx.reply("No URL Detected!")
    }
})

// Your code here, but do not `bot.launch()`

const router = new Router();
router.post(`/${WEBHOOK}`, createTelegrafMiddware(bot));
new Application().use(router.middleware).listen();
