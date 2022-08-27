const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://gokulhansv:GOk%409846@cluster0.gzlmt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    );
    console.log('Database is Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;