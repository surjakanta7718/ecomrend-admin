
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    const token = localStorage.getItem("token");

    // ---------------- LOAD PRODUCT ----------------
    async function loadProduct() {
      const res = await fetch(`/products/${productId}`);
      const product = await res.json();

      document.getElementById("title").innerText = product.title;
      document.getElementById("description").innerText = product.description;
      document.getElementById("price").innerText = product.price;

      renderReviews(product.reviews || []);
      if (token) document.getElementById("reviewFormContainer").style.display = "block";
    }

    // ---------------- RENDER REVIEWS ----------------
    function renderReviews(reviews) {
      const ul = document.getElementById("reviews");
      ul.innerHTML = "";
      reviews.forEach(r => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${r.user?.email || "Anonymous"}</strong> — ⭐ ${r.rating}/5<br>
          ${r.comment}
        `;
        if (token && r.ownedByUser) {
          const btn = document.createElement("button");
          btn.innerText = "Delete";
          btn.onclick = () => deleteReview(r._id);
          li.appendChild(document.createElement("br"));
          li.appendChild(btn);
        }
        ul.appendChild(li);
      });
    }

    // ---------------- ADD TO CART ----------------
    document.getElementById("addToCartBtn").addEventListener("click", async () => {
      if (!token) {
        alert("Login required");
        location.href = "login.html";
        return;
      }
      const res = await fetch("/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ productId, qty: 1 })
      });
      if (res.ok) alert("Added to cart");
      else alert("Failed to add to cart");
    });

    // ---------------- SUBMIT REVIEW ----------------
    document.getElementById("reviewForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const rating = fd.get("rating");
      const comment = fd.get("comment");

      const res = await fetch(`/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ rating, comment })
      });

      if (res.ok) {
        e.target.reset();
        loadProduct(); // reload reviews
      } else {
        const err = await res.json();
        alert(err.message || "Failed to submit review");
      }
    });

    // ---------------- DELETE REVIEW ----------------
    async function deleteReview(reviewId) {
      if (!confirm("Delete this review?")) return;
      const res = await fetch(`/products/${productId}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
      });
      if (res.ok) loadProduct();
      else alert("Failed to delete review");
    }

    // ---------------- INIT ----------------
    loadProduct();