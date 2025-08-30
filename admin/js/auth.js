const API_URL = "http://localhost:5000/api/admin"; // update with actual backend

// Login
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("adminToken", data.token);
      window.location.href = "index.html";
    } else {
      document.getElementById("msg").innerText = data.message || "Login failed";
    }
  });
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("adminToken");
   window.location.href = "../index.html";  // adjust path if needed
  });
}
