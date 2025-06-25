import os from "os";

export default {
  name: "uptime",
  description: "Shows the uptime of the bot.",
  category: "tools",

  run: async ({ sock, msg, utils }) => {
    try {
      const uptimeSeconds = process.uptime();
      const hours = Math.floor(uptimeSeconds / 3600);
      const minutes = Math.floor((uptimeSeconds % 3600) / 60);
      const formattedUptime = `${hours}h ${minutes}m`;

      const memUsedMB = (os.totalmem() - os.freemem()) / 1024 / 1024;
      const totalMemMB = os.totalmem() / 1024 / 1024;

      const text = `╭─❒ ᴜᴘᴛɪᴍᴇ ʀᴇᴘᴏʀᴛ
│
├ ᴜᴘᴛɪᴍᴇ: ${formattedUptime}
├ ᴘʟᴀᴛғᴏʀᴍ: ${os.platform()}
├ ᴍᴇᴍᴏʀʏ: ${memUsedMB.toFixed(2)} MB / ${totalMemMB.toFixed(2)} MB
╰───────────────❒`;

      await utils.reply(sock, msg.key.remoteJid, text, msg);

      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: "🔥", key: msg.key }
      });

      console.log("✅ Uptime command executed successfully!");
    } catch (err) {
      console.error("❌ Error in uptime.js:", err);
    }
  }
};