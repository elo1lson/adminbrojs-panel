const Message = require("../models/Message");
const Channel = require("../models/Channel");
const Client = require("../discord/client");
const { EmbedBuilder } = require("discord.js");

let objectIdPing = {};

const navbar = {
  name: "General",
  icon: "General",
};

module.exports = async () => {
  const channel = await Channel.find(
    {},
    {
      description: 0,
      guild: 0,
      __v: 0,
      channel: 0,
    }
  );
  return {
    resource: Message,
    options: {
      navbar,
      properties: {
        channel: {
          isTitle: true,
          availableValues: await channel.map((i) => {
            objectIdPing = {
              _id: i._id,
              name: i.ping_name,
            };
            return {
              label: i.label + "   (ping " + i.ping_name + ")",
              value: i.value,
            };
          }),
        },
        user: {
          isVisible: {
            edit: false,
          },
        },
        guild: {
          isVisible: {
            edit: false,
          },
        },
        message_id: {
          isVisible: {
            edit: false,
          },
        },
        Date: {
          isVisible: {
            edit: false,
          },
        },
        guild_name: {
          isVisible: {
            edit: false,
          },
        },
      },
      actions: {
        new: {
          before: async (req, { currentAdmin }) => {
            try {
              console.log(req.payload);
              let channelDc;
              let { payload } = req;
              let { content, title, youtube_url, image } = payload;
              let formChannel = payload.channel;

              let embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(content)
                .setColor("Blue");

              if (image) {
                embed.setThumbnail(image);
              }

              let pingRole = await Channel.findById(objectIdPing._id);
              console.log(objectIdPing);
              channelDc = await Client.channels.cache.get(formChannel);

              return await channelDc
                .send({
                  content: `<@&${await pingRole.ping}>` + youtube_url ?? " ",
                  embeds: [embed],
                })
                .then(async (m) => {
                  return {
                    ...req,
                    payload: {
                      ...req.payload,
                      youtube_url: youtube_url ?? "",
                      ping: objectIdPing.name,
                      message_id: m.id,
                      guild: m.guildId,
                      guild_name: m.guild.name,
                      user: currentAdmin._id,
                      channel: m.channelId,
                    },
                  };
                });
            } catch (e) {
              console.log(e);
            }
          },
          after: (res) => {
            return res;
          },
        },
      },
    },
  };
};
