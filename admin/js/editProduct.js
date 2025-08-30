const API_URL = "http://localhost:5000/api/admin/products";
const token = localStorage.getItem("adminToken");

// 📌 Extract product ID from URL query params
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// Load product details into form
async function loadProduct() {
    console.log("Loading product with ID:", productId);
  const res = await fetch(`${API_URL}/${productId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const product = await res.json();

  // Fill form fields
  document.getElementById("title").value = product.title;
  document.getElementById("price").value = product.price;
 console.log( document.getElementById("title").value );
  // ✅ Pre-select brand
  const brandSelect = document.getElementById("brand");
  brandSelect.value = product.brand;

  // ✅ Pre-select category
  const categorySelect = document.getElementById("category");
  categorySelect.value = product.category;
}

document.getElementById("editProductForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedProduct = {
    title: document.getElementById("title").value,
    brand: document.getElementById("brand").value,
    category: document.getElementById("category").value,
    price: document.getElementById("price").value
  };

  const res = await fetch(`${API_URL}/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(updatedProduct)
  });

  if (res.ok) {
    alert("✅ Product updated successfully!");
    window.location.href = "products.html"; // redirect back
  } else {
    alert("❌ Failed to update product");
  }
});

// Load existing product data on page load
loadProduct();
