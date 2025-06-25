import { spawn } from "child_process";

export default {
  name: "restart",
  category: "owner",
  description: "Restart the Maria-V2 bot process.",
  usage: ".restart",

  run: async ({ sock, msg, utils }) => {
    try {
      // ✅ React to indicate restart
      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: "🛑", key: msg.key }
      });

      // 📡 Notify about restart
      await sock.sendMessage(msg.key.remoteJid, {
        text: "🛑 *Shutting Down Maria-V2...*\nPlease start the bot from the panel.",
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363420003990090@newsletter",
            newsletterName: "𝑴𝒂𝒓𝒊𝒂-𝑽𝟐"
          }
        }
      }, { quoted: msg });

      // ⏳ Delay a bit before restarting
      await new Promise(res => setTimeout(res, 3000));

      // 🧠 Detect if using `npm` to restart properly
      const isNpm = !!process.env.npm_lifecycle_event;

      if (isNpm) {
        spawn("npm", ["start"], {
          detached: true,
          stdio: "inherit",
          shell: true,
        }).unref();
      } else {
        spawn(process.argv[0], [process.argv[1]], {
          detached: true,
          stdio: "inherit",
        }).unref();
      }

      process.exit(0);

    } catch (err) {
      console.error("❌ Shutdown error:", err);
      await utils.reply(sock, msg.key.remoteJid, "❌ Failed to shutdown the bot.", msg);
    }
  }
};