// Logic JavaScript cho trang: Quản lý Tài khoản & Phân quyền
let pendingRoleUser = null;
let pendingBanUser = null;
let pendingResetUser = null;
let banDuration = '7';

function findUser(id){ return users.find(u=>u.id===id); }

function statusBadge(u){
  if(u.status==='banned') return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm"><span class="material-symbols-outlined text-[14px]">lock</span>Đã khóa</span>`;
  if(u.status==='pending') return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm"><span class="material-symbols-outlined text-[14px]">hourglass_top</span>Chờ xác minh</span>`;
  return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm"><span class="w-1.5 h-1.5 rounded-full bg-[#3B6E4C]"></span>Hoạt động</span>`;
}

function roleBadge(role){
  const m = ROLE_META[role];
  return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${m.badge} font-label-sm text-label-sm"><span class="material-symbols-outlined text-[15px]">${m.icon}</span>${m.label}</span>`;
}

function renderStats(){
  const cards = [
    {label:'Tổng tài khoản', val:users.length, icon:'group', tone:'bg-surface-container-low text-primary'},
    {label:'Người sáng tạo (Maker)', val:users.filter(u=>u.role==='maker').length, icon:'workspace_premium', tone:'bg-primary-fixed text-on-primary-fixed'},
    {label:'Đội kiểm duyệt & Admin', val:users.filter(u=>u.role==='moderator'||u.role==='admin').length, icon:'shield_person', tone:'bg-tertiary-fixed text-on-tertiary-fixed'},
    {label:'Đang bị khóa', val:users.filter(u=>u.status==='banned').length, icon:'block', tone:'bg-secondary-fixed text-on-secondary-fixed'},
  ];
  document.getElementById('statCards').innerHTML = cards.map(c=>`
    <div class="bg-surface-container-lowest rounded-xl shadow-xs p-space-md flex items-center gap-space-md">
      <div class="w-12 h-12 rounded-xl ${c.tone} flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[26px]">${c.icon}</span></div>
      <div class="min-w-0"><div class="font-headline-md text-headline-md text-primary font-semibold truncate">${c.val}</div><div class="font-body-sm text-body-sm text-on-surface-variant">${c.label}</div></div>
    </div>`).join('');
}

function renderTable(){
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const rf = document.getElementById('roleFilter').value;
  const sf = document.getElementById('statusFilter').value;
  const vo = document.getElementById('verifiedOnly').checked;
  const rows = users.filter(u=>{
    if(rf!=='all' && u.role!==rf) return false;
    if(sf!=='all' && u.status!==sf) return false;
    if(vo && !(u.role==='maker' && u.verified)) return false;
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.replace(/\s/g,'').includes(q.replace(/\s/g,''));
  });
  document.getElementById('userTableBody').innerHTML = rows.map(u=>`
    <tr class="border-b border-surface-container-high hover:bg-surface-container-low/50 transition-colors ${u.status==='banned'?'opacity-60':''}">
      <td class="px-gutter py-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-title-lg text-title-lg shrink-0">${u.name.split(' ').pop()[0]}</div>
          <div class="min-w-0">
            <div class="font-title-md text-title-md text-primary font-semibold flex items-center gap-1.5">${u.name}
              ${u.verified?`<span class="material-symbols-outlined text-[18px] text-tertiary-container" style="font-variation-settings:'FILL' 1" title="Đã xác minh thủ công mỹ nghệ">verified</span>`:''}
            </div>
            <div class="font-body-sm text-body-sm text-on-surface-variant truncate">${u.email}</div>
          </div>
        </div>
      </td>
      <td class="px-4 py-3">${roleBadge(u.role)}</td>
      <td class="px-4 py-3">${statusBadge(u)}</td>
      <td class="px-4 py-3 text-center">
        ${u.violations>0
          ? `<span class="inline-flex items-center justify-center min-w-[28px] h-7 px-1.5 rounded-full ${u.violations>=3?'bg-error text-on-error':'bg-secondary-fixed text-on-secondary-fixed'} font-title-md text-title-md font-semibold">${u.violations}</span>`
          : '<span class="font-body-sm text-body-sm text-outline">0</span>'}
      </td>
      <td class="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">${u.joined}</td>
      <td class="px-4 py-3">
        <div class="flex justify-end gap-1">
          <button class="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors" title="Xem hồ sơ" type="button" onclick="openDetail(${u.id})"><span class="material-symbols-outlined text-[20px]">visibility</span></button>
          <button class="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors" title="Đổi vai trò" type="button" onclick="openRoleModal(${u.id})"><span class="material-symbols-outlined text-[20px]">manage_accounts</span></button>
          <button class="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors" title="Ép đổi mật khẩu" type="button" onclick="openResetModal(${u.id})"><span class="material-symbols-outlined text-[20px]">password</span></button>
          ${u.role==='maker'&&u.status!=='pending'?`<button class="p-2 rounded-lg transition-colors ${u.verified?'text-tertiary-container hover:bg-surface-container-high':'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'}" title="${u.verified?'Gỡ tích xanh':'Cấp tích xanh xác minh'}" type="button" onclick="toggleVerified(${u.id})"><span class="material-symbols-outlined text-[20px]" style="font-variation-settings:'FILL' ${u.verified?1:0}">verified</span></button>`:''}
          ${u.status==='banned'
            ? `<button class="p-2 rounded-lg text-on-error-container hover:bg-primary-fixed transition-colors" title="Mở khóa" type="button" onclick="unbanUser(${u.id})"><span class="material-symbols-outlined text-[20px]">lock_open</span></button>`
            : `<button class="p-2 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors" title="Khóa tài khoản" type="button" onclick="openBanModal(${u.id})"><span class="material-symbols-outlined text-[20px]">block</span></button>`}
        </div>
      </td>
    </tr>`).join('') || `<tr><td colspan="6" class="px-gutter py-8 text-center font-body-md text-body-md text-on-surface-variant">Không có tài khoản nào khớp bộ lọc.</td></tr>`;
  document.getElementById('tableSummary').textContent = `${rows.length} / ${users.length} tài khoản`;
  renderStats();
}

function openDetail(id){
  const u = findUser(id);
  const m = ROLE_META[u.role];
  document.getElementById('detailContent').innerHTML = `
    <div class="px-gutter py-space-md border-b border-surface-container-high flex items-center justify-between sticky top-0 bg-surface-container-lowest rounded-t-xl">
      <h3 class="font-headline-sm text-headline-sm text-primary font-semibold">Hồ sơ chi tiết</h3>
      <button class="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant" type="button" onclick="closeDetail()"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div class="p-gutter space-y-gutter">
      <div class="flex items-start gap-space-md">
        <div class="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-md text-headline-md shrink-0">${u.name.split(' ').pop()[0]}</div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-headline-sm text-headline-sm text-primary font-semibold">${u.name}</span>
            ${u.verified?'<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm"><span class="material-symbols-outlined text-[14px]">verified</span>Tích xanh nghệ nhân</span>':''}
          </div>
          <div class="font-body-md text-body-md text-on-surface-variant mt-0.5">${u.email} · ${u.phone}</div>
          <div class="flex items-center gap-2 mt-2 flex-wrap">${roleBadge(u.role)} ${statusBadge(u)}</div>
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-space-md">
        <div class="p-3.5 rounded-lg bg-surface-container-low"><div class="font-body-sm text-body-sm text-on-surface-variant">Khu vực</div><div class="font-title-md text-title-md text-primary font-semibold mt-0.5">${u.location}</div></div>
        <div class="p-3.5 rounded-lg bg-surface-container-low"><div class="font-body-sm text-body-sm text-on-surface-variant">Làng nghề</div><div class="font-title-md text-title-md text-primary font-semibold mt-0.5 truncate">${u.craft}</div></div>
        <div class="p-3.5 rounded-lg bg-surface-container-low"><div class="font-body-sm text-body-sm text-on-surface-variant">Tổng đơn hàng</div><div class="font-title-md text-title-md text-primary font-semibold mt-0.5">${u.orders}</div></div>
        <div class="p-3.5 rounded-lg bg-surface-container-low"><div class="font-body-sm text-body-sm text-on-surface-variant">Giá trị giao dịch</div><div class="font-title-md text-title-md text-primary font-semibold mt-0.5">${u.revenue}</div></div>
      </div>
      ${u.banInfo?`<div class="p-3.5 rounded-lg bg-error-container font-body-sm text-body-sm text-on-error-container flex gap-2"><span class="material-symbols-outlined text-[18px] shrink-0">block</span><span><b>Khóa tới:</b> ${u.banInfo.until}<br/><b>Lý do:</b> ${u.banInfo.reason}</span></div>`:''}
      <div>
        <h4 class="font-title-lg text-title-lg text-primary font-semibold mb-space-sm flex items-center gap-2"><span class="material-symbols-outlined text-[20px]">history</span>Lịch sử hoạt động gần đây</h4>
        <ul class="space-y-2.5">
          ${u.activity.map((a,i)=>`<li class="flex gap-3"><span class="mt-1 w-2 h-2 rounded-full ${i===0?'bg-secondary':'bg-outline-variant'} shrink-0"></span><span class="font-body-md text-body-md text-on-surface">${a}</span></li>`).join('')}
        </ul>
      </div>
      <div class="flex items-center justify-between pt-space-sm border-t border-surface-container-high">
        <span class="font-body-sm text-body-sm text-on-surface-variant">Chỉ số vi phạm: <b class="${u.violations>=3?'text-error':'text-primary'}">${u.violations}</b> cảnh báo</span>
        <button class="h-10 px-5 rounded-lg bg-surface-container-high text-primary font-label-lg text-label-lg font-semibold hover:bg-surface-container-highest transition-colors" type="button" onclick="closeDetail()">Đóng</button>
      </div>
    </div>`;
  document.getElementById('detailModal').classList.remove('modal-hidden');
}
function closeDetail(){ document.getElementById('detailModal').classList.add('modal-hidden'); }

function openRoleModal(id){
  pendingRoleUser = findUser(id);
  document.getElementById('roleModalDesc').innerHTML = `Tài khoản <b>${pendingRoleUser.name}</b> — vai trò hiện tại: <b>${ROLE_META[pendingRoleUser.role].label}</b>.`;
  document.getElementById('roleOptions').innerHTML = Object.keys(ROLE_META).map(r=>`
    <label class="chip relative"><input type="radio" name="newRole" value="${r}" ${r===pendingRoleUser.role?'checked':''} onchange="onRolePick('${r}')"/><span><span class="material-symbols-outlined text-[18px]">${ROLE_META[r].icon}</span>${ROLE_META[r].label}</span></label>`).join('');
  document.getElementById('roleAckWrap').classList.add('hidden');
  document.getElementById('roleAck').checked = false;
  document.getElementById('roleModal').classList.remove('modal-hidden');
}
function onRolePick(r){
  const elevated = ROLE_RANK[r] >= ROLE_RANK.moderator || r==='maker';
  document.getElementById('roleAckWrap').classList.toggle('hidden', !elevated);
}
function closeRoleModal(){ pendingRoleUser=null; document.getElementById('roleModal').classList.add('modal-hidden'); }
function confirmRoleChange(){
  const r = document.querySelector('input[name="newRole"]:checked').value;
  if(r===pendingRoleUser.role){ closeRoleModal(); return; }
  const elevated = ROLE_RANK[r] >= ROLE_RANK.moderator || r==='maker';
  if(elevated && !document.getElementById('roleAck').checked){ showToast('Vui lòng tick xác nhận phân quyền cấp cao','error'); return; }
  const old = ROLE_META[pendingRoleUser.role].label;
  pendingRoleUser.role = r;
  if(r==='maker' && pendingRoleUser.status==='pending') pendingRoleUser.status='active';
  showToast(`Đã đổi vai trò ${pendingRoleUser.name}: ${old} → ${ROLE_META[r].label}`);
  closeRoleModal(); renderTable();
}

function openBanModal(id){
  pendingBanUser = findUser(id);
  document.getElementById('banModalDesc').innerHTML = `Khóa tài khoản <b>${pendingBanUser.name}</b> (${pendingBanUser.email}). Người dùng sẽ không đăng nhập được trong thời hạn đã chọn.`;
  const durs = [{v:'7',l:'7 ngày',i:'calendar_clock'},{v:'30',l:'30 ngày',i:'event_busy'},{v:'forever',l:'Vĩnh viễn',i:'block'}];
  banDuration = '7';
  document.getElementById('banDurations').innerHTML = durs.map(d=>`
    <button type="button" class="dur-btn p-3 rounded-lg border-2 text-center transition-colors ${d.v==='7'?'border-secondary bg-secondary-fixed/40':'border-surface-container-high hover:border-outline-variant'}" data-v="${d.v}" onclick="pickDuration('${d.v}')">
      <span class="material-symbols-outlined text-[22px] ${d.v==='7'?'text-secondary':'text-on-surface-variant'} block mx-auto">${d.i}</span>
      <span class="font-label-lg text-label-lg font-semibold ${d.v==='7'?'text-on-secondary-fixed':'text-on-surface'}">${d.l}</span>
    </button>`).join('');
  document.getElementById('banReason').value = '';
  document.getElementById('banModal').classList.remove('modal-hidden');
}
function pickDuration(v){
  banDuration = v;
  document.querySelectorAll('.dur-btn').forEach(b=>{
    const on = b.dataset.v===v;
    b.className = `dur-btn p-3 rounded-lg border-2 text-center transition-colors ${on?'border-secondary bg-secondary-fixed/40':'border-surface-container-high hover:border-outline-variant'}`;
  });
}
function closeBanModal(){ pendingBanUser=null; document.getElementById('banModal').classList.add('modal-hidden'); }
function confirmBan(){
  const reason = document.getElementById('banReason').value.trim();
  if(!reason){ showToast('Vui lòng nhập lý do khóa','error'); return; }
  const label = banDuration==='7'?'7 ngày':banDuration==='30'?'30 ngày':'Vĩnh viễn';
  const uname = pendingBanUser.name;
  pendingBanUser.status = 'banned';
  pendingBanUser.violations++;
  pendingBanUser.banInfo = {until:label==='Vĩnh viễn'?'Vĩnh viễn':label, reason};
  pendingBanUser.activity.unshift(`Bị khóa ${label.toLowerCase()} bởi Admin Nam — ${reason}`);
  const mail = document.getElementById('banSendEmail').checked;
  closeBanModal(); renderTable();
  showToast(`Đã khóa "${uname}" ${label.toLowerCase()}${mail?' — email thông báo đã gửi':''}`);
}

function unbanUser(id){
  const u = findUser(id);
  u.status = 'active';
  delete u.banInfo;
  u.activity.unshift('Được mở khóa bởi Admin Nam');
  renderTable();
  showToast(`Đã mở khóa tài khoản "${u.name}"`);
}

function openResetModal(id){
  pendingResetUser = findUser(id);
  document.getElementById('resetModalDesc').innerHTML = `Gửi yêu cầu <b>bắt buộc đổi mật khẩu</b> tới <b>${pendingResetUser.name}</b> vì lý do bảo mật.`;
  document.getElementById('resetModal').classList.remove('modal-hidden');
}
function closeResetModal(){ pendingResetUser=null; document.getElementById('resetModal').classList.add('modal-hidden'); }
function confirmReset(){
  showToast(`Đã gửi yêu cầu đặt lại mật khẩu tới ${pendingResetUser.email}`);
  closeResetModal();
}

function toggleVerified(id){
  const u = findUser(id);
  u.verified = !u.verified;
  renderTable();
  showToast(u.verified?`Đã cấp tích xanh xác minh cho "${u.name}"`:`Đã gỡ tích xanh của "${u.name}"`);
}

function openCreateModal(){ document.getElementById('createModal').classList.remove('modal-hidden'); }
function closeCreateModal(){ document.getElementById('createModal').classList.add('modal-hidden'); }
function createAccount(e){
  e.preventDefault();
  const name = document.getElementById('newName').value.trim();
  const role = document.getElementById('newRole').value;
  users.unshift({
    id:Date.now(), name, email:document.getElementById('newEmail').value.trim(), phone:'—',
    role, status:'active', joined:new Date().toLocaleDateString('vi-VN'), violations:0, verified:false,
    location:'Hà Nội', craft:'—', orders:0, revenue:'—', activity:['Tài khoản nội bộ được tạo bởi Admin Nam']
  });
  closeCreateModal(); renderTable();
  showToast(`Đã tạo tài khoản ${ROLE_META[role].label.toLowerCase()} "${name}" — email kích hoạt đã gửi`);
  e.target.reset();
}

document.getElementById('searchInput').addEventListener('input', renderTable);
document.getElementById('roleFilter').addEventListener('change', renderTable);
document.getElementById('statusFilter').addEventListener('change', renderTable);
document.getElementById('verifiedOnly').addEventListener('change', renderTable);
renderTable();
