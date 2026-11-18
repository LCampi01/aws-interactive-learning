/* ---------- Motor ---------- */
const $=s=>document.querySelector(s);
const NS='http://www.w3.org/2000/svg';
const X=c=>80+150*c, Y=r=>66+118*r;
const pad2=n=>String(n).padStart(2,'0');
const svgEl=(tag,attrs,parent,text)=>{const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(text!=null)e.textContent=text;if(parent)parent.appendChild(e);return e};
const tileHTML=(abbr,cat,glyph,key)=>ICONS[key]?`<span class="tile img${ICON_RES.has(key)?' res':''}"><img src="${ICONS[key]}" alt=""></span>`:`<span class="tile c-${cat}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${GLYPHS[glyph]||GLYPHS.app}"/></svg><em>${abbr}</em></span>`;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let li=0, si=0, paused=reduce, view='lesson', NODES={}, GROUPS={}, selNode=null;
let store={max:{}};
try{store=Object.assign(store,JSON.parse(localStorage.getItem('awspp:v2')||'{}'));if(!store.max)store.max={}}catch(e){}
const save=()=>{try{localStorage.setItem('awspp:v2',JSON.stringify(store))}catch(e){}};
const isDone=L=>store.max[L.id]===L.steps.length-1;

// una lección con «tras» se coloca justo después de la lección indicada
LESSONS.filter(L=>L.tras).forEach(L=>{LESSONS.splice(LESSONS.indexOf(L),1);const i=LESSONS.findIndex(x=>x.id===L.tras);LESSONS.splice(i<0?LESSONS.length:i+1,0,L)});

// prepara cada lección: nodos, grupos y piezas visibles en cada paso
LESSONS.forEach(L=>{
  L.N={};
  for(const id in L.nodes){const [spec,label,sub,c,r]=L.nodes[id];let abbr,cat,glyph,svc=null;
    if(spec[0]==='@'){[abbr,cat,glyph]=spec.slice(1).split(':');glyph=glyph||CUSTOM_GLYPH[abbr]||'app'}
    else{svc=spec;if(!S[spec])throw new Error('servicio desconocido: '+spec+' en '+L.id);abbr=S[spec][0];cat=S[spec][2];glyph=S[spec][4]}
    const x=X(c),y=Y(r);L.N[id]={id,abbr,cat,glyph,svc,label,sub,x,y,cx:x,cy:y,l:x-34,r:x+34,t:y-34,b:y+68}}
  L.G={};
  for(const id in (L.groups||{})){const [label,c0,r0,c1,r1,pad,pos]=L.groups[id];
    const l=X(c0)-58-pad,t=Y(r0)-50-pad,r=X(c1)+58+pad,b=Y(r1)+70+pad;L.G[id]={id,label,pos:pos||'tl',l,t,r,b,cx:(l+r)/2,cy:(t+b)/2}}
  let cur=new Set();L.vis=L.steps.map(st=>{(st.rm||[]).forEach(i=>cur.delete(i));(st.add||[]).forEach(i=>cur.add(i));return new Set(cur)});
});
const SECS=[...new Set(LESSONS.map(l=>l.sec))];

function buildLesson(){
  const L=LESSONS[li];
  ['gGroups','gEdges','gNodes','gDots'].forEach(id=>$('#'+id).replaceChildren());
  NODES={};GROUPS={};selNode=null;
  for(const id in L.G){const g=L.G[id];const el=svgEl('g',{class:'grp'},$('#gGroups'));
    svgEl('rect',{x:g.l,y:g.t,width:g.r-g.l,height:g.b-g.t,rx:10},el);
    const top=g.pos[0]==='t',left=g.pos[1]==='l';
    svgEl('text',{x:left?g.l+12:g.r-12,y:(top?g.t:g.b)+3.5,'text-anchor':left?'start':'end'},el,g.label);GROUPS[id]=el}
  for(const id in L.N){const n=L.N[id];
    const el=svgEl('g',{class:'node c-'+n.cat,transform:`translate(${n.x},${n.y})`,tabindex:0,role:'button','aria-label':n.label+(n.sub?', '+n.sub:'')},$('#gNodes'));
    const inn=svgEl('g',{class:'nin'},el);
    const ic=n.svc&&ICONS[n.svc],res=ic&&ICON_RES.has(n.svc);
    svgEl('rect',{class:'ring',x:-31,y:-31,width:62,height:62,rx:ic&&!res?5:15},inn);
    if(ic){ // icono oficial de AWS
      if(res)svgEl('rect',{class:'tb',x:-26,y:-26,width:52,height:52,rx:12},inn);
      svgEl('image',{class:'ic',href:ic,x:res?-21:-26,y:res?-21:-26,width:res?42:52,height:res?42:52},inn);
    }else{ // pictograma propio
      svgEl('rect',{class:'t',x:-26,y:-26,width:52,height:52,rx:12},inn);
      svgEl('path',{class:'gl',d:GLYPHS[n.glyph]||GLYPHS.app,transform:'translate(-12,-22)'},inn);
      svgEl('text',{class:'ab',y:19.5,'font-size':n.abbr.length<=3?9.5:n.abbr.length===4?9:8},inn,n.abbr);
    }
    svgEl('path',{class:'x',d:'M-17,-17 L17,17 M17,-17 L-17,17'},inn);
    svgEl('text',{class:'nm',y:44},inn,n.label);
    if(n.sub)svgEl('text',{class:'sb',y:58},inn,n.sub);
    const note=svgEl('g',{class:'note'},inn);note.setAttribute('visibility','hidden');
    svgEl('rect',{y:-52,height:18,rx:9},note);svgEl('text',{y:-39.5},note);
    el.addEventListener('click',()=>selectNode(id));
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();selectNode(id)}});
    NODES[id]=el}
  const inSec=LESSONS.filter(x=>x.sec===L.sec);
  $('#crumb').textContent=`${pad2(SECS.indexOf(L.sec)+1)}. ${L.sec} · Lección ${inSec.indexOf(L)+1} de ${inSec.length}`;
  $('#lTitle').textContent=L.title;$('#lBlurb').textContent=L.blurb;
  $('#pMin').textContent=L.min+' min';$('#pLvl').textContent=L.lvl;$('#pSteps').textContent=L.steps.length+' pasos';
  $('#tl').innerHTML=L.steps.map((s,i)=>`<li><button data-i="${i}" aria-label="Paso ${i+1}: ${s.t}"><span class="n">${i+1}</span><span class="t">${s.t}</span></button></li>`).join('');
  $('#learn').innerHTML=L.learn.map(l=>`<li>${l[0]}</li>`).join('');
  document.title=L.title+' · AWS pieza a pieza';
  renderQuiz();
}

// preguntas de práctica de la lección: QUIZ[id] = [[pregunta, [opciones], índice correcto, explicación], …]
function renderQuiz(){
  const L=LESSONS[li],Q=QUIZ[L.id]||[],box=$('#quiz');
  if(!Q.length){box.hidden=true;return}
  box.hidden=false;const ans=(store.quiz&&store.quiz[L.id])||[];
  const okN=Q.filter((q,i)=>ans[i]===q[2]).length,done=Q.every((q,i)=>ans[i]!=null);
  box.innerHTML=`<div class="qhd"><span class="eyebrow">Práctica</span><span class="mono qsc">${done?okN+' / '+Q.length+' correctas':Q.length+' preguntas'}</span></div>`+
    Q.map((q,i)=>{const a=ans[i];return `<div class="q"><p>${i+1}. ${q[0]}</p><div class="opts">${q[1].map((o,j)=>`<button class="opt${a!=null&&j===q[2]?' ok':''}${a===j&&j!==q[2]?' no':''}" data-q="${i}" data-o="${j}"${a!=null?' disabled':''}>${o}</button>`).join('')}</div>${a!=null?`<div class="why"><b>${a===q[2]?'Correcto.':'No es esa.'}</b> ${q[3]}</div>`:''}</div>`}).join('')+
    (done?'<button class="ctl" id="qreset">Reintentar</button>':'');
}
$('#quiz').addEventListener('click',e=>{
  const L=LESSONS[li],b=e.target.closest('.opt');store.quiz=store.quiz||{};
  if(b&&!b.disabled){const a=store.quiz[L.id]=store.quiz[L.id]||[];a[+b.dataset.q]=+b.dataset.o;save();renderQuiz()}
  else if(e.target.id==='qreset'){delete store.quiz[L.id];save();renderQuiz()}
});

function selectNode(id){
  const L=LESSONS[li];
  if(selNode&&NODES[selNode])NODES[selNode].classList.remove('sel');
  selNode=id;const f=$('#ficha');
  if(!id||!L.N[id]){f.innerHTML='<span class="hint">Toca una pieza del diagrama para ver qué servicio es y para qué sirve.</span>';return}
  NODES[id].classList.add('sel');const n=L.N[id];
  if(n.svc){const s=S[n.svc];f.innerHTML=`${tileHTML(s[0],s[2],s[4],n.svc)}<div><b>${s[1]}</b><span class="chip c-${s[2]}">${CATS[s[2]]}</span><br>${s[3]}</div>`}
  else f.innerHTML=`${tileHTML(n.abbr,n.cat,n.glyph)}<div><b>${n.label}</b><br><span class="hint">${n.sub?n.sub+'. ':''}No es un servicio concreto: representa una pieza del ejemplo.</span></div>`;
}

function geom(A,B,off){
  const dx=B.cx-A.cx,dy=B.cy-A.cy,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len;
  const ex=(P,ux,uy)=>Math.min(ux>0?(P.r-P.cx)/ux:ux<0?(P.l-P.cx)/ux:1e9, uy>0?(P.b-P.cy)/uy:uy<0?(P.t-P.cy)/uy:1e9);
  const a=ex(A,ux,uy),b=ex(B,-ux,-uy),px=-uy*off,py=ux*off;
  return {x0:A.cx+ux*a+px,y0:A.cy+uy*a+py,x1:B.cx-ux*b+px,y1:B.cy-uy*b+py,ux,uy};
}
// dónde va la etiqueta de una flecha: punto y alineación
function labelPos(g,pair){
  let lx=-g.uy,ly=g.ux;
  if(!pair){if(ly>0||(Math.abs(ly)<.01&&lx<0)){lx=-lx;ly=-ly}if(Math.abs(lx)>.6&&(g.x0+g.x1)/2>560){lx=-lx;ly=-ly}}
  return {x:(g.x0+g.x1)/2+lx*11,y:(g.y0+g.y1)/2+ly*11,anchor:Math.abs(lx)>.6?(lx>0?'start':'end'):'middle'};
}

let anim=[],raf=0,t0=0,startTimer=0;
function drawEdges(){
  const L=LESSONS[li],st=L.steps[si],E=st.e||[];
  $('#gEdges').replaceChildren();$('#gDots').replaceChildren();anim=[];
  const keys=new Set(E.map(e=>e[0]+'>'+e[1]));
  E.forEach(e=>{
    const A=L.N[e[0]]||L.G[e[0]],B=L.N[e[1]]||L.G[e[1]];if(!A||!B)return;
    const kind=e[3]||'req',pair=keys.has(e[1]+'>'+e[0]);
    const g=geom(A,B,pair?7:0);
    const el=svgEl('g',{class:'edge '+kind},$('#gEdges'));
    const bx=g.x1-g.ux*9,by=g.y1-g.uy*9,nx=-g.uy,ny=g.ux;
    svgEl('line',{x1:g.x0,y1:g.y0,x2:bx,y2:by},el);
    svgEl('polygon',{points:`${g.x1},${g.y1} ${bx+nx*4.5},${by+ny*4.5} ${bx-nx*4.5},${by-ny*4.5}`},el);
    if(e[2]){const p=labelPos(g,pair);svgEl('text',{x:p.x,y:p.y+3.5,'text-anchor':p.anchor},el,e[2])}
    const dot=svgEl('circle',{class:'dot '+kind,r:4.5,opacity:0},$('#gDots'));
    anim.push({dot,x0:g.x0,y0:g.y0,x1:bx,y1:by});
  });
  startAnim();
}
function startAnim(){
  cancelAnimationFrame(raf);clearTimeout(startTimer);t0=0;anim.forEach(a=>a.dot.setAttribute('opacity',0));
  if(paused||!anim.length||view!=='lesson')return;
  startTimer=setTimeout(()=>{raf=requestAnimationFrame(tick)},350);
}
function tick(ts){
  if(!t0)t0=ts;const n=anim.length,total=n*520+900+1100,tt=(ts-t0)%total;
  anim.forEach((a,i)=>{const u=(tt-i*520)/900;
    if(u<0||u>1){a.dot.setAttribute('opacity',0);return}
    const k=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
    a.dot.setAttribute('cx',a.x0+(a.x1-a.x0)*k);a.dot.setAttribute('cy',a.y0+(a.y1-a.y0)*k);a.dot.setAttribute('opacity',1)});
  raf=requestAnimationFrame(tick);
}

// en pantallas estrechas, el diagrama se acerca a las piezas del paso actual
const narrow=matchMedia('(max-width: 700px)');let zoomOn=true,lastFit=null;
function fitView(){
  const svg=$('#svg'),L=LESSONS[li],wrap=svg.parentNode,full=()=>{svg.setAttribute('viewBox','0 0 760 500')};
  wrap.classList.toggle('fit',narrow.matches&&zoomOn);$('#zoom').textContent=zoomOn?'Ver todo':'Acercar';
  if(!narrow.matches||!zoomOn||!lastFit){full();return}
  const [act,all]=lastFit;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  [...L.vis[si]].filter(i=>all||act.has(i)).forEach(i=>{const n=L.N[i],g=L.G[i];
    if(n){x0=Math.min(x0,n.x-80);x1=Math.max(x1,n.x+80);y0=Math.min(y0,n.y-60);y1=Math.max(y1,n.y+74)}
    else if(g){x0=Math.min(x0,g.l-8);x1=Math.max(x1,g.r+8);y0=Math.min(y0,g.t-12);y1=Math.max(y1,g.b+12)}});
  if(x0>x1){full();return}
  const R=.82;let w=Math.max(x1-x0,(y1-y0)/R,400);if(w>=700){full();return}
  const h=Math.min(w*R,500),cx=(x0+x1)/2,cy=(y0+y1)/2;
  const vx=Math.max(0,Math.min(760-w,cx-w/2)),vy=Math.max(0,Math.min(500-h,cy-h/2));
  svg.setAttribute('viewBox',`${vx} ${vy} ${w} ${h}`);
}
narrow.addEventListener('change',fitView);

function nextTarget(){
  const L=LESSONS[li];
  if(si<L.steps.length-1)return {li,si:si+1,label:'Siguiente: '+L.steps[si+1].t};
  if(li<LESSONS.length-1)return {li:li+1,si:0,label:'Siguiente lección: '+LESSONS[li+1].title};
  return {catalog:true,label:'Ver el catálogo de servicios'};
}

function renderStep(){
  const L=LESSONS[li],st=L.steps[si],vis=L.vis[si],prev=si?L.vis[si-1]:new Set();
  const added=[...vis].filter(i=>!prev.has(i)),removed=[...prev].filter(i=>!vis.has(i));
  const act=new Set(added);(st.e||[]).forEach(e=>{act.add(e[0]);act.add(e[1])});Object.keys(st.n||{}).forEach(k=>act.add(k));(st.x||[]).forEach(k=>act.add(k));
  const all=st.k==='elegir'||st.k==='resumen'||(!(st.e||[]).length&&!added.length&&!st.n&&!st.x);
  for(const id in NODES){const el=NODES[id],on=vis.has(id);
    el.classList.toggle('on',on);el.classList.toggle('dim',on&&!all&&!act.has(id));
    el.classList.toggle('new',on&&added.includes(id)&&si>0);el.classList.toggle('down',!!(st.x&&st.x.includes(id)));
    el.setAttribute('tabindex',on?0:-1);
    const note=el.querySelector('.note'),txt=st.n&&st.n[id];
    if(txt){const w=txt.length*6.2+16;note.querySelector('rect').setAttribute('x',-w/2);note.querySelector('rect').setAttribute('width',w);note.querySelector('text').textContent=txt;note.setAttribute('visibility','visible')}
    else note.setAttribute('visibility','hidden')}
  for(const id in GROUPS)GROUPS[id].classList.toggle('on',vis.has(id));
  if(selNode&&!vis.has(selNode))selectNode(null);else if(!selNode)selectNode(null);
  drawEdges();
  lastFit=[act,all];fitView();

  // tira de datos
  if(L.keys){let vals=null;for(let i=si;i>=0&&!vals;i--)vals=L.steps[i].s;
    $('#stats').innerHTML=L.keys.map((k,i)=>`<div><dt>${k}</dt><dd>${vals?vals[i]:'—'}</dd></div>`).join('');$('#stats').hidden=false}
  else $('#stats').hidden=true;

  // panel
  $('#stepCount').textContent=`PASO ${si+1} / ${L.steps.length}`;
  $('#kind').textContent=st.k;$('#kind').dataset.k=st.k;$('#stepH').textContent=st.h;
  let h=(st.p||[]).map(p=>`<p>${p}</p>`).join('');
  if(st.code)h+=`<pre>${st.code}</pre>`;
  if(st.ul)h+='<ul>'+st.ul.map(x=>`<li>${x}</li>`).join('')+'</ul>';
  if(st.idea)h+=`<div class="idea"><span class="eyebrow">Idea clave</span>${st.idea}</div>`;
  const nm=i=>L.N[i]?L.N[i].label:null;
  const addN=added.filter(i=>L.N[i]),addG=added.filter(i=>L.G[i]),remN=removed.filter(i=>L.N[i]);
  if(addN.length||addG.length||remN.length){
    h+='<div class="chg"><span class="eyebrow">Qué cambia en el diagrama</span><ul>';
    const seen=new Set();
    addN.forEach(i=>{const n=L.N[i],key=n.label+n.sub;if(seen.has(key))return;seen.add(key);
      const c=addN.filter(j=>L.N[j].label+L.N[j].sub===key).length;
      h+=`<li><span class="sg">+</span><span>${n.label}${c>1?' ×'+c:''}${n.sub?` <small>${n.sub}</small>`:''}</span></li>`});
    [...new Set(addG.map(i=>L.G[i].label))].forEach(l=>{h+=`<li><span class="sg">+</span><span>${l} <small>zona del diagrama</small></span></li>`});
    if(remN.length)h+=`<li class="out"><span class="sg">−</span><span><small>Salen de escena: ${[...new Set(remN.map(nm))].join(', ')}</small></span></li>`;
    h+='</ul></div>'}
  $('#stepBody').innerHTML=h;
  $('#prev').disabled=!si&&!li;
  $('#nextTxt').textContent=nextTarget().label;

  // progreso
  store.max[L.id]=Math.max(store.max[L.id]||0,si);save();
  const mx=store.max[L.id];
  document.querySelectorAll('#tl li').forEach((el,i)=>{el.classList.toggle('cur',i===si);el.classList.toggle('seen',i<=mx);
    const b=el.querySelector('button');if(i===si){b.setAttribute('aria-current','step');$('#tl').scrollTo({left:el.offsetLeft-$('#tl').clientWidth/2+el.clientWidth/2,behavior:reduce?'auto':'smooth'})}else b.removeAttribute('aria-current')});
  $('#tlCount').textContent=`Paso ${si+1} de ${L.steps.length}`;
  document.querySelectorAll('#learn li').forEach((el,i)=>el.classList.toggle('ok',mx>=L.learn[i][1]));
  renderToc();
  const hsh='#'+L.id+'-'+(si+1);
  if(location.hash!==hsh){try{history.replaceState(null,'',hsh)}catch(e){try{location.replace(hsh)}catch(_){}}}
}

const navName=L=>L.nav||L.title.split(':')[0];
const openSecs=new Set();
function renderToc(){
  const curSec=LESSONS[li].sec;let h='';
  SECS.forEach((sec,k)=>{
    const Ls=LESSONS.filter(L=>L.sec===sec),nd=Ls.filter(isDone).length;
    const open=(view==='lesson'&&sec===curSec)||openSecs.has(sec);
    h+=`<details data-sec="${k}"${open?' open':''}><summary><span class="num">${pad2(k+1)}</span><span class="st">${sec}</span><span class="pg${nd===Ls.length?' full':''}">${nd}/${Ls.length}</span></summary><ol>`;
    Ls.forEach(L=>{const i=LESSONS.indexOf(L),mx=store.max[L.id],n=L.steps.length,done=isDone(L);
      h+=`<li><a href="#${L.id}-1" class="${L.cat?'c-'+L.cat:''}${done?' done':''}" ${i===li&&view==='lesson'?'aria-current="true"':''}><span class="sw"></span><span>${navName(L)}</span><span class="pg">${done?'✓':mx!=null?(mx+1)+'/'+n:''}</span></a></li>`});
    h+='</ol></details>'});
  $('#toc').innerHTML=h;
  const done=LESSONS.filter(isDone).length;
  $('#progTxt').textContent=`${done} / ${LESSONS.length} lecciones completas`;$('#progBar').style.width=(100*done/LESSONS.length)+'%';
}
$('#toc').addEventListener('toggle',e=>{const s=SECS[+e.target.dataset.sec];if(!s)return;if(e.target.open)openSecs.add(s);else openSecs.delete(s)},true);

function go(l,s){
  setView('lesson');
  const changed=l!==li||!Object.keys(NODES).length;li=l;si=Math.max(0,Math.min(s,LESSONS[l].steps.length-1));
  if(changed)buildLesson();
  renderStep();
}
function setView(v){
  view=v;$('#lessonView').hidden=v!=='lesson';$('#catalogView').hidden=v!=='catalog';
  $('#tabLesson').setAttribute('aria-selected',v==='lesson');$('#tabCatalog').setAttribute('aria-selected',v==='catalog');
  if(v==='catalog'){cancelAnimationFrame(raf);renderToc();if(location.hash!=='#catalogo'){try{history.replaceState(null,'','#catalogo')}catch(e){}}document.title='Catálogo · AWS pieza a pieza'}
  closeSide();
}
const HASH=/^([a-z0-9]+)-(\d+)$/;
function route(){
  const h=location.hash.slice(1);
  if(h==='catalogo'){if(!Object.keys(NODES).length){buildLesson();renderStep()}setView('catalog');return}
  const m=h.match(HASH),idx=m?LESSONS.findIndex(L=>L.id===m[1]):-1;
  if(idx>=0)go(idx,+m[2]-1);else go(0,0);
}

/* ---------- Catálogo ---------- */
let fcat=null;
function lessonFor(key){
  const own=LESSONS.find(L=>L.svc===key);if(own)return own;
  const cat=S[key][2];let first=null;
  for(const L of LESSONS){const uses=Object.values(L.nodes).some(n=>n[0]===key);if(!uses)continue;if(L.cat===cat)return L;first=first||L}
  return first;
}
function renderCatalog(){
  const q=$('#q').value.trim().toLowerCase();let h='';
  Object.keys(CATS).filter(c=>c!=='ext').forEach(c=>{
    if(fcat&&fcat!==c)return;
    const items=Object.keys(S).filter(k=>S[k][2]===c&&(!q||(S[k][0]+' '+S[k][1]+' '+S[k][3]).toLowerCase().includes(q)));
    if(!items.length)return;
    h+=`<section class="cgroup c-${c}"><h2><i></i>${CATS[c]} <small>${items.length}</small></h2><div class="cgrid">`+
      items.map(k=>{const s=S[k],L=lessonFor(k);return `<div class="svc">${tileHTML(s[0],c,s[4],k)}<div><b>${s[1]}</b><p>${s[3]}</p>${L?`<a href="#${L.id}-1">Lección: ${navName(L)} →</a>`:''}</div></div>`}).join('')+'</div></section>'});
  $('#cat').innerHTML=h||'<p class="empty">Ningún servicio coincide con esa búsqueda.</p>';
}
$('#fchips').innerHTML=Object.keys(CATS).filter(c=>c!=='ext').map(c=>`<button class="fchip c-${c}" data-c="${c}" aria-pressed="false"><i></i>${CATS[c]}</button>`).join('');
$('#fchips').addEventListener('click',e=>{const b=e.target.closest('.fchip');if(!b)return;fcat=fcat===b.dataset.c?null:b.dataset.c;
  document.querySelectorAll('.fchip').forEach(x=>x.setAttribute('aria-pressed',x.dataset.c===fcat));renderCatalog()});
$('#q').addEventListener('input',renderCatalog);

/* ---------- Controles ---------- */
function next(){const t=nextTarget();if(t.catalog)setView('catalog');else go(t.li,t.si)}
function prev(){if(si)go(li,si-1);else if(li)go(li-1,LESSONS[li-1].steps.length-1)}
function togglePause(){paused=!paused;$('#pause').textContent=paused?'Animar':'Pausa';startAnim()}
function replay(){if(paused){paused=false;$('#pause').textContent='Pausa'}startAnim()}
$('#next').addEventListener('click',next);$('#prev').addEventListener('click',prev);
$('#zoom').addEventListener('click',()=>{zoomOn=!zoomOn;fitView()});
$('#pause').addEventListener('click',togglePause);$('#replay').addEventListener('click',replay);
$('#pause').textContent=paused?'Animar':'Pausa';
$('#tl').addEventListener('click',e=>{const b=e.target.closest('button');if(b)go(li,+b.dataset.i)});
$('#tabLesson').addEventListener('click',()=>go(li,si));
$('#tabCatalog').addEventListener('click',()=>setView('catalog'));
const closeSide=()=>{$('#side').classList.remove('open');$('#menuBtn').setAttribute('aria-expanded','false')};
$('#menuBtn').addEventListener('click',()=>{const o=$('#side').classList.toggle('open');$('#menuBtn').setAttribute('aria-expanded',o)});
$('#scrim').addEventListener('click',closeSide);
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const m=a.getAttribute('href').slice(1).match(HASH);if(!m)return;
  const idx=LESSONS.findIndex(L=>L.id===m[1]);if(idx<0)return;e.preventDefault();go(idx,+m[2]-1);window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});
document.addEventListener('keydown',e=>{
  if(e.target.closest('input,textarea,select')||e.metaKey||e.ctrlKey||e.altKey)return;
  if(e.key==='Escape'){closeSide();return}
  if(view!=='lesson')return;
  if(e.key==='ArrowRight'){e.preventDefault();next()}
  else if(e.key==='ArrowLeft'){e.preventDefault();prev()}
  else if(e.key==='r'||e.key==='R')replay();
  else if(e.key===' '&&!e.target.closest('button,a,summary,[role=button]')){e.preventDefault();togglePause()}
});
window.addEventListener('hashchange',route);

/* ---------- Validador de diagramas (para quien edite las lecciones): lint() en la consola ---------- */
window.lint=function(){
  const out=[],hit=(g,P)=>{ // ¿el segmento cruza la caja de P?
    let t0=0,t1=1;const dx=g.x1-g.x0,dy=g.y1-g.y0;
    for(const [p,q] of [[-dx,g.x0-(P.x-30)],[dx,(P.x+30)-g.x0],[-dy,g.y0-(P.y-28)],[dy,(P.y+60)-g.y0]]){
      if(p===0){if(q<0)return false}else{const r=q/p;if(p<0){if(r>t1)return false;if(r>t0)t0=r}else{if(r<t0)return false;if(r<t1)t1=r}}}
    return true};
  const ids=new Set();
  LESSONS.forEach(L=>{
    if(ids.has(L.id))out.push(L.id+': id repetido');ids.add(L.id);
    if(!HASH.test(L.id+'-1'))out.push(L.id+': id no válido');
    if(!QUIZ[L.id])out.push(L.id+': sin preguntas de práctica');
    (QUIZ[L.id]||[]).forEach((q,i)=>{if(q.length!==4||q[1].length<3||!(q[2]>=0&&q[2]<q[1].length))out.push(`${L.id}: pregunta ${i+1} mal formada`)});
    for(const id in L.N){const n=L.N[id],w=Math.max(n.label.length*6.9,(n.sub||'').length*5.4)/2;
      if(n.x-w<2||n.x+w>758)out.push(`${L.id}: «${n.label}» se sale del lienzo`);
      if(w>74)out.push(`${L.id}: etiqueta ancha en «${n.label}» / «${n.sub}»`)}
    L.learn.forEach(l=>{if(l[1]>=L.steps.length)out.push(L.id+': learn apunta a un paso que no existe')});
    L.steps.forEach((st,i)=>{
      const at=`${L.id}-${i+1}`,vis=[...L.vis[i]],vn=vis.filter(k=>L.N[k]).map(k=>L.N[k]);
      [...(st.add||[]),...(st.rm||[]),...Object.keys(st.n||{}),...(st.x||[])].forEach(k=>{if(!L.N[k]&&!L.G[k])out.push(`${at}: pieza desconocida ${k}`)});
      if(st.s&&L.keys&&st.s.length!==L.keys.length)out.push(`${at}: la tira tiene ${st.s.length} valores`);
      for(let a=0;a<vn.length;a++)for(let b=a+1;b<vn.length;b++){const A=vn[a],B=vn[b];
        if(Math.abs(A.x-B.x)<112&&Math.abs(A.y-B.y)<90)out.push(`${at}: «${A.label}» y «${B.label}» se pisan`)}
      const E=st.e||[],keys=new Set(E.map(e=>e[0]+'>'+e[1]));
      E.forEach(e=>{
        const A=L.N[e[0]]||L.G[e[0]],B=L.N[e[1]]||L.G[e[1]];
        if(!A||!B||!L.vis[i].has(e[0])||!L.vis[i].has(e[1])){out.push(`${at}: flecha ${e[0]}→${e[1]} con pieza no visible`);return}
        const pair=keys.has(e[1]+'>'+e[0]),g=geom(A,B,pair?7:0),len=Math.hypot(g.x1-g.x0,g.y1-g.y0);
        vn.forEach(P=>{if(P.id!==e[0]&&P.id!==e[1]&&hit(g,P))out.push(`${at}: flecha ${e[0]}→${e[1]} pasa por encima de «${P.label}»`)});
        if(e[2]){const w=e[2].length*6.4,p=labelPos(g,pair);
          const l=p.anchor==='middle'?p.x-w/2:p.anchor==='start'?p.x:p.x-w,r=l+w;
          if(l<2||r>758)out.push(`${at}: etiqueta «${e[2]}» se sale del lienzo`);
          if(p.anchor==='middle'&&Math.abs(g.uy)<.25&&w>len+4)out.push(`${at}: etiqueta «${e[2]}» larga para la flecha ${e[0]}→${e[1]}`);
          vn.forEach(P=>{if(r>P.x-30&&l<P.x+30&&p.y>P.y-30&&p.y<P.y+62)out.push(`${at}: etiqueta «${e[2]}» tapa «${P.label}»`)})}
      });
      for(const k in (st.n||{})){const n=L.N[k];if(n&&(n.y-52<0||n.x-st.n[k].length*3.1-8<0||n.x+st.n[k].length*3.1+8>760))out.push(`${at}: nota «${st.n[k]}» se sale del lienzo`)}
    })});
  return out;
};

renderCatalog();route();
