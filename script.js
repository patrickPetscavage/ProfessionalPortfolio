(()=>{'use strict';
const toggle=document.querySelector('.theme-toggle');
function syncTheme(){const dark=document.documentElement.dataset.theme==='dark';toggle.setAttribute('aria-pressed',String(dark));toggle.querySelector('.theme-label').textContent=dark?'Day mode':'Night mode';toggle.setAttribute('aria-label',dark?'Switch to day mode':'Switch to night mode');toggle.querySelector('[aria-hidden]').textContent=dark?'☀':'☾';}
if(toggle){syncTheme();toggle.addEventListener('click',()=>{const t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;try{localStorage.setItem('pp-theme',t)}catch{}syncTheme();});window.addEventListener('storage',e=>{if(e.key==='pp-theme'){document.documentElement.dataset.theme=e.newValue==='dark'?'dark':'light';syncTheme();}});}
const menu=document.querySelector('.menu'),links=document.querySelector('#navlinks');
function closeMenu(){links.classList.remove('open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));links.classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();menu.focus();}});
links.addEventListener('click',closeMenu);
window.addEventListener('scroll',()=>document.body.classList.toggle('scrolled',scrollY>20),{passive:true});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if(!reduced.matches&&'IntersectionObserver' in window){document.body.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));}
const canvas=document.getElementById('matrix'),ctx=canvas.getContext('2d');if(!ctx)return;
const fine=matchMedia('(any-pointer: fine)');let w=0,h=0,raf=0,last=0,lastMove=-Infinity,spawnAt=0,px=0,py=0,streams=[];
const chars='01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ';
function resize(){w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);ctx.font='13px ui-monospace, SFMono-Regular, Consolas, monospace';}
function allowed(){return fine.matches&&!reduced.matches;}
function stop(){cancelAnimationFrame(raf);raf=0;streams=[];ctx.clearRect(0,0,w,h);}
function frame(now){const dt=Math.min((now-last)/1000||.016,.04);last=now;ctx.clearRect(0,0,w,h);const active=now-lastMove<110;
if(active&&now-spawnAt>28){spawnAt=now;for(let i=0;i<3&&streams.length<70;i++){const a=Math.random()*Math.PI*2,r=Math.sqrt(Math.random())*165;streams.push({x:px+Math.cos(a)*r,y:py+Math.sin(a)*r-25,age:0,life:.65+Math.random()*.4,speed:22+Math.random()*28,n:3+Math.floor(Math.random()*4),seed:Math.random()*1000});}}
streams=streams.filter(s=>s.age<s.life);
for(const s of streams){s.age+=dt;s.y+=s.speed*dt;const life=Math.sin(Math.PI*Math.min(s.age/s.life,1));for(let j=0;j<s.n;j++){const y=s.y-j*16,dist=Math.hypot(s.x-px,y-py),edge=Math.max(0,1-dist/210);const alpha=life*edge*(1-j/(s.n+1))*.58;if(alpha<.008)continue;ctx.fillStyle=document.documentElement.dataset.theme==='dark'?`rgba(85,210,175,${alpha*1.3})`:`rgba(20,116,101,${alpha})`;ctx.fillText(chars[Math.floor(s.seed+j*13+now/170)%chars.length],s.x,y);}}
if(active||streams.length)raf=requestAnimationFrame(frame);else{raf=0;ctx.clearRect(0,0,w,h);}}
window.addEventListener('pointermove',e=>{if(!allowed()||e.pointerType==='touch')return;px=e.clientX;py=e.clientY;lastMove=performance.now();if(!raf){last=lastMove;raf=requestAnimationFrame(frame);}},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>{lastMove=-Infinity;});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
for(const query of [fine,reduced])query.addEventListener('change',()=>{if(!allowed())stop();});window.addEventListener('resize',resize,{passive:true});resize();
})();
