
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
async function processAndSendResponse(message, query, userId) {
  await message.channel.sendTyping();
  const response = await generateResponse(query, userId);
  
  if (response.length > 2000) {
    const chunks = response.match(/.{1,2000}/g);
    for (const chunk of chunks) {
      await message.reply(chunk);
    }
  } else {
    await message.reply(response);
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
      const query = message.content.slice(5).trim();
      await processAndSendResponse(message, query, message.author.id);
    }
  } catch (error) {
    console.error("Error responding to message:", error);
    message.reply("Sorry, I encountered an error processing your request.");
  }
});



client.login(process.env.DISCORD_TOKEN);
