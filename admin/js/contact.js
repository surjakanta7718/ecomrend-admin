const token = localStorage.getItem("adminToken");
const params = new URLSearchParams(window.location.search);
const userId = params.get("userId");

async function loadContacts() {
  if (!userId) {
    document.getElementById("contactsList").innerText = "No user selected";
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/contacts`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      document.getElementById("contactsList").innerText = "Failed to load contacts";
      return;
    }

    const contacts = await res.json();
    const root = document.getElementById("contactsList");

    if (!contacts.length) {
      root.innerText = "No contacts found for this user.";
      return;
    }

    root.innerHTML = "";
    contacts.forEach(c => {
      const div = document.createElement("div");
      div.innerHTML = `<b>${c.name}</b> (${c.email})<br>
        ${c.message}<br>
        <small>${new Date(c.createdAt).toLocaleString()}</small>
        <hr>`;
      root.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading contacts:", err);
  }
}

loadContacts();
