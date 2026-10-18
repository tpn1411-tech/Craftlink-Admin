// Hành vi header: đóng dropdown thông báo khi bấm ra ngoài
document.addEventListener('click',function(e){
  var p=document.getElementById('notifPanel');
  if(p&&!p.classList.contains('hidden')&&!e.target.closest('#notifPanel')&&!e.target.closest('[onclick^="toggleNotif"]')) p.classList.add('hidden');
});
