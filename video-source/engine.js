const CFG=__CFG__;
(function(){
const W=1080,HH=1920,D=60;
const $=id=>document.getElementById(id),Q=(s,r=document)=>[...r.querySelectorAll(s)];
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),P=(t,a,b)=>cl((t-a)/(b-a)),L=(a,b,k)=>a+(b-a)*k;
const eo=x=>1-Math.pow(1-x,3),eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const back=x=>{const c1=1.7,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
const num=s=>s==null?null:parseFloat(s),nums=s=>s?s.split(',').map(parseFloat):null;

/* ---------- musical grid: 125 BPM house, bars anchored so the drop lands on 7.2s ---------- */
const BT=.48,BAR=1.92,ST=.12,O=-0.48;
const CH=[[53,56,60,63,67],[49,53,56,60,63],[48,51,56,60,63],[51,55,58,62,65]];
const ROOT=[41,37,44,39];
const HOOK=[[[0,72],[3,75],[6,77],[10,75],[12,72]],[[0,77],[3,75],[6,72],[10,68],[12,72]],[[0,75],[3,72],[6,68],[10,72],[12,75]],[[0,74],[3,70],[6,67],[10,70],[14,72]]];
const PIANO=[0,3,6,10,12];
const NB=32,BS=n=>O+n*BAR;
const GROOVE=n=>(n>=4&&n<=24)||n===28||n===29;
const CHIDX=n=>((n%4)+4)%4;
const KICKS=[];for(let n=0;n<NB;n++){if(GROOVE(n)||n===3)for(let b=0;b<4;b++)KICKS.push(BS(n)+b*BT);}KICKS.push(57.12);

/* ---------- scenes ---------- */
const S=Q('.sc').map(e=>({el:e,t0:+e.dataset.t0,t1:+e.dataset.t1,tr:e.dataset.tr,glint:nums(e.dataset.glint),dust:!!e.dataset.dust,items:[]}));
const bars=$('bars');S.forEach(()=>{const i=document.createElement('i');i.innerHTML='<u></u>';bars.appendChild(i)});const barU=Q('#bars u');
S.forEach(s=>{Q('[data-in],[data-draw],[data-dot],[data-count],[data-text],[data-kb],[data-out],[data-pulse]',s.el).forEach(el=>{
 const d=el.dataset;const a={el,sc:s,svg:el instanceof SVGElement,in:num(d.in),type:d.anim||'up',dur:num(d.dur)||.45,dy:num(d.dy)??60,dx:num(d.dx)??400,out:num(d.out),od:num(d.od)??.3,rot:num(d.rot)||0,
  cnt:d.count?d.count.split(','):null,kb:nums(d.kb),rgb:el.classList.contains('rgb'),beat:el.classList.contains('beat'),
  txt:d.text?d.text.split('|').map(x=>{const i=x.indexOf(':');return[parseFloat(x.slice(0,i)),x.slice(i+1)]}):null,draw:nums(d.draw),dot:d.dot?d.dot.split(','):null};
 if(a.draw){a.len=el.getTotalLength?el.getTotalLength():1000;el.style.strokeDasharray=el.getAttribute('stroke-dasharray')?null:a.len;if(!el.getAttribute('stroke-dasharray'))el.style.strokeDashoffset=a.len;else a.mask=true;}
 s.items.push(a);});});
const FMT={int:v=>Math.round(v).toLocaleString('en-US'),cnt:v=>String(Math.max(1,Math.ceil(v))).padStart(2,'0')+' / 20'};
const pulseAt=t=>{let p=0;KICKS.forEach(k=>{const d=t-k;if(d>=0&&d<.4)p+=Math.exp(-d*14)});return Math.min(p,1.2)};
function anim(a,t){const el=a.el;let o=1,tx=0,ty=0,sc=1;
 if(a.in!=null){const k=P(t,a.in,a.in+a.dur),e=eo(k);
  switch(a.type){case 'up':o=e;ty=(1-e)*a.dy;break;case 'left':o=e;tx=-(1-e)*a.dx;break;case 'pop':o=cl(k*3);sc=k>0?back(k):.5;break;
   case 'zoom':o=e;sc=L(1.5,1,e);break;case 'cut':o=t>=a.in?1:0;break;default:o=e;}}
 if(a.out!=null)o*=1-P(t,a.out,a.out+a.od);
 if(a.pu!=null)sc*=1;
 if(a.txt){let s=a.txt[0][1];a.txt.forEach(([tt,v])=>{if(t>=tt)s=v});if(el._t!==s){el.innerHTML=s;el._t=s;}}
 if(a.cnt){const to=+a.cnt[0],t0=+a.cnt[1],t1=+a.cnt[2],f=a.cnt[3]||'int';el.textContent=FMT[f](L(0,to,f==='cnt'?P(t,t0,t1):eo(P(t,t0,t1))));}
 if(a.draw&&!a.mask)el.style.strokeDashoffset=a.len*(1-eio(P(t,a.draw[0],a.draw[1])));
 if(a.draw&&a.mask)el.style.opacity=P(t,a.draw[0],a.draw[1]);
 if(a.dot){const p=$(a.dot[0]),t0=+a.dot[1],t1=+a.dot[2],k=P(t,t0,t1);if(!p._len)p._len=p.getTotalLength();const q=p.getPointAtLength(p._len*eio(k));el.setAttribute('cx',q.x);el.setAttribute('cy',q.y);el.setAttribute('opacity',k>0?1:0);return;}
 if(a.kb){const[s0,s1,x0,x1,y0,y1]=a.kb;const k=P(t,a.sc.t0,a.sc.t1);let z=L(s0,s1,k);if(a.beat)z*=1+.018*pulseAt(t);
  el.style.transform=`translate(${L(x0,x1,k)}px,${L(y0,y1,k)}px) scale(${z})`;if(a.in==null&&a.out==null)return;}
 el.style.opacity=o;
 if(a.rgb){const k=1-P(t,a.in||0,(a.in||0)+.35);const d=(14*k+2.5*pulseAt(t)).toFixed(1);el.style.textShadow=`${d}px 0 rgba(255,79,163,.85),-${d}px 0 rgba(80,200,255,.85)`;}
 if(!a.svg&&!a.kb)el.style.transform=`translate(${tx}px,${ty}px) rotate(${a.rot}deg) scale(${sc})`;
 if(a.svg&&a.in!=null&&a.type==='pop'){el.style.transformOrigin='center';el.style.transformBox='fill-box';el.style.transform=`scale(${sc})`;}
}

/* ---------- FX canvas: glints, dust, diamond shockwaves, bursts ---------- */
const fx=$('fx'),cx=fx.getContext('2d');
const GL=[];seed=31;S.forEach(s=>{if(!s.glint)return;const[x0,y0,x1,y1,rate]=s.glint;for(let t=s.t0;t<s.t1;t+=rate){GL.push({t,x:L(x0,x1,rnd()),y:L(y0,y1,rnd()),s:30+rnd()*60,life:.45+rnd()*.35,r:rnd()*.6});}});
const DU=[];seed=5;for(let i=0;i<80;i++)DU.push({x:rnd()*W,y:rnd()*HH,v:15+rnd()*45,ph:rnd()*6.28,r:1+rnd()*2.6,a:.2+rnd()*.5});
const BU=[];seed=11;(CFG.bursts||[]).forEach(([t0,x,y,n])=>{for(let i=0;i<n;i++){const a=rnd()*6.283,v=400+rnd()*1200;BU.push({t0,x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-300,r:2+rnd()*5,life:.8+rnd()*1,c:rnd()<.5?'232,211,168':(rnd()<.5?'215,255,58':'255,79,163')});}});
function star(x,y,s,a,rot){cx.save();cx.translate(x,y);cx.rotate(rot);cx.globalAlpha=a;
 const g=cx.createRadialGradient(0,0,0,0,0,s*.45);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(1,'rgba(255,255,255,0)');cx.fillStyle=g;cx.beginPath();cx.arc(0,0,s*.45,0,6.283);cx.fill();
 cx.fillStyle='#fff';[[s,s*.05],[s*.05,s],[s*.55,s*.03],[s*.03,s*.55]].forEach(([w,h],i)=>{cx.save();if(i>1)cx.rotate(Math.PI/4);cx.beginPath();cx.ellipse(0,0,w,h,0,0,6.283);cx.fill();cx.restore();});cx.restore();}
function dshape(x,y,r){cx.beginPath();cx.moveTo(x-r*.6,y-r*.45);cx.lineTo(x+r*.6,y-r*.45);cx.lineTo(x+r,y-r*.05);cx.lineTo(x,y+r*.8);cx.lineTo(x-r,y-r*.05);cx.closePath();}
function drawFX(t){cx.clearRect(0,0,W,HH);const cur=S.find(s=>t>=s.t0&&t<s.t1);
 if(cur&&cur.dust)DU.forEach(p=>{const y=((p.y-t*p.v)%HH+HH)%HH,x=p.x+Math.sin(t*.7+p.ph)*24;cx.beginPath();cx.arc(x,y,p.r,0,6.283);cx.fillStyle=`rgba(212,175,106,${p.a*.7})`;cx.fill();});
 GL.forEach(g=>{const d=t-g.t;if(d<0||d>g.life)return;const k=d/g.life,a=Math.sin(k*Math.PI);star(g.x,g.y,g.s*(.4+.6*a),a,g.r+k*.5);});
 (CFG.rings||[]).forEach(t0=>{const d=t-t0;if(d<0||d>.9)return;const k=d/.9;dshape(540,960,80+eo(k)*1000);cx.strokeStyle=`rgba(232,211,168,${.6*(1-k)})`;cx.lineWidth=7*(1-k)+1;cx.stroke();});
 BU.forEach(b=>{const d=t-b.t0;if(d<0||d>b.life)return;const k=d/b.life;cx.beginPath();cx.arc(b.x+b.vx*d,b.y+b.vy*d+800*d*d,b.r*(1-k*.5),0,6.283);cx.fillStyle=`rgba(${b.c},${1-k})`;cx.fill();});}
const gr=$('grain'),gx=gr.getContext('2d'),gid=gx.createImageData(216,384);
function drawGrain(){const d=gid.data;for(let i=0;i<d.length;i+=4){const v=Math.random()*255;d[i]=d[i+1]=d[i+2]=v;d[i+3]=255;}gx.putImageData(gid,0,0);}
const WIPES=CFG.wipes||[26.4,43.2];
function render(t){
 S.forEach((s,i)=>{let o=(t>=s.t0&&t<s.t1)?1:0;const fi=s.tr==='fade'?.35:0;if(o&&fi)o*=P(t,s.t0,s.t0+fi);
  if(o&&i===S.length-1)o*=1-P(t,59.5,60);
  s.el.style.opacity=o;s.el.style.visibility=o>.001?'visible':'hidden';
  if(o>0){const pk=s.tr==='cut'?(1-eo(P(t,s.t0,s.t0+.3)))*.07:0,zf=fi?(1-eo(P(t,s.t0,s.t0+fi)))*.05:0;
   s.el.style.transform=`scale(${1+pk-zf})`;s.el.style.filter=zf>.003?`blur(${zf*140}px)`:'none';s.items.forEach(a=>anim(a,t));}
  barU[i].style.transform=`scaleX(${P(t,s.t0,s.t1)})`;});
 const chrome=t<7.2?0:t<53.08?1:1-P(t,53.08,53.28);['bars','brand','pgn'].forEach(id=>$(id).style.opacity=chrome);
 let wy=-3000;WIPES.forEach(w0=>{const k=P(t,w0-.3,w0+.3);if(k>0&&k<1)wy=L(2400,-3000,eio(k));});$('wipe').style.transform=`translateY(${wy}px) skewY(-10deg)`;
 let fl=0;(CFG.cuts||[]).forEach(c=>{if(t>=c)fl=Math.max(fl,.28*(1-P(t,c,c+.18)))});(CFG.drops||[]).forEach(c=>{if(t>=c)fl=Math.max(fl,.75*(1-P(t,c,c+.4)))});
 $('flashbg').style.opacity=fl;drawFX(t);}

/* ---------- AUDIO: "drop 01" deep house, 125 BPM, F minor ---------- */
let AC,OUT,REV,DLY,NOISE,MASTER,SC;const mf=n=>440*Math.pow(2,(n-69)/12);
function initAudio(ctx){AC=ctx;const comp=AC.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=3;comp.attack.value=.004;comp.release.value=.12;comp.connect(AC.destination);
 MASTER=AC.createGain();MASTER.gain.setValueAtTime(.6,0);MASTER.gain.setValueAtTime(.6,59.0);MASTER.gain.linearRampToValueAtTime(0,60);MASTER.connect(comp);OUT=MASTER;
 SC=AC.createGain();SC.gain.value=1;SC.connect(OUT);
 const conv=AC.createConvolver();const len=AC.sampleRate*2.6,ir=AC.createBuffer(2,len,AC.sampleRate);
 for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3)}conv.buffer=ir;
 REV=AC.createGain();REV.gain.value=.3;REV.connect(conv);conv.connect(OUT);
 const dl=AC.createDelay(1);dl.delayTime.value=BT*.75;const fb=AC.createGain();fb.gain.value=.32;const dlp=AC.createBiquadFilter();dlp.type='lowpass';dlp.frequency.value=3500;
 DLY=AC.createGain();DLY.gain.value=.45;DLY.connect(dl);dl.connect(dlp);dlp.connect(fb);fb.connect(dl);dlp.connect(SC);
 NOISE=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);const nd=NOISE.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
 // sidechain pump on every kick
 KICKS.slice().sort((a,b)=>a-b).forEach(k=>{if(k<0)return;SC.gain.setValueAtTime(1,Math.max(0,k-.005));SC.gain.linearRampToValueAtTime(.28,k+.01);SC.gain.linearRampToValueAtTime(1,k+.3);});}
function env(w,a,peak,d,dest=OUT,rev=0,dly=0){const g=AC.createGain();g.gain.setValueAtTime(.0001,w);g.gain.exponentialRampToValueAtTime(peak,w+a);g.gain.exponentialRampToValueAtTime(.0001,w+a+d);g.connect(dest);
 if(rev){const r=AC.createGain();r.gain.value=rev;g.connect(r);r.connect(REV);}if(dly){const r=AC.createGain();r.gain.value=dly;g.connect(r);r.connect(DLY);}return g}
function osc(type,f,w,dur,dest){const o=AC.createOscillator();o.type=type;o.frequency.setValueAtTime(f,w);o.connect(dest);o.start(w);o.stop(w+dur+.05);return o}
function noise(w,dur,dest){const s=AC.createBufferSource();s.buffer=NOISE;s.connect(dest);s.start(w,Math.random()*.5);s.stop(w+dur+.05);return s}
function filt(type,f,qv,dest){const b=AC.createBiquadFilter();b.type=type;b.frequency.value=f;if(qv)b.Q.value=qv;b.connect(dest);return b}
const I={
 kick(w,v=.95){const g=env(w,.002,v,.26);const o=osc('sine',150,w,.32,g);o.frequency.exponentialRampToValueAtTime(48,w+.09);const c=env(w,.001,.22,.015);noise(w,.02,filt('highpass',2500,0,c));},
 clap(w,v=.28){[0,.011,.022].forEach((o,i)=>{const g=env(w+o,.001,v*(i===2?1:.6),i===2?.17:.018,OUT,.35);noise(w+o,.22,filt('bandpass',1400,1,g));});},
 snare(w,v=.12){const g=env(w,.001,v,.09,OUT,.2);noise(w,.12,filt('bandpass',1900,.8,g));},
 ohat(w,v=.06){const g=env(w,.001,v,.14);noise(w,.2,filt('highpass',7200,0,g));},
 shk(w,v=.025){const g=env(w,.004,v,.04);noise(w,.08,filt('bandpass',9000,1.2,g));},
 bass(w,n,d=.2,v=.32){const g=env(w,.005,v,d,SC);const lp=filt('lowpass',650,2,g);lp.frequency.setValueAtTime(1400,w);lp.frequency.exponentialRampToValueAtTime(420,w+d);osc('sawtooth',mf(n),w,d+.05,lp);osc('sine',mf(n-12),w,d+.05,env(w,.005,v*.9,d,SC));},
 piano(w,notes,v=.03,lp=4200,rv=.3){notes.forEach((n,i)=>{const f=mf(n);const g=env(w+i*.004,.002,v,.65,SC,rv,.15);const l=filt('lowpass',lp,0,g);osc('triangle',f,w,.75,l);osc('sine',f*2,w,.5,env(w,.002,v*.45,.35,SC));osc('sine',f*3.01,w,.25,env(w,.001,v*.2,.15,SC));});},
 chop(w,n,v=.06,rv=.25){const f=mf(n);const g=env(w,.006,v,.2,SC,rv,.35);const mix=AC.createGain();mix.gain.value=1;mix.connect(g);
  [[800,6,1],[1150,7,.7],[2900,9,.25]].forEach(([fr,q,a])=>{const b=filt('bandpass',fr,q,mix);const ga=AC.createGain();ga.gain.value=a*3;ga.connect(b);const o=osc('sawtooth',f,w,.26,ga);o.detune.setValueAtTime(-30,w);o.detune.linearRampToValueAtTime(0,w+.05);});
  osc('sine',f,w,.24,env(w,.005,v*.35,.18,SC));},
 pad(w,notes,dur,v=.025,f0=1500,f1=1500){const g=AC.createGain();g.gain.setValueAtTime(.0001,w);g.gain.linearRampToValueAtTime(v,w+.35);g.gain.setValueAtTime(v,w+dur);g.gain.linearRampToValueAtTime(.0001,w+dur+.6);g.connect(SC);
  const r=AC.createGain();r.gain.value=.5;g.connect(r);r.connect(REV);const lp=filt('lowpass',f0,.7,g);lp.frequency.setValueAtTime(f0,w);lp.frequency.exponentialRampToValueAtTime(f1,w+dur);
  notes.forEach(n=>{[-9,9].forEach(dt=>{const o=osc('sawtooth',mf(n),w,dur+.7,lp);o.detune.value=dt;})});},
 stab(w,notes,v=.07){const g=env(w,.003,v,.4,OUT,.45);const lp=filt('lowpass',3200,.8,g);notes.forEach(n=>{[-7,7].forEach(dt=>{const o=osc('sawtooth',mf(n+12),w,.55,lp);o.detune.value=dt;})});},
 bell(w,n,v=.05){const f=mf(n);const g=env(w,.002,v,1.4,OUT,.5,.4);const c=osc('sine',f,w,1.6,g);const m=AC.createOscillator();m.frequency.value=f*3.5;const mg=AC.createGain();mg.gain.setValueAtTime(f*2,w);mg.gain.exponentialRampToValueAtTime(f*.05,w+.6);m.connect(mg);mg.connect(c.frequency);m.start(w);m.stop(w+1.7);},
 chip(w,n,v=.03){const g=env(w,.002,v,.1);osc('square',mf(n),w,.13,filt('lowpass',4000,0,g));},
 tick(w,f=1500,v=.06){const g=env(w,.001,v,.06);const o=osc('sine',f,w,.08,g);o.frequency.exponentialRampToValueAtTime(f*.6,w+.05);},
 ting(w,v=.06){[2637,3951,5274].forEach((f,i)=>{const g=env(w,.001,v/(i+1),1.4,OUT,.5);osc('sine',f,w,1.5,g);});},
 sparkle(w,v=.035){[84,88,91,96,100].forEach((n,i)=>{const g=env(w+i*.045,.002,v,.5,OUT,.5,.3);osc('sine',mf(n),w+i*.045,.55,g);});},
 shutter(w,v=.1){const g=env(w,.001,v,.035);noise(w,.05,filt('bandpass',4200,1.5,g));const g2=env(w+.04,.001,v*.6,.03);noise(w+.04,.05,filt('bandpass',3000,1.5,g2));},
 whoosh(w,dur=.5,v=.16,rev=false){const g=AC.createGain();g.gain.setValueAtTime(.0001,w);g.gain.linearRampToValueAtTime(v,w+dur*(rev?.9:.4));g.gain.linearRampToValueAtTime(.0001,w+dur);g.connect(OUT);
  const r=AC.createGain();r.gain.value=.35;g.connect(r);r.connect(REV);const bp=filt('bandpass',rev?5000:400,1.2,g);bp.frequency.setValueAtTime(rev?5000:400,w);bp.frequency.exponentialRampToValueAtTime(rev?400:5000,w+dur);noise(w,dur,bp);},
 riser(w,dur,v=.12){const g=AC.createGain();g.gain.setValueAtTime(.0001,w);g.gain.exponentialRampToValueAtTime(v,w+dur);g.gain.linearRampToValueAtTime(.0001,w+dur+.02);g.connect(OUT);
  const hp=filt('highpass',400,1,g);hp.frequency.setValueAtTime(400,w);hp.frequency.exponentialRampToValueAtTime(7000,w+dur);noise(w,dur,hp);
  const h=AC.createGain();h.gain.value=.25;const lp=filt('lowpass',800,5,g);h.connect(lp);lp.frequency.setValueAtTime(800,w);lp.frequency.exponentialRampToValueAtTime(5000,w+dur);const o=osc('sawtooth',87,w,dur,h);o.frequency.exponentialRampToValueAtTime(698,w+dur);},
 boom(w,v=.75){const g=env(w,.01,v,1.6);const o=osc('sine',68,w,1.7,g);o.frequency.exponentialRampToValueAtTime(28,w+1.4);const c=env(w,.004,.13,2,OUT,.7);noise(w,2.1,filt('highpass',5000,0,c));},
 tapestop(w,dur=.45,v=.16){const g=env(w,.005,v,dur);const o=osc('sawtooth',mf(65),w,dur,filt('lowpass',1500,0,g));o.frequency.exponentialRampToValueAtTime(40,w+dur);const o2=osc('sine',mf(41),w,dur,g);o2.frequency.exponentialRampToValueAtTime(20,w+dur);},
};
function buildCues(){const c=[];const add=(t,f)=>{if(t>=0&&t<60)c.push([t,f])};
 for(let n=0;n<NB;n++){const b=BS(n),ci=CHIDX(n),chd=CH[ci],rt=ROOT[ci];if(b>=60)break;
  const brk=n>=25&&n<=27, intro=n<=3, fin=n>=30;
  // pads
  if(!fin)add(b,w=>I.pad(w,chd,BAR,intro?.02:brk?.034:.02,intro?400+n*350:brk?900+(n-25)*900:1600,intro?800+n*400:brk?1800+(n-25)*1200:1600));
  // house piano stabs
  if(!fin)PIANO.forEach(s=>add(b+s*ST,w=>I.piano(w,chd.slice(1).map(x=>x+12),intro?.022:brk?.034:.03,intro?900+n*700:brk?3000:4200,brk?.5:.25)));
  // vocal chop hook
  if(n>=2&&!fin&&n!==3)HOOK[ci].forEach(([s,nn])=>add(b+s*ST,w=>I.chop(w,nn,n<4?.035:brk?.05:.06,brk?.5:.25)));
  // drums and bass
  if(GROOVE(n)){
   for(let k=0;k<4;k++){add(b+k*BT,w=>I.kick(w));add(b+k*BT+BT/2,w=>I.ohat(w));}
   [1,3].forEach(k=>add(b+k*BT,w=>I.clap(w)));
   for(let s=0;s<16;s++)add(b+s*ST+(s%2?.018:0),(ss=>w=>I.shk(w,ss%4===2?.035:.02))(s));
   [2,6,10,14].forEach((s,i)=>add(b+s*ST,w=>I.bass(w,rt+(i===3&&ci===0?12:0))));add(b+7*ST,w=>I.bass(w,rt+12,.1,.2));
   if(n%4===3)for(let k=0;k<4;k++)add(b+3*BT+k*ST,(kk=>w=>I.snare(w,.06+kk*.03))(k));
   if(n>=20&&n<=22)[1,5,9,13].forEach(s=>add(b+s*ST,w=>I.snare(w,.035)));}
  if(n===1||n===2)for(let s=0;s<16;s++)add(b+s*ST+(s%2?.018:0),w=>I.shk(w,.018+n*.004));
  if(n===2)[2,6,10,14].forEach(s=>add(b+s*ST,w=>I.ohat(w,.035)));
  if(n===26)for(let k=0;k<4;k++)add(b+k*BT,w=>I.kick(w,.35));
 }
 // bar 3 (5.28-7.2): slams on every beat into the drop
 [5.28,5.76,6.24,6.72].forEach((t,i)=>add(t,w=>{I.kick(w);I.stab(w,CH[3],.06);I.bass(w,ROOT[3]+(i===3?5:0),.3,.34);I.clap(w,.18);}));
 add(0.1,w=>I.sparkle(w,.03));add(5.28,w=>I.riser(w,1.9,.12));for(let k=0;k<8;k++)add(6.72+k*.055,(kk=>w=>I.snare(w,.05+kk*.02))(k));add(6.75,w=>I.whoosh(w,.45,.17,true));
 add(7.2,w=>{I.boom(w);I.sparkle(w,.05);I.stab(w,CH[0],.06)});
 // pixel scene chiptune 26.4-28.8
 [65,68,72,77,72,68,65,68,72,77,80,77,72,77,80,84,80,77,84,89].forEach((n,i)=>add(26.4+i*ST,w=>I.chip(w,n)));
 // CAD tings and counter ticks
 add(28.8,w=>I.ting(w));add(31.2,w=>I.ting(w,.05));for(let k=0;k<22;k++){const tt=31.4+1.3*(1-Math.pow(1-k/22,3));add(tt,(kk=>w=>I.tick(w,1200+kk*40,.03))(k));}
 // montage shutters
 for(let k=0;k<20;k++)add(38.4+k*.24,w=>I.shutter(w));
 // stack it accents
 [43.2,43.68,44.16,44.64].forEach((t,i)=>add(t,w=>I.stab(w,CH[i],.055)));
 // break 47.52-53.28
 add(46.6,w=>I.riser(w,.9,.08));add(47.3,w=>I.tapestop(w));add(47.52,w=>I.sparkle(w,.045));add(49.9,w=>I.ting(w,.06));
 add(51.36,w=>I.riser(w,1.9,.14));for(let k=0;k<16;k++)add(52.32+k*.06,(kk=>w=>I.snare(w,.04+kk*.012))(k));add(52.8,w=>I.whoosh(w,.48,.2,true));
 add(53.28,w=>{I.boom(w,.85);I.sparkle(w,.06);I.stab(w,CH[0],.07)});
 // finale 57.12
 add(57.12,w=>{I.boom(w,.7);I.kick(w);I.stab(w,CH[0],.08);I.pad(w,CH[0],2.2,.035,1800,700);I.bass(w,ROOT[0],1.2,.34);});
 [72,75,77,79,84].forEach((n,i)=>add(57.3+i*.12,w=>I.bell(w,n,.05)));
 // cut whooshes and sticker pops
 (CFG.cuts||[]).forEach(t=>{if([7.2,43.2,53.28].includes(t))return;add(t-.2,w=>I.whoosh(w,.28,.09));});
 Q('.stk,.pill').forEach((e,i)=>{const t=+e.dataset.in;if(t)add(t,w=>I.tick(w,1300+(i%5)*150,.05));});
 return c.sort((a,b)=>a[0]-b[0]);}
window.__reel={full(){},seek(t){render(t);drawGrain();},
 async audio(){const sr=44100,oc=new OfflineAudioContext(2,sr*(D+.2),sr);initAudio(oc);buildCues().forEach(([ct,fn])=>{try{fn(ct)}catch(e){console.error(e)}});
  const b=await oc.startRendering(),n=b.length,L0=b.getChannelData(0),R0=b.getChannelData(1),buf=new DataView(new ArrayBuffer(44+n*4));
  const ws=(o,s)=>{for(let i=0;i<s.length;i++)buf.setUint8(o+i,s.charCodeAt(i))};
  ws(0,'RIFF');buf.setUint32(4,36+n*4,true);ws(8,'WAVEfmt ');buf.setUint32(16,16,true);buf.setUint16(20,1,true);buf.setUint16(22,2,true);buf.setUint32(24,sr,true);buf.setUint32(28,sr*4,true);buf.setUint16(32,4,true);buf.setUint16(34,16,true);ws(36,'data');buf.setUint32(40,n*4,true);
  for(let i=0;i<n;i++){buf.setInt16(44+i*4,cl(L0[i],-1,1)*32767,true);buf.setInt16(46+i*4,cl(R0[i],-1,1)*32767,true);}
  const u=new Uint8Array(buf.buffer);let s='';for(let i=0;i<u.length;i+=32768)s+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(s);}};
render(0);
})();
