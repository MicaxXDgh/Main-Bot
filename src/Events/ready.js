// src/Events/ready.js
const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,

    execute(client) {
        console.log(`Logged in as ${client.user.tag}.`);
        console.log(`Currently in ${client.guilds.cache.size} guild(s).`);

        client.user.setPresence({
            activities: [{ name: '/help', type: ActivityType.Watching }],
            status: 'dnd',
        });
    },
};
