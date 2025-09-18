const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

// რეგისტრაცია
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(registerForm);
  const res = await fetch("/register", {
    method: "POST",
    body: formData
  });
  const text = await res.text();
  alert(text);
});

// ლოგინი
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const personalId = loginForm.personalId.value;
  const password = loginForm.password.value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ personalId, password })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    window.location.href = "chat.html";
  } else {
    alert(data.message || JSON.stringify(data));
  }
});
