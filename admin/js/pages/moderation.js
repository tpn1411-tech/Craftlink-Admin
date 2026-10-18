// Logic JavaScript cho trang: Kiểm duyệt & Xử lý Vi phạm
let decisionTarget = null;

function escRegex(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

function severityBadge(sev){
  const m = SEV_META[sev];
  return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${m.badge} font-label-sm text-label-sm"><span class="w-1.5 h-1.5 rounded-full" style="background:${m.dot}"></span>${m.label}</span>`;
}

function renderAppeals(){
  const list = document.getElementById('appealsList');
  const pending = appeals.filter(a=>a.status==='pending');
  document.getElementById('appealBadge').textContent = pending.length;
  document.getElementById('pendingStat').textContent = pending.length;
  list.innerHTML = appeals.map(a=>{
    if(a.status==='pending'){
      return `<article class="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden fade-in">
        <div class="px-gutter py-space-md border-b border-surface-container-high flex flex-wrap items-center gap-space-md justify-between">
          <div class="flex items-center gap-3">
            <span class="px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">#${a.id}</span>
            <div>
              <div class="font-title-md text-title-md text-primary font-semibold">${a.listing}</div>
              <div class="font-body-sm text-body-sm text-on-surface-variant">${a.maker} · ${a.makerTier} · Gửi ${a.submitted}</div>
            </div>
          </div>
          ${a.severity==='high'
            ? '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error text-on-error font-label-sm text-label-sm"><span class="material-symbols-outlined text-[14px]">priority_high</span>Ưu tiên cao</span>'
            : '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">Mức thường</span>'}
        </div>
        <div class="p-gutter grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div class="p-4 rounded-lg bg-error-container/40">
            <h4 class="font-label-lg text-label-lg font-semibold text-on-error-container mb-1.5 flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px]">gavel</span>Quyết định gốc</h4>
            <p class="font-body-sm text-body-sm text-on-error-container leading-relaxed">${a.originalDecision}</p>
          </div>
          <div class="p-4 rounded-lg bg-primary-fixed/60">
            <h4 class="font-label-lg text-label-lg font-semibold text-on-primary-fixed mb-1.5 flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px]">campaign</span>Nội dung kháng án</h4>
            <p class="font-body-sm text-body-sm text-on-primary-fixed-variant leading-relaxed">${a.appealReason}</p>
          </div>
        </div>
        <div class="px-gutter pb-gutter flex flex-wrap gap-space-md">
          <button class="h-10 px-5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container transition-colors flex items-center gap-1.5" type="button" onclick="openDecision('${a.id}','uphold')">
            <span class="material-symbols-outlined text-[18px]">cancel</span>Giữ nguyên từ chối
          </button>
          <button class="h-10 px-5 rounded-lg bg-secondary text-on-secondary font-label-lg text-label-lg font-semibold hover:bg-on-secondary-container transition-colors flex items-center gap-1.5" type="button" onclick="openDecision('${a.id}','reverse')">
            <span class="material-symbols-outlined text-[18px]">undo</span>Đảo ngược quyết định
          </button>
          <button class="h-10 px-5 rounded-lg bg-surface-container-high text-primary font-label-lg text-label-lg font-semibold hover:bg-surface-container-highest transition-colors flex items-center gap-1.5" type="button" onclick="openDecision('${a.id}','escalate')">
            <span class="material-symbols-outlined text-[18px]">more_time</span>Chuyển ca phức tạp
          </button>
        </div>
      </article>`;
    }
    const ok = a.resolution==='reversed';
    const esc = a.resolution==='escalate';
    const desc = ok?'Đã đảo ngược quyết định, tin đăng được phục hồi':esc?'Đã chuyển hội đồng xử lý — chờ phản hồi 48 giờ':'Giữ nguyên quyết định của Moderator';
    return `<article class="bg-surface-container-lowest rounded-xl shadow-xs px-gutter py-space-md flex flex-wrap items-center gap-space-md opacity-75">
      <span class="material-symbols-outlined text-[24px] ${ok?'text-[#3B6E4C]':'text-on-surface-variant'}">${ok?'check_circle':esc?'more_time':'cancel'}</span>
      <div class="flex-1 min-w-[220px]">
        <div class="font-title-md text-title-md text-primary font-semibold">#${a.id} — ${a.listing}</div>
        <div class="font-body-sm text-body-sm text-on-surface-variant">${desc} · ${a.note||''}</div>
      </div>
      <span class="px-3 py-1.5 rounded-full ${ok?'bg-primary-fixed text-on-primary-fixed':esc?'bg-tertiary-fixed text-on-tertiary-fixed':'bg-surface-container-high text-on-surface'} font-label-sm text-label-sm">${ok?'Đã phục hồi listing':esc?'Chờ hội đồng':'Đã đóng ca'}</span>
    </article>`;
  }).join('') || '<div class="bg-surface-container-lowest rounded-xl shadow-xs p-gutter text-center font-body-md text-body-md text-on-surface-variant">Không có đơn kháng án nào.</div>';
}

function renderBlacklist(){
  const q = document.getElementById('wordSearch').value.trim().toLowerCase();
  const rows = blacklist.filter(w=>w.word.toLowerCase().includes(q));
  document.getElementById('blacklistBadge').textContent = blacklist.length;
  document.getElementById('wordTableBody').innerHTML = rows.map((w,i)=>`
    <tr class="border-b border-surface-container-high hover:bg-surface-container-low/50 transition-colors">
      <td class="px-gutter py-3 font-title-md text-title-md text-primary font-semibold">"${w.word}"</td>
      <td class="px-4 py-3">${severityBadge(w.severity)}</td>
      <td class="px-4 py-3 text-center font-title-md text-title-md">${w.flagged}</td>
      <td class="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">${w.addedBy}<br/><span class="text-outline">${w.date}</span></td>
      <td class="px-4 py-3">
        <div class="flex justify-end gap-1">
          <button class="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors" type="button" onclick="cycleSeverity(${blacklist.indexOf(w)})" title="Đổi mức độ"><span class="material-symbols-outlined text-[20px]">swap_vert</span></button>
          <button class="p-2 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors" type="button" onclick="removeWord(${blacklist.indexOf(w)})" title="Gỡ khỏi danh sách"><span class="material-symbols-outlined text-[20px]">delete</span></button>
        </div>
      </td>
    </tr>`).join('') || `<tr><td colspan="5" class="px-gutter py-8 text-center font-body-md text-body-md text-on-surface-variant">Không có từ khóa nào khớp.</td></tr>`;
}

function openDecision(id, action){
  decisionTarget = {id, action};
  const a = appeals.find(x=>x.id===id);
  const titles = {uphold:'Giữ nguyên quyết định từ chối', reverse:'Đảo ngược quyết định (Reverse Decision)', escalate:'Chuyển ca lên cấp xử lý phức tạp'};
  document.getElementById('decisionTitle').textContent = titles[action];
  const notes = {
    uphold:`Tin đăng <b>${a.listing}</b> tiếp tục bị từ chối. Maker sẽ nhận email giải thích kèm hướng dẫn chỉnh sửa và có thể kháng cáo lần cuối.`,
    reverse:`Tin đăng <b>${a.listing}</b> sẽ được <b>phục hồi và hiển thị công khai</b> ngay lập tức. Quyết định của Moderator bị vô hiệu hóa; Moderator liên quan sẽ nhận thông báo để rút kinh nghiệm.`,
    escalate:`Chuyển ca <b>#${a.id}</b> sang hội đồng xử lý (2 Admin + Trưởng bộ phận kiểm duyệt) với hạn phản hồi 48 giờ. Tin đăng tiếp tục bị đình chỉ trong thời gian chờ.`,
  };
  document.getElementById('decisionContent').innerHTML = `
    <p class="font-body-md text-body-md text-on-surface-variant">${notes[action]}</p>
    <div class="space-y-1.5">
      <label class="font-label-lg text-label-lg text-primary font-semibold" for="decisionNote">Ghi chú quyết định (đưa vào audit log) <span class="text-error">*</span></label>
      <textarea id="decisionNote" rows="3" class="w-full px-3 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary resize-none" placeholder="Căn cứ pháp lý / bằng chứng đã kiểm chứng..."></textarea>
    </div>
    ${action==='reverse'?`<label class="flex items-start gap-2.5 p-3 rounded-lg bg-tertiary-fixed/60 cursor-pointer"><input id="decisionAck" type="checkbox" class="mt-0.5 accent-[#9a4526]"/><span class="font-body-sm text-body-sm text-on-tertiary-fixed-variant">Tôi đã kiểm chứng bằng chứng của Maker và chịu trách nhiệm về việc <b>đảo ngược quyết định kiểm duyệt</b>.</span></label>`:''}
    <div class="flex justify-end gap-space-md pt-space-sm border-t border-surface-container-high">
      <button class="h-10 px-5 rounded-lg bg-surface-container-high text-primary font-label-lg text-label-lg font-semibold hover:bg-surface-container-highest transition-colors" type="button" onclick="closeDecisionModal()">Hủy</button>
      <button class="h-10 px-5 rounded-lg ${action==='uphold'?'bg-primary text-on-primary':'bg-secondary text-on-secondary'} font-label-lg text-label-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5" type="button" onclick="confirmDecision()">
        <span class="material-symbols-outlined text-[18px]">${action==='reverse'?'undo':action==='uphold'?'cancel':'more_time'}</span>${titles[action]}
      </button>
    </div>`;
  document.getElementById('decisionModal').classList.remove('modal-hidden');
}
function closeDecisionModal(){ decisionTarget=null; document.getElementById('decisionModal').classList.add('modal-hidden'); }
function confirmDecision(){
  const note = document.getElementById('decisionNote').value.trim();
  if(!note){ showToast('Vui lòng nhập ghi chú quyết định','error'); return; }
  if(decisionTarget.action==='reverse' && !document.getElementById('decisionAck')?.checked){ showToast('Vui lòng tick xác nhận đã kiểm chứng bằng chứng','error'); return; }
  const a = appeals.find(x=>x.id===decisionTarget.id);
  a.status = 'resolved';
  a.note = note;
  a.resolution = decisionTarget.action==='reverse'?'reversed':decisionTarget.action;
  const msg = decisionTarget.action==='reverse'
    ? `Đã đảo ngược quyết định — listing "${a.listing}" được phục hồi`
    : decisionTarget.action==='uphold'
      ? `Đã giữ nguyên quyết định từ chối #${a.id}`
      : `Đã chuyển ca #${a.id} sang hội đồng xử lý`;
  showToast(msg);
  closeDecisionModal(); renderAppeals();
}

function addWord(e){
  e.preventDefault();
  const word = document.getElementById('newWord').value.trim().toLowerCase();
  const severity = document.querySelector('input[name="wordSeverity"]:checked').value;
  if(blacklist.some(w=>w.word===word)){ showToast('Từ khóa này đã có trong danh sách','error'); return; }
  blacklist.unshift({word, severity, flagged:0, addedBy:'Admin Nam', date:new Date().toLocaleDateString('vi-VN')});
  document.getElementById('newWord').value = '';
  renderBlacklist();
  showToast(`Đã thêm từ khóa cấm "${word}" — mức ${SEV_META[severity].label.toLowerCase()}`);
}

function cycleSeverity(i){
  blacklist[i].severity = blacklist[i].severity==='warn'?'block':'warn';
  renderBlacklist();
  showToast(`"${blacklist[i].word}" chuyển sang mức ${SEV_META[blacklist[i].severity].label.toLowerCase()}`);
}
function removeWord(i){
  const w = blacklist[i].word;
  blacklist.splice(i,1);
  renderBlacklist();
  showToast(`Đã gỡ từ khóa "${w}" khỏi danh sách cấm`);
}

function simulateScan(){
  const text = document.getElementById('simInput').value;
  const box = document.getElementById('simResult');
  if(!text.trim()){ box.innerHTML = 'Kết quả quét sẽ hiển thị tại đây...'; return; }
  const hits = blacklist.filter(w=>text.toLowerCase().includes(w.word));
  let html = text;
  blacklist.forEach(w=>{ html = html.replace(new RegExp(escRegex(w.word),'gi'), m=>`<mark class="flag">${m}</mark>`); });
  if(!hits.length){
    box.innerHTML = `<div class="flex items-center gap-2 text-[#3B6E4C]"><span class="material-symbols-outlined text-[20px]">check_circle</span><span><b>An toàn</b> — không phát hiện từ khóa cấm. Nội dung được phép hiển thị.</span></div>`;
    return;
  }
  const hard = hits.some(h=>h.severity==='block');
  box.innerHTML = `
    <p class="mb-2">${html}</p>
    <div class="flex items-start gap-2 ${hard?'text-on-error-container':'text-on-secondary-fixed'}">
      <span class="material-symbols-outlined text-[20px] shrink-0">${hard?'block':'flag'}</span>
      <span><b>${hard?'BỊ CHẶN CỨNG':'BỊ GẮN CỜ'}</b> — phát hiện ${hits.length} từ khóa: ${hits.map(h=>`"${h.word}" (${SEV_META[h.severity].label.toLowerCase()})`).join(', ')}.
      ${hard?'Nội dung bị ẩn ngay và chuyển tới hàng đợi kiểm duyệt.':'Nội dung vẫn hiển thị nhưng Moderator sẽ rà soát trong 24 giờ.'}</span>
    </div>`;
}

function switchTab(tab){
  document.getElementById('appealsPanel').classList.toggle('hidden', tab!=='appeals');
  document.getElementById('blacklistPanel').classList.toggle('hidden', tab!=='blacklist');
  const on = 'tab-btn px-4 py-3 font-title-md text-title-md font-semibold text-secondary border-b-2 border-secondary -mb-px flex items-center gap-2';
  const off = 'tab-btn px-4 py-3 font-title-md text-title-md font-semibold text-on-surface-variant hover:text-on-surface -mb-px flex items-center gap-2';
  document.getElementById('tabAppeals').className = tab==='appeals'?on:off;
  document.getElementById('tabBlacklist').className = tab==='blacklist'?on:off;
}

document.getElementById('wordSearch').addEventListener('input', renderBlacklist);
renderAppeals(); renderBlacklist();
