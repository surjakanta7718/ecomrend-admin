
document.getElementById('f').onsubmit = async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email: fd.get('email'), password: fd.get('password') })
  });
  const json = await res.json();
  if (json.token) { localStorage.setItem('token', json.token); location='index.html'; }
  else alert(json.message || 'Login failed');
}