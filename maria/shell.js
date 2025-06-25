import fs from "fs";
import path from "path";
import vm from "vm";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TMP_PLUGIN_DIR = path.join(__dirname, "..", "mekaplugintmp");

if (!fs.existsSync(TMP_PLUGIN_DIR)) fs.mkdirSync(TMP_PLUGIN_DIR, { recursive: true });

function restartBot() {
  const isNpm = !!process.env.npm_lifecycle_event;
  const cmd = isNpm
    ? spawn("npm", ["start"], { detached: true, stdio: "inherit", shell: true })
    : spawn(process.argv[0], [process.argv[1]], { detached: true, stdio: "inherit" });
  cmd.unref();
  process.exit(0);
}

function isValidPlugin(code) {
  return code.includes("export default") &&
         /name\s*:\s*["'`]/.test(code) &&
         /run\s*:\s*/.test(code);
}

function extractPluginName(code) {
  const match = code.match(/name\s*:\s*["'`](.*?)["'`]/);
  return match ? match[1] : `plugin_${Date.now()}`;
}

async function tryReloadPlugin(filePath) {
  try {
    const mod = await import(`file://${filePath}?t=${Date.now()}`);
    return mod.default?.name || null;
  } catch {
    return null;
  }
}

export default {
  name: "$",
  description: "Execute JS code or install Maria V2 plugins dynamically.",
  category: "system",

  run: async ({ sock, msg }) => {
    const jid = msg.key.remoteJid;
    const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
    if (!body.startsWith("$")) return;

    const input = body.trim().slice(1).trim();

    // 🆘 Show help
    if (!input) {
      const usage = `🧠 *Maria V2 Dev Shell*

Use these commands:

🔹 *$ create <js code>* → Run JS and get output.
🔹 *$ plugins <code>* → Save code as plugin and restart.

Examples:
\`\`\`
$ create console.log("Hello world")
\`\`\`

\`\`\`
$ plugins export default {
  name: "hi",
  category: "fun",
  run: async ({ sock, msg }) => {
    await sock.sendMessage(msg.key.remoteJid, { text: "Hi, I'm Maria V2!" });
  }
}
\`\`\``;
      return await sock.sendMessage(jid, { text: usage }, { quoted: msg });
    }

    // 🧪 Execute JS code
    if (input.startsWith("create ")) {
      const code = input.slice(7);
      const logs = [];
      const context = {
        console: {
          log: (...args) => logs.push(args.join(" "))
        }
      };

      try {
        vm.runInNewContext(code, context, { timeout: 3000 });
        const output = logs.join("\n") || "(Code executed, no output)";
        return await sock.sendMessage(jid, {
          text: `Shell Output\n${output}`
        }, { quoted: msg });
      } catch (err) {
        return await sock.sendMessage(jid, {
          text: `Shell Error\n${err.message}`
        }, { quoted: msg });
      }
    }

    // 📦 Install plugin
    if (input.startsWith("plugins ")) {
      const code = input.slice(8).trim();

      if (!isValidPlugin(code)) {
        return await sock.sendMessage(jid, {
          text: `Plugin format invalid.\nRequired:\n• export default\n• name\n• run function`
        }, { quoted: msg });
      }

      const pluginName = extractPluginName(code);
      const filePath = path.join(TMP_PLUGIN_DIR, `${pluginName}.js`);

      try {
        fs.writeFileSync(filePath, code);
        const check = await tryReloadPlugin(filePath);

        if (check) {
          await sock.sendMessage(jid, {
            text: `Plugin created successfully, Saved to ./maria folder\n🔁 Restarting Maria V2...`
          }, { quoted: msg });
          setTimeout(restartBot, 1000);
        } else {
          return await sock.sendMessage(jid, {
            text: `⚠️ Plugin saved but failed to load.\nPlease check syntax.`
          }, { quoted: msg });
        }
      } catch (err) {
        return await sock.sendMessage(jid, {
          text: `Failed to save the plugin\n${err.message}`
        }, { quoted: msg });
      }

      return;
    }

    // 🚫 Fallback
    return await sock.sendMessage(jid, {
      text: `Plugin format invalid.\nRequired:\n• export default\n• name\n• run function`
    }, { quoted: msg });
  }
};