const mongoose = require("mongoose");

const dbURI = process.env['MONGODB_URI'];

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log("Mongoose is connected")
  } catch (err) {
    console.error(err.message);
    process.exit(1)
  }
}

module.exports = connectDB;