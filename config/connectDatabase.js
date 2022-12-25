const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect('mongodb+srv://ritesh:ritesh@cluster0.cpp386n.mongodb.net/login?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;