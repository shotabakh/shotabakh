const socket = io();
const user = JSON.parse(localStorage.getItem("user"));
let currentChatUser = null;

const usersDiv = document.getElementById("users");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

async function loadUsers() {
  const res = await fetch("/users");
  const users = await res.json();
  usersDiv.innerHTML = "";
  users.forEach(u => {
    if (u.personalId !== user.personalId) {
      const div = document.createElement("div");
      div.className = "user";
      div.innerHTML = `<img src="${u.avatar}" alt=""> ${u.username}`;
      div.onclick = () => selectUser(u);
      usersDiv.appendChild(div);
    }
  });
}

function selectUser(u) {
  currentChatUser = u;
  loadMessages();
}

async function loadMessages() {
  if (!currentChatUser) return;
  const res = await fetch(`/messages/${user.id}/${currentChatUser._id}`);
  const msgs = await res.json();
  messagesDiv.innerHTML = "";
  msgs.forEach(msg => {
    const div = document.createElement("div");
    div.className = "msg" + (msg.from === user.id ? " you" : "");
    div.textContent = `${msg.from === user.id ? "მე" : currentChatUser.username}: ${msg.message}`;
    messagesDiv.appendChild(div);
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

sendBtn.addEventListener("click", () => {
  if (!currentChatUser) return alert("აირჩიე მომხმარებელი ჩატისთვის");
  const msgText = messageInput.value;
  if (!msgText) return;
  const msgData = { from: user.id, to: currentChatUser._id, message: msgText };
  socket.emit("sendMessage", msgData);
  messageInput.value = "";
});

socket.on("newMessage", (msg) => {
  if ((msg.from === user.id && msg.to === currentChatUser?._id) ||
      (msg.to === user.id && msg.from === currentChatUser?._id)) {
    loadMessages();
  }
});

loadUsers();
