"use strict";

const Message = require("../models/Message");
const Channel = require("../models/Channel");
const Client = require("../discord/client");
const { EmbedBuilder } = require("discord.js");
const client = require("../discord/client");
const { canEdit, canDelete } = require("../utils/isAccessible");

const navigation = {
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
      navigation,
      listProperties: ["title", "channel", "ping", "Date"],
      showProperties: [
        "title",
        "content",
        "channel",
        "ping",
        "youtube_url",
        "guild_name",
        "channel_name",
        "user",
        "Date",
      ],
      editProperties: ["title", "content", "youtube_url", "channel", "image"],
      properties: {
        title: {
          isTitle: true,
          type: "string",
        },
        content: {
          type: "textarea",
        },
        channel: {
          availableValues: channel.map((i) => {
            return {
              label: i.label + "   (ping " + i.ping_name + ")",
              value: i._id,
            };
          }),
        },
      },
      actions: {
        new: {
          before: async (req, { currentAdmin }) => {
            try {
              let channelDc;
              let { payload } = req;
              let { content, title, youtube_url, image, channel } = payload;
              let formChannel = payload.channel;

              let embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(content)
                .setColor("Blue");

              if (image) {
                embed.setThumbnail(image);
              }

              let databaseChannel = await Channel.findById(channel);
              let _channel_id = databaseChannel._id;

              youtube_url = youtube_url || "";

              channelDc = Client.channels.cache.get(databaseChannel.value);
              return await channelDc
                .send({
                  content: `<@&${databaseChannel.ping}>` + youtube_url ?? " ",
                  embeds: [embed],
                })
                .then(async (m) => {
                  return {
                    ...req,
                    payload: {
                      ...req.payload,
                      youtube_url: youtube_url ?? " ",
                      ping: databaseChannel.ping_name,
                      message_id: m.id,
                      guild: m.guildId,
                      guild_name: m.guild.name,
                      user: currentAdmin._id,
                      channel: databaseChannel.value,
                      channel_name: m.channel.name,
                      Date: Date.now(),
                      _channel_id,
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
        edit: {
          isAccessible: canEdit,
          before: async (req) => {
            try {
              if (req.method == "get") return req;
              let {
                content,
                image,
                message_id,
                youtube_url,
                title,
                channel,
                _id,
                _channel_id,
                ping,
              } = req.payload;
              let pingName = await Message.findById(_id);

              let embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle(title)
                .setDescription(content);

              if (image) {
                embed.setImage(image);
              }
              console.log(req.payload, "\nchannel");

              let databaseChannel = await Channel.findById(_channel_id);

              console.log(databaseChannel, "\n\ndatabase\n\n");

              let originalMessage = client.channels.cache.get(
                databaseChannel.value
              );

              originalMessage.messages.fetch(message_id);

              originalMessage.edit({
                content: `<@&${databaseChannel.ping}>\n` + youtube_url ?? " ",
                embeds: [embed],
              });

              return req;
            } catch (e) {
              // console.log(e);
              // return req;
            }
          },
          after: async (res) => {
            return res;
          },
        },
        delete: {
          isAccessible: canDelete,
          before: async (req) => {
            try {
              let message = await Message.findById(req.params.recordId);
              let channel = Client.channels.cache.get(message.channel);

              if (!channel) {
                message.delete();
                return req;
              }
              discordMessage = await channel.messages.fetch(message.message_id);

              if (!discordMessage) {
                message.delete();
                return req;
              }

              discordMessage.delete();
              message.delete();
              return req;
            } catch (e) {
              console.log(e);
              return req;
            } finally {
            }
          },
        },
      },
    },
  };
};
