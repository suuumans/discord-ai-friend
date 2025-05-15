import OpenAI from "openai";

const apiKey = process.env.GEMINI_API_KEY;
const openai = new OpenAI({
  apiKey: apiKey, 
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// Store chat sessions by user ID
const userSessions = new Map();

export async function generateResponse(prompt, userId = "default") {
  if (!prompt || typeof prompt !== "string" || prompt.length === 0) {
    return "Please provide a question or message for me to answer!";
  }

  try {
    const messages = userSessions.get(userId) || [];
    
    // Add system message if this is a new conversation
    if (messages.length === 0) {
      messages.push({
        role: "system", 
        content: "You are a helpful Discord bot assistant. You provide concise, friendly, and accurate answers. You will also answer questions related to coding and programming and provide code examples when appropriate."
      });
    }
    
    // Add user message
    messages.push({ role: "user", content: prompt });
    
    // Store updated messages
    userSessions.set(userId, messages);
    
    // Get response from Gemini via OpenAI SDK
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: messages,
    });
    
    // Add assistant response to history
    const assistantResponse = response.choices[0].message.content;
    messages.push({ role: "assistant", content: assistantResponse });
    
    return assistantResponse;
  } catch (error) {
    console.error("Error in chat:", error);
    return "Sorry, I encountered an error while processing your request. Please try again!";
  }
}
