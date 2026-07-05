/* ===================== KI-Forschungsreise – Kern-App ===================== */
(function(){
  "use strict";

  const TOTAL_MODULES = 8;
  const TARGET_SECONDS = 90*60;

  const state = {
    name: "",
    points: 0,
    badges: [],           // {icon,name}
    moduleStatus: {1:"unlocked",2:"locked",3:"locked",4:"locked",5:"locked",6:"locked",7:"locked",8:"locked"},
    rendered: {},
    startTime: null,
    timerHandle: null
  };

  /* ---------- kleine Helfer ---------- */
  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return Array.from((root||document).querySelectorAll(sel)); }
  function el(html){
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function fmtTime(sec){
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec/3600);
    const m = Math.floor((sec%3600)/60);
    const s = sec%60;
    const mm = (h>0? String(m).padStart(2,"0") : String(m)).padStart(2,"0");
    const ss = String(s).padStart(2,"0");
    return h>0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  }

  /* ---------- Toasts ---------- */
  function showToast(text){
    const layer = qs("#toast-layer");
    const t = el(`<div class="toast">${text}</div>`);
    layer.appendChild(t);
    setTimeout(()=>t.remove(), 3200);
  }

  /* ---------- Konfetti ---------- */
  function confetti(count){
    count = count || 60;
    const colors = ["#2dd4bf","#8b5cf6","#f472b6","#f97316","#facc15","#4ade80"];
    for(let i=0;i<count;i++){
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = Math.random()*100+"vw";
      piece.style.background = colors[Math.floor(Math.random()*colors.length)];
      piece.style.transform = `rotate(${Math.random()*360}deg)`;
      piece.style.borderRadius = Math.random()>0.5 ? "50%" : "2px";
      document.body.appendChild(piece);
      const duration = 1800 + Math.random()*1400;
      const drift = (Math.random()-0.5)*200;
      piece.animate([
        { transform: piece.style.transform + " translate(0,0)", opacity: 1 },
        { transform: `rotate(${Math.random()*720}deg) translate(${drift}px, 100vh)`, opacity: 0.9 }
      ], { duration, easing: "cubic-bezier(.2,.6,.4,1)" });
      setTimeout(()=>piece.remove(), duration+50);
    }
  }

  /* ---------- Punkte & Abzeichen ---------- */
  function addPoints(n, label){
    state.points += n;
    qs("#points-display").textContent = state.points;
    const stat = qs("#stat-points");
    stat.animate([{transform:"scale(1)"},{transform:"scale(1.35)"},{transform:"scale(1)"}], {duration:400});
    showToast(`⭐ +${n} Punkte${label? " – "+label : ""}`);
  }

  function awardBadge(icon, name){
    if(state.badges.some(b=>b.name===name)) return;
    state.badges.push({icon,name});
    showToast(`${icon} Abzeichen freigeschaltet: <strong>${name}</strong>`);
  }

  function updateProgressBar(){
    const done = Object.values(state.moduleStatus).filter(s=>s==="done").length;
    const pct = Math.round(done/TOTAL_MODULES*100);
    let fill = qs("#progress-track .progress-fill");
    if(!fill){
      fill = el(`<div class="progress-fill"></div>`);
      qs("#progress-track").appendChild(fill);
    }
    fill.style.width = pct+"%";
  }

  /* ---------- Navigation ---------- */
  function hideAllViews(){
    qsa(".view").forEach(v=>v.classList.remove("active"));
  }

  function goToModule(id){
    if(state.moduleStatus[id] === "locked"){
      showToast("🔒 Diese Station ist noch gesperrt.");
      return;
    }
    hideAllViews();
    const view = qs("#modul-"+id);
    view.classList.add("active");
    ensureRendered(id);
    window.scrollTo(0,0);
  }

  function showMap(){
    hideAllViews();
    qs("#view-map").classList.add("active");
    renderMap();
  }

  function ensureRendered(id){
    if(state.rendered[id]) return;
    const fnName = "renderModule"+id;
    if(typeof window[fnName] === "function"){
      window[fnName](qs("#modul-"+id+"-content"), App);
      state.rendered[id] = true;
    }
  }

  function completeModule(id, points, opts){
    opts = opts || {};
    const wasDone = state.moduleStatus[id] === "done";
    state.moduleStatus[id] = "done";
    if(!wasDone){
      const view = qs("#modul-"+id);
      addPoints(points || 0, opts.label);
      awardBadge(view.dataset.badge, view.dataset.badgeName);
      confetti(opts.big ? 140 : 60);
      if(state.moduleStatus[id+1] === "locked"){
        state.moduleStatus[id+1] = "unlocked";
      }
      updateProgressBar();
    }
  }

  /* ---------- Level-Karte ---------- */
  const STATIONS = [
    {id:1, x:100,  y:400, icon:"🧠", label:"Was ist KI?"},
    {id:2, x:255,  y:150, icon:"🌳", label:"Arten von KI"},
    {id:3, x:410,  y:400, icon:"🕸️", label:"Neuronale Netze"},
    {id:4, x:565,  y:150, icon:"🎓", label:"Lernarten"},
    {id:5, x:720,  y:400, icon:"🚀", label:"KI im Alltag"},
    {id:6, x:875,  y:150, icon:"⚠️", label:"Probleme"},
    {id:7, x:1030, y:400, icon:"🔍", label:"Recherche"},
    {id:8, x:1150, y:200, icon:"🏆", label:"Abschluss"}
  ];

  function renderMap(){
    const svg = qs("#map-svg");
    const holder = qs("#map-stations");
    svg.innerHTML = "";
    holder.innerHTML = "";

    // Pfad
    let d = "";
    STATIONS.forEach((s,i)=>{
      d += (i===0? `M ${s.x} ${s.y}` : ` L ${s.x} ${s.y}`);
    });
    const path = document.createElementNS("http://www.w3.org/2000/svg","path");
    path.setAttribute("d", d);
    path.setAttribute("fill","none");
    path.setAttribute("stroke","rgba(255,255,255,0.25)");
    path.setAttribute("stroke-width","5");
    path.setAttribute("stroke-dasharray","2 16");
    path.setAttribute("stroke-linecap","round");
    svg.appendChild(path);

    STATIONS.forEach(s=>{
      const status = state.moduleStatus[s.id];
      const div = el(`<div class="station ${status}" style="left:${s.x/1200*100}%; top:${s.y/480*100}%;">
        <span>${s.icon}</span>
        <span class="station-label">${s.label}</span>
      </div>`);
      div.addEventListener("click", ()=>{
        if(status === "locked"){ showToast("🔒 Schließe erst die vorherige Station ab."); return; }
        goToModule(s.id);
      });
      holder.appendChild(div);
    });

    renderBadgesBar();
  }

  function renderBadgesBar(){
    const list = qs("#badges-bar-list");
    list.innerHTML = "";
    STATIONS.forEach(s=>{
      const moduleEl = qs("#modul-"+s.id);
      const icon = moduleEl.dataset.badge;
      const name = moduleEl.dataset.badgeName;
      const earned = state.badges.some(b=>b.name===name);
      const pill = el(`<div class="badge-pill ${earned? "earned":"locked"}">
        <span class="badge-pill-icon">${earned? icon : "❔"}</span>
        <span class="badge-pill-name">${name}</span>
      </div>`);
      list.appendChild(pill);
    });
  }

  /* ---------- Drag & Drop (Pointer-Events, touch-fähig) ---------- */
  function enableDragDrop(container, onDrop){
    let dragEl = null, offsetX = 0, offsetY = 0, placeholder = null;

    container.addEventListener("pointerdown", e=>{
      const item = e.target.closest(".drag-item");
      if(!item || item.classList.contains("locked-item")) return;
      dragEl = item;
      const rect = item.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      item.setPointerCapture(e.pointerId);
      // Platzhalter hält den Platz im Fluss frei, damit das Layout beim Anheben nicht springt
      placeholder = document.createElement("div");
      placeholder.style.width = rect.width+"px";
      placeholder.style.height = rect.height+"px";
      placeholder.style.visibility = "hidden";
      item.parentNode.insertBefore(placeholder, item);
      item.style.position = "fixed";
      item.style.zIndex = 9999;
      item.style.width = rect.width+"px";
      item.style.left = rect.left+"px";
      item.style.top = rect.top+"px";
      item.style.pointerEvents = "none";
      item.classList.add("dragging");
    });

    container.addEventListener("pointermove", e=>{
      if(!dragEl) return;
      dragEl.style.left = (e.clientX-offsetX)+"px";
      dragEl.style.top = (e.clientY-offsetY)+"px";
      qsa(".drop-zone", container).forEach(z=>z.classList.remove("over"));
      const under = document.elementFromPoint(e.clientX, e.clientY);
      const zone = under && under.closest(".drop-zone");
      if(zone) zone.classList.add("over");
    });

    function drop(e){
      if(!dragEl) return;
      const under = document.elementFromPoint(e.clientX, e.clientY);
      const zone = under && under.closest(".drop-zone");
      qsa(".drop-zone", container).forEach(z=>z.classList.remove("over"));
      dragEl.style.position = "";
      dragEl.style.zIndex = "";
      dragEl.style.left = "";
      dragEl.style.top = "";
      dragEl.style.width = "";
      dragEl.style.pointerEvents = "";
      dragEl.classList.remove("dragging");
      if(placeholder){ placeholder.remove(); placeholder = null; }
      const item = dragEl;
      dragEl = null;
      onDrop(item, zone);
    }
    container.addEventListener("pointerup", drop);
    container.addEventListener("pointercancel", drop);
  }

  /* ---------- Wiederverwendbare Quiz-Engine ---------- */
  function buildQuiz(mount, opts){
    const questions = opts.questions;
    const pointsPerCorrect = opts.pointsPerCorrect || 10;
    let idx = 0, correct = 0;

    function renderQuestion(){
      mount.innerHTML = "";
      const q = questions[idx];
      const wrap = el(`<div>
        <p class="text-dim">Frage ${idx+1} von ${questions.length}</p>
        <h3>${q.q}</h3>
        <div class="choices"></div>
        <div class="feedback-box"></div>
        <div class="nav-row"><span class="spacer"></span><button class="btn-primary btn-next hidden">Weiter →</button></div>
      </div>`);
      mount.appendChild(wrap);
      const choicesBox = qs(".choices", wrap);
      const fb = qs(".feedback-box", wrap);
      const nextBtn = qs(".btn-next", wrap);

      shuffle(q.choices.map((c,i)=>({...c,_i:i}))).forEach(choice=>{
        const btn = el(`<button class="choice-btn">${choice.text}</button>`);
        btn.addEventListener("click", ()=>{
          qsa(".choice-btn", choicesBox).forEach(b=>b.classList.add("disabled"));
          if(choice.correct){
            btn.classList.add("correct");
            correct++;
            fb.className = "feedback-box show ok";
            fb.textContent = "✅ Richtig! " + (q.explain||"");
          } else {
            btn.classList.add("wrong");
            fb.className = "feedback-box show bad";
            fb.textContent = "❌ Nicht ganz. " + (q.explain||"");
          }
          // richtige Antwort hervorheben, falls falsch gewählt
          if(!choice.correct){
            const idxCorrectText = q.choices.find(c=>c.correct).text;
            qsa(".choice-btn", choicesBox).forEach(b=>{
              if(b.textContent === idxCorrectText) b.classList.add("correct");
            });
          }
          nextBtn.classList.remove("hidden");
        }, {once:true});
        choicesBox.appendChild(btn);
      });

      nextBtn.addEventListener("click", ()=>{
        idx++;
        if(idx < questions.length){
          renderQuestion();
        } else {
          const pts = correct*pointsPerCorrect;
          mount.innerHTML = `<div class="center">
            <h3>🎉 Quiz beendet!</h3>
            <p>Du hast <strong>${correct} von ${questions.length}</strong> Fragen richtig beantwortet.</p>
          </div>`;
          opts.onComplete && opts.onComplete({correct, total: questions.length, points: pts});
        }
      });
    }
    renderQuestion();
  }

  /* ---------- Timer ---------- */
  function startTimer(){
    state.startTime = Date.now();
    state.timerHandle = setInterval(()=>{
      const elapsed = (Date.now()-state.startTime)/1000;
      const display = qs("#timer-display");
      display.textContent = fmtTime(elapsed);
      const stat = qs("#stat-timer");
      stat.style.color = elapsed > TARGET_SECONDS ? "var(--orange)" : "";
    }, 1000);
  }

  /* ---------- Start der Reise ---------- */
  function startJourney(){
    const nameInput = qs("#player-name");
    state.name = (nameInput.value || "Forscher:in").trim();
    qs("#app-header").classList.remove("hidden");
    startTimer();
    updateProgressBar();
    showMap();
  }

  /* ---------- Öffentliche API ---------- */
  const App = {
    state, qs, qsa, el, shuffle, fmtTime,
    showToast, confetti,
    addPoints, awardBadge,
    goToModule, showMap, completeModule,
    enableDragDrop, buildQuiz,
    TOTAL_MODULES
  };
  window.App = App;

  document.addEventListener("DOMContentLoaded", ()=>{
    qs("#btn-start-journey").addEventListener("click", startJourney);
    qs("#player-name").addEventListener("keydown", e=>{ if(e.key==="Enter") startJourney(); });
    qs("#btn-map-toggle").addEventListener("click", showMap);
  });

})();
