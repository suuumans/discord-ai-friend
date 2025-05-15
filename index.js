
import { Client, GatewayIntentBits } from "discord.js";
import { generateResponse } from "./ai.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`Bot is online as ${client.user.tag}`);
});
// Extract the response processing logic into a separate function
// filepath: /Users/suman/programming/discord-bot/index.js
async function processAndSendResponse(message, query, userId) {
  await message.channel.sendTyping();
  const response = await generateResponse(query, userId);

  // Split by code blocks (```), keeping code and text chunks together
  const parts = response.split(/(```[\s\S]*?```)/g).filter(Boolean);

  for (const part of parts) {
    if (part.startsWith('```') && part.endsWith('```')) {
      // It's a code block
      if (part.length <= 2000) {
        await message.reply(part);
      } else {
        // Too big: split code block by lines, keep language if present
        const lines = part.split('\n');
        const firstLine = lines[0]; // ```lang or ```
        let chunk = firstLine + '\n';
        for (let i = 1; i < lines.length; i++) {
          if ((chunk + lines[i] + '\n```').length > 2000) {
            chunk += '```';
            await message.reply(chunk);
            chunk = firstLine + '\n';
          }
          chunk += lines[i] + '\n';
        }
        if (chunk.trim() !== firstLine) {
          chunk += '```';
          await message.reply(chunk);
        }
      }
    } else {
      // Not a code block, just text
      if (part.length <= 2000) {
        await message.reply(part);
      } else {
        // Split long text by paragraphs
        const paragraphs = part.split('\n\n');
        let chunk = '';
        for (const para of paragraphs) {
          if ((chunk + '\n\n' + para).length > 2000) {
            await message.reply(chunk);
            chunk = '';
          }
          chunk += (chunk ? '\n\n' : '') + para;
        }
        if (chunk) await message.reply(chunk);
      }
    }
  }
}

// Simplified message handler
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  try {
    // Option 1: Respond when the bot is mentioned
    if (message.mentions.has(client.user)) {
      const content = message.content.replace(/<@!?(\d+)>/g, '').trim();
      await processAndSendResponse(message, content, message.author.id);
    } 
    // Option 2: Respond to a prefix (e.g., !ask)
    else if (message.content.startsWith('!ask')) {
      const query = message.content.trim();
      await processAndSendResponse(message, query, message.author.id);
    }
  } catch (error) {
    console.error("Error responding to message:", error);
    message.reply("Sorry, I encountered an error processing your request.");
  }
});



client.login(process.env.DISCORD_TOKEN);
