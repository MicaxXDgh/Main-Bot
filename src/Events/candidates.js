const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

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

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    // Check if the message starts with the correct command prefix
    if (message.content.toLowerCase().startsWith(config.prefix)) {
      // Split the message content into command and arguments
      const args = message.content.slice(config.prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();

      if (command === 'candidates') {
        if (!message.member.roles.cache.has('1123648276349079632')) {
          message.reply('You do not have permission to use this command.');
          return;
        }

        // Check if at least one user mention or ID is provided
        if (args.length === 0) {
          message.reply('Please provide at least one user mention or ID.');
          return;
        }

        if (args[0] === 'list') {
          const candidateRoleID = '1189195643244253214';
          const candidateRole = message.guild.roles.cache.get(candidateRoleID);

          if (!candidateRole) {
            message.reply('Candidate role not found. Please provide a valid role ID.');
            return;
          }

          // Fetch members with the "Candidate" role
          const candidates = await getMembersWithRole(message.guild, candidateRoleID);

          // Log candidates to the console
          console.log('Candidates:', candidates.map(candidate => `${candidate.user.tag} (\`${candidate.id}\`)`).join('\n'));

          // Create an embed with the list of candidates
          const listEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('List of Candidates')
            .setDescription(candidates.map(candidate => `• ${candidate.toString()} (\`${candidate.id}\`)`).join('\n') || 'No candidates found.')
            .setTimestamp();

          // Send the embed to the channel
          message.channel.send({ embeds: [listEmbed] });
        } else {
          const candidateRoleID = '1189195643244253214';
          const candidateRole = message.guild.roles.cache.get(candidateRoleID);

          if (!candidateRole) {
            message.reply('Candidate role not found. Please provide a valid role ID.');
            return;
          }

          args.forEach(async (userMentionOrID) => {
            const userID = userMentionOrID.replace(/[<@!>]/g, '');

            const targetUser = await message.guild.members.fetch(userID).catch(() => null);

            if (!targetUser) {
              message.reply(`User with ID ${userID} not found in the server.`);
              return;
            }

            targetUser.roles.add(candidateRole);

            const candidateEmbed = new EmbedBuilder()
              .setColor('#0099ff')
              .setTitle('Candidate Information')
              .setDescription(`Candidate: ${targetUser.toString()} (ID: ${targetUser.id})`)
              .setTimestamp();

            message.channel.send({ embeds: [candidateEmbed] });
          });
        }
      }
    }
  },
};
