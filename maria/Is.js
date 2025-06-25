import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMMANDS_DIR = path.join(__dirname); // your maria/ folder

export default {
  name: "listplugins",
  category: "owner",
  description: "List all loaded plugins and share their source code.",
  usage: ".listplugins [plugin_name]",

  run: async ({ sock, msg, args, utils }) => {
    const jid = msg.key.remoteJid;

    try {
      const allFiles = fs.readdirSync(COMMANDS_DIR).filter(f => f.endsWith(".js"));
      if (!allFiles.length) {
        await utils.reply(sock, jid, "❌ No plugins found in the maria/ directory.", msg);
        return;
      }

      // If user requested code of a specific plugin
      if (args.length > 0) {
        const requested = args[0].toLowerCase().replace(".js", "");
        const pluginFile = allFiles.find(file => file.replace(".js", "").toLowerCase() === requested);

        if (!pluginFile) {
          await utils.reply(sock, jid, `❌ Plugin "*${requested}*" not found.`, msg);
          return;
        }

        const filePath = path.join(COMMANDS_DIR, pluginFile);
        const pluginBuffer = fs.readFileSync(filePath);

        await sock.sendMessage(jid, {
          document: pluginBuffer,
          fileName: pluginFile,
          mimetype: "text/javascript",
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363420003990090@newsletter",
              newsletterName: "𝑴𝒂𝒓𝒊𝒂-𝑽𝟐"
            },
            externalAdReply: {
              title: "Maria-V2 Plugin Source",
              body: `${pluginFile}`,
              thumbnailUrl: "https://i.imgur.com/7SgrvDX.jpeg",
              mediaType: 1,
              sourceUrl: "https://github.com/abbybotz141/maria-v2",
              showAdAttribution: false,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: msg });

        return;
      }

      // Else show plugin list
      let pluginList = `📦 *Maria-V2 Plugins*\n\nTotal: ${allFiles.length} loaded\n\n`;

      allFiles.forEach((file, i) => {
        const name = file.replace(".js", "");
        pluginList += `🔹 ${i + 1}. ${name}\n`;
      });

      pluginList += `\n📥 To download a plugin's code:\n.listplugins <plugin_name>\n\nExample:\n.listplugins ping`;

      await sock.sendMessage(jid, {
        text: pluginList,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363420003990090@newsletter",
            newsletterName: "𝑴𝒂𝒓𝒊𝒂-𝑽𝟐"
          },
          externalAdReply: {
            title: "Maria-V2 Plugin Manager",
            body: "Type .listplugins joke to get the source of joke.js",
            thumbnailUrl: "https://i.imgur.com/Enn6JAh.jpeg",
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: false,
            sourceUrl: "https://github.com/abbybotz141/maria-v2"
          }
        }
      }, { quoted: msg });
    } catch (err) {
      console.error("❌ listplugins error:", err);
      await utils.reply(sock, jid, "❌ Failed to list or share plugins.", msg);
    }
  }
};