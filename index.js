"use strict";

const { Client, Collection } = require("discord.js"),
    { Manager } = require("@lavacord/discord.js"),
    Enmap = require("enmap"),
    { readdirSync } = require("fs"),
    { join } = require("path"),
    CooldownManager = require("./src/structure/Cooldown");

class Shouko extends Client {

    constructor() {
        super({
            messageCacheMaxSize: 10,
            disableEveryone: true,
            partials: ['MESSAGE', 'REACTION']
        });
        this.config = require("./config");
        this.commands = new Collection();
        this.radio = new Map();
        this.guildsEntry = new Enmap({name: "guilds", dataDir: "./data/guilds"});
        this.usersEntry = new Enmap({name: "users", dataDir: "./data/users"});
        this.cooldown = new CooldownManager(this);
        this.extends = {
            user: require("./utils/models/user"),
            guild: require("./utils/models/guild")
        };

        setTimeout(() => {
            this.manager = new Manager(this, this.config.LAVALINK.NODES, {
                user: this.config.bot.id,
                shards: this.shard.count ? this.shard.count + 1 : 2
            });

            this.manager.connect().then(console.log(["Lavalink"], "Connected to Lavalink"))
        }, 10000);

        this.launch();
    }

    launch() {
        this.eventsLoad();
        this.commandsLoad();
        this.login(this.config.bot.token).then(console.log(["Base-WS"], "Connected to discord")).catch((e) => {
            console.error(["Base-WS"], `Connection error: ${e}`);
            return process.exit(1);
        });
    }

    eventsLoad() {
        const events = readdirSync(join(__dirname, "src/events")).filter(f => f.endsWith(".js"));
        if (events.length === 0) return console.log(["Problem"], "No event found !");
        let count = 0;

        for (const element of events) {
            try {
                const eventName = element.split(".")[0];
                const filter = require(join(__dirname, "src/events", element));
                this.on(eventName, filter.bind(null, this));
                delete require.cache[require.resolve(join(__dirname, "src/events", element))];
                count++;
            } catch (err) {
                console.log(["Error"], `An error has occurred:\n\n${err.message}`);
            }
        }
        console.log(["Events"], `Loaded ${count}/${events.length} events`);
    }

    commandsLoad() {
        let count = 0;
        const folders = readdirSync(join(__dirname, "src/commands"));
        for (const folder of folders) {
            const commands = readdirSync(join(__dirname, "src/commands/", folder));
            for (const element of commands) {
                count++;
                try {
                    const command = new (require(join(__dirname, "src/commands/", folder, element)))();
                    this.commands.set(command.name, command);
                } catch (e) {
                    console.log(["Error"], `${folder} » ${element} n'a pas été charger: ${e.message}`);
                }
            }
        }
    }
}

module.exports.client = new Shouko();