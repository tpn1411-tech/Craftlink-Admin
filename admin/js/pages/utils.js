// Tiện ích dùng chung: hiển thị toast thông báo
let toastTimer;
function showToast(msg, type='success'){
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  document.getElementById('toastIcon').textContent = type==='success'?'check_circle':'error';
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.add('hidden'), 3200);
}
