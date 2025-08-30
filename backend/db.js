// // db.js
// const mongoose = require("mongoose");

// const connectDB = async () => {
//   const mongoUri = process.env.MONGO_URI;

//   if (!mongoUri) {
//     console.error("❌ MONGO_URI is not defined!");
//     throw new Error("MONGO_URI is required in environment variables.");
//   }

//   try {
//     await mongoose.connect(mongoUri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     console.log("✅ MongoDB connected");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
const mongoose = require("mongoose");

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI not defined");

    cached.promise = mongoose.connect(mongoUri).then(mongoose => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
