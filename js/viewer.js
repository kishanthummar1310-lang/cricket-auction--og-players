let prev=null;
S.on(s=>{
  const tm=id=>s.teams.find(t=>t.id===id),pl=id=>s.players.find(p=>p.id===id);
  const c=s.cur,p=c&&pl(c.pid),lead=c&&c.tid&&tm(c.tid);let h;
  if(p){
    h=`<div class="who"><span class="av">${ini(p.name)}</span><div><h2>${esc(p.name)}</h2><p>${p.role}, base price ${fmt(p.base)}</p></div></div>
    <div class="price ${c.bid!==prev?'flash':''}">${fmt(c.bid)}</div>
    <div class="lead">${lead?`<span class="dot" style="--c:${lead.color}"></span>${esc(lead.name)} leads`:'Waiting for the first bid'}</div>`;
    prev=c.bid;
  }else{
    prev=null;const l=s.last,lp=l&&pl(l.pid),nx=s.players.find(x=>x.status==='pending');
    h=`<div class="empty">${lp?(l.tid?`<h2>${esc(lp.name)}</h2><div class="res">Sold to ${esc(tm(l.tid)?.name||'')} for ${fmt(l.price)}</div>`:`<h2>${esc(lp.name)}</h2><div class="res no">Unsold</div>`)
      :`<h2>Auction starting soon</h2>`}<p class="mut" style="margin-top:14px">${nx?`Up next: ${esc(nx.name)}, ${nx.role}`:'No players left in the pool'}</p></div>`;
  }
  $('#stage').innerHTML=h;
  $('#teams').innerHTML=s.teams.map(t=>`<div class="team ${c&&c.tid===t.id?'hl':''}"><div class="row"><b><span class="dot" style="--c:${t.color}"></span> ${esc(t.name)}</b><span>${fmt(t.purse)} left</span></div>
    <div class="mut">${s.players.filter(x=>x.team===t.id).length} of ${t.max} players</div><div class="bar" style="--c:${t.color}"><i style="width:${Math.max(0,t.purse/t.start*100)}%"></i></div></div>`).join('')||'<p class="mut">No teams yet.</p>';
  $('#sales').innerHTML=s.sales.slice(0,8).map(x=>{const q=pl(x.pid),t=tm(x.tid);return q&&t?`<div><span class="dot" style="--c:${t.color}"></span><b>${esc(q.name)}</b><span class="mut">${esc(t.name)}</span><b style="flex:none">${fmt(x.price)}</b></div>`:''}).join('')||'<p class="mut">No sales yet.</p>';
});
