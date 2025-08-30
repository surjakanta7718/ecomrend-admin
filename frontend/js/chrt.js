
async function load() {
  const token = localStorage.getItem('token');
  if (!token) { alert('Login first'); location='login.html'; return; }
  const res = await fetch('/cart', { headers: { Authorization: 'Bearer ' + token } });
  const cart = await res.json();
  const root = document.getElementById('list');
  if (!cart.length) root.innerText = 'Cart empty';
  root.innerHTML = '';
  cart.forEach(i => {
    const div = document.createElement('div');
    div.innerHTML = `${i.product.title} — qty ${i.qty} — ₹${i.product.price * i.qty}
      <button onclick="remove('${i.product._id}')">Remove</button>`;
    root.appendChild(div);
  });
}
async function remove(pid) {
  const token = localStorage.getItem('token');
  await fetch('/cart/remove', { method:'DELETE', headers:{ 'Content-Type':'application/json', Authorization:'Bearer ' + token }, body: JSON.stringify({ productId: pid })});
  load();
}
document.getElementById('checkout').onsubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const address = new FormData(e.target).get('address');
  const res = await fetch('/orders/create', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:'Bearer ' + token }, body: JSON.stringify({ address })});
  const json = await res.json();
  if (json._id) { alert('Order placed'); location='index.html'; }
  else alert('Order error');
}
load();
