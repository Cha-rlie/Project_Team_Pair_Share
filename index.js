const fs = require("node:fs");
const path = require("node:path");

const axios = require("axios");
const express = require("express");
const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');

const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");

const app = express();

const discord_api = axios.create({
    baseURL: "https://discord.com/api/",
    timeout: 3000,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Authorization",
        "Authorization": `Bot ${token}`
    }
})

const dotenv = require("dotenv");
dotenv.config();
const token = process.env.BOT_TOKEN;

app.post('/interactions', verifyKeyMiddleware(PUBLIC_KEY), async (req, res) => {
    const interaction = req.body;
  
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
      console.log(interaction.data.name)
      if(interaction.data.name == 'yo'){
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Yo ${interaction.member.user.username}!`,
          },
        });
      }
  
      if(interaction.data.name == 'dm'){
        // https://discord.com/developers/docs/resources/user#create-dm
        let c = (await discord_api.post(`/users/@me/channels`,{
          recipient_id: interaction.member.user.id
        })).data
        try{
          // https://discord.com/developers/docs/resources/channel#create-message
          let res = await discord_api.post(`/channels/${c.id}/messages`,{
            content:'Yo! I got your slash command. I am not able to respond to DMs just slash commands.',
          })
          console.log(res.data)
        }catch(e){
          console.log(e)
        }
  
        return res.send({
          // https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data:{
            content:'👍'
          }
        });
      }
    }
  
  });
  
  
  
  app.get('/register_commands', async (req,res) =>{
    let slash_commands = [
      {
        "name": "yo",
        "description": "replies with Yo!",
        "options": []
      },
      {
        "name": "dm",
        "description": "sends user a DM",
        "options": []
      }
    ]
    try
    {
      // api docs - https://discord.com/developers/docs/interactions/application-commands#create-global-application-command
      let discord_response = await discord_api.put(
        `/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`,
        slash_commands
      )
      console.log(discord_response.data)
      return res.send('commands have been registered')
    }catch(e){
      console.error(e.code)
      console.error(e.response?.data)
      return res.send(`${e.code} error from discord`)
    }
  })
  
  
  app.get('/', async (req,res) =>{
    return res.send('Follow documentation ')
  })
  
  
  app.listen(8999, () => {
  
  })

/*const client = new Client({ intents: [GatewayIntentBits.Guilds]});

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

client.login(token);*/