const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const PASSWORD = encodeURIComponent(process.env.MONGO_PWD);
const MONGO_URL = `mongodb+srv://${process.env.MONGO_UR}:${PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose
  .connect(process.env.MONGO_URl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("Connect DB...");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
exports.mongoose;
