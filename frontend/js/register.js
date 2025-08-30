document.getElementById('f').onsubmit = async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = {
    name: fd.get('name'),
    email: fd.get('email'),
    password: fd.get('password')
  };
  const res = await fetch('https://ecomrend.onrender.com/auth/register', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (json.token) {
    localStorage.setItem('token', json.token);
    location = 'index.html';
  } else alert(json.message || 'Error');
}