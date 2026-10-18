// Đóng mọi modal đang mở & panel thông báo bằng phím Escape
document.addEventListener('keydown',function(e){
  if(e.key!=='Escape') return;
  document.querySelectorAll('.fixed.inset-0.z-50:not(.modal-hidden)').forEach(function(m){m.classList.add('modal-hidden');});
  var p=document.getElementById('notifPanel');
  if(p) p.classList.add('hidden');
});
