export default {
  name: "devinfo",
  description: "Displays developer information and credits",
  category: "tools",

  run: async ({ sock, msg, utils }) => {
    try {
      const userName = msg.pushName || msg.key.participant?.split("@")[0] || "User";
      const text = `
╭───[ *🤖 Maria-V2 Developer Info* ]
│
│ 👑 *Developer:* Lørd Ãbby Tëçh
│ 🌐 *GitHub:* https://github.com/abbybotz141
│ 🤖 *Bot Name:* Maria-V2
│ 📦 *Source:* https://github.com/abbybotz141/maria-v2
│ 🛠️ *Tech Stack:* Baileys, Node.js
│ 🔄 *Prefix:* Supports multiple or no prefix
│
│ 💬 *Hi ${userName}, I hope you're enjoying Maria-V2!*
│
╰─────────────────────────────◆`;

      await sock.sendMessage(msg.key.remoteJid, {
        text,
        mentions: [msg.sender],
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: "Maria-V2",
            body: `Hey ${userName}`,
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnailUrl: "https://files.catbox.moe/bt7a3x.jpeg",
            sourceUrl: "https://github.com/abbybotz141/maria-v2",
            showAdAttribution: false
          },
          // 🗞️ Optional Newsletter Feature:
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363420003990090@newsletter",
            newsletterName: "𝑴𝒂𝒓𝒊𝒂-𝑽𝟐",
            serverMessageId: 1
          }
        }
      });
    } catch (err) {
      console.error("❌ Devinfo error:", err);
      await utils.reply(sock, msg.key.remoteJid, "❌ Failed to display developer info.", msg);
    }
  }
};