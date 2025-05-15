# Discord AI Chat Bot

A simple Discord bot that uses Google Gemini (via the OpenAI SDK) to provide AI-powered chat responses, including programming help and code examples.

## Features

- Responds to messages when mentioned or when prefixed with `!ask`
- Remembers conversation context per user
- Uses Google Gemini (via OpenAI SDK) for AI responses
- Supports multi-part replies for long answers

## Requirements

- [Bun](https://bun.sh) (v1.1.26 or later)
- Node.js-compatible environment
- Discord bot token
- Google Gemini API key

## Setup

1. **Clone the repository**

   ```sh
   git clone <>
   cd discord-bot
   ```

2. **Install dependencies**

   ```sh
   bun install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```
   DISCORD_TOKEN=your_discord_bot_token
   CLIENT_ID=your_discord_client_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the bot**

   ```sh
   bun run index.js
   ```

## Usage

- **Mention the bot** in any channel it has access to, and it will reply to your message.
- **Use the `!ask` command** followed by your question:

  ```
  !ask How do I reverse a string in JavaScript?
  ```

## File Structure

- [`index.js`](index.js): Main entry point, Discord bot logic
- [`ai.js`](ai.js): Handles AI chat and context using Gemini via OpenAI SDK
- [`package.json`](package.json): Project dependencies and scripts
- [`tsconfig.json`](tsconfig.json): TypeScript configuration (for future use)
- [`.env`](.env): Environment variables (not committed)

## License

MIT

---

[Suman Sarkar](https://x.com/suuumans)