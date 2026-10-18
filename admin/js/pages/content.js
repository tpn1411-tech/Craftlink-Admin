// Logic JavaScript cho trang: Quản lý Danh mục & Taxonomy
let archived = [];
let currentView = 'tree';
let pendingStatusId = null;
let pendingDeleteId = null;
let selectedIcon = ICONS[0];
let expanded = new Set(categories.filter(c=>!c.parentId).map(c=>c.id));

function slugify(str){
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/đ/g,'d').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}
function findCat(id){ return categories.find(c=>c.id===id); }
function childrenOf(id){ return categories.filter(c=>c.parentId===id).sort((a,b)=>a.order-b.order); }
function catStats(){
  return {
    total: categories.length + archived.length,
    active: categories.filter(c=>c.status==='active').length,
    hidden: categories.filter(c=>c.status==='hidden').length,
    products: categories.reduce((s,c)=>s+c.products,0),
    orders: categories.reduce((s,c)=>s+c.orders,0)
  };
}

function renderStats(){
  const s = catStats();
  const cards = [
    {label:'Tổng danh mục', val:s.total, icon:'category', tone:'bg-surface-container-low text-primary'},
    {label:'Đang hoạt động', val:s.active, icon:'check_circle', tone:'bg-primary-fixed text-on-primary-fixed'},
    {label:'Đang ẩn', val:s.hidden, icon:'visibility_off', tone:'bg-secondary-fixed text-on-secondary-fixed'},
    {label:'Sản phẩm phân loại', val:s.products.toLocaleString('vi-VN'), icon:'inventory_2', tone:'bg-tertiary-fixed text-on-tertiary-fixed'},
  ];
  document.getElementById('statCards').innerHTML = cards.map(c=>`
    <div class="bg-surface-container-lowest rounded-xl shadow-xs p-space-md flex items-center gap-space-md">
      <div class="w-12 h-12 rounded-xl ${c.tone} flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[26px]">${c.icon}</span></div>
      <div class="min-w-0"><div class="font-headline-md text-headline-md text-primary font-semibold truncate">${c.val}</div><div class="font-body-sm text-body-sm text-on-surface-variant">${c.label}</div></div>
    </div>`).join('');
}

function statusBadge(c){
  return c.status==='active'
    ? `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm"><span class="w-1.5 h-1.5 rounded-full bg-[#3B6E4C]"></span>Hoạt động</span>`
    : `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm"><span class="w-1.5 h-1.5 rounded-full bg-outline"></span>Đang ẩn</span>`;
}

function matchesFilter(c, q){
  if(!q) return true;
  return c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
}

function renderTree(){
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const f = document.getElementById('statusFilter').value;
  const roots = categories.filter(c=>!c.parentId).sort((a,b)=>a.order-b.order);
  let html = '', visible = 0;

  function row(c, depth){
    if(f!=='all' && c.status!==f) return '';
    if(!matchesFilter(c,q)) return '';
    visible++;
    const kids = childrenOf(c.id);
    const isOpen = expanded.has(c.id);
    const hasKids = kids.length>0;
    const pad = depth===0 ? '' : `style="padding-left:${depth*2.25+1}rem"`;
    const dimmed = c.status==='hidden' ? 'opacity-60' : '';
    return `
    <div class="tree-row border-b border-surface-container-high ${dimmed}" data-cat="${c.id}">
      <div class="px-gutter py-3.5 flex items-center gap-3 ${depth===0?'bg-surface-container-low/60':''}" ${pad}>
        <button class="w-6 h-6 rounded flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors ${hasKids?'':'invisible'}" type="button" onclick="toggleExpand(${c.id})">
          <span class="material-symbols-outlined text-[18px] transition-transform ${isOpen?'':'-rotate-90'}">expand_more</span>
        </button>
        <span class="w-9 h-9 rounded-lg ${c.status==='active'?'bg-primary-fixed text-on-primary-fixed':'bg-surface-container-high text-outline'} flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[20px]">${c.icon}</span></span>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-title-md text-title-md text-primary font-semibold">${c.name}</span>
            <span class="font-mono text-body-sm text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded">${c.slug}</span>
            ${depth===0?'<span class="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">CHA</span>':''}
          </div>
          <div class="font-body-sm text-body-sm text-on-surface-variant mt-0.5 truncate max-w-xl">${c.desc||''}</div>
        </div>
        <div class="hidden lg:flex items-center gap-6 font-body-sm text-body-sm text-on-surface-variant shrink-0">
          <span class="text-center w-16"><b class="block text-on-surface font-title-md">${c.products}</b>SP</span>
          <span class="text-center w-16"><b class="block text-on-surface font-title-md">${c.listings}</b>Tin đăng</span>
          <span class="text-center w-16"><b class="block text-on-surface font-title-md">${c.orders}</b>Đơn hàng</span>
          <span class="text-center w-12"><b class="block text-on-surface font-title-md">${c.order}</b>Thứ tự</span>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          ${statusBadge(c)}
          <button class="switch ${c.status==='active'?'on':''}" title="${c.status==='active'?'Ẩn danh mục':'Hiện danh mục'}" type="button" onclick="requestToggleStatus(${c.id})"></button>
          <button class="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors" title="Chỉnh sửa" type="button" onclick="openFormModal(${c.id})"><span class="material-symbols-outlined text-[20px]">edit</span></button>
          <button class="p-2 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors" title="Xóa / Lưu trữ" type="button" onclick="openDeleteModal(${c.id})"><span class="material-symbols-outlined text-[20px]">delete</span></button>
        </div>
      </div>
      ${isOpen ? kids.map(k=>row(k, depth+1)).join('') : ''}
    </div>`;
  }

  html = roots.map(r=>row(r,0)).join('');

  document.getElementById('treeContainer').innerHTML = html || `<div class="p-gutter text-center font-body-md text-body-md text-on-surface-variant">Không có danh mục nào khớp bộ lọc.</div>`;
  document.getElementById('treeSummary').textContent = `${visible} danh mục đang hiển thị`;
}

function renderTable(){
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const f = document.getElementById('statusFilter').value;
  const rows = categories.slice().sort((a,b)=>(a.parentId||0)-(b.parentId||0)||a.order-b.order)
    .filter(c=>(f==='all'||c.status===f) && matchesFilter(c,q));
  document.getElementById('tableBody').innerHTML = rows.map(c=>{
    const parent = c.parentId ? findCat(c.parentId) : null;
    return `<tr class="border-b border-surface-container-high hover:bg-surface-container-low/50 transition-colors ${c.status==='hidden'?'opacity-60':''}">
      <td class="px-gutter py-3">
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-lg bg-surface-container-low text-primary flex items-center justify-center"><span class="material-symbols-outlined text-[18px]">${c.icon}</span></span>
          <div><div class="font-title-md text-title-md text-primary font-semibold">${c.name}</div><div class="font-body-sm text-body-sm text-on-surface-variant">${c.desc?c.desc.slice(0,60)+(c.desc.length>60?'…':''):'—'}</div></div>
        </div>
      </td>
      <td class="px-4 py-3 font-body-sm text-body-sm">${parent?parent.name:'<span class="text-outline">— Gốc —</span>'}</td>
      <td class="px-4 py-3 font-mono text-body-sm text-on-surface-variant">${c.slug}</td>
      <td class="px-4 py-3 text-center font-title-md text-title-md">${c.products}</td>
      <td class="px-4 py-3 text-center font-title-md text-title-md">${c.orders}</td>
      <td class="px-4 py-3 font-title-md text-title-md">${c.order}</td>
      <td class="px-4 py-3">${statusBadge(c)}</td>
      <td class="px-4 py-3">
        <div class="flex justify-end gap-1">
          <button class="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors" type="button" onclick="requestToggleStatus(${c.id})" title="Ẩn/Hiện"><span class="material-symbols-outlined text-[20px]">${c.status==='active'?'visibility_off':'visibility'}</span></button>
          <button class="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors" type="button" onclick="openFormModal(${c.id})" title="Sửa"><span class="material-symbols-outlined text-[20px]">edit</span></button>
          <button class="p-2 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors" type="button" onclick="openDeleteModal(${c.id})" title="Xóa"><span class="material-symbols-outlined text-[20px]">delete</span></button>
        </div>
      </td>
    </tr>`;
  }).join('') || `<tr><td colspan="8" class="px-gutter py-8 text-center font-body-md text-body-md text-on-surface-variant">Không có danh mục nào khớp bộ lọc.</td></tr>`;
  document.getElementById('tableSummary').textContent = `${rows.length} danh mục đang hiển thị`;
}

function renderArchive(){
  const box = document.getElementById('archiveContainer');
  if(!archived.length){
    box.innerHTML = `<div class="p-gutter text-center font-body-md text-body-md text-on-surface-variant">Chưa có danh mục nào được lưu trữ.</div>`;
  } else {
    box.innerHTML = archived.map(c=>`
      <div class="px-gutter py-3.5 flex items-center gap-3 border-b border-surface-container-high last:border-0 opacity-70">
        <span class="w-9 h-9 rounded-lg bg-surface-container-high text-outline flex items-center justify-center"><span class="material-symbols-outlined text-[20px]">${c.icon}</span></span>
        <div class="flex-1 min-w-0"><span class="font-title-md text-title-md text-primary font-semibold">${c.name}</span><span class="font-mono text-body-sm text-on-surface-variant ml-2">${c.slug}</span></div>
        <span class="font-body-sm text-body-sm text-on-surface-variant hidden sm:block">Lưu trữ ${c.archivedAt}</span>
        <button class="h-9 px-3 rounded-lg bg-surface-container-high text-primary font-label-lg text-label-lg font-semibold hover:bg-surface-container-highest transition-colors" type="button" onclick="restoreCategory(${c.id})">Khôi phục</button>
      </div>`).join('');
  }
  document.getElementById('archiveSummary').textContent = `${archived.length} danh mục`;
}

function renderAll(){ renderStats(); renderTree(); renderTable(); renderArchive(); }

function toggleExpand(id){ expanded.has(id)?expanded.delete(id):expanded.add(id); renderTree(); }

function setView(v){
  currentView = v;
  document.getElementById('treeView').classList.toggle('hidden', v!=='tree');
  document.getElementById('tableView').classList.toggle('hidden', v!=='table');
  const on = 'h-8 px-4 rounded-md font-label-lg text-label-lg font-semibold flex items-center gap-1.5 transition-colors bg-primary text-on-primary';
  const off = 'h-8 px-4 rounded-md font-label-lg text-label-lg font-semibold flex items-center gap-1.5 transition-colors text-on-surface-variant hover:text-on-surface';
  document.getElementById('viewTreeBtn').className = v==='tree'?on:off;
  document.getElementById('viewTableBtn').className = v==='table'?on:off;
}

function autoSlug(){
  const id = document.getElementById('catId').value;
  if(!id) document.getElementById('catSlug').value = slugify(document.getElementById('catName').value);
}

function renderIconPicker(){
  document.getElementById('iconPicker').innerHTML = ICONS.map(i=>`
    <button type="button" class="icon-pick ${i===selectedIcon?'selected':''} w-10 h-10 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors" data-icon="${i}" onclick="pickIcon('${i}')">
      <span class="material-symbols-outlined text-[20px]">${i}</span>
    </button>`).join('');
}
function pickIcon(i){ selectedIcon = i; renderIconPicker(); }

function openFormModal(id){
  const sel = document.getElementById('catParent');
  const cat = id ? findCat(id) : null;
  sel.innerHTML = `<option value="">— Không (danh mục gốc) —</option>` +
    categories.filter(c=>!c.parentId && c.id!==id).map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
  document.getElementById('formModalTitle').textContent = cat ? `Chỉnh sửa: ${cat.name}` : 'Tạo danh mục mới';
  document.getElementById('catId').value = cat?cat.id:'';
  document.getElementById('catName').value = cat?cat.name:'';
  document.getElementById('catSlug').value = cat?cat.slug:'';
  document.getElementById('catParent').value = cat&&cat.parentId?cat.parentId:'';
  document.getElementById('catOrder').value = cat?cat.order:0;
  document.getElementById('catDesc').value = cat?cat.desc:'';
  selectedIcon = cat?cat.icon:ICONS[0];
  renderIconPicker();
  document.getElementById('formModal').classList.remove('modal-hidden');
}
function closeFormModal(){ document.getElementById('formModal').classList.add('modal-hidden'); }

function saveCategory(e){
  e.preventDefault();
  const id = document.getElementById('catId').value;
  const name = document.getElementById('catName').value.trim();
  const data = {
    name,
    slug: document.getElementById('catSlug').value.trim() || slugify(name),
    parentId: document.getElementById('catParent').value ? +document.getElementById('catParent').value : null,
    order: +document.getElementById('catOrder').value||0,
    desc: document.getElementById('catDesc').value.trim(),
    icon: selectedIcon
  };
  if(id){
    Object.assign(findCat(+id), data);
    showToast(`Đã cập nhật danh mục "${name}"`);
  } else {
    categories.push({id:Date.now(), status:'active', products:0, listings:0, orders:0, ...data});
    showToast(`Đã tạo danh mục "${name}"`);
  }
  closeFormModal(); renderAll();
}

function requestToggleStatus(id){
  const c = findCat(id);
  if(c.status==='hidden'){ c.status='active'; showToast(`Đã hiện danh mục "${c.name}"`); renderAll(); return; }
  pendingStatusId = id;
  document.getElementById('statusModalDesc').innerHTML = `Danh mục <b>${c.name}</b> và toàn bộ sản phẩm con sẽ bị ẩn khỏi Trang chủ & Marketplace ngay lập tức.`;
  document.getElementById('statusProductCount').textContent = c.products;
  document.getElementById('statusAck').checked = false;
  document.getElementById('statusModal').classList.remove('modal-hidden');
}
function closeStatusModal(){ pendingStatusId=null; document.getElementById('statusModal').classList.add('modal-hidden'); }
function confirmStatusToggle(){
  if(!document.getElementById('statusAck').checked){ showToast('Vui lòng tick xác nhận tác động trước','error'); return; }
  const c = findCat(pendingStatusId);
  c.status='hidden'; closeStatusModal(); showToast(`Đã ẩn danh mục "${c.name}" — ${c.products} sản phẩm tạm ẩn khỏi sàn`); renderAll();
}

function openMigrationModal(){
  const opts = categories.map(c=>`<option value="${c.id}">${c.parentId?'└ ':''}${c.name}</option>`).join('');
  document.getElementById('migrateFrom').innerHTML = opts;
  document.getElementById('migrateTo').innerHTML = opts;
  document.getElementById('migrateAck').checked = false;
  updateMigrationPreview();
  document.getElementById('migrationModal').classList.remove('modal-hidden');
}
function closeMigrationModal(){ document.getElementById('migrationModal').classList.add('modal-hidden'); }
function updateMigrationPreview(){
  const a = findCat(+document.getElementById('migrateFrom').value);
  const b = findCat(+document.getElementById('migrateTo').value);
  const pv = document.getElementById('migrationPreview');
  const btn = document.getElementById('migrateBtn');
  if(a && b && a.id===b.id){
    pv.classList.remove('hidden');
    pv.innerHTML = `<span class="material-symbols-outlined text-[18px] align-middle mr-1">error</span>Danh mục nguồn và đích không được trùng nhau.`;
    btn.disabled = true; btn.classList.add('opacity-50');
    return;
  }
  btn.disabled = false; btn.classList.remove('opacity-50');
  if(!a || !b){ pv.classList.add('hidden'); return; }
  pv.classList.remove('hidden');
  pv.innerHTML = `Sẽ chuyển <b>${a.products} sản phẩm</b> và <b>${a.listings} tin đăng</b> từ <b>${a.name}</b> sang <b>${b.name}</b>. Danh mục "${a.name}" sẽ còn 0 sản phẩm và có thể xóa an toàn.`;
}
function runMigration(){
  if(!document.getElementById('migrateAck').checked){ showToast('Vui lòng tick xác nhận kiểm toán trước','error'); return; }
  const a = findCat(+document.getElementById('migrateFrom').value);
  const b = findCat(+document.getElementById('migrateTo').value);
  if(!a||!b||a.id===b.id) return;
  b.products += a.products; b.orders += a.orders;
  if(document.getElementById('migrateListings').checked) b.listings += a.listings;
  const moved = a.products;
  a.products = 0; a.listings = 0; a.orders = 0;
  closeMigrationModal(); renderAll();
  showToast(`Đã chuyển ${moved} sản phẩm từ "${a.name}" sang "${b.name}"`);
}

function openDeleteModal(id){
  pendingDeleteId = id;
  const c = findCat(id);
  const kids = childrenOf(id);
  document.getElementById('deleteModalTitle').textContent = `Xóa / Lưu trữ: ${c.name}`;
  let warn = '';
  if(kids.length) warn += `<div class="p-3 rounded-lg bg-error-container/60 font-body-sm text-body-sm text-on-error-container flex gap-2"><span class="material-symbols-outlined text-[18px] shrink-0">error</span>Danh mục đang có <b>${kids.length} danh mục con</b> — bắt buộc chuyển hoặc lưu trữ cấp con trước.</div>`;
  if(c.orders>0) warn += `<div class="p-3 rounded-lg bg-error-container/60 font-body-sm text-body-sm text-on-error-container flex gap-2"><span class="material-symbols-outlined text-[18px] shrink-0">error</span>Đang có <b>${c.orders} đơn hàng hoạt động</b> liên quan — hệ thống yêu cầu xác nhận cấp cao.</div>`;
  if(c.listings>0) warn += `<div class="p-3 rounded-lg bg-tertiary-fixed/60 font-body-sm text-body-sm text-on-tertiary-fixed-variant flex gap-2"><span class="material-symbols-outlined text-[18px] shrink-0">warning</span><b>${c.listings} tin đăng</b> đang hiển thị trên sàn sẽ bị gỡ nếu xóa.</div>`;
  document.getElementById('deleteWarnings').innerHTML = warn;
  const needType = c.orders>0 || kids.length>0;
  document.getElementById('deleteConfirmWrap').classList.toggle('hidden', !needType);
  document.getElementById('deleteTypeNameTarget').textContent = c.name;
  document.getElementById('deleteTypeName').value = '';
  document.getElementById('deleteModalDesc').textContent = needType
    ? 'Hành động rủi ro cao. Bạn nên Lưu trữ (ẩn toàn bộ) thay vì xóa vĩnh viễn.'
    : 'Danh mục sạch dữ liệu, có thể xóa ngay. Vẫn khuyến nghị Lưu trữ để giữ lịch sử kiểm toán.';
  document.getElementById('deleteModal').classList.remove('modal-hidden');
}
function closeDeleteModal(){ pendingDeleteId=null; document.getElementById('deleteModal').classList.add('modal-hidden'); }
function confirmArchive(){
  const i = categories.findIndex(c=>c.id===pendingDeleteId);
  if(i<0) return;
  const [c] = categories.splice(i,1);
  archived.unshift({...c, archivedAt:new Date().toLocaleDateString('vi-VN')});
  closeDeleteModal(); renderAll();
  showToast(`Đã lưu trữ danh mục "${c.name}" — có thể khôi phục sau`);
}
function confirmDelete(){
  const c = findCat(pendingDeleteId);
  if(!c) return;
  const needType = c.orders>0 || childrenOf(c.id).length>0;
  if(needType && document.getElementById('deleteTypeName').value.trim()!==c.name){
    showToast('Tên xác nhận không khớp — kiểm tra lại','error'); return;
  }
  categories = categories.filter(x=>x.id!==c.id);
  closeDeleteModal(); renderAll();
  showToast(`Đã xóa vĩnh viễn danh mục "${c.name}"`,'error');
}
function restoreCategory(id){
  const i = archived.findIndex(c=>c.id===id);
  if(i<0) return;
  const [c] = archived.splice(i,1);
  delete c.archivedAt;
  categories.push(c); renderAll();
  showToast(`Đã khôi phục danh mục "${c.name}"`);
}

document.getElementById('searchInput').addEventListener('input', renderAll);
document.getElementById('statusFilter').addEventListener('change', renderAll);
renderAll();
