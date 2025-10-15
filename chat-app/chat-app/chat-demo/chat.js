
// შეტყობინების გაგზავნა
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = messageInput.value.trim();
  if (!text) return;

  // ვამატებთ მესიჯს DOM-ში
  const messageEl = document.createElement("div");
  messageEl.classList.add("message");
  messageEl.textContent = text;
  messagesDiv.appendChild(messageEl);

  // ვასუფთავებთ input-ს
  messageInput.value = "";
});


const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const messagesDiv = document.getElementById("messages");
const logoutBtn = document.getElementById("logoutBtn");

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) {
  alert("❌ ჯერ უნდა შეხვიდე სისტემაში!");
  window.location.href = "/chat-app/chat-app/chat-demo/index.html";
}

// მესიჯების ჩატვირთვა
function loadMessages() {
  const allMessages = JSON.parse(localStorage.getItem("messages")) || [];
  messagesDiv.innerHTML = "";

  allMessages.forEach((msg) => {
    const div = document.createElement("div");
    div.textContent = `${msg.user}: ${msg.text}`;
    messagesDiv.appendChild(div);
  });
}
loadMessages();

// გაგზავნა
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = messageInput.value;
  if (!text.trim()) return;

  const newMessage = { user: loggedInUser.username, text };

  let allMessages = JSON.parse(localStorage.getItem("messages")) || [];
  allMessages.push(newMessage);
  localStorage.setItem("messages", JSON.stringify(allMessages));

  messageInput.value = "";
  loadMessages();
});

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "/chat-app/chat-app/chat-demo/index.html";
});
