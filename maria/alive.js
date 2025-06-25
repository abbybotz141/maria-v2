import os from "os";

export default {
  name: "alive",
  description: "Check if Maria V2 is online and running smoothly.",
  category: "main",

  run: async ({ sock, msg, utils }) => {
    try {
      const uptimeSeconds = process.uptime();
      const hours = Math.floor(uptimeSeconds / 3600);
      const minutes = Math.floor((uptimeSeconds % 3600) / 60);
      const uptime = `${hours}h ${minutes}m`;

      const response = `✨ *Maria V2 is ALIVE and fully operational!* 🚀

🟢 *Status:* Online  
⏳ *Uptime:* ${uptime}  
💻 *System:* ${os.platform()}  
🔥 *Performance:* Running smoothly!  

⚡ *Type .menu to see all commands!*`;

      await utils.reply(sock, msg.key.remoteJid, response, msg);

      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: "✅", key: msg.key }
      });

      console.log("✅ Alive command executed successfully!");
    } catch (err) {
      console.error("❌ Error in alive.js:", err);
    }
  }
};