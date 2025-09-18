const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/chat-app")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// Schemas
const UserSchema = new mongoose.Schema({
  username: String,
  personalId: String,
  password: String,
  avatar: String
});

const MessageSchema = new mongoose.Schema({
  from: String,
  to: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);
const Message = mongoose.model("Message", MessageSchema);

// Multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// 🔹 Registration
app.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    const { username, personalId, password } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : "/uploads/default.png";

    const exists = await User.findOne({ personalId });
    if (exists) return res.status(400).send("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, personalId, password: hashedPassword, avatar });
    await user.save();

    res.send("success");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 🔹 Login
app.post("/login", async (req, res) => {
  try {
    const { personalId, password } = req.body;
    const user = await User.findOne({ personalId });
    if (!user) return res.status(400).send("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send("Invalid password");

    const token = jwt.sign({ id: user._id }, "SECRET_KEY", { expiresIn: "1h" });
    res.json({ token, user: { id: user._id, username: user.username, avatar: user.avatar } });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 🔹 Users list
app.get("/users", async (req, res) => {
  const users = await User.find({}, "username personalId avatar");
  res.json(users);
});

// 🔹 Messages
app.get("/messages/:from/:to", async (req, res) => {
  const { from, to } = req.params;
  const msgs = await Message.find({
    $or: [
      { from, to },
      { from: to, to: from }
    ]
  }).sort("timestamp");
  res.json(msgs);
});

// 🔹 Socket.IO
io.on("connection", (socket) => {
  console.log("🔗 User connected");

  socket.on("sendMessage", async (data) => {
    const msg = new Message(data);
    await msg.save();
    io.emit("newMessage", msg);
  });
});

// Server
const PORT = 3000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:3000`));
