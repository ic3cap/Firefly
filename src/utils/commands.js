const { readdirSync } = require('fs');

module.exports = {
    getAllCommands() {
        let commands = {};
        readdirSync(`${__dirname}/../commands`).forEach(folder => readdirSync(`${__dirname}/../commands/${folder}`).forEach(file => {
            commands[file.slice(0, file.indexOf('.'))] = require(`${__dirname}/../commands/${folder}/${file}`);
        }));
        return commands;
    },
    getCommandsInCategory(category) {
        let commands = {};
        readdirSync(`${__dirname}/../commands/${category}`).forEach(file => {
            commands[file.slice(0, file.indexOf('.'))] = require(`${__dirname}/../commands/${category}/${file}`);
        });
        return commands;
    },
    getCategories() {
        return readdirSync(`${__dirname}/../commands`);
    },
    doesCategoryExist(category) {
        return readdirSync(`${__dirname}/../commands`).includes(category);
    },
    doesCommandExist(command) {
        return readdirSync(`${__dirname}/../commands`).some(folder => readdirSync(`${__dirname}/../commands/${folder}`).includes(`${command}.js`));
    }
}