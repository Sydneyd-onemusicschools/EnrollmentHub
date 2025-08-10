(function(){
  const OK_KEY='eh_admin_ok', PASS='music1234';
  const gate=document.getElementById('gate'), form=document.getElementById('gate-form'), input=document.getElementById('gate-input'), err=document.getElementById('gate-error');
  function unlock(){ gate.style.display='none'; sessionStorage.setItem(OK_KEY,'1'); initApp(); }
  if(sessionStorage.getItem(OK_KEY)==='1'){ gate.style.display='none'; initApp(); }
  else { gate.style.display='flex'; input&&input.focus(); form.addEventListener('submit', e=>{ e.preventDefault(); if(input.value===PASS){ unlock(); } else { err.style.display='inline'; input.select(); } }); }
  function initApp(){
    var label=document.getElementById('today-label'); if(label){ var now=new Date(); var opts={weekday:'short',year:'numeric',month:'short',day:'numeric'}; label.textContent=now.toLocaleDateString(undefined,opts); }
    const DS=(function(){ const P='eh_'; const g=(k,f)=>{try{const v=localStorage.getItem(P+k);return v?JSON.parse(v):f;}catch(e){return f;}}; const s=(k,v)=>localStorage.setItem(P+k,JSON.stringify(v));
      if(!localStorage.getItem(P+'employees')) s('employees',[{first:'Sydney',last:'',phone:''},{first:'Hannah',last:'',phone:''},{first:'Shy',last:'',phone:''},{first:'Megan',last:'',phone:''},{first:'Montana',last:'',phone:''},{first:'Sophie',last:'',phone:''}]);
      if(!localStorage.getItem(P+'ann_today')) s('ann_today',['Prioritize HubSpot tasks for promo replies.']);
      if(!localStorage.getItem(P+'ann_week')) s('ann_week',['Training Thursday — Objections refresher at 2:00pm.']);
      if(!localStorage.getItem(P+'ann_today_title')) s('ann_today_title','Phones are hot');
      if(!localStorage.getItem(P+'ann_today_note')) s('ann_today_note','Keep calls concise; log every outcome.');
      if(!localStorage.getItem(P+'ann_week_title')) s('ann_week_title','This Week');
      if(!localStorage.getItem(P+'ann_week_note')) s('ann_week_note','Focus on clean data entry and fast follow-ups.');
      if(!localStorage.getItem(P+'skillspill')) s('skillspill',{title:'Overcoming Common Enrollment Objections',text:'Quick refresher + examples you can use today',link:'#'});
      if(!localStorage.getItem(P+'quota_team')) s('quota_team',{achieved:136,target:200});
      if(!localStorage.getItem(P+'quota_people')) s('quota_people',[{name:'Hannah',achieved:18,target:25},{name:'Megan',achieved:10,target:24},{name:'Sydney',achieved:14,target:24},{name:'Shy',achieved:18,target:24},{name:'Montana',achieved:9,target:25}]);
      if(!localStorage.getItem(P+'today_schedule')) s('today_schedule',[{who:'Hannah',shift:'10–3',role:'New leads (AM)',lunch:'12:30–1:00 (Off-site)',onetoone:'1:30'},{who:'Megan',shift:'10–1',role:'Phones',lunch:'1:30–2:00 (Remote)',onetoone:'—'}]);
      if(!localStorage.getItem(P+'checkins')) s('checkins',[]); if(!localStorage.getItem(P+'thoughts')) s('thoughts',[]);
      return {
        getEmployees(){return g('employees',[])}, setEmployees(v){s('employees',v)},
        getTodayTitle(){return g('ann_today_title','')}, setTodayTitle(v){s('ann_today_title',v)},
        getTodayNote(){return g('ann_today_note','')}, setTodayNote(v){s('ann_today_note',v)},
        getWeekTitle(){return g('ann_week_title','')}, setWeekTitle(v){s('ann_week_title',v)},
        getWeekNote(){return g('ann_week_note','')}, setWeekNote(v){s('ann_week_note',v)},
        getAnnouncementsToday(){return g('ann_today',[])}, setAnnouncementsToday(v){s('ann_today',v)},
        getAnnouncementsWeek(){return g('ann_week',[])}, setAnnouncementsWeek(v){s('ann_week',v)},
        getSkillSpill(){return g('skillspill',{title:'',text:'',link:''})}, setSkillSpill(v){s('skillspill',v)},
        getTeamQuota(){return g('quota_team',{achieved:0,target:0})}, setTeamQuota(v){s('quota_team',v)},
        getPeopleQuota(){return g('quota_people',[])}, setPeopleQuota(v){s('quota_people',v)},
        getTodaySchedule(){return g('today_schedule',[])}, setTodaySchedule(v){s('today_schedule',v)},
        getCheckins(){return g('checkins',[])}, setCheckins(v){s('checkins',v)},
        getThoughts(){return g('thoughts',[])}, setThoughts(v){s('thoughts',v)},
      };
    })();
    function renderEmployees(){ const wrap=document.getElementById('emp-rows'); wrap.innerHTML=''; const employees=DS.getEmployees();
      employees.forEach((e,idx)=>{ const row=document.createElement('div'); row.className='rep-row'; const grid=document.createElement('div'); grid.className='rep-grid';
        const f=document.createElement('input'); f.type='text'; f.placeholder='First name'; f.value=e.first||'';
        const l=document.createElement('input'); l.type='text'; l.placeholder='Last name'; l.value=e.last||'';
        const p=document.createElement('input'); p.type='text'; p.placeholder='Phone'; p.value=e.phone||'';
        const del=document.createElement('button'); del.className='btn btn-icon'; del.textContent='Delete';
        del.addEventListener('click',()=>{ const arr=DS.getEmployees(); arr.splice(idx,1); DS.setEmployees(arr); renderEmployees(); renderSchedule(); });
        const save=()=>{ const arr=DS.getEmployees(); arr[idx]={first:f.value.trim(), last:l.value.trim(), phone:p.value.trim()}; DS.setEmployees(arr); };
        [f,l,p].forEach(el=>el.addEventListener('input',save)); grid.append(f,l,p,del); row.append(grid); wrap.append(row);
      }); }
    document.getElementById('add-emp').addEventListener('click',()=>{ const arr=DS.getEmployees(); arr.push({first:'',last:'',phone:''}); DS.setEmployees(arr); renderEmployees(); renderSchedule(); });
    document.getElementById('save-emp').addEventListener('click',()=> alert('Saved employees.')); renderEmployees();
    function editor(containerId, getter, setter){ const listEl=document.getElementById(containerId);
      function render(){ listEl.innerHTML=''; const arr=getter();
        arr.forEach((val,idx)=>{ const row=document.createElement('div'); row.className='rep-row'; const bar=document.createElement('div'); bar.className='actionbar';
          const text=document.createElement('span'); text.textContent=val||'(empty)';
          const edit=document.createElement('button'); edit.className='btn'; edit.textContent='Edit';
          const up=document.createElement('button'); up.className='btn'; up.textContent='↑';
          const down=document.createElement('button'); down.className='btn'; down.textContent='↓';
          const del=document.createElement('button'); del.className='btn'; del.textContent='Delete';
          const editor=document.createElement('div'); editor.style.display='none'; editor.style.gap='8px'; editor.style.marginTop='8px';
          const input=document.createElement('input'); input.type='text'; input.value=val||''; input.placeholder='Bullet text';
          const save=document.createElement('button'); save.className='btn'; save.textContent='Save';
          const cancel=document.createElement('button'); cancel.className='btn'; cancel.textContent='Cancel';
          edit.addEventListener('click',()=>{ bar.style.display='none'; editor.style.display='flex'; input.focus(); });
          save.addEventListener('click',()=>{ const a=getter(); a[idx]=input.value; setter(a); render(); });
          cancel.addEventListener('click',()=>{ editor.style.display='none'; bar.style.display='flex'; });
          del.addEventListener('click',()=>{ const a=getter(); a.splice(idx,1); setter(a); render(); });
          up.addEventListener('click',()=>{ if(idx>0){ const a=getter(); [a[idx-1],a[idx]]=[a[idx],a[idx-1]]; setter(a); render(); } });
          down.addEventListener('click',()=>{ const a=getter(); if(idx<a.length-1){ [a[idx+1],a[idx]]=[a[idx],a[idx+1]]; setter(a); render(); } });
          bar.append(text,edit,up,down,del); editor.append(input,save,cancel); row.append(bar,editor); listEl.append(row);
        }); }
      render(); return { render };
    }
    const todayTitle=document.getElementById('today-title'), todayNote=document.getElementById('today-note'), weekTitle=document.getElementById('week-title'), weekNote=document.getElementById('week-note');
    todayTitle.value=DS.getTodayTitle(); todayNote.value=DS.getTodayNote(); weekTitle.value=DS.getWeekTitle(); weekNote.value=DS.getWeekNote();
    todayTitle.addEventListener('input',()=>DS.setTodayTitle(todayTitle.value.trim())); todayNote.addEventListener('input',()=>DS.setTodayNote(todayNote.value.trim()));
    weekTitle.addEventListener('input',()=>DS.setWeekTitle(weekTitle.value.trim())); weekNote.addEventListener('input',()=>DS.setWeekNote(weekNote.value.trim()));
    const todayEd=editor('today-list', DS.getAnnouncementsToday, DS.setAnnouncementsToday);
    const weekEd=editor('week-list', DS.getAnnouncementsWeek, DS.setAnnouncementsWeek);
    document.getElementById('add-today').addEventListener('click',()=>{ const a=DS.getAnnouncementsToday(); a.push(''); DS.setAnnouncementsToday(a); todayEd.render(); });
    document.getElementById('add-week').addEventListener('click',()=>{ const a=DS.getAnnouncementsWeek(); a.push(''); DS.setAnnouncementsWeek(a); weekEd.render(); });
    const ss=DS.getSkillSpill(); const ssTitle=document.getElementById('ss-title'); const ssText=document.getElementById('ss-text'); const ssLink=document.getElementById('ss-link');
    ssTitle.value=ss.title||''; ssText.value=ss.text||''; ssLink.value=ss.link||''; document.getElementById('save-ss').addEventListener('click',()=>{ DS.setSkillSpill({title:ssTitle.value.trim(), text:ssText.value.trim(), link:ssLink.value.trim()}); alert('Saved The Skill Spill.'); });
    const team=DS.getTeamQuota(); const teamAch=document.getElementById('team-achieved'); const teamTar=document.getElementById('team-target');
    teamAch.value=team.achieved; teamTar.value=team.target; const saveTeam=()=>DS.setTeamQuota({achieved:+teamAch.value||0, target:+teamTar.value||0}); teamAch.addEventListener('input',saveTeam); teamTar.addEventListener('input',saveTeam);
    function renderPeople(){ const wrap=document.getElementById('people-rows'); wrap.innerHTML=''; const people=DS.getPeopleQuota();
      people.forEach((p,idx)=>{ const row=document.createElement('div'); row.className='rep-row'; const grid=document.createElement('div'); grid.className='rep-grid'; grid.style.gridTemplateColumns='1.2fr .6fr .6fr auto';
        const name=document.createElement('input'); name.type='text'; name.placeholder='Name'; name.value=p.name||'';
        const ach=document.createElement('input'); ach.type='number'; ach.min='0'; ach.step='1'; ach.placeholder='Achieved'; ach.value=p.achieved||0;
        const tar=document.createElement('input'); tar.type='number'; tar.min='0'; tar.step='1'; tar.placeholder='Target'; tar.value=p.target||0;
        const del=document.createElement('button'); del.className='btn btn-icon'; del.textContent='Delete';
        del.addEventListener('click',()=>{ const arr=DS.getPeopleQuota(); arr.splice(idx,1); DS.setPeopleQuota(arr); renderPeople(); });
        const save=()=>{ const arr=DS.getPeopleQuota(); arr[idx]={name:name.value.trim(), achieved:+ach.value||0, target:+tar.value||0}; DS.setPeopleQuota(arr); };
        [name,ach,tar].forEach(el=>el.addEventListener('input',save)); grid.append(name,ach,tar,del); row.append(grid); wrap.append(row);
      }); }
    document.getElementById('add-person').addEventListener('click',()=>{ const arr=DS.getPeopleQuota(); arr.push({name:'',achieved:0,target:0}); DS.setPeopleQuota(arr); renderPeople(); });
    document.getElementById('save-people').addEventListener('click',()=> alert('Saved people quotas.')); renderPeople();
    function renderSchedule(){ const wrap=document.getElementById('sched-rows'); wrap.innerHTML=''; const schedule=DS.getTodaySchedule(); const emps=DS.getEmployees();
      schedule.forEach((s,idx)=>{ const row=document.createElement('div'); row.className='rep-row'; const grid=document.createElement('div'); grid.className='rep-grid sched';
        const who=document.createElement('select'); const none=document.createElement('option'); none.value=''; none.textContent='Select…'; who.append(none);
        emps.forEach(e=>{ const full=(e.first||'')+(e.last?(' '+e.last):''); const o=document.createElement('option'); o.value=full; o.textContent=full; who.append(o); });
        who.value=s.who||''; const shift=document.createElement('input'); shift.type='text'; shift.placeholder='Shift'; shift.value=s.shift||'';
        const role=document.createElement('input'); role.type='text'; role.placeholder='Role'; role.value=s.role||'';
        const lunch=document.createElement('input'); lunch.type='text'; lunch.placeholder='Lunch'; lunch.value=s.lunch||'';
        const one=document.createElement('input'); one.type='text'; one.placeholder='1-on-1'; one.value=s.onetoone||'';
        const del=document.createElement('button'); del.className='btn btn-icon'; del.textContent='Delete';
        del.addEventListener('click',()=>{ const arr=DS.getTodaySchedule(); arr.splice(idx,1); DS.setTodaySchedule(arr); renderSchedule(); });
        const save=()=>{ const arr=DS.getTodaySchedule(); arr[idx]={who:who.value, shift:shift.value.trim(), role:role.value.trim(), lunch:lunch.value.trim(), onetoone:one.value.trim()}; DS.setTodaySchedule(arr); };
        who.addEventListener('change',save); [shift,role,lunch,one].forEach(el=>el.addEventListener('input',save));
        grid.append(who,shift,role,lunch,one,del); row.append(grid); wrap.append(row);
      }); }
    document.getElementById('add-slot').addEventListener('click',()=>{ const arr=DS.getTodaySchedule(); arr.push({who:'',shift:'',role:'',lunch:'',onetoone:''}); DS.setTodaySchedule(arr); renderSchedule(); });
    document.getElementById('save-sched').addEventListener('click',()=> alert('Saved today’s schedule.')); renderSchedule();
    function renderCheckins(){ const tblWrap=document.getElementById('checkins-table'); const rows=DS.getCheckins();
      if(rows.length===0){ tblWrap.innerHTML='<div class="muted small">No submissions yet.</div>'; return; }
      let html='<table><thead><tr><th>Date</th><th>Name</th><th>Workload (1–3)</th><th>Deals</th><th>Tasks</th><th>Comments</th><th></th></tr></thead><tbody>';
      rows.forEach((r,i)=>{ html += '<tr><td>'+(r.date||'')+'</td><td>'+(r.who||'')+'</td><td>'+(r.load||'')+'</td><td>'+(r.deals_done||'')+'</td><td>'+(r.tasks_done||'')+'</td><td>'+(r.notes?('<span class="muted">'+r.notes+'</span>'):'')+'</td><td><button class="btn btn-icon" data-i="'+i+'">Delete</button></td></tr>'; });
      html+='</tbody></table>'; tblWrap.innerHTML=html; tblWrap.querySelectorAll('button[data-i]').forEach(btn=>{ btn.addEventListener('click',()=>{ const idx=+btn.getAttribute('data-i'); const arr=DS.getCheckins(); arr.splice(idx,1); DS.setCheckins(arr); renderCheckins(); }); });
    }
    function renderThoughts(){ const tblWrap=document.getElementById('thoughts-table'); const rows=DS.getThoughts();
      if(rows.length===0){ tblWrap.innerHTML='<div class="muted small">No submissions yet.</div>'; return; }
      let html='<table><thead><tr><th>Submitted</th><th>Message</th><th></th></tr></thead><tbody>';
      rows.forEach((r,i)=>{ html += '<tr><td>'+(r.when||'')+'</td><td>'+(r.text?('<span class="muted">'+r.text+'</span>'):'')+'</td><td><button class="btn btn-icon" data-i="'+i+'">Delete</button></td></tr>'; });
      html+='</tbody></table>'; tblWrap.innerHTML=html; tblWrap.querySelectorAll('button[data-i]').forEach(btn=>{ btn.addEventListener('click',()=>{ const idx=+btn.getAttribute('data-i'); const arr=DS.getThoughts(); arr.splice(idx,1); DS.setThoughts(arr); renderThoughts(); }); });
    }
    document.getElementById('clear-checkins').addEventListener('click',()=>{ if(confirm('Delete all Daily Check-In submissions?')){ DS.setCheckins([]); renderCheckins(); }});
    document.getElementById('clear-thoughts').addEventListener('click',()=>{ if(confirm('Delete all Thought Box submissions?')){ DS.setThoughts([]); renderThoughts(); }});
    renderCheckins(); renderThoughts();
  }
})();