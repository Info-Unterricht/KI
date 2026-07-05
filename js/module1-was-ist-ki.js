/* ===================== Modul 1: Was ist KI? ===================== */
function renderModule1(mount, App){
  const { el, qs, qsa, addPoints, completeModule, showMap } = App;

  const scenarios = [
    { text:"Netflix schlägt dir einen Film vor, weil du ähnliche Filme geschaut hast.", answer:"ki",
      explain:"Die App erkennt Muster in deinem Verhalten – das macht eine KI." },
    { text:"Deine Lehrerin korrigiert deinen Aufsatz und gibt dir Feedback.", answer:"mensch",
      explain:"Hier denkt und urteilt ein Mensch – keine KI im Spiel." },
    { text:"Eine App erkennt auf einem Foto, dass ein Hund abgebildet ist.", answer:"ki",
      explain:"Bilderkennung ist eine typische Aufgabe für KI." },
    { text:"Dein Freund empfiehlt dir ein Buch, weil er weiß, was du magst.", answer:"mensch",
      explain:"Dein Freund kennt dich persönlich – das ist keine KI." },
    { text:"Ein Schachprogramm berechnet in Sekunden den besten nächsten Zug.", answer:"ki",
      explain:"Das Programm berechnet aus Millionen Möglichkeiten – klassische KI." },
    { text:"Ein Sprachassistent wie Siri oder Alexa versteht deine Frage und antwortet.", answer:"ki",
      explain:"Spracherkennung und Antwortgenerierung laufen über KI-Modelle." }
  ];

  let idx = 0, sortCorrect = 0;

  mount.innerHTML = `
    <div class="mascot-row">
      <div class="mascot-icon">🤖</div>
      <div class="speech-bubble">
        Hallo, ich bin Robi! Ich begleite dich auf deiner Forschungsreise durch die Welt der
        <strong>Künstlichen Intelligenz (KI)</strong>. Fangen wir ganz am Anfang an: Was ist eine KI eigentlich?
      </div>
    </div>

    <div class="card">
      <div class="section-title">🧠 Was ist Künstliche Intelligenz?</div>
      <p>Eine <strong>Künstliche Intelligenz (KI)</strong> ist ein Computerprogramm, das darauf trainiert wurde,
      <strong>Muster in Daten zu erkennen</strong> und daraus <strong>Entscheidungen oder Vorhersagen</strong> zu treffen –
      ganz ohne dass ein Mensch jede einzelne Regel von Hand programmiert hat.</p>
      <p class="text-dim">Beispiel: Niemand hat einer Bild-KI gesagt "ein Hund hat vier Beine, Fell und eine Schnauze" –
      sie hat das selbst gelernt, indem sie <strong>tausende Fotos</strong> von Hunden angeschaut hat.</p>
    </div>

    <div class="card" id="sort-game-card">
      <div class="section-title">🕵️ Mini-Spiel: Mensch oder KI?</div>
      <p class="section-sub">Lies die Situation und entscheide: Steckt hier ein Mensch oder eine KI dahinter?</p>
      <p class="text-dim" id="sort-progress">Situation 1 von ${scenarios.length}</p>
      <div class="story-card">
        <div class="story-emoji">❓</div>
        <div id="sort-text" style="font-weight:700; font-size:1.1rem;"></div>
      </div>
      <div class="grid-2" id="sort-buttons">
        <button class="btn-secondary" id="btn-mensch" style="padding:1rem; font-size:1.1rem;">🧑 Mensch</button>
        <button class="btn-primary" id="btn-ki" style="padding:1rem; font-size:1.1rem;">🤖 KI</button>
      </div>
      <div class="feedback-box" id="sort-feedback"></div>
      <div class="nav-row"><span class="spacer"></span><button class="btn-primary hidden" id="sort-next">Weiter →</button></div>
    </div>

    <div class="card hidden" id="quiz-card">
      <div class="section-title">📝 Kurz-Check</div>
      <div id="quiz-mount"></div>
    </div>

    <div class="nav-row hidden" id="finish-row">
      <span class="spacer"></span>
      <button class="btn-primary btn-huge" id="btn-finish-m1">Weiter zur Karte 🗺️</button>
    </div>
  `;

  function renderScenario(){
    qs("#sort-progress", mount).textContent = `Situation ${idx+1} von ${scenarios.length}`;
    qs("#sort-text", mount).textContent = scenarios[idx].text;
    qs("#sort-feedback", mount).className = "feedback-box";
    qs("#sort-next", mount).classList.add("hidden");
    qs("#btn-mensch", mount).disabled = false;
    qs("#btn-ki", mount).disabled = false;
  }
  renderScenario();

  function answer(choice){
    const s = scenarios[idx];
    const fb = qs("#sort-feedback", mount);
    qs("#btn-mensch", mount).disabled = true;
    qs("#btn-ki", mount).disabled = true;
    if(choice === s.answer){
      sortCorrect++;
      fb.className = "feedback-box show ok";
      fb.textContent = "✅ Richtig! " + s.explain;
      addPoints(5, "Mensch oder KI?");
    } else {
      fb.className = "feedback-box show bad";
      fb.textContent = "❌ Nicht ganz. " + s.explain;
    }
    qs("#sort-next", mount).classList.remove("hidden");
  }

  qs("#btn-mensch", mount).addEventListener("click", ()=>answer("mensch"));
  qs("#btn-ki", mount).addEventListener("click", ()=>answer("ki"));
  qs("#sort-next", mount).addEventListener("click", ()=>{
    idx++;
    if(idx < scenarios.length){
      renderScenario();
    } else {
      qs("#sort-game-card", mount).innerHTML = `
        <div class="section-title">🕵️ Mini-Spiel: Mensch oder KI?</div>
        <p>Super gemacht! Du hattest <strong>${sortCorrect} von ${scenarios.length}</strong> richtig.</p>`;
      startQuiz();
    }
  });

  function startQuiz(){
    const quizCard = qs("#quiz-card", mount);
    quizCard.classList.remove("hidden");
    App.buildQuiz(qs("#quiz-mount", mount), {
      pointsPerCorrect: 10,
      questions: [
        {
          q: "Was macht eine KI besonders?",
          choices: [
            {text:"Sie erkennt Muster in Daten und trifft daraus Entscheidungen.", correct:true},
            {text:"Sie befolgt nur Regeln, die exakt so von einem Menschen eingegeben wurden.", correct:false},
            {text:"Sie hat eigene Gefühle wie ein Mensch.", correct:false}
          ],
          explain:"KI lernt aus Daten – sie fühlt nichts und denkt nicht wie ein Mensch."
        },
        {
          q: "Woher 'weiß' eine Bild-KI, wie ein Hund aussieht?",
          choices: [
            {text:"Sie hat viele Beispielbilder von Hunden analysiert und Muster gelernt.", correct:true},
            {text:"Ein Mensch hat jedes Detail eines Hundes einzeln als Regel eingetippt.", correct:false},
            {text:"Sie hat einen echten Hund gesehen und angefasst.", correct:false}
          ],
          explain:"KI lernt aus großen Mengen an Beispieldaten – das nennt man 'trainieren'."
        },
        {
          q: "Welche Aussage stimmt?",
          choices: [
            {text:"Jede App mit 'smart' im Namen ist automatisch eine KI.", correct:false},
            {text:"KI kann nur bei Aufgaben helfen, für die sie trainiert wurde.", correct:true},
            {text:"Eine KI kann alles genauso gut wie ein Mensch.", correct:false}
          ],
          explain:"KI-Systeme sind meist auf bestimmte Aufgaben spezialisiert – das nennt man 'schwache KI'."
        }
      ],
      onComplete: (result)=>{
        addPoints(result.points, "Kurz-Check bestanden");
        qs("#finish-row", mount).classList.remove("hidden");
      }
    });
  }

  qs("#btn-finish-m1", mount).addEventListener("click", ()=>{
    completeModule(1, 20, {label:"Station 1 abgeschlossen"});
    showMap();
  });
}
