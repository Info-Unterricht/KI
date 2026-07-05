/* ===================== Modul 5: Nutzungsmöglichkeiten von KI ===================== */
function renderModule5(mount, App){
  const { el, qs, qsa, addPoints, completeModule, showMap, enableDragDrop, shuffle } = App;

  const items = shuffle([
    {id:"h1", cat:"zuhause", text:"🧹 Saugroboter findet selbstständig seinen Weg durch die Wohnung"},
    {id:"h2", cat:"zuhause", text:"💡 Sprachassistent steuert per Zuruf das Licht"},
    {id:"s1", cat:"schule", text:"✍️ Rechtschreibprüfung korrigiert deinen Text automatisch"},
    {id:"s2", cat:"schule", text:"📚 Lern-App passt Aufgaben an dein Niveau an"},
    {id:"g1", cat:"gesundheit", text:"🩺 App erkennt verdächtige Hautveränderungen auf Fotos"},
    {id:"g2", cat:"gesundheit", text:"🏥 KI hilft Ärzt:innen, Röntgenbilder auszuwerten"},
    {id:"v1", cat:"verkehr", text:"🗺️ Navi-App berechnet in Echtzeit den schnellsten Weg"},
    {id:"v2", cat:"verkehr", text:"🚗 Autopilot hält selbstständig die Spur auf der Autobahn"},
    {id:"u1", cat:"unterhaltung", text:"🎬 Streaming-Dienst empfiehlt dir passende Serien"},
    {id:"u2", cat:"unterhaltung", text:"🎮 Gegner-KI reagiert im Videospiel auf dein Verhalten"}
  ]);

  const categories = [
    {key:"zuhause", label:"🏠 Zuhause"},
    {key:"schule", label:"🏫 Schule"},
    {key:"gesundheit", label:"🏥 Gesundheit"},
    {key:"verkehr", label:"🚗 Verkehr"},
    {key:"unterhaltung", label:"🎮 Unterhaltung"}
  ];

  mount.innerHTML = `
    <div class="mascot-row">
      <div class="mascot-icon">🤖</div>
      <div class="speech-bubble">
        KI steckt heute in viel mehr Bereichen, als man auf den ersten Blick denkt. Sortiere jede Situation in den passenden Lebensbereich!
      </div>
    </div>

    <div class="card">
      <div class="section-title">🚀 KI im Alltag: Sortier-Spiel</div>
      <div class="drag-pool" id="use-pool"></div>
      <div class="grid-3 drop-zones" id="use-zones" style="grid-template-columns: repeat(5, 1fr);"></div>
      <div class="feedback-box" id="use-feedback"></div>
    </div>

    <div class="card hidden" id="quiz-card-5">
      <div class="section-title">📝 Kurz-Check</div>
      <div id="quiz-mount-5"></div>
    </div>

    <div class="nav-row hidden" id="finish-row-5">
      <span class="spacer"></span>
      <button class="btn-primary btn-huge" id="btn-finish-m5">Weiter zur Karte 🗺️</button>
    </div>
  `;

  const zonesHolder = qs("#use-zones", mount);
  categories.forEach(c=>{
    const z = el(`<div class="drop-zone" data-cat="${c.key}"><div class="zone-title">${c.label}</div><div class="dropped"></div></div>`);
    zonesHolder.appendChild(z);
  });

  const pool = qs("#use-pool", mount);
  items.forEach(it=>{
    const d = el(`<div class="drag-item" data-id="${it.id}" data-cat="${it.cat}" style="max-width:220px;">${it.text}</div>`);
    pool.appendChild(d);
  });

  let correctCount = 0;
  enableDragDrop(mount, (item, zone)=>{
    if(!zone || !zone.dataset.cat){
      pool.appendChild(item);
      return;
    }
    const fb = qs("#use-feedback", mount);
    if(zone.dataset.cat === item.dataset.cat){
      qs(".dropped", zone).appendChild(item);
      item.classList.add("locked-item");
      item.style.opacity = "0.85";
      correctCount++;
      addPoints(5, "Richtig zugeordnet");
      fb.className = "feedback-box show ok";
      fb.textContent = "✅ Passt!";
      if(correctCount === items.length){
        fb.textContent = "🎉 Alle Situationen richtig zugeordnet!";
        qs("#quiz-card-5", mount).classList.remove("hidden");
        startQuiz5();
        qs("#quiz-card-5", mount).scrollIntoView({behavior:"smooth"});
      }
    } else {
      pool.appendChild(item);
      fb.className = "feedback-box show bad";
      fb.textContent = "❌ Das gehört eher in einen anderen Bereich – versuch's nochmal.";
    }
  });

  function startQuiz5(){
    App.buildQuiz(qs("#quiz-mount-5", mount), {
      pointsPerCorrect: 10,
      questions: [
        {
          q:"Warum kann eine KI in der Medizin bei Röntgenbildern helfen?",
          choices:[
            {text:"Sie wurde mit vielen Beispielbildern trainiert, um Muster/Auffälligkeiten zu erkennen.", correct:true},
            {text:"Sie kennt den Patienten persönlich.", correct:false},
            {text:"Sie ersetzt komplett die Ärzt:innen.", correct:false}
          ],
          explain:"KI unterstützt Ärzt:innen als Werkzeug – die Entscheidung trifft weiterhin ein Mensch."
        },
        {
          q:"Was haben ein Saugroboter und ein Navi-System gemeinsam?",
          choices:[
            {text:"Beide nutzen KI, um den besten Weg durch eine Umgebung zu finden.", correct:true},
            {text:"Beide können nur geradeaus fahren.", correct:false},
            {text:"Beide brauchen keine Sensoren.", correct:false}
          ]
        },
        {
          q:"Welche Aussage über KI im Alltag stimmt am besten?",
          choices:[
            {text:"KI ist in vielen unterschiedlichen Bereichen im Einsatz – oft ohne dass wir es merken.", correct:true},
            {text:"KI wird nur in Videospielen verwendet.", correct:false},
            {text:"KI-Nutzung ist neu und kommt in normalen Haushalten noch nicht vor.", correct:false}
          ]
        }
      ],
      onComplete: (result)=>{
        addPoints(result.points, "Kurz-Check bestanden");
        qs("#finish-row-5", mount).classList.remove("hidden");
      }
    });
  }

  qs("#btn-finish-m5", mount).addEventListener("click", ()=>{
    completeModule(5, 20, {label:"Station 5 abgeschlossen"});
    showMap();
  });
}
