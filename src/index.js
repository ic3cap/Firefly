const { Client, IntentsBitField, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { default: mongoose } = require('mongoose');
require('dotenv').config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ]
});

client.commands = new Collection();

(async () => {
  await mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Successfully connected to MongoDB!');
    })
    .catch(err => {
      console.log(`Error connecting to MongoDB!\nError: ${err}`);
    });
})();

client.once('ready', c => {
  console.log(`Logged in as ${c.user.tag}!`);
  readdirSync(`${__dirname}/loaders`).forEach(loader => require(`./loaders/${loader}`)(client));
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
  const cmdData = client.commands.get(interaction.commandName);
  if (cmdData) {
    await cmdData.run(client, interaction)
      .catch(err => {
        console.log(`Error running command!\nCommand: ${interaction.commandName}\nUserID: ${interaction.member.id}\nGuildID: ${interaction.guildId}\nError: ${err}`);
      });
  } else {
    return;
  }
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
});

/*
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://fireflyadmin:<password>@firefly-discord-bot.hlh6oby.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
*/

client.login(process.env.TOKEN);