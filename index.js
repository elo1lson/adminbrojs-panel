const express = require("express");
const app = express();
const AdminBro = require("admin-bro");
const expressAdminBro = require("@admin-bro/express");
const mongooseAdminBro = require("@admin-bro/mongoose");
const bcrypt = require("bcrypt");

const message = require("./src/resources/message");
const user = require("./src/resources/user");
const channel = require("./src/resources/channel");
const conection = require("./src/database/db");
const locale = require("./src/translations/translactions");

const User = require("./src/models/User");
const client = require("./src/discord/client");

require("dotenv").config();

async function run() {
  AdminBro.registerAdapter(mongooseAdminBro);
  const AdminBroOptions = {
    resources: [await message(), await user(), await channel()],
    locale,
    branding: {
      companyName: "Discord messenger",
      softwareBrothers: false,
      logo: "",
    },
  };

  const adminBro = new AdminBro(AdminBroOptions);
  const router = expressAdminBro.buildRouter(adminBro);

  const routeAdmin = expressAdminBro.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
      const user = await User.findOne({ email });

      if (user) {
        const matched = await bcrypt.compare(password, user.encryptedPassword);
        if (matched) {
          return user;
        }
      }

      return false;
    },
    cookiePassword: "some-secret-password-used-to-secure-cookie",
  });

  app.use(adminBro.options.rootPath, routeAdmin);
  //app.use(adminBro.options.rootPath, router);

  app.get("/", (req, res) => {
    res.redirect("/admin");
  });

  app.listen(3000, () => {
    console.log("http://localhost:3000/admin");
  });
}

conection.on("error", (error) => console.log("El error de conexión es:"));
conection.once("open", async () => {
  await client.login(process.env.TOKEN);
  run();
});
