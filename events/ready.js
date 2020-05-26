module.esports = class {
    constructor(client)
        {
            this.client = client;
        }

    async run() {
        await this.client.wait(1000);

        this.client.appInfo = await this.client.fetchApplication();
        setInterval(async () => {
            this.client.appInfo = await this.client.fetchApplication();
        }, 60000);

        this.client.user.activity.state("En maintenance... [W.I.P]");
        this.client.logger.log("Shouko est prête !")
    }
}