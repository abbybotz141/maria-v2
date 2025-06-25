export default {
  name: "block",
  category: "owner",
  description: "Block a user from contacting the bot.",
  usage: ".block @user or .block 234xxxxxxxxxx",

  run: async ({ sock, msg, args, utils }) => {
    try {
      const sender = msg.key.participant || msg.key.remoteJid;
      const from = msg.key.remoteJid;

      // 📛 Check if a user is mentioned or passed
      const targetJid = 
        msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
        (args[0] && args[0].replace(/[^0-9]/g, '') + "@s.whatsapp.net");

      if (!targetJid) {
        await utils.reply(sock, from, "❌ Please tag a user or provide a number to block.", msg);
        return;
      }

      // ✅ Block the user
      await sock.updateBlockStatus(targetJid, "block");

      const confirmation = `✅ Successfully *blocked* user:\n\`\`\`${targetJid}\`\`\``;

      await sock.sendMessage(from, {
        text: confirmation,
        mentions: [msg.sender],
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363420003990090@newsletter',
            newsletterName: '𝑴𝒂𝒓𝒊𝒂-𝑽𝟐'
          },
          externalAdReply: {
            title: "User Blocked 🔒",
            body: `Blocked successfully by Maria-V2 owner`,
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnailUrl: "https://i.imgur.com/8JKb9aD.jpg",
            sourceUrl: "https://github.com/abbybotz141/maria-v2",
            showAdAttribution: false
          }
        }
      }, { quoted: msg });

      console.log(`✅ User ${targetJid} blocked by owner.`);
    } catch (err) {
      console.error("❌ Error in block command:", err);
      await utils.reply(sock, msg.key.remoteJid, "❌ Failed to block user.", msg);
    }
  }
};