const { readdirSync } = require('fs');

module.exports = client => {
    readdirSync(`${__dirname}/../events`).forEach(folder => readdirSync(`${__dirname}/../events/${folder}`).forEach(file => {
        const eventData = require(`${__dirname}/../events/${folder}/${file}`);
        if (eventData.data.enabled && eventData.data.public) {
            eventData.data.type === 'once' ? client.once(eventData.data.name, async arg => eventData.run(client, arg)) : client.on(eventData.data.name, async arg => eventData.run(client, arg));
            console.log(`Loaded event: ${eventData.data.name}`);
        }
    }));
}