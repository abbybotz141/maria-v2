import fs from 'fs';
import baileys from '@whiskeysockets/baileys';
import { handleMessages } from './abby.js';
import { Boom } from '@hapi/boom';
import P from 'pino';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { useMultiFileAuthState } from '@whiskeysockets/baileys';

const { makeWASocket, DisconnectReason, fetchLatestBaileysVersion } = baileys;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sessionDir = join(__dirname, 'session');

// ✅ Ensure sessionDir exists
if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir, { recursive: true });
}

const startBot = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const { version, isLatest } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    syncFullHistory: false,
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: true
  });

  sock.ev.on('creds.update', saveCreds);

  // ✅ Connection update and owner notify
  sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
    console.log(`🔄 Connection update: ${connection}`);

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log(`❌ Connection lost. Status Code: ${statusCode} | Reconnecting: ${shouldReconnect}`);

      if (shouldReconnect) {
        console.log("🔄 Attempting reconnect...");
        startBot();
      }
    } else if (connection === 'open') {
      console.log('✅ Maria-V2 successfully connected!');

      const ownerJid = "2347032411938@s.whatsapp.net";

      setTimeout(async () => {
        await sock.sendMessage(ownerJid, {
          image: { url: 'https://telegra.ph/file/900435c6d3157c98c3c88.jpg' },
          caption: '✅ *Maria-V2 is now live!*'
        });
        console.log("📢 Owner notification sent.");
      }, 3000);
    }
  });

  // 📦 Command handler
  try {
    handleMessages(sock);
  } catch (err) {
    console.error("❌ Failed to load message handler:", err);
  }
};

startBot();