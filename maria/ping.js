export default {
  name: "ping",
  description: "Check Maria V2's response time",
  category: "System Utilities",
  react: "⚡",

  run: async ({ sock, msg, utils }) => {
    try {
      const startTime = Date.now();

      const emojis = [
        "🔥", "⚡", "🚀", "💨", "🎯", "🎉", "🌟", "💥",
        "🕐", "🔹", "💎", "🏆", "🎶", "🌠", "🌀", "🔱", "🛡️", "✨"
      ];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: randomEmoji, key: msg.key }
      });

      const ping = Date.now() - startTime;

      let speedStatus = "🐢 Slow", statusColor = "🔴";
      if (ping <= 150) {
        speedStatus = "🚀 Fast";
        statusColor = "🟢";
      } else if (ping <= 300) {
        speedStatus = "🐌 Slow";
        statusColor = "🟡";
      } else if (ping <= 600) {
        speedStatus = "⚠️ Maria V2 is lagging";
        statusColor = "🟠";
      }

      const text = `╭──『 *Maria V2 Ping Report* 』──╮
│ 📡 *Ping:* ${ping}ms ${randomEmoji}
│ 📊 *Speed:* ${statusColor} ${speedStatus}
│ 🤖 *Status:* Active & Responsive
╰───────────❖`;

      await utils.reply(sock, msg.key.remoteJid, text, msg);

      console.log(`✅ Ping command executed successfully in ${ping}ms.`);
    } catch (err) {
      console.error("❌ Error in ping.js:", err);
    }
  }
};