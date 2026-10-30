const KEY='cricstrike_v1',$=(s,r=document)=>r.querySelector(s);
const uid=()=>Math.random().toString(36).slice(2,9);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>n>=100?+(n/100).toFixed(2)+' Cr':n+' L';
const ini=n=>n.split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();
const ROLES=['Batter','Bowler','All-rounder','Wicketkeeper'];
const step=b=>b<100?10:b<300?20:50;
function seed(){
  const t=(name,color)=>({id:uid(),name,color,purse:1000,start:1000,max:15});
  const p=(name,role,base)=>({id:uid(),name,role,base,status:'pending',team:null,price:0});
  return{teams:[t('Surat Strikers','#B3262E'),t('Tapi Titans','#1F5D3A'),t('Gujarat Gladiators','#2457A6'),t('Dumas Dynamos','#C27B0E')],
  players:[p('Aarav Mehta','Batter',50),p('Rohan Patel','Bowler',40),p('Kabir Shah','All-rounder',75),p('Vihaan Desai','Wicketkeeper',60),p('Ishaan Joshi','Bowler',30),p('Dev Trivedi','Batter',50),p('Yash Modi','All-rounder',100),p('Neel Parikh','Bowler',20)],
  cur:null,last:null,sales:[]};
}
function load(){try{return JSON.parse(localStorage.getItem(KEY))||seed()}catch(e){return seed()}}
let st=load();const subs=[];
const notify=()=>subs.forEach(f=>f(st));
function save(){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}notify()}
addEventListener('storage',e=>{if(e.key===KEY){st=load();notify()}});
function toast(m){const d=document.createElement('div');d.className='toast';d.textContent=m;document.body.append(d);setTimeout(()=>d.remove(),2200)}
const count=id=>st.players.filter(p=>p.team===id).length;
const nextBid=()=>st.cur.tid?st.cur.bid+step(st.cur.bid):st.cur.bid;
function canBid(tid){
  const t=st.teams.find(x=>x.id===tid);
  if(!st.cur)return'No player is live';
  if(st.cur.tid===tid)return'Already highest bidder';
  if(t.purse<nextBid())return'Not enough purse';
  if(count(tid)>=t.max)return'Squad is full';
}
const S={
  get:()=>st,on:f=>{subs.push(f);f(st)},
  addTeam(name,color,purse){st.teams.push({id:uid(),name,color,purse:+purse,start:+purse,max:15});save()},
  delTeam(id){if(count(id))return'Release its players first';st.teams=st.teams.filter(t=>t.id!==id);save()},
  addPlayer(name,role,base){st.players.push({id:uid(),name,role,base:+base,status:'pending',team:null,price:0});save()},
  delPlayer(id){if(st.cur&&st.cur.pid===id)return'Player is live';const p=st.players.find(x=>x.id===id);if(p.status==='sold')return'Release the player first';st.players=st.players.filter(x=>x.id!==id);save()},
  start(pid){if(st.cur)return'Sell or pass the live player first';const p=st.players.find(x=>x.id===pid);p.status='live';st.cur={pid,bid:p.base,tid:null,hist:[]};st.last=null;save()},
  bid(tid){const e=canBid(tid);if(e)return e;const a=nextBid();st.cur.hist.push({tid,amt:a});st.cur.tid=tid;st.cur.bid=a;save()},
  undo(){const c=st.cur;if(!c||!c.hist.length)return'Nothing to undo';c.hist.pop();const l=c.hist[c.hist.length-1];const p=st.players.find(x=>x.id===c.pid);c.tid=l?l.tid:null;c.bid=l?l.amt:p.base;save()},
  sell(){const c=st.cur;if(!c)return;const p=st.players.find(x=>x.id===c.pid);
    if(c.tid){const t=st.teams.find(x=>x.id===c.tid);t.purse-=c.bid;p.status='sold';p.team=c.tid;p.price=c.bid;st.sales.unshift({pid:p.id,tid:t.id,price:c.bid});st.last={pid:p.id,tid:t.id,price:c.bid}}
    else{p.status='unsold';st.last={pid:p.id,tid:null,price:0}}
    st.cur=null;save()},
  pass(){const c=st.cur;if(!c)return;st.players.find(x=>x.id===c.pid).status='unsold';st.last={pid:c.pid,tid:null,price:0};st.cur=null;save()},
  release(pid){const p=st.players.find(x=>x.id===pid);const t=st.teams.find(x=>x.id===p.team);if(t)t.purse+=p.price;p.status='pending';p.team=null;p.price=0;st.sales=st.sales.filter(s=>s.pid!==pid);save()},
  reset(empty){st=empty?{teams:[],players:[],cur:null,last:null,sales:[]}:seed();save()},
  export(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(st,null,2)],{type:'application/json'}));a.download='auction.json';a.click()},
  import(text){try{const d=JSON.parse(text);if(!d.teams||!d.players)throw 0;st=d;save();return}catch(e){return'Invalid auction file'}}
};
