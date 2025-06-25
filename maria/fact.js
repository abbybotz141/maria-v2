export default {
  name: "fact",
  description: "Get a random fun fact",
  category: "Entertainment",

  run: async ({ sock, msg, utils }) => {
    try {
      const facts = [
        "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible!",
        "Bananas are berries, but strawberries aren’t!",
        "Octopuses have three hearts and their blood is blue.",
        "A day on Venus is longer than a year on Venus!",
        "Water can boil and freeze at the same time under the right conditions, known as the 'triple point.'",
        "Sharks have been around longer than trees—they’ve existed for over 400 million years!",
        "Wombat poop is cube-shaped!",
        "The Eiffel Tower can grow taller in the summer due to heat expansion.",
        "There's a species of jellyfish called *Turritopsis dohrnii* that is biologically immortal!",
        "Your bones are constantly changing—your skeleton renews itself about every 10 years!",
        "There’s more stars in the universe than grains of sand on Earth!",
        "Butterflies can taste with their feet!",
        "A cloud can weigh **over a million pounds**!",
        "There’s a lake in Tanzania that turns animals who touch it into *stone!*",
        "Sloths can hold their breath longer than dolphins—up to 40 minutes!"
      ];

      const randomFact = facts[Math.floor(Math.random() * facts.length)];
      const text = `🧠 *Here’s a fun fact for you:*\n\n${randomFact}\n\n— _Powered by Maria V2_`;

      await utils.reply(sock, msg.key.remoteJid, text, msg);

      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: "🤔", key: msg.key }
      });

      console.log("✅ Fact command executed successfully!");
    } catch (err) {
      console.error("❌ Error in fact.js:", err);
    }
  }
};