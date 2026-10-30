(() => {
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const projects=window.IMPACTORY_PROJECTS||[];
const stage=$('#gallery-stage'),dots=$('#gallery-dots'),viewport=$('#gallery-viewport');
let active=0,mouseX=0,mouseY=0;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const wrap=i=>projects.length?(i+projects.length)%projects.length:0;
const cards=projects.map((p,i)=>{
  const card=document.createElement('button');card.className='project-frame';card.type='button';
  card.setAttribute('aria-label',`Explore ${p.name}`);card.style.setProperty('--project-accent',p.color);
  const logo=p.logo?`<img class="project-logo" src="${p.logo}" alt="" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="project-symbol" hidden>${p.symbol}</span>`:`<span class="project-symbol">${p.symbol}</span>`;
  card.innerHTML=`<span class="frame-outer"><span class="frame-inner"><span class="frame-corner tl"></span><span class="frame-corner tr"></span><span class="frame-corner bl"></span><span class="frame-corner br"></span><span class="frame-index">PROJECT / ${String(i+1).padStart(2,'0')}</span><span class="frame-center">${logo}<strong>${p.name}</strong><small>${p.tag}</small></span><span class="frame-open">ENTER PROJECT ↗</span></span></span>`;
  card.addEventListener('click',()=>{if(active!==i){active=i;render();}else openProject(i)});
  card.addEventListener('pointermove',e=>{if(active!==i||reduce)return;const r=card.getBoundingClientRect();card.style.setProperty('--tilt-y',((e.clientX-r.left)/r.width-.5)*9+'deg');card.style.setProperty('--tilt-x',((.5-(e.clientY-r.top)/r.height)*8)+'deg');});
  card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-y','0deg');card.style.setProperty('--tilt-x','0deg');});
  stage.appendChild(card);
  const dot=document.createElement('button');dot.className='gallery-dot';dot.setAttribute('aria-label',`Show ${p.name}`);dot.addEventListener('click',()=>{active=i;render()});dots.appendChild(dot);
  return card;
});
function render(){cards.forEach((card,i)=>{
  let d=i-active;if(d>projects.length/2)d-=projects.length;if(d< -projects.length/2)d+=projects.length;
  const abs=Math.abs(d);card.style.setProperty('--offset',d);card.style.setProperty('--depth',-abs*155+'px');
  card.style.setProperty('--x',d*66+'%');card.style.setProperty('--rot',-d*13+'deg');card.style.setProperty('--scale',Math.max(.53,1-abs*.17));
  card.style.opacity=abs>3?'0':String(Math.max(.23,1-abs*.22));card.style.zIndex=String(10-abs);
  card.classList.toggle('is-active',d===0);card.tabIndex=abs>2?-1:0;
  dots.children[i].classList.toggle('active',i===active);
});$('#gallery-count').textContent=`${String(active+1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}`;}
function navigate(delta){if(!projects.length)return;active=wrap(active+delta);render()}
$('#prev-project').addEventListener('click',()=>navigate(-1));$('#next-project').addEventListener('click',()=>navigate(1));
viewport.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();navigate(e.key==='ArrowRight'?1:-1)}if(e.key==='Enter')openProject(active)});
let startX=0;viewport.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX},{passive:true});viewport.addEventListener('touchend',e=>{const diff=e.changedTouches[0].clientX-startX;if(Math.abs(diff)>45)navigate(diff<0?1:-1)},{passive:true});
function openProject(i){const p=projects[i];if(!p)return;const modal=$('#project-modal');$('#modal-number').textContent=`PROJECT ${String(i+1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}`;$('#modal-title').textContent=p.name;$('#modal-category').textContent=p.category;$('#modal-description').textContent=p.description;const emblem=$('#modal-emblem');emblem.replaceChildren();if(p.logo){const img=document.createElement('img');img.src=p.logo;img.alt=p.name+' official logo';emblem.appendChild(img)}else{emblem.textContent=p.symbol;emblem.style.color=p.color;}const link=$('#modal-link');link.hidden=!p.url;if(p.url)link.href=p.url;modal.hidden=false;document.body.classList.add('modal-open');$('#modal-close').focus();}
function closeProject(){$('#project-modal').hidden=true;document.body.classList.remove('modal-open');cards[active]?.focus({preventScroll:true})}
$('#modal-close').addEventListener('click',closeProject);$('#project-modal').addEventListener('click',e=>{if(e.target.dataset.close)closeProject()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#project-modal').hidden)closeProject()});
if(projects.length) render(); else $('#gallery-count').textContent='00 / 00';
$('#year').textContent=new Date().getFullYear();
const menu=$('#menu-toggle');menu.addEventListener('click',()=>{const open=document.body.classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open))});$$('nav a').forEach(a=>a.addEventListener('click',()=>{document.body.classList.remove('menu-open');menu.setAttribute('aria-expanded','false')}));
const cursor=$('#cursor');let cx=innerWidth/2,cy=innerHeight/2,tx=cx,ty=cy,lastTrail=0;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
if(fine&&!reduce){document.body.classList.add('custom-cursor');document.addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;cursor.classList.add('visible');const hover=!!e.target.closest('a,button,.skill-card');cursor.classList.toggle('interactive',hover);
  if(performance.now()-lastTrail>40){lastTrail=performance.now();const particle=document.createElement('span');particle.className='cursor-particle';particle.style.left=tx+'px';particle.style.top=ty+'px';document.body.appendChild(particle);particle.addEventListener('animationend',()=>particle.remove());}
});document.addEventListener('pointerdown',e=>{const pulse=document.createElement('span');pulse.className='cursor-pulse';pulse.style.left=e.clientX+'px';pulse.style.top=e.clientY+'px';document.body.appendChild(pulse);pulse.addEventListener('animationend',()=>pulse.remove())});
const animate=()=>{cx+=(tx-cx)*.22;cy+=(ty-cy)*.22;cursor.style.transform=`translate3d(${cx}px,${cy}px,0)`;requestAnimationFrame(animate)};animate();}
const updateProgress=()=>{const max=document.documentElement.scrollHeight-innerHeight;$('#progress').style.transform=`scaleX(${max?scrollY/max:0})`};addEventListener('scroll',updateProgress,{passive:true});updateProgress();
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target)}}),{threshold:.12});$$('.section-heading,.skill-card,.about-content,.about-image,.contact-section').forEach(el=>{el.classList.add('reveal');observer.observe(el)});
})();
