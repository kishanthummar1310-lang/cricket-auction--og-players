const say=e=>e&&toast(e);
S.on(s=>{
  const tm=id=>s.teams.find(t=>t.id===id),c=s.cur,p=c&&s.players.find(x=>x.id===c.pid);
  $('#live').innerHTML=p?`<div class="row"><div class="who"><span class="av" style="width:56px;height:56px;font-size:19px">${ini(p.name)}</span>
    <div><h2 style="font-size:26px">${esc(p.name)}</h2><p class="mut">${p.role}, base ${fmt(p.base)}</p></div></div><div style="text-align:right"><div class="mut">Current bid</div><div class="res">${fmt(c.bid)}</div></div></div>
    <p style="margin-top:8px">${c.tid?`Leading: <b>${esc(tm(c.tid).name)}</b>`:'No bids yet'}</p>
    <div class="bids">${s.teams.map(t=>{const e=canBid(t.id);return`<button class="btn" style="--c:${t.color}" data-a="bid" data-id="${t.id}" ${e?'disabled title="'+e+'"':''}>${esc(t.name)}<small>Bid ${fmt(nextBid())}</small></button>`}).join('')}</div>
    <div class="row" style="justify-content:flex-start"><button class="btn p" data-a="sell">${c.tid?'Sold':'Mark unsold'}</button><button class="btn" data-a="undo">Undo bid</button><button class="btn d" data-a="pass">Pass player</button></div>`
    :`<h3>Live auction</h3><p class="mut">Nobody is on the block. Press Start on a player below.</p>`;
  $('#players').innerHTML=s.players.map(x=>`<div><b>${esc(x.name)}</b><span class="mut">${x.role}, ${fmt(x.base)}</span>
    <span class="chip ${x.status}">${x.status==='sold'?esc(tm(x.team)?.name||'sold')+' '+fmt(x.price):x.status}</span>
    ${x.status==='sold'?`<button class="btn s" data-a="release" data-id="${x.id}">Release</button>`:x.status==='live'?'':`<button class="btn s p" data-a="start" data-id="${x.id}" ${c?'disabled':''}>Start</button>`}
    <button class="btn s d" data-a="delp" data-id="${x.id}" aria-label="Delete ${esc(x.name)}">Delete</button></div>`).join('')||'<p class="mut">Add players to build the pool.</p>';
  $('#teams').innerHTML=s.teams.map(t=>`<div class="team"><div class="row"><b><span class="dot" style="--c:${t.color}"></span> ${esc(t.name)}</b>
    <button class="btn s d" data-a="delt" data-id="${t.id}">Delete</button></div><div class="mut">${fmt(t.purse)} left, ${count(t.id)} of ${t.max} players</div></div>`).join('')||'<p class="mut">Add teams to begin.</p>';
});
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-a]');if(!b)return;const id=b.dataset.id;
  ({bid:()=>say(S.bid(id)),sell:()=>S.sell(),undo:()=>say(S.undo()),pass:()=>S.pass(),start:()=>say(S.start(id)),release:()=>S.release(id),
   delp:()=>say(S.delPlayer(id)),delt:()=>say(S.delTeam(id)),export:()=>S.export(),
   demo:()=>confirm('Replace everything with demo data?')&&S.reset(),clear:()=>confirm('Delete all teams and players?')&&S.reset(true)})[b.dataset.a]();
});
$('#pf').onsubmit=e=>{e.preventDefault();const f=e.target;S.addPlayer(f.n.value.trim(),f.r.value,f.b.value);f.n.value='';f.n.focus()};
$('#tf').onsubmit=e=>{e.preventDefault();const f=e.target;S.addTeam(f.n.value.trim(),f.c.value,f.p.value);f.n.value='';f.n.focus()};
$('#imp').onchange=async e=>{const f=e.target.files[0];if(f)say(S.import(await f.text()));e.target.value=''};
