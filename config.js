export const config = {
  botName: "Maria-V2",
  ownerName: "Fareed",
  ownerJid: "2347032411938@s.whatsapp.net",
  prefix: "",  // Bot command prefix
  sessionFolder: "session",  // Path for authentication storage
  reactEmoji: "✨",  // Default reaction emoji
  botVersion: "1.0.0",
  debugMode: true,  // Enable/Disable debug logging
};

// 🚀 Utility function for logging (enabled only in debug mode)
export const log = (message) => {
  if (config.debugMode) console.log(`[DEBUG] ${message}`);
};