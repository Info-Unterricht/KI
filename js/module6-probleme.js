/* ===================== Modul 6: Probleme von KI ===================== */
function renderModule6(mount, App){
  const { el, qs, qsa, addPoints, completeModule, showMap } = App;

  const scenarios = [
    { icon:"⚖️", tag:"Vorurteile (Bias)",
      text:"Eine KI zur Auswahl von Bewerber:innen wurde nur mit alten Bewerbungen von Männern trainiert.",
      q:"Was passiert wahrscheinlich, wenn diese KI jetzt eingesetzt wird?",
      choices:[
        {text:"Die KI übernimmt die Vorurteile aus den Trainingsdaten und benachteiligt z.B. Frauen unfair.", correct:true},
        {text:"Die KI wird automatisch fair zu allen Bewerber:innen.", correct:false},
        {text:"Die Trainingsdaten haben keinen Einfluss auf das Ergebnis.", correct:false}
      ],
      explain:"KI lernt aus den Daten, mit denen sie trainiert wurde. Einseitige Daten führen zu einseitigen, unfairen Ergebnissen – das nennt man Bias." },
    { icon:"👻", tag:"Halluzination / Fehler",
      text:"Ein Chatbot behauptet ganz selbstbewusst ein Geschichtsdatum, das komplett erfunden ist.",
      q:"Wie nennt man es, wenn eine KI überzeugend klingende, aber falsche Antworten erfindet?",
      choices:[
        {text:"Eine 'Halluzination' – die KI erfindet Fakten, die falsch sind.", correct:true},
        {text:"Das kann bei KI niemals passieren.", correct:false},
        {text:"Das passiert nur bei sehr alten Computern.", correct:false}
      ],
      explain:"KI-Sprachmodelle erzeugen manchmal Texte, die sich richtig anhören, aber inhaltlich falsch sind – deshalb muss man Antworten immer prüfen." },
    { icon:"🔒", tag:"Datenschutz",
      text:"Eine Spielzeug-App mit KI-Sprachassistent zeichnet alle Gespräche von Kindern auf und speichert sie auf fremden Servern.",
      q:"Warum ist das problematisch?",
      choices:[
        {text:"Weil es unbedenklich ist – Spielzeug darf alles aufnehmen.", correct:false},
        {text:"Weil persönliche Daten wie Stimme und Gespräche geschützt werden sollten.", correct:true},
        {text:"Weil nur Erwachsene Datenschutz brauchen.", correct:false}
      ],
      explain:"Persönliche Daten – auch von Kindern – sollten nicht ungefragt gesammelt und gespeichert werden." },
    { icon:"⚡", tag:"Energieverbrauch",
      text:"Das Training eines großen KI-Modells kann so viel Strom verbrauchen wie hunderte Haushalte in einem ganzen Jahr.",
      q:"Was bedeutet das für die Umwelt?",
      choices:[
        {text:"KI verbraucht überhaupt keine Energie.", correct:false},
        {text:"Große KI-Systeme können sehr viel Energie und Ressourcen benötigen – das belastet die Umwelt.", correct:true},
        {text:"Das betrifft nur winzige Taschenrechner.", correct:false}
      ],
      explain:"Das Training riesiger KI-Modelle braucht enorme Rechenleistung – und damit auch viel Energie." },
    { icon:"🎯", tag:"Abhängigkeit",
      text:"Ein Schüler lässt jede einzelne Matheaufgabe von einer KI lösen, ohne selbst zu rechnen.",
      q:"Welche Gefahr steckt darin?",
      choices:[
        {text:"Keine – man muss ja nichts mehr selbst können.", correct:false},
        {text:"Man kann verlernen, selbst zu denken und eigene Fähigkeiten zu entwickeln.", correct:true},
        {text:"Mathe braucht man im echten Leben sowieso nicht.", correct:false}
      ],
      explain:"KI kann eine gute Hilfe sein – aber wer sich zu sehr auf sie verlässt, trainiert die eigenen Fähigkeiten nicht mehr." }
  ];

  mount.innerHTML = `
    <div class="mascot-row">
      <div class="mascot-icon">🤖</div>
      <div class="speech-bubble">
        KI kann enorm hilfreich sein – aber sie hat auch echte Schwächen und Risiken. Schauen wir uns 5 typische Probleme an einem Beispiel an.
      </div>
    </div>

    <div class="card" id="scenario-card">
      <p class="text-dim" id="scenario-progress"></p>
      <div class="story-card">
        <div class="story-emoji" id="scenario-icon"></div>
        <div>
          <span class="tag" id="scenario-tag"></span>
          <div id="scenario-text" style="margin-top:.4rem; font-weight:600;"></div>
        </div>
      </div>
      <h3 id="scenario-q"></h3>
      <div id="scenario-choices"></div>
      <div class="feedback-box" id="scenario-fb"></div>
      <div class="nav-row"><span class="spacer"></span><button class="btn-primary hidden" id="scenario-next">Weiter →</button></div>
    </div>

    <div class="card" id="recap-card" style="display:none;">
      <div class="section-title">📋 Fünf Probleme von KI im Überblick</div>
      <div class="grid-3">
        <div class="story-card"><div class="story-emoji">⚖️</div><div><strong>Vorurteile (Bias)</strong><br>Übernimmt unfaire Muster aus Trainingsdaten.</div></div>
        <div class="story-card"><div class="story-emoji">👻</div><div><strong>Halluzinationen</strong><br>Erfindet überzeugend klingende, falsche Antworten.</div></div>
        <div class="story-card"><div class="story-emoji">🔒</div><div><strong>Datenschutz</strong><br>Sammelt & speichert oft persönliche Daten.</div></div>
        <div class="story-card"><div class="story-emoji">⚡</div><div><strong>Energieverbrauch</strong><br>Training großer Modelle braucht viel Strom.</div></div>
        <div class="story-card"><div class="story-emoji">🎯</div><div><strong>Abhängigkeit</strong><br>Zu viel Vertrauen kann eigenes Denken schwächen.</div></div>
      </div>
      <div class="nav-row"><span class="spacer"></span><button class="btn-primary" id="btn-to-quiz-6">Weiter zum Kurz-Check →</button></div>
    </div>

    <div class="card hidden" id="quiz-card-6">
      <div class="section-title">📝 Kurz-Check</div>
      <div id="quiz-mount-6"></div>
    </div>

    <div class="nav-row hidden" id="finish-row-6">
      <span class="spacer"></span>
      <button class="btn-primary btn-huge" id="btn-finish-m6">Weiter zur Karte 🗺️</button>
    </div>
  `;

  let idx = 0, correctCount = 0;

  function renderScenario(){
    const s = scenarios[idx];
    qs("#scenario-progress", mount).textContent = `Fall ${idx+1} von ${scenarios.length}`;
    qs("#scenario-icon", mount).textContent = s.icon;
    qs("#scenario-tag", mount).textContent = s.tag;
    qs("#scenario-text", mount).textContent = s.text;
    qs("#scenario-q", mount).textContent = s.q;
    qs("#scenario-fb", mount).className = "feedback-box";
    qs("#scenario-next", mount).classList.add("hidden");

    const box = qs("#scenario-choices", mount);
    box.innerHTML = "";
    App.shuffle(s.choices).forEach(choice=>{
      const btn = el(`<button class="choice-btn">${choice.text}</button>`);
      btn.addEventListener("click", ()=>{
        qsa(".choice-btn", box).forEach(b=>b.classList.add("disabled"));
        const fb = qs("#scenario-fb", mount);
        if(choice.correct){
          btn.classList.add("correct");
          correctCount++;
          addPoints(10, s.tag);
          fb.className = "feedback-box show ok";
          fb.textContent = "✅ Richtig! " + s.explain;
        } else {
          btn.classList.add("wrong");
          const correctText = s.choices.find(c=>c.correct).text;
          qsa(".choice-btn", box).forEach(b=>{ if(b.textContent===correctText) b.classList.add("correct"); });
          fb.className = "feedback-box show bad";
          fb.textContent = "❌ Nicht ganz. " + s.explain;
        }
        qs("#scenario-next", mount).classList.remove("hidden");
      }, {once:true});
      box.appendChild(btn);
    });
  }
  renderScenario();

  qs("#scenario-next", mount).addEventListener("click", ()=>{
    idx++;
    if(idx < scenarios.length){
      renderScenario();
    } else {
      qs("#scenario-card", mount).style.display = "none";
      qs("#recap-card", mount).style.display = "block";
      qs("#recap-card", mount).scrollIntoView({behavior:"smooth"});
    }
  });

  qs("#btn-to-quiz-6", mount).addEventListener("click", ()=>{
    qs("#quiz-card-6", mount).classList.remove("hidden");
    startQuiz6();
    qs("#quiz-card-6", mount).scrollIntoView({behavior:"smooth"});
  });

  function startQuiz6(){
    App.buildQuiz(qs("#quiz-mount-6", mount), {
      pointsPerCorrect: 10,
      questions: [
        {
          q:"Warum sollte man KI-Antworten immer kritisch prüfen?",
          choices:[
            {text:"Weil KI manchmal überzeugend klingende, aber falsche Antworten (Halluzinationen) gibt.", correct:true},
            {text:"Weil KI immer absichtlich lügt.", correct:false},
            {text:"Weil KI-Antworten grundsätzlich nutzlos sind.", correct:false}
          ]
        },
        {
          q:"Woher kommt 'Bias' (Vorurteile) in einer KI meistens?",
          choices:[
            {text:"Aus einseitigen oder unvollständigen Trainingsdaten.", correct:true},
            {text:"KI hat von Geburt an eigene Vorurteile.", correct:false},
            {text:"Bias entsteht nur zufällig, ohne erkennbaren Grund.", correct:false}
          ]
        },
        {
          q:"Was ist ein guter Umgang mit den Grenzen von KI?",
          choices:[
            {text:"KI-Ergebnisse hinterfragen, prüfen und eigene Fähigkeiten weiter trainieren.", correct:true},
            {text:"KI-Ergebnissen immer blind vertrauen.", correct:false},
            {text:"KI komplett meiden, weil sie nur Probleme macht.", correct:false}
          ]
        }
      ],
      onComplete: (result)=>{
        addPoints(result.points, "Kurz-Check bestanden");
        qs("#finish-row-6", mount).classList.remove("hidden");
      }
    });
  }

  qs("#btn-finish-m6", mount).addEventListener("click", ()=>{
    completeModule(6, 20, {label:"Station 6 abgeschlossen"});
    showMap();
  });
}
