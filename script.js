(function(){
  const S=window.SITE;
  const $=id=>document.getElementById(id);
  const tabsEl=$("tabs"),cardEl=$("card"),nameEl=$("name"),wishEl=$("wish"),
        dotsEl=$("dots"),avatarEl=$("avatar"),galleryEl=$("gallery"),
        lightEl=$("lightbox"),lightImg=$("lightboxImg");
  let p=0,w=0,timer=null;

  document.title=S.title;
  $("date").textContent=S.date;
  $("title").textContent=S.title;
  $("subtitle").textContent=S.subtitle;
  $("footer").textContent=S.footer;
  $("from").textContent=S.sender;

  S.people.forEach((person,i)=>{
    const b=document.createElement("button");
    b.className="tab";b.type="button";b.setAttribute("role","tab");
    b.textContent=person.tab||person.name;
    b.addEventListener("click",()=>{p=i;w=0;render(true);restart()});
    tabsEl.appendChild(b);
  });

  function renderAvatar(person){
    avatarEl.textContent="";
    if(!person.photo){avatarEl.textContent=person.flower||"🌸";return}
    const img=new Image();
    img.alt=person.name;
    img.onload=()=>{avatarEl.textContent="";avatarEl.appendChild(img)};
    img.onerror=()=>{avatarEl.textContent=person.flower||"🌸"};
    avatarEl.textContent=person.flower||"🌸";
    img.src=person.photo;
  }

  function renderGallery(person){
    galleryEl.textContent="";
    (person.gallery||[]).forEach(src=>{
      const img=new Image();
      img.alt=person.name;
      img.loading="lazy";
      img.onload=()=>galleryEl.appendChild(img);
      img.addEventListener("click",()=>{lightImg.src=src;lightEl.hidden=false});
      img.src=src;
    });
  }

  function renderWish(){
    const list=S.people[p].wishes;
    wishEl.textContent="";
    const s=document.createElement("span");
    s.textContent=list[w];
    wishEl.appendChild(s);
    [...dotsEl.children].forEach((d,i)=>d.classList.toggle("on",i===w));
  }

  function render(animate){
    const person=S.people[p];
    [...tabsEl.children].forEach((t,i)=>t.setAttribute("aria-selected",String(i===p)));
    nameEl.textContent=person.name;
    renderAvatar(person);
    renderGallery(person);
    dotsEl.textContent="";
    person.wishes.forEach((_,i)=>{
      const d=document.createElement("button");
      d.type="button";d.className="dot";d.setAttribute("aria-label","Lời chúc "+(i+1));
      d.addEventListener("click",()=>{w=i;renderWish();restart()});
      dotsEl.appendChild(d);
    });
    if(animate){
      cardEl.style.animation="none";
      void cardEl.offsetWidth;
      cardEl.style.animation="";
    }
    renderWish();
  }

  function step(dir){
    const n=S.people[p].wishes.length;
    w=(w+dir+n)%n;
    renderWish();
  }

  function restart(){
    clearInterval(timer);
    const sec=S.autoPlaySeconds;
    if(sec>0)timer=setInterval(()=>step(1),sec*1000);
  }

  function burst(x,y){
    const icons=["💙","🌸","✨","🌷","💎"];
    for(let i=0;i<7;i++){
      const h=document.createElement("span");
      h.className="heart";
      h.textContent=icons[Math.floor(Math.random()*icons.length)];
      h.style.left=x+"px";h.style.top=y+"px";
      h.style.setProperty("--hx",(Math.random()*140-70)+"px");
      h.style.animationDelay=(i*60)+"ms";
      document.body.appendChild(h);
      setTimeout(()=>h.remove(),1900);
    }
  }

  $("next").addEventListener("click",e=>{step(1);restart();burst(e.clientX,e.clientY)});
  $("prev").addEventListener("click",()=>{step(-1);restart()});
  lightEl.addEventListener("click",()=>{lightEl.hidden=true});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")lightEl.hidden=true});

  const box=$("petals");
  for(let i=0;i<22;i++){
    const el=document.createElement("i");
    el.className="petal";
    const sc=.6+Math.random()*.9;
    el.style.left=(Math.random()*100)+"vw";
    el.style.width=(14*sc)+"px";
    el.style.height=(18*sc)+"px";
    el.style.setProperty("--dx",(Math.random()*160-80)+"px");
    el.style.animationDuration=(9+Math.random()*10)+"s";
    el.style.animationDelay=(-Math.random()*18)+"s";
    box.appendChild(el);
  }

  render(false);
  restart();
})();
