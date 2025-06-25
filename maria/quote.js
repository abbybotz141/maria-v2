export default {
  name: "quote",
  description: "Get a random inspirational quote",
  category: "Motivation",

  run: async ({ sock, msg, utils }) => {
    try {
      const quotes = [
        "The best way to predict the future is to create it. – Peter Drucker",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. – Winston Churchill",
        "Do what you can, with what you have, where you are. – Theodore Roosevelt",
        "Your time is limited, so don’t waste it living someone else’s life. – Steve Jobs",
        "The only way to do great work is to love what you do. – Steve Jobs",
        "Difficulties in life are intended to make us better, not bitter. – Dan Reeves",
        "Dream big and dare to fail. – Norman Vaughan",
        "Start where you are. Use what you have. Do what you can. – Arthur Ashe",
        "What lies behind us and what lies before us are tiny matters compared to what lies within us. – Ralph Waldo Emerson",
        "Believe you can and you’re halfway there. – Theodore Roosevelt",
        "Don’t count the days, make the days count. – Muhammad Ali",
        "Act as if what you do makes a difference. It does. – William James",
        "It always seems impossible until it’s done. – Nelson Mandela",
        "Your limitation—it’s only your imagination.",
        "Hardships often prepare ordinary people for an extraordinary destiny. – C.S. Lewis"
      ];

      const random = quotes[Math.floor(Math.random() * quotes.length)];
      const text = `🌟 *Quote of the Moment:*\n\n“${random}”\n\n— _Maria V2_`;

      await utils.reply(sock, msg.key.remoteJid, text, msg);

      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: "⭐", key: msg.key }
      });

      console.log("✅ Quote command executed successfully!");
    } catch (err) {
      console.error("❌ Error in quote.js:", err);
    }
  }
};