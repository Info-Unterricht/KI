/* ===================== Modul 7: Recherche mit KI – Vorteile & Nachteile ===================== */
function renderModule7(mount, App){
  const { el, qs, qsa, addPoints, completeModule, showMap, enableDragDrop, shuffle } = App;

  const factSentences = [
    { id:1, text:"Der Amazonas-Regenwald ist der größte zusammenhängende Regenwald der Erde.", wrong:false },
    { id:2, text:"Er liegt hauptsächlich in Südamerika, vor allem in Brasilien.", wrong:false },
    { id:3, text:"Der Amazonas-Regenwald produziert über 50% des gesamten Sauerstoffs der Erde.", wrong:true,
      explain:"Das ist ein weit verbreiteter Mythos! Tatsächlich trägt der Amazonas nur einen kleinen Teil zum Sauerstoff bei, den wir wirklich nutzen – vieles stammt aus dem Meer. Und da der Wald selbst auch Sauerstoff verbraucht, ist seine echte Bilanz fast ausgeglichen." },
    { id:4, text:"Der Amazonas-Fluss transportiert mehr Wasser als die nächsten sieben größten Flüsse der Welt zusammen.", wrong:false }
  ];

  mount.innerHTML = `
    <div class="mascot-row">
      <div class="mascot-icon">🤖</div>
      <div class="speech-bubble">
        KI kann dir super beim Recherchieren für ein Referat helfen – aber sie liegt nicht immer richtig!
        Lass uns das an einem Beispieltext über den Amazonas-Regenwald prüfen.
      </div>
    </div>

    <div class="card">
      <div class="section-title">🔍 Faktencheck: Finde den erfundenen Satz</div>
      <p class="section-sub">Dieser Text könnte von einer KI geschrieben worden sein. Tippe auf den Satz, der <strong>falsch</strong> ist:</p>
      <div id="fact-sentences"></div>
      <div class="feedback-box" id="fact-fb"></div>
      <div class="nav-row hidden" id="fact-next-row"><span class="spacer"></span><button class="btn-primary" id="fact-next">Weiter →</button></div>
    </div>

    <div class="card" id="procon-card" style="display:none;">
      <div class="section-title">⚖️ Vorteile & Nachteile: KI für die Recherche nutzen</div>
      <p class="section-sub">Sortiere die Aussagen in die richtige Spalte:</p>
      <div class="drag-pool" id="procon-pool"></div>
      <div class="grid-2 drop-zones">
        <div class="drop-zone" data-side="pro"><div class="zone-title">✅ Vorteil</div><div class="dropped"></div></div>
        <div class="drop-zone" data-side="kontra"><div class="zone-title">❌ Nachteil</div><div class="dropped"></div></div>
      </div>
      <div class="feedback-box" id="procon-fb"></div>
    </div>

    <div class="card" id="tips-card" style="display:none;">
      <div class="section-title">✅ So nutzt du KI clever für dein Referat</div>
      <p class="section-sub">Tippe jeden Tipp an, den du verstanden hast:</p>
      <div id="tips-list"></div>
      <div class="feedback-box" id="tips-fb"></div>
    </div>

    <div class="card hidden" id="quiz-card-7">
      <div class="section-title">📝 Kurz-Check</div>
      <div id="quiz-mount-7"></div>
    </div>

    <div class="nav-row hidden" id="finish-row-7">
      <span class="spacer"></span>
      <button class="btn-primary btn-huge" id="btn-finish-m7">Weiter zur Karte 🗺️</button>
    </div>
  `;

  /* ---------- Faktencheck ---------- */
  const factBox = qs("#fact-sentences", mount);
  factSentences.forEach(s=>{
    const d = el(`<div class="choice-btn" data-id="${s.id}">${s.text}</div>`);
    factBox.appendChild(d);
  });
  qsa(".choice-btn", factBox).forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = parseInt(btn.dataset.id);
      const sentence = factSentences.find(s=>s.id===id);
      qsa(".choice-btn", factBox).forEach(b=>b.classList.add("disabled"));
      const fb = qs("#fact-fb", mount);
      const wrongOne = factSentences.find(s=>s.wrong);
      qsa(".choice-btn", factBox).forEach(b=>{
        if(parseInt(b.dataset.id) === wrongOne.id) b.classList.add(sentence.wrong ? "correct" : "wrong");
      });
      if(sentence.wrong){
        fb.className = "feedback-box show ok";
        fb.textContent = "✅ Genau erkannt! " + wrongOne.explain;
        addPoints(15, "Halluzination erkannt");
      } else {
        btn.classList.add("wrong");
        fb.className = "feedback-box show bad";
        fb.textContent = "❌ Das stimmt eigentlich. Der falsche Satz war: „" + wrongOne.text + "“ – " + wrongOne.explain;
      }
      qs("#fact-next-row", mount).classList.remove("hidden");
    }, {once:true});
  });
  qs("#fact-next", mount).addEventListener("click", ()=>{
    qs("#procon-card", mount).style.display = "block";
    qs("#procon-card", mount).scrollIntoView({behavior:"smooth"});
  });

  /* ---------- Pro & Kontra ---------- */
  const proconItems = shuffle([
    {id:"p1", side:"pro", text:"Schnelle erste Übersicht über ein neues Thema"},
    {id:"p2", side:"pro", text:"Gut zum Sammeln von Ideen für ein Referat"},
    {id:"p3", side:"pro", text:"Kann komplizierte Texte einfacher erklären"},
    {id:"p4", side:"pro", text:"Rund um die Uhr verfügbar, auch am Wochenende"},
    {id:"k1", side:"kontra", text:"Kann falsche oder erfundene Informationen liefern"},
    {id:"k2", side:"kontra", text:"Ersetzt nicht das eigene Nachdenken und Verstehen"},
    {id:"k3", side:"kontra", text:"Quellen sind oft nicht klar erkennbar oder prüfbar"},
    {id:"k4", side:"kontra", text:"Kann bei zu starker Nutzung faul beim Lernen machen"}
  ]);
  const proconPool = qs("#procon-pool", mount);
  proconItems.forEach(it=>{
    const d = el(`<div class="drag-item" data-side="${it.side}" style="max-width:230px;">${it.text}</div>`);
    proconPool.appendChild(d);
  });

  let proconCorrect = 0;
  enableDragDrop(mount, (item, zone)=>{
    if(!zone || !zone.dataset.side){ proconPool.appendChild(item); return; }
    const fb = qs("#procon-fb", mount);
    if(zone.dataset.side === item.dataset.side){
      qs(".dropped", zone).appendChild(item);
      item.classList.add("locked-item");
      item.style.opacity = "0.85";
      proconCorrect++;
      addPoints(5, "Richtig einsortiert");
      fb.className = "feedback-box show ok";
      fb.textContent = "✅ Passt!";
      if(proconCorrect === proconItems.length){
        fb.textContent = "🎉 Super einsortiert! Du kennst jetzt die wichtigsten Vor- und Nachteile.";
        qs("#tips-card", mount).style.display = "block";
        renderTips();
        qs("#tips-card", mount).scrollIntoView({behavior:"smooth"});
      }
    } else {
      proconPool.appendChild(item);
      fb.className = "feedback-box show bad";
      fb.textContent = "❌ Das passt eher auf die andere Seite – versuch's nochmal.";
    }
  });

  /* ---------- Tipps-Checkliste ---------- */
  const tips = [
    "Nutze KI nur als Startpunkt, nicht als einzige Quelle",
    "Prüfe wichtige Fakten immer mit einer zweiten, vertrauenswürdigen Quelle",
    "Schreib Ergebnisse in deinen eigenen Worten um",
    "Frag nach, wenn du etwas nicht verstehst",
    "Sag ehrlich, wenn du KI-Hilfe genutzt hast"
  ];
  let tipsChecked = 0;
  function renderTips(){
    const list = qs("#tips-list", mount);
    list.innerHTML = "";
    tips.forEach((t,i)=>{
      const row = el(`<button class="choice-btn" data-checked="0"><span class="icon">☐</span>${t}</button>`);
      row.addEventListener("click", ()=>{
        if(row.dataset.checked === "1") return;
        row.dataset.checked = "1";
        row.querySelector(".icon").textContent = "☑️";
        row.classList.add("correct");
        tipsChecked++;
        if(tipsChecked === tips.length){
          addPoints(15, "Alle Tipps verinnerlicht");
          const fb = qs("#tips-fb", mount);
          fb.className = "feedback-box show ok";
          fb.textContent = "🎉 Stark! Damit bist du bestens für kluge Recherche mit KI vorbereitet.";
          qs("#quiz-card-7", mount).classList.remove("hidden");
          startQuiz7();
        }
      });
      list.appendChild(row);
    });
  }

  function startQuiz7(){
    App.buildQuiz(qs("#quiz-mount-7", mount), {
      pointsPerCorrect: 10,
      questions: [
        {
          q:"Was solltest du tun, wenn eine KI dir ein Fakt für dein Referat nennt?",
          choices:[
            {text:"Den Fakt mit einer zweiten, vertrauenswürdigen Quelle überprüfen.", correct:true},
            {text:"Ihn ungeprüft übernehmen, KI liegt nie falsch.", correct:false},
            {text:"Ihn ignorieren, weil KI grundsätzlich nutzlos ist.", correct:false}
          ]
        },
        {
          q:"Ein guter Einsatz von KI bei der Recherche ist:",
          choices:[
            {text:"Als Startpunkt für Ideen und eine erste Übersicht nutzen.", correct:true},
            {text:"Das komplette Referat wortwörtlich von der KI übernehmen.", correct:false},
            {text:"KI komplett meiden und nie benutzen.", correct:false}
          ]
        },
        {
          q:"Warum ist es wichtig, Ergebnisse in eigenen Worten zu formulieren?",
          choices:[
            {text:"Damit du den Inhalt wirklich verstehst und selbst gelernt hast.", correct:true},
            {text:"Damit der Text länger wird.", correct:false},
            {text:"Das ist nicht wichtig, Kopieren reicht völlig.", correct:false}
          ]
        }
      ],
      onComplete: (result)=>{
        addPoints(result.points, "Kurz-Check bestanden");
        qs("#finish-row-7", mount).classList.remove("hidden");
      }
    });
  }

  qs("#btn-finish-m7", mount).addEventListener("click", ()=>{
    completeModule(7, 20, {label:"Station 7 abgeschlossen"});
    showMap();
  });
}
