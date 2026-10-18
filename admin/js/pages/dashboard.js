// Logic JavaScript cho trang: Tổng quan nền tảng
let overrideTarget = null;

function renderKPIs(){
  document.getElementById('kpiCards').innerHTML = KPI.map(k=>`
    <div class="bg-surface-container-lowest rounded-xl shadow-xs p-space-md space-y-2">
      <div class="flex items-center justify-between">
        <div class="w-11 h-11 rounded-xl ${k.tone} flex items-center justify-center"><span class="material-symbols-outlined text-[24px]">${k.icon}</span></div>
        <span class="inline-flex items-center gap-1 font-label-lg text-label-lg font-semibold ${k.up?'text-[#3B6E4C]':'text-error'}">
          <span class="material-symbols-outlined text-[16px]">${k.up?'trending_up':'trending_down'}</span>${k.delta}
        </span>
      </div>
      <div class="font-headline-md text-headline-md text-primary font-semibold">${k.val}</div>
      <div class="font-body-sm text-body-sm text-on-surface-variant">${k.label}</div>
    </div>`).join('');
}

function renderRevenueChart(){
  const W = 760, H = 240, padL = 44, padB = 28, padT = 14, padR = 10;
  const max = Math.max(...REVENUE.map(r=>r.v));
  const innerW = W-padL-padR, innerH = H-padT-padB;
  const x = i => padL + i*(innerW/(REVENUE.length-1));
  const y = v => padT + innerH - (v/max)*innerH;
  const pts = REVENUE.map((r,i)=>[x(i),y(r.v)]);
  const path = pts.map((p,i)=>(i===0?'M':'L')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area = path + ` L${x(REVENUE.length-1)} ${padT+innerH} L${x(0)} ${padT+innerH} Z`;
  const gridY = [0,.25,.5,.75,1].map(f=>padT+innerH-f*innerH);
  document.getElementById('revenueChart').innerHTML = `
  <svg viewBox="0 0 ${W} ${H}" class="w-full" role="img" aria-label="Biểu đồ doanh thu 12 tháng">
    ${gridY.map(g=>`<line x1="${padL}" y1="${g}" x2="${W-padR}" y2="${g}" stroke="#e3e3de" stroke-width="1"/><text x="${padL-8}" y="${g+4}" text-anchor="end" font-size="10" fill="#737874" font-family="Plus Jakarta Sans">${Math.round(max*(1-(g-padT)/innerH))}</text>`).join('')}
    <path d="${area}" fill="#9a4526" opacity="0.08"/>
    <path d="${path}" fill="none" stroke="#9a4526" stroke-width="2.5" stroke-linejoin="round"/>
    ${pts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="#faf9f4" stroke="#9a4526" stroke-width="2"><title>${REVENUE[i].m}: ${REVENUE[i].v} triệu đ</title></circle>`).join('')}
    ${REVENUE.map((r,i)=>`<text x="${x(i)}" y="${H-8}" text-anchor="middle" font-size="9.5" fill="#737874" font-family="Plus Jakarta Sans">${r.m}</text>`).join('')}
  </svg>`;
}

function renderCategoryChart(){
  const max = Math.max(...CAT_ORDERS.map(c=>c.pct));
  document.getElementById('categoryChart').innerHTML = CAT_ORDERS.map(c=>`
    <div>
      <div class="flex items-center justify-between font-body-sm text-body-sm mb-1.5">
        <span class="text-on-surface font-semibold">${c.name}</span>
        <span class="text-on-surface-variant">${c.orders} đơn</span>
      </div>
      <div class="h-3 rounded-full bg-surface-container-high overflow-hidden">
        <div class="h-full rounded-full transition-all duration-700" style="width:${(c.pct/max*100).toFixed(0)}%;background:${c.color}"></div>
      </div>
    </div>`).join('');
}

function renderInsights(){
  document.getElementById('aiInsights').innerHTML = INSIGHTS.map(i=>`
    <div class="bg-white/5 backdrop-blur-sm rounded-xl p-space-md border border-white/10 space-y-2">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-tertiary-fixed text-[20px]">${i.icon}</span>
        <span class="font-title-md text-title-md text-surface-container-lowest font-semibold flex-1">${i.title}</span>
        <span class="px-2 py-0.5 rounded-full ${i.tagTone} font-label-sm text-label-sm">${i.tag}</span>
      </div>
      <p class="font-body-sm text-body-sm text-surface-container-high leading-relaxed">${i.body}</p>
    </div>`).join('');
}

function renderDisputes(){
  document.getElementById('disputeCount').textContent = disputes.filter(d=>d.status==='pending').length;
  document.getElementById('disputeTableBody').innerHTML = disputes.map(d=>`
    <tr class="border-b border-surface-container-high transition-colors ${d.status!=='pending'?'opacity-55 bg-surface-container-low/40':''}">
      <td class="px-gutter py-3.5">
        <div class="font-title-md text-title-md text-primary font-semibold">#${d.id}</div>
        <div class="font-body-sm text-body-sm text-on-surface-variant max-w-[240px] truncate">${d.title}</div>
      </td>
      <td class="px-4 py-3.5 font-body-sm text-body-sm">${d.customer}</td>
      <td class="px-4 py-3.5 font-body-sm text-body-sm">${d.maker}</td>
      <td class="px-4 py-3.5 font-title-md text-title-md text-primary font-semibold">${d.value}</td>
      <td class="px-4 py-3.5 max-w-[300px]">
        ${d.status==='pending'
          ? `<div class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">${d.issue}</div><div class="font-label-sm text-label-sm text-error mt-1">Chờ ${d.days} ngày</div>`
          : `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${d.status==='refunded'?'bg-error-container text-on-error-container':'bg-primary-fixed text-on-primary-fixed'} font-label-sm text-label-sm"><span class="material-symbols-outlined text-[14px]">${d.status==='refunded'?'undo':'check_circle'}</span>${d.status==='refunded'?'Đã ép hoàn tiền':'Đã buộc hoàn thành'}</span>`}
      </td>
      <td class="px-4 py-3.5">
        ${d.status==='pending'
          ? `<div class="flex justify-end gap-2">
              <button class="h-9 px-3.5 rounded-lg bg-error text-on-error font-label-lg text-label-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-1" type="button" onclick="openOverride('${d.id}','refund')"><span class="material-symbols-outlined text-[16px]">undo</span>Ép hoàn tiền</button>
              <button class="h-9 px-3.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container transition-colors flex items-center gap-1" type="button" onclick="openOverride('${d.id}','complete')"><span class="material-symbols-outlined text-[16px]">check_circle</span>Buộc hoàn thành</button>
            </div>`
          : `<div class="text-right font-body-sm text-body-sm text-on-surface-variant">Đã xử lý bởi Admin Nam</div>`}
      </td>
    </tr>`).join('') || `<tr><td colspan="6" class="px-gutter py-8 text-center font-body-md text-body-md text-on-surface-variant">Không có tranh chấp nào đang mở.</td></tr>`;
}

function nowTime(){ return new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit',second:'2-digit'}); }

function pushLog(icon, tone, text){
  const ul = document.getElementById('activityLog');
  const li = document.createElement('li');
  li.className = 'log-entry flex gap-3 items-start';
  li.innerHTML = `<span class="mt-0.5 w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[18px] ${tone}">${icon}</span></span>
    <div class="min-w-0"><p class="font-body-sm text-body-sm text-on-surface leading-snug">${text}</p><span class="font-label-sm text-label-sm text-outline">${nowTime()}</span></div>`;
  ul.prepend(li);
  while(ul.children.length>16) ul.removeChild(ul.lastChild);
}

function seedLog(){
  const seed = [
    {icon:'request_quote',tone:'text-secondary',text:'Brief #BR-121 gửi tới 3 Maker chuyên mây tre'},
    {icon:'gavel',tone:'text-error',text:'Moderator Trang mở ca kháng án #APL-12'},
    {icon:'payments',tone:'text-primary',text:'Đối soát đợt #PAYOUT-44 hoàn tất — 96 Maker nhận tiền'},
    {icon:'person_add',tone:'text-primary',text:'12 khách hàng mới đăng ký trong giờ qua'},
    {icon:'inventory',tone:'text-tertiary-container',text:'AI matching tự gán danh mục "Thêu tay cao cấp" cho 6 listing'},
    {icon:'shopping_bag',tone:'text-primary',text:'Đơn #CL-9841 hoàn tất — 5.780.000đ'},
  ];
  seed.reverse().forEach(s=>pushLog(s.icon,s.tone,s.text));
}

function simulateLog(){
  const t = LOG_TEMPLATES[Math.floor(Math.random()*LOG_TEMPLATES.length)];
  pushLog(t.icon,t.tone,t.text);
}

function openOverride(id, action){
  overrideTarget = {id, action};
  const d = disputes.find(x=>x.id===id);
  document.getElementById('overrideTitle').textContent = action==='refund'?'Ép buộc hoàn tiền?':'Buộc hoàn thành đơn?';
  document.getElementById('overrideDesc').innerHTML = action==='refund'
    ? `Toàn bộ số tiền <b>${d.value}</b> của brief <b>#${d.id}</b> sẽ được hoàn về khách hàng <b>${d.customer}</b>. Maker <b>${d.maker}</b> sẽ nhận cảnh báo chất lượng.`
    : `Brief <b>#${d.id}</b> sẽ được chuyển sang trạng thái <b>Hoàn thành</b>; thanh toán <b>${d.value}</b> chuyển cho Maker <b>${d.maker}</b>. Khách hàng có thể khiếu nại tiếp trong 48 giờ.`;
  document.getElementById('overrideAck').checked = false;
  document.getElementById('overrideModal').classList.remove('modal-hidden');
}
function closeOverrideModal(){ overrideTarget=null; document.getElementById('overrideModal').classList.add('modal-hidden'); }
function confirmOverride(){
  if(!document.getElementById('overrideAck').checked){ showToast('Vui lòng tick xác nhận chịu trách nhiệm ghi đề','error'); return; }
  const d = disputes.find(x=>x.id===overrideTarget.id);
  d.status = overrideTarget.action==='refund'?'refunded':'completed';
  pushLog('gavel','text-error',`Admin ghi đề #${d.id}: ${overrideTarget.action==='refund'?'ép hoàn tiền':'buộc hoàn thành'}`);
  showToast(`Đã ghi đề brief #${d.id} — ${overrideTarget.action==='refund'?'hoàn tiền cho khách':'chuyển sang hoàn thành'}`);
  closeOverrideModal(); renderDisputes();
}

function onCommissionChange(v){
  document.getElementById('commissionLabel').textContent = (+v).toLocaleString('vi-VN',{minimumFractionDigits:0})+'%';
}
function onBriefLimitChange(v){
  document.getElementById('briefLimitLabel').textContent = v+' brief';
}
function toggleMaintenance(){
  const sw = document.getElementById('maintenanceSwitch');
  sw.classList.toggle('on');
  const on = sw.classList.contains('on');
  document.getElementById('maintenanceBadge').classList.toggle('hidden', !on);
  showToast(on?'Chế độ bảo trì đã BẬT — người dùng bị chặn truy cập':'Chế độ bảo trì đã TẮT — sàn hoạt động bình thường', on?'error':'success');
  pushLog('construction', on?'text-error':'text-primary', on?'Bật chế độ bảo trì toàn sàn':'Tắt chế độ bảo trì toàn sàn');
}
function saveSettings(){
  const c = document.getElementById('commissionRange').value;
  const b = document.getElementById('briefLimitRange').value;
  showToast(`Đã lưu cấu hình: hoa hồng ${(+c).toLocaleString('vi-VN')}% · giới hạn ${b} brief/ngày`);
  pushLog('tune','text-primary',`Cập nhật cấu hình hệ thống: phí hoa hồng ${c}%, giới hạn brief ${b}/ngày`);
}
function resetSettings(){
  document.getElementById('commissionRange').value = 7.5;
  document.getElementById('briefLimitRange').value = 5;
  onCommissionChange(7.5); onBriefLimitChange(5);
  showToast('Đã khôi phục tham số mặc định');
}

function exportCSV(){
  let csv = '\uFEFFLoại báo cáo;Kỳ;Chỉ số;Giá trị\n';
  csv += `Người dùng mới;10/2026;Số lượng;1284\n`;
  csv += `Listing mới;10/2026;Số lượng;312\n`;
  csv += `Brief tùy biến;10/2026;Số lượng;96\n`;
  csv += `GMV;10/2026;VNĐ;2840000000\n`;
  csv += `Phí hoa hồng hiện hành;10/2026;%;${document.getElementById('commissionRange').value}\n`;
  csv += `\nTài khoản;Vai trò;Số vi phạm;Trạng thái\n`;
  [
    ['Phạm Hồng Sơn','Khách hàng',4,'Khóa vĩnh viễn'],
    ['Hoàng Thị Thuỳ Dung','Maker',3,'Khóa 30 ngày'],
    ['Lê Văn Hùng','Maker',2,'Đang hoạt động'],
    ['Trịnh Công Sơn','Khách hàng',1,'Đang hoạt động'],
    ['Vũ Đức Thịnh','Maker',1,'Đang hoạt động'],
  ].forEach(r=>csv+=r.join(';')+'\n');
  const blob = new Blob([csv],{type:'text/csv;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'craftlink-bao-cao-10-2026.csv';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('Đã xuất báo cáo CSV (doanh thu + vi phạm)');
  pushLog('download','text-primary','Xuất báo cáo CSV phục vụ kiểm toán');
}

renderKPIs(); renderRevenueChart(); renderCategoryChart(); renderInsights(); renderDisputes();
seedLog();
setInterval(simulateLog, 7000);
