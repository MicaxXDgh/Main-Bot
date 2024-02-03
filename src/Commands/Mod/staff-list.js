// ./src/Commands/staff-list.js

const { EmbedBuilder } = require('discord.js');

async function getMembersWithRole(guild, roleId) {
    try {
        const role = await guild.roles.fetch(roleId);

        if (!role) {
            console.error(`Role with ID ${roleId} not found.`);
            return [];
        }

        const membersWithRole = [];
        const members = await guild.members.fetch();

        members.each(member => {
            if (member.roles.cache.has(roleId)) {
                membersWithRole.push(member);
            }
        });

        console.log(`Members with role ${role.name}:`, membersWithRole);
        return membersWithRole || [];
    } catch (error) {
        console.error(`Error fetching members with role ${roleId}:`, error);
        return [];
    }
}

function formatMembers(members) {
    return members.map(user => `> <@${user.id}> (\`${user.id}\`)`).join('\n') || '> None';
}

module.exports = {
    data: {
        name: 'staff',
        description: 'Display the staff list.',
    },
    async execute(message) {
        if (message.author.bot) return;

        if (message.content.toLowerCase() === '$staff') {
            const ownerRoleId = '1123648276349079632';
            const managerRoleId = '1146787093570404396';
            const adminRoleId = '1123675539773849660';
            const seniorModRoleId = '1128751645837246484';
            const modRoleId = '1123675849766477855';
            const trialModRoleId = '1148315583646023750';

            const owners = await getMembersWithRole(message.guild, ownerRoleId);
            const managers = await getMembersWithRole(message.guild, managerRoleId);
            const admins = await getMembersWithRole(message.guild, adminRoleId);
            const seniorMods = await getMembersWithRole(message.guild, seniorModRoleId);
            const mods = await getMembersWithRole(message.guild, modRoleId);
            const trialMods = await getMembersWithRole(message.guild, trialModRoleId);

            const staffListEmbed = new EmbedBuilder()
                .setTitle('Staff List')
                .setColor('Orange')
                .setThumbnail(message.guild.iconURL())
                .setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })                .addFields(
                    { name: 'Owner(s);', value: `${formatMembers(owners)}`, inline: false },
                    { name: 'Manager(s);', value: `${formatMembers(managers)}`, inline: false },
                    { name: 'Administrator(s);', value: `${formatMembers(admins)}`, inline: false },
                    { name: 'Senior Moderator(s);', value: `${formatMembers(seniorMods)}`, inline: false },
                    { name: 'Moderator(s);', value: `${formatMembers(mods)}`, inline: false },
                    { name: 'Trial Moderator(s);', value: `${formatMembers(trialMods)}`, inline: false },
                )
                .setTimestamp();

            message.reply({ embeds: [staffListEmbed] });
        }
    },
};
