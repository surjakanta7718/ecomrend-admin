const API_URL = "http://localhost:5000";
const token = localStorage.getItem("adminToken");

async function loadProducts() {
  const res = await fetch("/products", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const products = await res.json();
    console.log(products);
  const table = document.getElementById("productsTable");
  table.innerHTML = "";
  products.forEach(p => {
    const row = `<tr>
      <td>${p.title}</td>
      <td>${p.brand}</td>
      <td>${p.category}</td>
      <td>${p.price}</td>
      <td><button onclick="deleteProduct('${p._id}')">Delete</button>
       <button onclick="window.location.href='editProduct.html?id=${p._id}'">Edit</button>
       </td>
    </tr>`;
    table.innerHTML += row;
  });
}

// Get token after admin login


document.getElementById("addProductForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const product = {
    title: document.getElementById("title").value,
    brand: document.getElementById("brand").value,
    category: document.getElementById("category").value,
    price: document.getElementById("price").value
  };

  try {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });

    if (!res.ok) {
      const errMsg = await res.text();
      throw new Error(errMsg);
    }

    const data = await res.json();
    console.log("✅ Product added:", data);
    alert("Product added successfully!");
    loadProducts();
  } catch (err) {
    console.error("❌ Error adding product:", err.message);
    alert("Failed to add product. Check console.");
  }
});

async function deleteProduct(id) {
  await fetch(`/api/admin/products/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  loadProducts();
}

loadProducts();
