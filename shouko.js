const {Client, Collection} = require('discord.js');
const {promisify} = require("util");
const {TOKEN} = require('./config');
const {readdirSync} = require("fs");
const path = require("path");
const klaw = require("klaw");

class Shouko extends Client {
    constructor(options)
        {
            super(options);

            this.commands = new Collection()
            this.aliases = new Collection()

            this.logger = require("./modules/logger")
            this.wait = require("util").promisify(setTimeout);
        }

    loadCommand(commandPath, commandName)
        {
            try {
                const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
                this.logger.log(`Chargement de la commande: ${props.help.name}`, "log");
                props.location = commandPath;
                if (props.init) {
                    props.init(this);
                }
                this.commands.set(props.help.name, props);
                props.aliases.forEach(alias =>
                {
                    this.aliases.set(alias, props.help.name)
                });
                return false;
            } catch (e) {
                return `Impossible de charger la commande ${commandName}: ${e}`;
            }
        }
}

const client = new Shouko();

const init = async () =>
    {
        klaw("./commands/").on("data", item =>
        {
            const cmdFile = path.parse(item.path);
            if (!cmdFile || cmdFile.ext !== ".js") return;
            const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
            if (response) client.logger.error(response);
        });

        const evtFiles = await readdirSync("./events");
        client.logger.log(`Chargement de ${evtFiles.length} événements.`, "log");
        evtFiles.forEach(file =>
        {
            const eventName = file.split(".")[0];
            client.logger.log(`Chargement de l'événement : ${eventName}`);
            const event = new (require(`./events/${file}`))(client);
            client.on(eventName, (...args) => event.run(...args));
            delete require.cache[require.resolve(`./events/${file}`)];
        });
    };

init()

client.login(TOKEN);


/*const loadCommands = (dir = "./commands/") => {
        readdirSync(dir).forEach(dirs =>
        {
            const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
            for (const file of commands) {
                const getFileName = require(`${dir}/${dirs}/${file}`);
                client.commands.set(getFileName.help.name, getFileName);
            }
        })
    }*/

