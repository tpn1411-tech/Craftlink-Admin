// Thông báo: dropdown chuông ở header, đánh dấu đã đọc
const NOTIFS=[
  {icon:'gavel',cls:'bg-secondary-fixed text-on-secondary-container',title:'Đơn kháng án mới',desc:'APL-12 yêu cầu Admin rà soát lại quyết định khóa sản phẩm',time:'5 phút trước',unread:true},
  {icon:'person_add',cls:'bg-primary-fixed text-on-primary-fixed',title:'Maker mới đăng ký',desc:'banmongcatque vừa gửi hồ sơ xác minh nghệ nhân',time:'32 phút trước',unread:true},
  {icon:'payments',cls:'bg-tertiary-fixed text-on-tertiary-fixed',title:'Tranh chấp brief BR-104',desc:'Khiếu nại vượt ngưỡng 48h — chờ Admin can thiệp ghi đề',time:'2 giờ trước',unread:true},
  {icon:'database',cls:'bg-surface-container-high text-primary',title:'Sao lưu dữ liệu',desc:'Bản sao lưu tự động lúc 02:00 đã hoàn tất an toàn',time:'Hôm qua',unread:false},
];
function renderNotifs(){
  var list=document.getElementById('notifList'); if(!list) return;
  list.innerHTML=NOTIFS.map(function(n){
    return '<div class="px-4 py-3 flex gap-3 border-b border-surface-container-low last:border-0 '+(n.unread?'bg-primary-fixed/30':'')+'">'
      +'<span class="w-9 h-9 rounded-lg '+n.cls+' flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[20px]">'+n.icon+'</span></span>'
      +'<div class="min-w-0">'
      +'<p class="font-title-md text-title-md text-on-surface leading-snug">'+n.title+'</p>'
      +'<p class="font-body-sm text-body-sm text-on-surface-variant leading-snug mt-0.5">'+n.desc+'</p>'
      +'<p class="font-label-sm text-label-sm text-outline mt-1">'+n.time+'</p>'
      +'</div>'
      +(n.unread?'<span class="w-2 h-2 rounded-full bg-secondary mt-1.5 shrink-0"></span>':'')
      +'</div>';
  }).join('');
  var unread=NOTIFS.filter(function(n){return n.unread;}).length;
  var badge=document.getElementById('notifBadge');
  if(badge){badge.textContent=unread;badge.style.display=unread?'flex':'none';}
}
function toggleNotif(e){
  e.stopPropagation();
  var p=document.getElementById('notifPanel');
  if(p) p.classList.toggle('hidden');
}
function markAllRead(){
  NOTIFS.forEach(function(n){n.unread=false;});
  renderNotifs();
  showToast('Đã đánh dấu tất cả thông báo là đã đọc');
  var p=document.getElementById('notifPanel');
  if(p) p.classList.add('hidden');
}
renderNotifs();
