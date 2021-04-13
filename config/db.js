const mongoose = require("mongoose");
// const config = require("config");
// const db = config.get("mongoURI");

const db =
  "mongodb://shan:shan123@cluster0-shard-00-00.mm4sm.mongodb.net:27017,cluster0-shard-00-01.mm4sm.mongodb.net:27017,cluster0-shard-00-02.mm4sm.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-3580wb-shard-0&authSource=admin&retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
