export default {
  name: "unblock",
  category: "owner",
  description: "Unblock a user so they can contact the bot again.",
  usage: ".unblock @user or .unblock 234xxxxxxxxxx",

  run: async ({ sock, msg, args, utils }) => {
    try {
      const from = msg.key.remoteJid;

      // 🧠 Get mentioned JID or parse number
      const targetJid =
        msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
        (args[0] && args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net");

      if (!targetJid) {
        await utils.reply(sock, from, "❌ Please tag a user or enter a number to unblock.", msg);
        return;
      }

      // ✅ Unblock the user
      await sock.updateBlockStatus(targetJid, "unblock");

      const confirmation = `✅ Successfully *unblocked* user:\n\`\`\`${targetJid}\`\`\``;

      // 📢 Send confirmation using newsletter
      await sock.sendMessage(from, {
        text: confirmation,
        mentions: [msg.sender],
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363420003990090@newsletter",
            newsletterName: "𝑴𝒂𝒓𝒊𝒂-𝑽𝟐"
          },
          externalAdReply: {
            title: "User Unblocked ✅",
            body: "The user is now free to message the bot again.",
            thumbnailUrl: "https://i.imgur.com/Cg5QgMb.jpeg",
            sourceUrl: "https://github.com/abbybotz141/maria-v2",
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: false
          }
        }
      }, { quoted: msg });

      console.log(`✅ User ${targetJid} unblocked by owner.`);
    } catch (err) {
      console.error("❌ Error in unblock command:", err);
      await utils.reply(sock, msg.key.remoteJid, "❌ Failed to unblock user.", msg);
    }
  }
};