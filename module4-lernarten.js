/* ===================== Modul 4: Lernarten ===================== */
function renderModule4(mount, App){
  const { el, qs, qsa, addPoints, completeModule, showMap, enableDragDrop, shuffle } = App;

  mount.innerHTML = `
    <div class="mascot-row">
      <div class="mascot-icon">🤖</div>
      <div class="speech-bubble">
        Es gibt drei große Wege, wie eine KI lernen kann. Wir probieren alle drei selbst aus!
      </div>
    </div>

    <!-- A: Überwachtes Lernen -->
    <div class="card">
      <div class="section-title">🏷️ 1. Überwachtes Lernen</div>
      <p class="section-sub">Die KI bekommt Beispiele <strong>mit der richtigen Lösung (Label)</strong> und lernt daraus Muster.
      Sortiere die Trainingsbeispiele in die richtigen Körbe – so "erstellst" du Trainingsdaten:</p>
      <div class="drag-pool" id="sup-pool"></div>
      <div class="grid-2 drop-zones">
        <div class="drop-zone" data-label="katze"><div class="zone-title">🐱 Katze</div><div class="dropped"></div></div>
        <div class="drop-zone" data-label="hund"><div class="zone-title">🐶 Hund</div><div class="dropped"></div></div>
      </div>
      <div class="feedback-box" id="sup-feedback"></div>
      <div id="sup-predict" style="display:none; margin-top:1rem;">
        <p class="section-sub">Jetzt bist <strong>du</strong> die trainierte KI! Ordne diese neuen, unbekannten Beispiele ein:</p>
        <div id="sup-predict-mount"></div>
      </div>
    </div>

    <!-- B: Unüberwachtes Lernen -->
    <div class="card" id="unsup-card" style="display:none;">
      <div class="section-title">🔍 2. Unüberwachtes Lernen</div>
      <p class="section-sub">Diesmal gibt es <strong>keine Labels</strong>! Die KI muss selbst Gruppen (Cluster) aus ähnlichen Daten finden.
      Ziehe die Formen in Gruppen, die für dich zusammengehören – wie eine KI, die Ähnlichkeiten entdeckt:</p>
      <div class="drag-pool" id="unsup-pool"></div>
      <div class="grid-3 drop-zones">
        <div class="drop-zone" data-zone="1"><div class="zone-title">Gruppe 1</div><div class="dropped"></div></div>
        <div class="drop-zone" data-zone="2"><div class="zone-title">Gruppe 2</div><div class="dropped"></div></div>
        <div class="drop-zone" data-zone="3"><div class="zone-title">Gruppe 3</div><div class="dropped"></div></div>
      </div>
      <div class="nav-row"><button class="btn-secondary" id="btn-check-clusters">🔎 Prüfen</button><span class="spacer"></span></div>
      <div class="feedback-box" id="unsup-feedback"></div>
    </div>

    <!-- C: Verstärkendes Lernen -->
    <div class="card" id="rl-card" style="display:none;">
      <div class="section-title">🍽️ 3. Verstärkendes Lernen (Reinforcement Learning)</div>
      <p class="section-sub">Die KI soll lernen, welches Tier zu welchem Futter gehört. Am Anfang wählt sie
      komplett <strong>zufällig</strong> aus. Bei einer <strong>richtigen</strong> Fütterung wird die gewählte
      Verbindung <strong>verstärkt</strong> (dicker, grün) – bei einer <strong>falschen</strong> Fütterung wird
      sie <strong>abgeschwächt</strong> (dünner, rot). Sie bekommt also keine Labels vorher, sondern lernt ganz
      allein durch Ausprobieren und die Rückmeldung danach. Klicke auf "Simulation starten" und beobachte, wie
      sich die Verbindungen mit der Zeit verändern! Die Simulation läuft so lange automatisch weiter, bis die
      KI bei <strong>allen vier Tieren</strong> den richtigen Weg zuverlässig gelernt hat (beide Verbindungen grün).</p>

      <div class="rl-layout">
        <div class="rl-controls">
          <div class="card" style="background: var(--bg-1); margin-bottom: 0;">
            <div class="slider-row">
              <label>Tempo <span id="rl-speed-val">1.50s / Schritt</span></label>
              <input type="range" id="rl-speed-slider" min="50" max="1500" step="50" value="1500">
            </div>
            <button class="btn-primary" id="rl-toggle-btn" style="width:100%;">▶️ Simulation starten</button>
          </div>

          <div class="text-dim" style="font-weight:700; margin: .8rem 0 .3rem;">📟 Live-Monitor</div>
          <div class="rl-log" id="rl-log"><span style="color:var(--text-dim);">[System] Bereit. Klicke auf "Simulation starten".</span></div>

          <div class="text-dim" style="margin-top:.6rem; font-size:.85rem;">
            Schritt: <strong id="rl-step-count">0</strong> · ✅ <span id="rl-correct-count">0</span> · ❌ <span id="rl-wrong-count">0</span> · 🟢 gelernt: <span id="rl-learned-count">0</span>/4
          </div>
        </div>

        <div class="canvas-wrap rl-visualization">
          <svg id="rl-net-svg" viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%;"></svg>
          <div id="rl-net-nodes" style="position:absolute; inset:0;"></div>
        </div>
      </div>

      <div class="feedback-box" id="rl-feedback"></div>
    </div>

    <div class="card hidden" id="quiz-card-4">
      <div class="section-title">📝 Kurz-Check</div>
      <div id="quiz-mount-4"></div>
    </div>

    <div class="nav-row hidden" id="finish-row-4">
      <span class="spacer"></span>
      <button class="btn-primary btn-huge" id="btn-finish-m4">Weiter zur Karte 🗺️</button>
    </div>
  `;

  /* ===== A: Überwachtes Lernen ===== */
  const supItems = shuffle([
    {id:"c1", label:"katze", text:"🐾 Whiskas: hat spitze Ohren, schnurrt leise"},
    {id:"c2", label:"katze", text:"🐾 Minka: klettert gerne auf Bäume, miaut"},
    {id:"c3", label:"katze", text:"🐾 Findus: putzt sich ständig selbst mit der Zunge"},
    {id:"d1", label:"hund", text:"🐾 Bello: bellt laut, wedelt mit dem Schwanz"},
    {id:"d2", label:"hund", text:"🐾 Rex: holt den Ball, hechelt"},
    {id:"d3", label:"hund", text:"🐾 Luna: geht an der Leine spazieren, bellt Postboten an"}
  ]);
  let supCorrectCount = 0;

  const supPool = qs("#sup-pool", mount);
  supItems.forEach(it=>{
    const d = el(`<div class="drag-item" data-id="${it.id}" data-label="${it.label}">${it.text}</div>`);
    supPool.appendChild(d);
  });

  enableDragDrop(mount, (item, zone)=>{
    // Überwachtes Lernen: strikte Prüfung
    if(item.dataset.label){
      if(zone && zone.dataset.label){
        if(zone.dataset.label === item.dataset.label){
          qs(".dropped", zone).appendChild(item);
          item.classList.add("locked-item");
          item.style.opacity = "0.85";
          supCorrectCount++;
          addPoints(5, "Richtig einsortiert");
          const fb = qs("#sup-feedback", mount);
          fb.className = "feedback-box show ok";
          fb.textContent = "✅ Passt!";
          if(supCorrectCount === supItems.length){
            fb.textContent = "🎉 Alle Trainingsdaten einsortiert! Jetzt testest du deine trainierte KI.";
            showPredictionRound();
          }
        } else {
          supPool.appendChild(item);
          const fb = qs("#sup-feedback", mount);
          fb.className = "feedback-box show bad";
          fb.textContent = "❌ Das passt nicht so gut – lies die Beschreibung nochmal genau.";
        }
        return;
      }
      // kein Drop-Ziel getroffen -> zurück in den Pool
      if(!item.classList.contains("locked-item")) supPool.appendChild(item);
    } else if(item.dataset.shapeType){
      // Unüberwachtes Lernen: freie Zuordnung, egal welche Gruppe
      if(zone && zone.dataset.zone){
        qs(".dropped", zone).appendChild(item);
      } else {
        qs("#unsup-pool", mount).appendChild(item);
      }
    }
  });

  function showPredictionRound(){
    qs("#sup-predict", mount).style.display = "block";
    const predictItems = [
      {text:"🐾 Simba: schleicht lautlos, jagt einen Wollknäuel", answer:"katze",
        explain:"Schleichen und mit Wollknäueln spielen sind typisches Katzenverhalten – deine KI hat generalisiert!"},
      {text:"🐾 Balu: gräbt im Garten, kommt angerannt wenn man pfeift", answer:"hund",
        explain:"Angerannt kommen und Graben passen eher zum gelernten Hunde-Muster."}
    ];
    let pIdx = 0, pCorrect = 0;
    const pm = qs("#sup-predict-mount", mount);

    function renderPredict(){
      pm.innerHTML = `
        <div class="story-card"><div class="story-emoji">❓</div><div style="font-weight:700;">${predictItems[pIdx].text}</div></div>
        <div class="grid-2">
          <button class="btn-secondary" id="pred-katze">🐱 Katze</button>
          <button class="btn-primary" id="pred-hund">🐶 Hund</button>
        </div>
        <div class="feedback-box" id="pred-fb"></div>
        <div class="nav-row"><span class="spacer"></span><button class="btn-primary hidden" id="pred-next">Weiter →</button></div>
      `;
      qs("#pred-katze", pm).addEventListener("click", ()=>answerPredict("katze"));
      qs("#pred-hund", pm).addEventListener("click", ()=>answerPredict("hund"));
      qs("#pred-next", pm).addEventListener("click", ()=>{
        pIdx++;
        if(pIdx < predictItems.length) renderPredict();
        else {
          pm.innerHTML = `<p>Du hast als "KI" <strong>${pCorrect} von ${predictItems.length}</strong> neuen Fällen richtig vorhergesagt!</p>`;
          addPoints(pCorrect*10, "Vorhersagen als trainierte KI");
          qs("#unsup-card", mount).style.display = "block";
          qs("#unsup-card", mount).scrollIntoView({behavior:"smooth"});
        }
      });
    }
    function answerPredict(choice){
      const item = predictItems[pIdx];
      qs("#pred-katze", pm).disabled = true; qs("#pred-hund", pm).disabled = true;
      const fb = qs("#pred-fb", pm);
      if(choice === item.answer){ pCorrect++; fb.className="feedback-box show ok"; fb.textContent="✅ "+item.explain; }
      else { fb.className="feedback-box show bad"; fb.textContent="❌ "+item.explain; }
      qs("#pred-next", pm).classList.remove("hidden");
    }
    renderPredict();
  }

  /* ===== B: Unüberwachtes Lernen ===== */
  const shapeTypes = [
    {type:"A", emoji:"🔵"}, {type:"B", emoji:"🟩"}, {type:"C", emoji:"🔺"}
  ];
  let unsupPoolItems = [];
  shapeTypes.forEach(st=>{
    for(let i=0;i<3;i++) unsupPoolItems.push({type:st.type, emoji:st.emoji});
  });
  unsupPoolItems = shuffle(unsupPoolItems);
  const unsupPool = qs("#unsup-pool", mount);
  unsupPoolItems.forEach((it,i)=>{
    const d = el(`<div class="drag-item" data-shape-type="${it.type}" style="font-size:1.6rem; padding:.5rem .8rem;">${it.emoji}</div>`);
    unsupPool.appendChild(d);
  });

  qs("#btn-check-clusters", mount).addEventListener("click", ()=>{
    const zones = qsa(".drop-zone", qs("#unsup-card", mount));
    let allUniform = true;
    const typesUsedPerZone = [];
    zones.forEach(z=>{
      const items = qsa(".drag-item", qs(".dropped", z));
      const types = new Set(items.map(i=>i.dataset.shapeType));
      if(types.size > 1) { allUniform = false; z.style.borderColor = "var(--red)"; }
      else { z.style.borderColor = types.size===1 ? "var(--green)" : ""; }
      if(types.size===1) typesUsedPerZone.push([...types][0]);
    });
    const stillInPool = qsa(".drag-item", unsupPool).length;
    const fb = qs("#unsup-feedback", mount);
    if(stillInPool > 0){
      fb.className = "feedback-box show bad";
      fb.textContent = "Es liegen noch Formen im Pool – ziehe alle in eine Gruppe.";
    } else if(allUniform && new Set(typesUsedPerZone).size === 3){
      fb.className = "feedback-box show ok";
      fb.textContent = "🎉 Super! Du hast automatisch die gleichen Formen gruppiert – genau das macht Clustering!";
      if(!renderModule4._unsupDone){
        renderModule4._unsupDone = true;
        addPoints(20, "Cluster erfolgreich gebildet");
        qs("#rl-card", mount).style.display = "block";
      }
    } else {
      fb.className = "feedback-box show bad";
      fb.textContent = "Noch nicht ganz – in mindestens einer Gruppe sind unterschiedliche Formen gemischt (rot markiert).";
    }
  });

  /* ===== C: Verstärkendes Lernen ===== */
  const rlAnimals = ["cat","dog","rabbit","bird"];
  const rlFoods = ["fish","bone","carrot","seed"];
  const rlRules = { cat:"fish", dog:"bone", rabbit:"carrot", bird:"seed" };
  const rlAnimalMeta = { cat:{emoji:"🐱",name:"Katze"}, dog:{emoji:"🐶",name:"Hund"}, rabbit:{emoji:"🐰",name:"Hase"}, bird:{emoji:"🐦",name:"Vogel"} };
  const rlFoodMeta = { fish:{emoji:"🐟",name:"Fisch"}, bone:{emoji:"🦴",name:"Knochen"}, carrot:{emoji:"🥕",name:"Karotte"}, seed:{emoji:"🌻",name:"Samen"} };
  const rlRowY = [12, 37, 63, 88];
  const RL_GREEN_THRESHOLD = 7;

  let rlWeights = {};
  rlAnimals.forEach(a=>{
    rlWeights["start-"+a] = 3;
    rlFoods.forEach(f=>{ rlWeights[a+"-"+f] = 3; });
  });

  const rlNodes = [
    {id:"start", x:6, y:50, label:"Start", type:"start"},
    ...rlAnimals.map((a,i)=>({id:a, x:45, y:rlRowY[i], label:rlAnimalMeta[a].emoji, type:"animal"})),
    ...rlFoods.map((f,i)=>({id:f, x:92, y:rlRowY[i], label:rlFoodMeta[f].emoji, type:"food"}))
  ];
  const rlEdges = [];
  rlAnimals.forEach(a=> rlEdges.push({from:"start", to:a, key:"start-"+a}));
  rlAnimals.forEach(a=> rlFoods.forEach(f=> rlEdges.push({from:a, to:f, key:a+"-"+f})));

  function rlWeightColor(w){
    if(w > RL_GREEN_THRESHOLD) return "var(--green)";
    if(w < 1.5) return "var(--red)";
    return "rgba(255,255,255,0.2)";
  }

  function drawRLNetwork(activeIds){
    activeIds = activeIds || [];
    const svg = qs("#rl-net-svg", mount);
    const holder = qs("#rl-net-nodes", mount);
    svg.innerHTML = ""; holder.innerHTML = "";
    rlEdges.forEach(edge=>{
      const from = rlNodes.find(n=>n.id===edge.from);
      const to = rlNodes.find(n=>n.id===edge.to);
      const w = rlWeights[edge.key];
      const line = document.createElementNS("http://www.w3.org/2000/svg","line");
      line.setAttribute("x1", from.x); line.setAttribute("y1", from.y);
      line.setAttribute("x2", to.x); line.setAttribute("y2", to.y);
      line.setAttribute("stroke", rlWeightColor(w));
      line.setAttribute("stroke-width", Math.max(0.3, w/4));
      line.setAttribute("stroke-linecap", "round");
      svg.appendChild(line);
    });
    rlNodes.forEach(n=>{
      const active = activeIds.includes(n.id);
      const cls = "rl-node" + (n.type==="start" ? " start-node" : "") + (active ? " active" : "");
      const div = el(`<div class="${cls}" style="left:${n.x}%; top:${n.y}%;">${n.label}</div>`);
      holder.appendChild(div);
    });
  }
  drawRLNetwork();

  let rlStepCount = 0, rlCorrectCount = 0, rlWrongCount = 0;
  let rlRunning = false, rlLoop = null, rlInterval = 1500;

  function rlLog(html){ qs("#rl-log", mount).innerHTML = html; }

  function rlIsAnimalLearned(a){
    const startW = rlWeights["start-"+a];
    const pairW = rlWeights[a+"-"+rlRules[a]];
    return startW > RL_GREEN_THRESHOLD && pairW > RL_GREEN_THRESHOLD;
  }
  function rlLearnedCount(){
    return rlAnimals.filter(rlIsAnimalLearned).length;
  }

  function rlUpdateStats(){
    qs("#rl-step-count", mount).textContent = rlStepCount;
    qs("#rl-correct-count", mount).textContent = rlCorrectCount;
    qs("#rl-wrong-count", mount).textContent = rlWrongCount;
    qs("#rl-learned-count", mount).textContent = rlLearnedCount();
  }

  function rlAutonomousStep(){
    rlStepCount++;
    const animal = rlAnimals[Math.floor(Math.random()*rlAnimals.length)];

    const foodScores = rlFoods.map(f=>rlWeights[animal+"-"+f]);
    const sum = foodScores.reduce((a,b)=>a+b, 0);
    let selector = Math.random()*sum;
    let chosenFood = rlFoods[0];
    let running = 0;
    for(let i=0;i<rlFoods.length;i++){
      running += foodScores[i];
      if(selector <= running){ chosenFood = rlFoods[i]; break; }
    }

    const isCorrect = rlRules[animal] === chosenFood;
    const startKey = "start-"+animal, pairKey = animal+"-"+chosenFood;

    if(isCorrect){
      rlCorrectCount++;
      rlWeights[startKey] = Math.min(12, rlWeights[startKey] + 1.5);
      rlWeights[pairKey] = Math.min(12, rlWeights[pairKey] + 3.0);
      rlFoods.forEach(f=>{
        if(f !== chosenFood) rlWeights[animal+"-"+f] = Math.max(0.5, rlWeights[animal+"-"+f] - 1.0);
      });
      rlLog(`[INPUT] : ${rlAnimalMeta[animal].emoji} ${rlAnimalMeta[animal].name}<br>[AKTION]: Gibt ${rlFoodMeta[chosenFood].emoji} ${rlFoodMeta[chosenFood].name}<br><span class="log-success">[STATUS]: Richtig! Belohnung erteilt.</span>`);
    } else {
      rlWrongCount++;
      rlWeights[pairKey] = Math.max(0.5, rlWeights[pairKey] - 2.0);
      rlLog(`[INPUT] : ${rlAnimalMeta[animal].emoji} ${rlAnimalMeta[animal].name}<br>[AKTION]: Gibt ${rlFoodMeta[chosenFood].emoji} ${rlFoodMeta[chosenFood].name}<br><span class="log-error">[STATUS]: Falsch! Pfad abgewertet.</span>`);
    }

    drawRLNetwork(["start", animal, chosenFood]);
    rlUpdateStats();

    if(rlLearnedCount() === rlAnimals.length && !renderModule4._rlDone){
      renderModule4._rlDone = true;
      addPoints(15, "Verstärkendes Lernen beobachtet");
      rlStopSimulation();
      const fb = qs("#rl-feedback", mount);
      fb.className = "feedback-box show ok";
      fb.textContent = "Geschafft! Die KI hat jetzt bei allen vier Tieren die Verbindung zum richtigen Futter deutlich verstärkt (grün) und die falschen abgeschwächt (rot) – genau wie beim echten Reinforcement Learning!";
      qs("#quiz-card-4", mount).classList.remove("hidden");
      startQuiz4();
    }
  }

  function rlStopSimulation(){
    clearInterval(rlLoop);
    rlRunning = false;
    const btn = qs("#rl-toggle-btn", mount);
    btn.textContent = "▶️ Simulation fortsetzen";
    btn.classList.remove("btn-stop");
    btn.classList.add("btn-primary");
  }

  qs("#rl-toggle-btn", mount).addEventListener("click", ()=>{
    const btn = qs("#rl-toggle-btn", mount);
    if(rlRunning){
      rlStopSimulation();
    } else {
      rlRunning = true;
      btn.textContent = "⏸️ Simulation pausieren";
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-stop");
      rlLoop = setInterval(rlAutonomousStep, rlInterval);
    }
  });

  qs("#rl-speed-slider", mount).addEventListener("input", ()=>{
    rlInterval = parseInt(qs("#rl-speed-slider", mount).value);
    qs("#rl-speed-val", mount).textContent = (rlInterval/1000).toFixed(2) + "s / Schritt";
    if(rlRunning){
      clearInterval(rlLoop);
      rlLoop = setInterval(rlAutonomousStep, rlInterval);
    }
  });

  function startQuiz4(){
    App.buildQuiz(qs("#quiz-mount-4", mount), {
      pointsPerCorrect: 10,
      questions: [
        {
          q:"Beim überwachten Lernen bekommt die KI...",
          choices:[
            {text:"Beispiele mit den richtigen Lösungen (Labels).", correct:true},
            {text:"Nur Belohnungen und Bestrafungen, keine Beispiele.", correct:false},
            {text:"Daten komplett ohne jede Rückmeldung.", correct:false}
          ]
        },
        {
          q:"Beim unüberwachten Lernen soll die KI vor allem...",
          choices:[
            {text:"Selbst Muster oder Gruppen in Daten ohne Labels finden.", correct:true},
            {text:"Auswendig lernen, was der Lehrer gesagt hat.", correct:false},
            {text:"Nur eine Regel befolgen, die fest programmiert ist.", correct:false}
          ]
        },
        {
          q:"Verstärkendes Lernen funktioniert durch...",
          choices:[
            {text:"Ausprobieren und Lernen aus Belohnung und Bestrafung.", correct:true},
            {text:"Vorgegebene Labels für jedes Beispiel.", correct:false},
            {text:"Zufällige Entscheidungen, die sich nie verändern.", correct:false}
          ]
        }
      ],
      onComplete: (result)=>{
        addPoints(result.points, "Kurz-Check bestanden");
        qs("#finish-row-4", mount).classList.remove("hidden");
      }
    });
  }

  qs("#btn-finish-m4", mount).addEventListener("click", ()=>{
    completeModule(4, 20, {label:"Station 4 abgeschlossen"});
    showMap();
  });
}
