export default {
  name: "owner",
  description: "Displays information about Maria V2's creator and maintainer.",
  category: "Owner",

  run: async ({ sock, msg, utils }) => {
    const text = `
👑 *Maria V2 Owner Info*

📛 *Name:* Fareed
📱 *WhatsApp:* wa.me/234XXXXXXXXXX
📧 *Email:* fareed@example.com
🌍 *Location:* Osun State, Nigeria
🛠 *Role:* Developer • Maintainer • Visionary

💬 _“Building with precision. Running with purpose.”_

🔐 _This command is visible to all but customizable by you._

– Powered by *Maria V2*
`;

    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
  }
};