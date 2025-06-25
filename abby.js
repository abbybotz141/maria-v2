import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = new Map();
const commandsDir = path.join(__dirname, 'maria');

// 🔥 Bot prefix ("" means no prefix)
const botPrefix = "";

const loadCommands = async () => {
  try {
    const files = fs.readdirSync(commandsDir);
    for (const file of files) {
      if (file.endsWith('.js')) {
        const filePath = pathToFileURL(path.join(commandsDir, file));
        const mod = await import(filePath.href);
        const command = mod.default;

        if (!command?.name || typeof command.run !== 'function') {
          console.warn(`⚠️ Skipping: ${file} (Missing name or run function)`);
          continue;
        }

        commands.set(command.name.toLowerCase(), command);
        console.log(`✅ Loaded: ${command.name}`);
      }
    }
  } catch (err) {
    console.error(`❌ Command loading error:`, err);
  }
};

// 🚀 Load all plugins at startup
await loadCommands();

// 🧩 Utility functions
export const utils = {
  reply: async (sock, jid, text, quoted) => {
    await sock.sendMessage(jid, { text: `✨ ${text}` }, { quoted });
  },
  isAdmin: async (sock, jid, sender) => {
    try {
      const metadata = await sock.groupMetadata(jid);
      return metadata.participants.some(p => p.admin && p.id === sender);
    } catch (err) {
      console.error("❌ Admin check failed:", err);
      return false;
    }
  },
  sleep: ms => new Promise(res => setTimeout(res, ms))
};

// 📬 Main message handler
export const handleMessages = (sock) => {
  sock.ev.on('messages.upsert', async ({ messages }) => {
    try {
      if (!messages || !messages[0]) return;
      const m = messages[0];
      if (m.key?.remoteJid === 'status@broadcast') return;

      const msg = m.message?.conversation ||
                  m.message?.extendedTextMessage?.text ||
                  m.message?.imageMessage?.caption ||
                  m.message?.videoMessage?.caption;

      if (!msg) return;

      const raw = msg.trim();
      if (!raw.startsWith(botPrefix)) return;

      const [cmdName, ...args] = raw.slice(botPrefix.length).trim().split(/\s+/);
      const command = commands.get(cmdName.toLowerCase());
      if (!command) return;

      await command.run({ sock, msg: m, args, utils });
    } catch (err) {
      console.error("❌ Message handling error:", err);
    }
  });
};