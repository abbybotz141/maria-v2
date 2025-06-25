export default {
  name: "joke",
  description: "Get a random joke to lighten the mood",
  category: "Entertainment",

  run: async ({ sock, msg, utils }) => {
    try {
      const jokes = [
        "Why don’t skeletons fight each other? Because they don’t have the guts!",
        "Parallel lines have so much in common. It’s a shame they’ll never meet.",
        "Why do cows have hooves instead of feet? Because they lactose!",
        "What do you call fake spaghetti? An impasta!",
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "How does a penguin build its house? Igloos it together!",
        "I told my wife she should embrace her mistakes. She gave me a hug!",
        "Why can’t a nose be 12 inches long? Because then it would be a foot!",
        "What do you call a fish wearing a crown? A kingfish!",
        "Why did the math book look sad? It had too many problems.",
        "I told my computer I needed a break, and now it won’t stop sending me vacation ads!",
        "Why did the bicycle fall over? Because it was two-tired!",
        "Why don’t eggs tell jokes? Because they might crack up!",
        "Did you hear about the kidnapping at the playground? They woke up!",
        "I’m reading a book on anti-gravity. It’s impossible to put down!"
      ];

      const random = jokes[Math.floor(Math.random() * jokes.length)];
      const text = `🤣 *Here's a joke for you:*\n\n${random}\n\n— _Powered by Maria V2_`;

      await utils.reply(sock, msg.key.remoteJid, text, msg);

      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: "😂", key: msg.key }
      });

      console.log("✅ Joke command executed successfully!");
    } catch (err) {
      console.error("❌ Error in joke.js:", err);
    }
  }
};