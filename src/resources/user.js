const User = require("../models/User");
const bcrypt = require("bcrypt");
const { canModifyUser } = require("../utils/isAccessible");

const navigation = {
  name: "General",
  icon: "General",
};
module.exports = async () => {
  return {
    resource: User,
    options: {
      navigation,
      properties: {
        encryptedPassword: {
          isVisible: false,
        },
        password: {
          type: "string",
          isVisible: {
            list: false,
            edit: true,
            filter: false,
            show: false,
          },
        },
      },

      actions: {
        new: {
          isAccessible: canModifyUser,
          before: async (request) => {
            if (request.payload.password) {
              request.payload = {
                ...request.payload,
                encryptedPassword: await bcrypt.hash(
                  request.payload.password,
                  10
                ),
                password: undefined,
              };
            }
            return request;
          },
        },
        edit: { isAccessible: canModifyUser },
        delete: { isAccessible: canModifyUser },
        new: { isAccessible: canModifyUser },
      },
    },
  };
};
