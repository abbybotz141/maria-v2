import fs from "fs/promises";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsDir = path.join(__dirname); // assumes this is inside /maria

export default {
  name: "menu",
  description: "Displays all commands in categories.",
  category: "General",

  run: async ({ sock, msg, utils }) => {
    try {
      const files = await fs.readdir(commandsDir);
      const jsFiles = files.filter(f => f.endsWith(".js") && f !== "menu.js");

      const categories = {};
      let total = 0;

      for (const file of jsFiles) {
        try {
          const mod = await import(`./${file}`);
          const command = mod.default;

          if (!command?.name) continue;
          const cat = command.category || "General";

          if (!categories[cat]) categories[cat] = [];
          categories[cat].push(command.name);
          total++;
        } catch (err) {
          console.warn(`⚠️ Failed to load ${file}:`, err);
        }
      }

      const ram = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
      const uptime = formatUptime(process.uptime());
      const userName = msg.pushName || msg.key.participant?.split("@")[0] || "User";

      let text = `
╭─❒ *🤖 Maria-V2 Menu* ❒
├⬡ 👤 User: ${userName}
├⬡ ⏱️ Uptime: ${uptime}
├⬡ 💾 RAM: ${ram}MB
├⬡ 🔢 Total Commands: ${total}
╰────────────❒\n\n`;

      for (const category of Object.keys(categories).sort()) {
        text += `╭── ❒ *${category}* ❒\n`;
        for (const cmdName of categories[category]) {
          text += `├⬡ ${cmdName}\n`;
        }
        text += `╰────────────❒\n\n`;
      }

      text += "Powered by Maria-V2";

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
          }
        }
      });
    } catch (err) {
      console.error("❌ Menu error:", err);
      await utils.reply(sock, msg.key.remoteJid, "❌ Failed to load menu.", msg);
    }
  }
};

function formatUptime(seconds) {
  const d = Math.floor(seconds / (24 * 3600));
  seconds %= (24 * 3600);
  const h = Math.floor(seconds / 3600);
  seconds %= 3600;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}