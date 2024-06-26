const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");

const dotenv = require("dotenv");
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds]});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands"); // Contructs a path to the "commands" directory
const commandFolders = fs.readdirSync(foldersPath); // Reads the path and returns all contained folders

// Loop through each folder in "commands" that was identified earlier
for (const folder of commandFolders) {
    // Find all the files in the current folder that end with ".js"
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
    // Loop through each file in the current folder and if the commands are complete, they will be added to the client.commands Collection
    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
        
        }
    }
}

const eventPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const filePath = path.join(eventPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.on("message", async message => {
    console.log(message);
    if (message.content.startsWith("ping")) {
        message.reply("pong!");
    }
});

client.login(process.env.BOT_TOKEN);