const mongoose = require("mongoose");
const uri =
  "mongodb+srv://root:root@cluster0.fb2whrx.mongodb.net/?retryWrites=true&w=majority";
mongoose.set("strictQuery", true);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const conexion = mongoose.connection;

module.exports = conexion;
