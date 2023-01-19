const User = require("../models/User");

const navbar = {
  name: "General",
  icon: "General",
};
module.exports = async () => {
  return {
    resource: User,
    options: {
      navbar,
    },
  };
};
