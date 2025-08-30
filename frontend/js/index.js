const productsList = document.getElementById("products");
const categoryFilter = document.getElementById("categoryFilter");
const brandFilter = document.getElementById("brandFilter");
const applyFilterBtn = document.getElementById("applyFilter");

// unified loader + filter
async function loadProducts(filters = {}) {
  try {
    // build query params if filters exist
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`https://ecomrend.onrender.com/products?${params}`);
    const data = await res.json();

  console.log("Data=",data);

    // clear old list
    productsList.innerHTML = "";

    // render
    if (data.length === 0) {
      productsList.innerHTML = "<li>No products found</li>";
      return;
    }

    data.forEach((p) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${p.title} - ${p.category} - ${p.brand} - ₹${p.price} 
        — <a href="product.html?id=${p._id}">view</a>
      `;
      productsList.appendChild(li);
    });
  } catch (err) {
    console.log("Error fetching products:", err);
  }
}

// 🚀 Load all products initially
loadProducts();

// 🎯 Apply filter on button click
applyFilterBtn.addEventListener("click", () => {
  const category = categoryFilter.value;
  const brand = brandFilter.value;

  let filters = {};
  if (category) filters.category = category;
  if (brand) filters.brand = brand;

  loadProducts(filters);
});

// ----------------- AUTH HANDLING -----------------
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");

  if (token) {
    // Logged in → hide login/register, show logout
    logoutBtn.style.display = "inline-block";
    loginLink.style.display = "none";
    registerLink.style.display = "none";
  } else {
    logoutBtn.style.display = "none";
    loginLink.style.display = "inline-block";
    registerLink.style.display = "inline-block";
  }

  logoutBtn.addEventListener("click", async () => {
    try {
      // optional backend logout if you track sessions
      await fetch("/auth/logout", { method: "POST" });

      // remove JWT
      localStorage.removeItem("token");

      // reload page to update UI
      location.reload();
    } catch (err) {
      console.error("Logout error:", err);
    }
  });
});

