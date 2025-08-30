// const API_URL = "http://localhost:5000/api/admin/users";
// const token = localStorage.getItem("adminToken");

// async function loadUsers() {
//   const res = await fetch(API_URL, {
//     headers: { "Authorization": `Bearer ${token}` }
//   });
//   const users = await res.json();

//   const table = document.getElementById("usersTable");
//   table.innerHTML = "";
//   users.forEach(user => {
//     const row = `<tr>
//       <td>${user.name}</td>
//       <td>${user.email}</td>
//       <td>${user.contact || "N/A"}</td>
//       <td><button onclick="deleteUser('${user._id}')">Delete</button></td>
//     </tr>`;
//     table.innerHTML += row;
//   });
// }

// async function deleteUser(id) {
//   await fetch(`${API_URL}/${id}`, {
//     method: "DELETE",
//     headers: { "Authorization": `Bearer ${token}` }
//   });
//   loadUsers();
// }

// loadUsers();
const API_URL = "http://localhost:5000/api/admin/users";
const token = localStorage.getItem("adminToken");

async function loadUsers() {
  const res = await fetch(API_URL, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const users = await res.json();

  const table = document.getElementById("usersTable");
  table.innerHTML = "";
  users.forEach(user => {
    const row = `<tr>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
        <button onclick="showContacts('${user._id}')">Show</button>
      </td>
      <td>
        <button onclick="deleteUser('${user._id}')">Delete</button>
      </td>
    </tr>`;
    table.innerHTML += row;
  });
}

async function deleteUser(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  loadUsers();
}

// redirect to contact page
function showContacts(userId) {
  window.location.href = `contact.html?userId=${userId}`;
}

loadUsers();
