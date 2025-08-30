const API_URL = "http://localhost:5000";

async function loadContacts() {
  console.log("Loading contacts...");
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Login first');
    location = 'login.html';
    return;
  }
 let contacts = [];
  console.log("Token:", token);
   try {
    const res = await fetch("http://localhost:5000/contact", {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) {
      console.error("Failed to fetch contacts:", res.status, res.statusText);
      return;
    }

   contacts = await res.json();
   console.log("Contacts:", contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
  }
  // contacts = await res.json();

  const root = document.getElementById('list');
  if (!contacts.length) {
    root.innerText = 'No contacts submitted yet.';
    return;
  }

  root.innerHTML = '';
  contacts.forEach(c => {
    const div = document.createElement('div');
    div.innerHTML = `<b>${c.name}</b> (${c.email})<br>
      ${c.message}<br>
      <small>${new Date(c.createdAt).toLocaleString()}</small>
      <hr>`;
    root.appendChild(div);
  });
}

document.getElementById('contactForm').onsubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Login first');
    location = 'login.html';
    return;
  }

  const form = new FormData(e.target);
  const body = {
    name: form.get('name'),
    email: form.get('email'),
    message: form.get('message')
  };
console.log("Submitting contact form with body:", body);
  const res = await fetch(`${API_URL}/contact`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',   // ✅ tell backend it's JSON
      'Authorization': 'Bearer ' + token   // ✅ if you want to send token
    },
    body: JSON.stringify(body)
  });

  const json = await res.json();
  if (json.ok) {
    alert('Message sent successfully!');
    e.target.reset();
    loadContacts();
  } else {
    alert('Error sending message');
  }
};

loadContacts();
