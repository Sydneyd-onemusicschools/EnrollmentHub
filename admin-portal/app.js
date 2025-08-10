// Admin Portal v7 — v5 features + password gate
(function(){
  // Password gate (session only)
  const OK_KEY = 'eh_admin_ok';
  const PASS = 'music1234';
  const gate = document.getElementById('gate');
  const form = document.getElementById('gate-form');
  const input = document.getElementById('gate-input');
  const err = document.getElementById('gate-error');

  function unlock(){
    gate.style.display='none';
    sessionStorage.setItem(OK_KEY, '1');
    initApp();
  }

  if (sessionStorage.getItem(OK_KEY) === '1'){ gate.style.display='none'; initApp(); }
  else {
    gate.style.display='flex';
    input && input.focus();
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (input.value === PASS){ unlock(); }
      else { err.style.display='inline'; input.select(); }
    });
  }

  // ---- All existing Admin v5 functionality is initialized in initApp ----
  function initApp(){
    // Header date
    var label = document.getElementById('today-label');
    if (label) {
      var now = new Date();
      var opts = { weekday:'short', year:'numeric', month:'short', day:'numeric' };
      label.textContent = now.toLocaleDateString(undefined, opts);
    }

    // DataService
    const DataService = (function(){
      const PREFIX = 'eh_';
      const get = (k, fallback) => { try { const v = localStorage.getItem(PREFIX+k); return v ? JSON.parse(v) : fallback; } catch(e){ return fallback; } };
      const set = (k, v) => localStorage.setItem(PREFIX+k, JSON.stringify(v));

      if (!localStorage.getItem(PREFIX+'employees')) set('employees', [
        {first:'Sydney', last:'', phone:''},
        {first:'Hannah', last:'', phone:''},
        {first:'Shy', last:'', phone:''},
        {first:'Megan', last:'', phone:''},
        {first:'Montana', last:'', phone:''},
        {first:'Sophie', last:'', phone:''},
      ]);

      if (!localStorage.getItem(PREFIX+'ann_today')) set('ann_today', ['Prioritize HubSpot tasks for promo replies.']);
      if (!localStorage.getItem(PREFIX+'ann_week')) set('ann_week', ['Training Thursday — Objections refresher at 2:00pm.']);
      if (!localStorage.getItem(PREFIX+'ann_today_title')) set('ann_today_title', 'Phones are hot');
      if (!localStorage.getItem(PREFIX+'ann_today_note')) set('ann_today_note', 'Keep calls concise; log every outcome.');
      if (!localStorage.getItem(PREFIX+'ann_week_title')) set('ann_week_title', 'This Week');
      if (!localStorage.getItem(PREFIX+'ann_week_note')) set('ann_week_note', 'Focus on clean data entry and fast follow-ups.');

      if (!localStorage.getItem(PREFIX+'skillspill')) set('skillspill', {title:'Overcoming Common Enrollment Objections', text:'Quick refresher + examples you can use today', link:'#'});
      if (!localStorage.getItem(PREFIX+'quota_team')) set('quota_team', {achieved:136, target:200});
      if (!localStorage.getItem(PREFIX+'quota_people')) set('quota_people', [
        {name:'Hannah', achieved:18, target:25},
        {name:'Megan', achieved:10, target:24},
        {name:'Sydney', achieved:14, target:24},
        {name:'Shy', achieved:18, target:24},
        {name:'Montana', achieved:9, target:25},
      ]);
      if (!localStorage.getItem(PREFIX+'today_schedule')) set('today_schedule', [
        {who:'Hannah', shift:'10–3', role:'New leads (AM)', lunch:'12:30–1:00 (Off-site)', onetoone:'1:30'},
        {who:'Megan', shift:'10–1', role:'Phones', lunch:'1:30–2:00 (Remote)', onetoone:'—'},
      ]);
      if (!localStorage.getItem(PREFIX+'checkins')) set('checkins', []);
      if (!localStorage.getItem(PREFIX+'thoughts')) set('thoughts', []);

      return {
        // Employees
        getEmployees(){ return get('employees', []); },
        setEmployees(list){ set('employees', list); },

        // Announcements
        getTodayTitle(){ return get('ann_today_title',''); },
        setTodayTitle(v){ set('ann_today_title', v); },
        getTodayNote(){ return get('ann_today_note',''); },
        setTodayNote(v){ set('ann_today_note', v); },
        getWeekTitle(){ return get('ann_week_title',''); },
        setWeekTitle(v){ set('ann_week_title', v); },
        getWeekNote(){ return get('ann_week_note',''); },
        setWeekNote(v){ set('ann_week_note', v); },
        getAnnouncementsToday(){ return get('ann_today', []); },
        setAnnouncementsToday(list){ set('ann_today', list); },
        getAnnouncementsWeek(){ return get('ann_week', []); },
        setAnnouncementsWeek(list){ set('ann_week', list); },

        // Skill Spill
        getSkillSpill(){ return get('skillspill', {title:'', text:'', link:''}); },
        setSkillSpill(obj){ set('skillspill', obj); },

        // Quota
        getTeamQuota(){ return get('quota_team', {achieved:0, target:0}); },
        setTeamQuota(obj){ set('quota_team', obj); },
        getPeopleQuota(){ return get('quota_people', []); },
        setPeopleQuota(list){ set('quota_people', list); },

        // Today schedule
        getTodaySchedule(){ return get('today_schedule', []); },
        setTodaySchedule(list){ set('today_schedule', list); },

        // Submissions
        getCheckins(){ return get('checkins', []); },
        setCheckins(list){ set('checkins', list); },
        getThoughts(){ return get('thoughts', []); },
        setThoughts(list){ set('thoughts', list); },
      };
    })();

    // Employees
    function renderEmployees(){
      const wrap = document.getElementById('emp-rows');
      wrap.innerHTML = '';
      const employees = DataService.getEmployees();
      employees.forEach((e, idx) => {
        const row = document.createElement('div');
        row.className = 'rep-row';
        const grid = document.createElement('div');
        grid.className = 'rep-grid';
        const f = document.createElement('input'); f.type='text'; f.placeholder='First name'; f.value=e.first||'';
        const l = document.createElement('input'); l.type='text'; l.placeholder='Last name'; l.value=e.last||'';
        const p = document.createElement('input'); p.type='text'; p.placeholder='Phone'; p.value=e.phone||'';
        const del = document.createElement('button'); del.className='btn btn-icon'; del.textContent='Delete';
        del.addEventListener('click', ()=>{ const arr=DataService.getEmployees(); arr.splice(idx,1); DataService.setEmployees(arr); renderEmployees(); renderSchedule(); });
        const saveInline = ()=>{ const arr=DataService.getEmployees(); arr[idx] = {first:f.value.trim(), last:l.value.trim(), phone:p.value.trim()}; DataService.setEmployees(arr); };
        [f,l,p].forEach(el=> el.addEventListener('input', saveInline));
        grid.append(f,l,p,del); row.append(grid); wrap.append(row);
      });
    }
    document.getElementById('add-emp').addEventListener('click', ()=>{
      const arr = DataService.getEmployees(); arr.push({first:'', last:'', phone:''}); DataService.setEmployees(arr); renderEmployees(); renderSchedule();
    });
    document.getElementById('save-emp').addEventListener('click', ()=> alert('Saved employees.'));
    renderEmployees();

    // Announcement bullets editor (edit/delete/reorder)
    function makeBulletsEditor(containerId, getter, setter){
      const listEl = document.getElementById(containerId);
      function render(){
        listEl.innerHTML='';
        const arr = getter();
        arr.forEach((val, idx)=>{
          const row = document.createElement('div');
          row.className = 'rep-row';
          const bar = document.createElement('div'); bar.className='actionbar';
          const text = document.createElement('span'); text.textContent = val || '(empty)';
          const editBtn = document.createElement('button'); editBtn.className='btn'; editBtn.textContent='Edit';
          const upBtn = document.createElement('button'); upBtn.className='btn'; upBtn.textContent='↑';
          const downBtn = document.createElement('button'); downBtn.className='btn'; downBtn.textContent='↓';
          const delBtn = document.createElement('button'); delBtn.className='btn'; delBtn.textContent='Delete';

          const editor = document.createElement('div'); editor.style.display='none'; editor.style.gap='8px'; editor.style.marginTop='8px';
          const input = document.createElement('input'); input.type='text'; input.value=val||''; input.placeholder='Bullet text';
          const saveBtn = document.createElement('button'); saveBtn.className='btn'; saveBtn.textContent='Save';
          const cancelBtn = document.createElement('button'); cancelBtn.className='btn'; cancelBtn.textContent='Cancel';

          editBtn.addEventListener('click', ()=>{ bar.style.display='none'; editor.style.display='flex'; input.focus(); });
          saveBtn.addEventListener('click', ()=>{ const a=getter(); a[idx]=input.value; setter(a); render(); });
          cancelBtn.addEventListener('click', ()=>{ editor.style.display='none'; bar.style.display='flex'; });
          delBtn.addEventListener('click', ()=>{ const a=getter(); a.splice(idx,1); setter(a); render(); });
          upBtn.addEventListener('click', ()=>{ if(idx>0){ const a=getter(); [a[idx-1],a[idx]]=[a[idx],a[idx-1]]; setter(a); render(); } });
          downBtn.addEventListener('click', ()=>{ const a=getter(); if(idx<a.length-1){ [a[idx+1],a[idx]]=[a[idx],a[idx+1]]; setter(a); render(); } });

          bar.append(text, editBtn, upBtn, downBtn, delBtn);
          editor.append(input, saveBtn, cancelBtn);
          row.append(bar, editor);
          listEl.append(row);
        });
      }
      render();
      return { render };
    }

    // Titles + notes
    const todayTitle = document.getElementById('today-title');
    const todayNote = document.getElementById('today-note');
    const weekTitle = document.getElementById('week-title');
    const weekNote = document.getElementById('week-note');
    todayTitle.value = DataService.getTodayTitle(); todayNote.value = DataService.getTodayNote();
    weekTitle.value = DataService.getWeekTitle(); weekNote.value = DataService.getWeekNote();
    todayTitle.addEventListener('input', ()=> DataService.setTodayTitle(todayTitle.value.trim()));
    todayNote.addEventListener('input', ()=> DataService.setTodayNote(todayNote.value.trim()));
    weekTitle.addEventListener('input', ()=> DataService.setWeekTitle(weekTitle.value.trim()));
    weekNote.addEventListener('input', ()=> DataService.setWeekNote(weekNote.value.trim()));

    const todayEditor = makeBulletsEditor('today-list', DataService.getAnnouncementsToday, DataService.setAnnouncementsToday);
    const weekEditor = makeBulletsEditor('week-list', DataService.getAnnouncementsWeek, DataService.setAnnouncementsWeek);

    document.getElementById('add-today').addEventListener('click', ()=>{
      const a = DataService.getAnnouncementsToday(); a.push(''); DataService.setAnnouncementsToday(a); todayEditor.render();
    });
    document.getElementById('add-week').addEventListener('click', ()=>{
      const a = DataService.getAnnouncementsWeek(); a.push(''); DataService.setAnnouncementsWeek(a); weekEditor.render();
    });

    // Skill Spill
    const ss = DataService.getSkillSpill();
    const ssTitle = document.getElementById('ss-title');
    const ssText = document.getElementById('ss-text');
    const ssLink = document.getElementById('ss-link');
    ssTitle.value = ss.title||''; ssText.value = ss.text||''; ssLink.value = ss.link||'';
    document.getElementById('save-ss').addEventListener('click', ()=>{
      DataService.setSkillSpill({title:ssTitle.value.trim(), text:ssText.value.trim(), link:ssLink.value.trim()});
      alert('Saved The Skill Spill.');
    });

    // Quota
    const team = DataService.getTeamQuota();
    const teamAch = document.getElementById('team-achieved');
    const teamTar = document.getElementById('team-target');
    teamAch.value = team.achieved; teamTar.value = team.target;
    const saveTeam = ()=> DataService.setTeamQuota({achieved:+teamAch.value||0, target:+teamTar.value||0});
    teamAch.addEventListener('input', saveTeam); teamTar.addEventListener('input', saveTeam);

    function renderPeople(){
      const wrap = document.getElementById('people-rows'); wrap.innerHTML='';
      const people = DataService.getPeopleQuota();
      people.forEach((p, idx)=>{
        const row = document.createElement('div'); row.className='rep-row';
        const grid = document.createElement('div'); grid.className='rep-grid'; grid.style.gridTemplateColumns='1.2fr .6fr .6fr auto';
        const name = document.createElement('input'); name.type='text'; name.placeholder='Name'; name.value=p.name||'';
        const ach = document.createElement('input'); ach.type='number'; ach.min='0'; ach.step='1'; ach.placeholder='Achieved'; ach.value=p.achieved||0;
        const tar = document.createElement('input'); tar.type='number'; tar.min='0'; tar.step='1'; tar.placeholder='Target'; tar.value=p.target||0;
        const del = document.createElement('button'); del.className='btn btn-icon'; del.textContent='Delete';
        del.addEventListener('click', ()=>{ const arr=DataService.getPeopleQuota(); arr.splice(idx,1); DataService.setPeopleQuota(arr); renderPeople(); });
        const saveInline = ()=>{ const arr=DataService.getPeopleQuota(); arr[idx]={name:name.value.trim(), achieved:+ach.value||0, target:+tar.value||0}; DataService.setPeopleQuota(arr); };
        ;[name,ach,tar].forEach(el=> el.addEventListener('input', saveInline));
        grid.append(name, ach, tar, del); row.append(grid); wrap.append(row);
      });
    }
    document.getElementById('add-person').addEventListener('click', ()=>{
      const arr = DataService.getPeopleQuota(); arr.push({name:'', achieved:0, target:0}); DataService.setPeopleQuota(arr); renderPeople();
    });
    document.getElementById('save-people').addEventListener('click', ()=> alert('Saved people quotas.'));
    renderPeople();

    // Today’s Schedule
    function renderSchedule(){
      const wrap = document.getElementById('sched-rows'); wrap.innerHTML='';
      const schedule = DataService.getTodaySchedule();
      const emps = DataService.getEmployees();
      schedule.forEach((s, idx)=>{
        const row = document.createElement('div'); row.className='rep-row';
        const grid = document.createElement('div'); grid.className='rep-grid sched';
        const who = document.createElement('select');
        const none = document.createElement('option'); none.value=''; none.textContent='Select…'; who.append(none);
        emps.forEach(e=>{ const full=(e.first||'') + (e.last?(' '+e.last):''); const o=document.createElement('option'); o.value=full; o.textContent=full; who.append(o); });
        who.value = s.who || '';
        const shift = document.createElement('input'); shift.type='text'; shift.placeholder='Shift'; shift.value=s.shift||'';
        const role = document.createElement('input'); role.type='text'; role.placeholder='Role'; role.value=s.role||'';
        const lunch = document.createElement('input'); lunch.type='text'; lunch.placeholder='Lunch'; lunch.value=s.lunch||'';
        const one = document.createElement('input'); one.type='text'; one.placeholder='1-on-1'; one.value=s.onetoone||'';
        const del = document.createElement('button'); del.className='btn btn-icon'; del.textContent='Delete';
        del.addEventListener('click', ()=>{ const arr=DataService.getTodaySchedule(); arr.splice(idx,1); DataService.setTodaySchedule(arr); renderSchedule(); });
        const saveInline = ()=>{
          const arr = DataService.getTodaySchedule();
          arr[idx] = {who:who.value, shift:shift.value.trim(), role:role.value.trim(), lunch:lunch.value.trim(), onetoone:one.value.trim()};
          DataService.setTodaySchedule(arr);
        };
        who.addEventListener('change', saveInline);
        [shift, role, lunch, one].forEach(el=> el.addEventListener('input', saveInline));
        grid.append(who, shift, role, lunch, one, del); row.append(grid); wrap.append(row);
      });
    }
    document.getElementById('add-slot').addEventListener('click', ()=>{
      const arr = DataService.getTodaySchedule(); arr.push({who:'', shift:'', role:'', lunch:'', onetoone:''}); DataService.setTodaySchedule(arr); renderSchedule();
    });
    document.getElementById('save-sched').addEventListener('click', ()=> alert('Saved today’s schedule.'));
    renderSchedule();

    // Submissions (view/delete)
    function renderCheckins(){
      const tblWrap = document.getElementById('checkins-table');
      const rows = DataService.getCheckins();
      if (rows.length === 0){ tblWrap.innerHTML = '<div class="muted small">No submissions yet.</div>'; return; }
      let html = '<table><thead><tr><th>Date</th><th>Name</th><th>Workload (1–3)</th><th>Deals</th><th>Tasks</th><th>Comments</th><th></th></tr></thead><tbody>';
      rows.forEach((r, i)=>{
        html += '<tr><td>'+(r.date||'')+'</td><td>'+(r.who||'')+'</td><td>'+(r.load||'')+'</td><td>'+(r.deals_done||'')+'</td><td>'+(r.tasks_done||'')+'</td><td>'+(r.notes?('<span class="muted">'+r.notes+'</span>'):'')+'</td><td><button class="btn btn-icon" data-i="'+i+'">Delete</button></td></tr>';
      });
      html += '</tbody></table>';
      tblWrap.innerHTML = html;
      tblWrap.querySelectorAll('button[data-i]').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const idx = +btn.getAttribute('data-i');
          const arr = DataService.getCheckins();
          arr.splice(idx,1); DataService.setCheckins(arr); renderCheckins();
        });
      });
    }
    function renderThoughts(){
      const tblWrap = document.getElementById('thoughts-table');
      const rows = DataService.getThoughts();
      if (rows.length === 0){ tblWrap.innerHTML = '<div class="muted small">No submissions yet.</div>'; return; }
      let html = '<table><thead><tr><th>Submitted</th><th>Message</th><th></th></tr></thead><tbody>';
      rows.forEach((r, i)=>{
        html += '<tr><td>'+(r.when||'')+'</td><td>'+(r.text?('<span class="muted">'+r.text+'</span>'):'')+'</td><td><button class="btn btn-icon" data-i="'+i+'">Delete</button></td></tr>';
      });
      html += '</tbody></table>';
      tblWrap.innerHTML = html;
      tblWrap.querySelectorAll('button[data-i]').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const idx = +btn.getAttribute('data-i');
          const arr = DataService.getThoughts();
          arr.splice(idx,1); DataService.setThoughts(arr); renderThoughts();
        });
      });
    }
    document.getElementById('clear-checkins').addEventListener('click', ()=>{ if (confirm('Delete all Daily Check-In submissions?')){ DataService.setCheckins([]); renderCheckins(); }});
    document.getElementById('clear-thoughts').addEventListener('click', ()=>{ if (confirm('Delete all Thought Box submissions?')){ DataService.setThoughts([]); renderThoughts(); }});
    renderCheckins(); renderThoughts();
  }
})();