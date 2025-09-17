// რეგისტრაცია
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const personalId = document.getElementById("personalId").value;
        const avatarFile = document.getElementById("avatar").files[0];
  
        const reader = new FileReader();
        reader.onload = () => {
          localStorage.setItem("userName", name);
          localStorage.setItem("userId", personalId || "შეყვანილი არაა");
          localStorage.setItem("userAvatar", avatarFile ? reader.result : "");
          window.location.href = "chat2.html";
        };
        if (avatarFile) {
          reader.readAsDataURL(avatarFile);
        } else {
          reader.onload(); // თუ ავატარი არ აირჩია
        }
      });
    }
  
    // პროფილის გვერდი
    if (window.location.pathname.includes("profile.html")) {
      document.getElementById("profileName").innerText = localStorage.getItem("userName");
      document.getElementById("profileId").innerText = localStorage.getItem("userId");
      const avatar = localStorage.getItem("userAvatar");
      if (avatar) {
        document.getElementById("profileAvatar").src = avatar;
      }
  
      const chatList = document.getElementById("chatList");
      const users = ["გიორგი", "ნინო", "მარიამი", "დავით"];
      users.forEach(u => {
        const div = document.createElement("div");
        div.className = "chat-item";
        div.innerHTML = `<span>${u}</span> <button onclick="openChat('${u}')">ჩატი</button>`;
        chatList.appendChild(div);
      });
      document.getElementById("search").addEventListener("input", (e) => {
        const searchValue = e.target.value.toLowerCase();
        Array.from(chatList.children).forEach(item => {
          const id = item.querySelector("small").innerText.toLowerCase(); // ID-ს ვიღებთ
          item.style.display = id.includes(searchValue) ? "flex" : "none";
        });
      });
      
    
    }
  
    // ჩატის გვერდი
    if (window.location.pathname.includes("chat3.html")) {
      document.getElementById("chatUser").innerText = localStorage.getItem("chatUser");
    }
  });
  
  // ფუნქციები
  function openChat(user) {
    localStorage.setItem("chatUser", user);
    window.location.href = "chat3.html";
  }
  
  function goBack() {
    window.location.href = "chat2.html";
  }
  
  function sendMessage() {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();
    if (!text) return;
  
    const messages = document.getElementById("messages");
  
    const msgDiv = document.createElement("div");
    msgDiv.className = "message sent";
    msgDiv.innerText = text;
  
    messages.appendChild(msgDiv);
    input.value = "";
    messages.scrollTop = messages.scrollHeight;
  }
  