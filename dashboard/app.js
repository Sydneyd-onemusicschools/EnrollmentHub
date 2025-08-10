// Dashboard v11 — same as v9; Admin link opens in new tab
(function(){
  const label = document.getElementById('today-label');
  if (label) {
    const now = new Date(); const opts = { weekday:'short', year:'numeric', month:'short', day:'numeric' };
    label.textContent = now.toLocaleDateString(undefined, opts);
  }

  const DS = (function(){
    const P='eh_'; const g=(k,f)=>{try{const v=localStorage.getItem(P+k);return v?JSON.parse(v):f;}catch(e){return f;}}; const s=(k,v)=>localStorage.setItem(P+k,JSON.stringify(v));
    return {
      todayTitle:()=>g('ann_today_title',''),
      todayNote:()=>g('ann_today_note',''),
      weekTitle:()=>g('ann_week_title',''),
      weekNote:()=>g('ann_week_note',''),
      annToday:()=>g('ann_today', []),
      annWeek:()=>g('ann_week', []),
      schedule:()=>g('today_schedule', []),
      skill:()=>g('skillspill', {title:'',text:'',link:'#'}),
      team:()=>g('quota_team', {achieved:0,target:0}),
      people:()=>g('quota_people', []),
      employees:()=>g('employees', []),
      addCheckin:(row)=>{const a=g('checkins', []); a.unshift(row); s('checkins', a);},
      addThought:(row)=>{const a=g('thoughts', []); a.unshift(row); s('thoughts', a);}
    };
  })();

  function renderAnnouncements(){
    document.getElementById('today-title').textContent = DS.todayTitle() || '';
    document.getElementById('today-note').textContent = DS.todayNote() || '';
    document.getElementById('week-title').textContent = DS.weekTitle() || '';
    document.getElementById('week-note').textContent = DS.weekNote() || '';

    const todayEl = document.getElementById('ann-today');
    const weekEl = document.getElementById('ann-week');
    const renderList = (el, arr)=>{
      el.innerHTML='';
      if (!arr || arr.length===0){ el.innerHTML='<div class="muted small">No items.</div>'; return; }
      arr.forEach(t=>{
        const item = document.createElement('div'); item.className='item';
        item.innerHTML = '<div class="dot" style="background:var(--ann)"></div><div>'+ (t||'') +'</div>';
        el.append(item);
      });
    };
    renderList(todayEl, DS.annToday());
    renderList(weekEl, DS.annWeek());
  }

  function renderSchedule(){
    const body = document.getElementById('today-body'); body.innerHTML='';
    const rows = DS.schedule();
    if (!rows || rows.length===0){
      body.innerHTML = '<tr><td colspan="5" class="muted">No schedule set yet.</td></tr>';
      return;
    }
    rows.forEach(r=>{
      const tr=document.createElement('tr');
      tr.innerHTML = `<td>${r.who||''}</td><td>${r.shift||''}</td><td>${r.role||''}</td><td>${r.lunch||''}</td><td>${r.onetoone||''}</td>`;
      body.append(tr);
    });
  }

  function renderSkillSpill(){
    const wrap = document.getElementById('skillspill-wrap');
    wrap.innerHTML = '';
    const ss = DS.skill();
    const item = document.createElement('div'); item.className='item'; item.style.background='#fff';
    const stack = document.createElement('div'); stack.className='stack';
    const t = document.createElement('div'); t.className='title'; t.textContent = ss.title || '—';
    const d = document.createElement('div'); d.className='muted small'; d.textContent = ss.text || '';
    stack.append(t,d);
    const a = document.createElement('a'); a.className='btn ghost'; a.href=ss.link||'#'; a.target='_blank'; a.rel='noopener'; a.textContent='Watch Video';
    item.append(stack,a); wrap.append(item);
  }

  function renderQuotas(){
    const team = DS.team();
    const pct = team.target>0 ? Math.round((team.achieved/team.target)*100) : 0;
    const bar = document.getElementById('team-bar');
    const text = document.getElementById('team-text');
    bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
    text.textContent = `${team.achieved} / ${team.target} • ${pct}%`;

    const list = document.getElementById('quota-people');
    list.innerHTML='';
    const people = DS.people();
    const colors = ['color-blue','color-amber','color-teal','color-purple','color-orange'];
    people.forEach((p,i)=>{
      const pct = p.target>0 ? Math.round((p.achieved/p.target)*100) : 0;
      const div = document.createElement('div'); div.className='person';
      div.innerHTML = `<div class="who">${p.name||''}</div>
        <div class="bar"><div class="bar-fill ${colors[i%colors.length]}" style="width:${Math.min(100,Math.max(0,pct))}%"></div></div>
        <div class="muted small">${p.achieved||0} / ${p.target||0} • ${pct}%</div>`;
      list.append(div);
    });
  }

  function populateEmployees(){
    const sel = document.getElementById('who');
    const emps = DS.employees();
    sel.innerHTML = '<option value="">Select…</option>';
    emps.forEach(e=>{
      const full = (e.first||'') + (e.last?(' '+e.last):'');
      if (full.trim().length>0){
        const o=document.createElement('option'); o.value=full; o.textContent=full; sel.append(o);
      }
    });
  }

  // Autofill date
  (function(){
    const dateInput = document.getElementById('date');
    if (dateInput && !dateInput.value){
      const d=new Date(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0');
      dateInput.value = d.getFullYear()+'-'+m+'-'+day;
    }
  })();

  document.getElementById('checkin-form').addEventListener('submit', function(e){
    e.preventDefault();
    const form = e.target;
    const row = {
      date: form.date.value,
      who: form.who.value,
      load: form.load.value,
      deals_done: form.deals_done.value,
      tasks_done: form.tasks_done.value,
      notes: form.notes.value.trim()
    };
    if (!row.date || !row.who || !row.load || !row.deals_done || !row.tasks_done){ alert('Please complete all required fields.'); return; }
    const P='eh_'; const g=(k,f)=>{try{const v=localStorage.getItem(P+k);return v?JSON.parse(v):f;}catch(e){return f;}}; const s=(k,v)=>localStorage.setItem(P+k,JSON.stringify(v));
    const a=g('checkins', []); a.unshift(row); s('checkins', a);
    alert('Check-in submitted!');
    form.reset();
    const d=new Date(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0');
    form.date.value = d.getFullYear()+'-'+m+'-'+day;
  });

  document.getElementById('thought-form').addEventListener('submit', function(e){
    e.preventDefault();
    const txt = document.getElementById('thoughts').value.trim();
    if (!txt){ alert('Please write a message.'); return; }
    const now = new Date(); const stamp = now.toLocaleString();
    const P='eh_'; const g=(k,f)=>{try{const v=localStorage.getItem(P+k);return v?JSON.parse(v):f;}catch(e){return f;}}; const s=(k,v)=>localStorage.setItem(P+k,JSON.stringify(v));
    const arr = g('thoughts', []); arr.unshift({when: stamp, text: txt}); s('thoughts', arr);
    alert('Thanks for your thoughts!');
    e.target.reset();
  });

  renderAnnouncements();
  renderSchedule();
  renderSkillSpill();
  renderQuotas();
  populateEmployees();
})();