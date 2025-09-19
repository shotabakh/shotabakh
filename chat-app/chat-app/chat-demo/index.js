const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

// რეგისტრაცია
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = registerForm.username.value;
  const personalId = registerForm.personalId.value;
  const password = registerForm.password.value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find((u) => u.personalId === personalId)) {
    alert("❌ ასეთი ID უკვე არსებობს!");
    return;
  }

  const newUser = { username, personalId, password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  // რეგისტრაციის შემდეგ ავტომატური ლოგინი
  localStorage.setItem("loggedInUser", JSON.stringify(newUser));

  alert("✅ რეგისტრაცია წარმატებით დასრულდა!");
  registerForm.reset();

  // აქ გადაჰყავს ჩატზე
  window.location.href = "/chat-app/chat-app/chat-demo/chat.html";
});

// ლოგინი
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const personalId = loginForm.personalId.value;
  const password = loginForm.password.value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    (u) => u.personalId === personalId && u.password === password
  );

  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    alert("✅ Login successful!");
    window.location.href = "/chat-app/chat-app/chat-demo/chat.html";
  } else {
    alert("❌ მომხმარებელი ვერ მოიძებნა ან პაროლი არასწორია!");
  }
});
