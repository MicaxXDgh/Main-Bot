const config = require('../../config.json');
const { ChannelType, PermissionsBitField } = require('discord.js');

const categoryId = '1199346424840736908';
const claimedTickets = new Set();
const openTickets = new Map();

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        if (message.content.toLowerCase() === '$ticket') {
            if (openTickets.has(message.author.id)) {
                return message.reply({ content: 'You already have an open ticket.', ephemeral: true });
            }

            try {
                const guild = await message.client.guilds.fetch(message.guild.id); // Fetch the guild
                const ticketCategory = await guild.channels.fetch(categoryId); // Fetch the category

                if (!ticketCategory || ticketCategory.type !== ChannelType.GuildCategory) {
                    console.error('Category not found or not a category.');
                    return message.reply({ content: 'Category not found or not a category.', ephemeral: true });
                }

                const ticketSupportRole = guild.roles.cache.find(role => role.name === 'Ticket Support');

                const newChannel = await guild.channels.create({
                    name: 'ticket-' + message.author.id.toString(),
                    type: ChannelType.GuildText,
                    parent: categoryId,
                    permissionOverwrites: [
                        {
                            id: message.author.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        },
                        {
                            id: ticketSupportRole.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        },
                        {
                            id: guild.roles.everyone,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                });

                const mention = message.author.toString();

                const welcomeMessage = await newChannel.send(`Welcome to your ticket, ${mention}! Could you please provide a detailed explanation of your issue? Support will arrive soon.`);

                console.log('Ticket channel created:', newChannel);
                message.reply({ content: `Your ticket has been created in channel ${newChannel}`, ephemeral: true });

                openTickets.set(message.author.id, { channelId: newChannel.id, messageId: welcomeMessage.id });

            } catch (error) {
                console.error('Error creating ticket:', error);
            }
        }

        if (message.content.toLowerCase() === '$claim') {
            try {
                if (claimedTickets.has(message.channel.id)) {
                    return message.reply({ content: 'This ticket has already been claimed.', ephemeral: true });
                }

                claimedTickets.add(message.channel.id);

                const claimingUser = message.author.tag;
                await message.channel.send(`Ticket has been claimed by ${claimingUser}.`);

            } catch (error) {
                console.error('Error claiming ticket:', error);
            }
        }

        if (message.content.toLowerCase() === '$close') {
            try {
                const closingMessage = await message.channel.send('Closing ticket in a few seconds...');

                setTimeout(async () => {
                    openTickets.delete(message.author.id);

                    await message.channel.delete();
                }, 5000);

            } catch (error) {
                console.error('Error closing ticket:', error);
            }
        }
    }
};
