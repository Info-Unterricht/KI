/* ===================== Modul 8: Abschluss, Quiz & Zertifikat ===================== */
function renderModule8(mount, App){
  const { el, qs, qsa, addPoints, completeModule, showMap } = App;

  mount.innerHTML = `
    <div class="mascot-row">
      <div class="mascot-icon">🤖</div>
      <div class="speech-bubble">
        Du hast alle Stationen der KI-Forschungsreise gemeistert! Zeig jetzt in einem großen Abschluss-Quiz,
        was du gelernt hast – danach gibt es dein Zertifikat.
      </div>
    </div>

    <div class="card" id="final-quiz-card">
      <div class="section-title">🏁 Großes Abschlussquiz</div>
      <div id="quiz-mount-8"></div>
    </div>

    <div class="card hidden" id="cert-card">
      <div class="section-title">🏆 Herzlichen Glückwunsch!</div>
      <div class="certificate" id="certificate">
        <h2>Zertifikat</h2>
        <p>hiermit wird bestätigt, dass</p>
        <div class="cert-name" id="cert-name">—</div>
        <p>erfolgreich die <strong>KI-Forschungsreise</strong> abgeschlossen hat und nun weiß,<br>
        was Künstliche Intelligenz ist, wie sie lernt, wofür man sie nutzt und wo ihre Grenzen liegen.</p>
        <p id="cert-stats" style="margin-top:.8rem; font-weight:700;"></p>
        <div class="cert-badges" id="cert-badges"></div>
        <p class="text-dim" style="margin-top:1rem; font-size:.8rem;">${new Date().toLocaleDateString("de-DE")}</p>
      </div>
      <div class="nav-row" style="margin-top:1.4rem;">
        <button class="btn-secondary" id="btn-print-cert">🖨️ Zertifikat drucken / als PDF speichern</button>
        <span class="spacer"></span>
      </div>
    </div>
  `;

  App.buildQuiz(qs("#quiz-mount-8", mount), {
    pointsPerCorrect: 10,
    questions: [
      {
        q:"Was macht eine Künstliche Intelligenz im Kern?",
        choices:[
          {text:"Sie erkennt Muster in Daten und trifft daraus Entscheidungen oder Vorhersagen.", correct:true},
          {text:"Sie denkt und fühlt genau wie ein Mensch.", correct:false},
          {text:"Sie folgt immer nur exakt einer einzigen, unveränderlichen Regel.", correct:false}
        ]
      },
      {
        q:"Was ist der Unterschied zwischen regelbasierter und lernender KI?",
        choices:[
          {text:"Regelbasiert folgt festen Wenn-Dann-Regeln, lernende KI erkennt Muster selbst aus Daten.", correct:true},
          {text:"Es gibt keinen Unterschied.", correct:false},
          {text:"Regelbasierte KI kann nur Bilder erkennen.", correct:false}
        ]
      },
      {
        q:"Was passiert in einem einzelnen künstlichen Neuron?",
        choices:[
          {text:"Eingaben werden mit Gewichten multipliziert, summiert und mit einem Schwellenwert verglichen.", correct:true},
          {text:"Es speichert ein komplettes Foto ab.", correct:false},
          {text:"Es trifft zufällige Entscheidungen ohne jede Berechnung.", correct:false}
        ]
      },
      {
        q:"Welche Lernart nutzt Trainingsdaten mit korrekten Lösungen (Labels)?",
        choices:[
          {text:"Überwachtes Lernen", correct:true},
          {text:"Unüberwachtes Lernen", correct:false},
          {text:"Verstärkendes Lernen", correct:false}
        ]
      },
      {
        q:"Welche Lernart lässt eine KI selbst Gruppen in Daten ohne Labels finden?",
        choices:[
          {text:"Überwachtes Lernen", correct:false},
          {text:"Unüberwachtes Lernen", correct:true},
          {text:"Verstärkendes Lernen", correct:false}
        ]
      },
      {
        q:"Welche Lernart funktioniert über Belohnung und Bestrafung durch Ausprobieren?",
        choices:[
          {text:"Überwachtes Lernen", correct:false},
          {text:"Unüberwachtes Lernen", correct:false},
          {text:"Verstärkendes Lernen", correct:true}
        ]
      },
      {
        q:"Was ist eine 'Halluzination' bei einer KI?",
        choices:[
          {text:"Eine überzeugend klingende, aber inhaltlich falsche oder erfundene Antwort.", correct:true},
          {text:"Ein Bild, das die KI sich einbildet zu sehen.", correct:false},
          {text:"Ein technischer Fehler, der den Computer abstürzen lässt.", correct:false}
        ]
      },
      {
        q:"Was ist ein kluger Umgang mit KI bei der Recherche für ein Referat?",
        choices:[
          {text:"KI als Startpunkt nutzen und wichtige Fakten mit einer zweiten Quelle prüfen.", correct:true},
          {text:"Alles wortwörtlich von der KI übernehmen, ohne es zu prüfen.", correct:false},
          {text:"KI-Antworten grundsätzlich ignorieren, egal worum es geht.", correct:false}
        ]
      }
    ],
    onComplete: (result)=>{
      addPoints(result.points, "Abschlussquiz gemeistert");
      showCertificate();
    }
  });

  function showCertificate(){
    completeModule(8, 30, {label:"KI-Forschungsreise abgeschlossen!", big:true});
    qs("#cert-card", mount).classList.remove("hidden");
    qs("#cert-name", mount).textContent = App.state.name || "Forscher:in";
    qs("#cert-stats", mount).textContent = `⭐ ${App.state.points} Punkte gesammelt`;
    qs("#cert-badges", mount).innerHTML = App.state.badges.map(b=>`<span title="${b.name}">${b.icon}</span>`).join(" ");
    qs("#cert-card", mount).scrollIntoView({behavior:"smooth"});
  }

  qs("#btn-print-cert", mount).addEventListener("click", ()=>{
    window.print();
  });
}
