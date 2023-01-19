const Channel = require("../models/Channel");
const client = require("../discord/client");
const { ValidationError } = require("admin-bro");

const navbar = {
  name: "General",
  icon: "General",
};

module.exports = async () => {
  return {
    resource: Channel,
    options: {
      navbar,
      //Properties: ['label','guild','role_name'],
      properties: {
        label: {
          isVisible: { edit: false, show: true, list: true },
        },
        guild: {
          isVisible: { edit: false, list: true },
        },
        value: {
          isVisible: { edit: false, list: true, show: true },
        },
        id: {
          type: "number",
        },
        ping: {
          type: "number",
        },
        ping_name: {
          isVisible: {
            edit: false,
          },
        },
      },

      actions: {
        new: {
          after: (res) => {
            return res;
          },
          before: async (req) => {
            try {
              let errors = {};
              let { payload } = req;
              const { id, ping, description } = payload;

              const channel = await client.channels.cache.get(id);

              if (!channel) {
                return req;
              }
              const nameOfChannel = channel.name;
              const roleObject = await client.guilds.cache
                .get(channel.guild.id)
                .roles.cache.find((r) => r.id == ping);

              if (!roleObject) {
                return req;
              }
              const guild = channel.guild.name;
              payload = {
                value : id,
                label: nameOfChannel,
                guild,
                ping: roleObject.id,
                ping_name: roleObject.name,
                description: description || " ",
              };
              req.payload = payload;
              return req;
            } catch (e) {
              console.log(e);
            }
          },
        },
      },
    },
  };
};
