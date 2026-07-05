/* ===================== Modul 3: Künstliche Neuronale Netze ===================== */
function renderModule3(mount, App){
  const { el, qs, qsa, addPoints, completeModule, showMap } = App;

  mount.innerHTML = `
    <div class="mascot-row">
      <div class="mascot-icon">🤖</div>
      <div class="speech-bubble">
        Manche KIs lernen nicht über feste Regeln, sondern wie ein <strong>Gehirn</strong> –
        mit vielen kleinen "Kunst-Neuronen", die miteinander verbunden sind. Lass uns dein eigenes Mini-Gehirn bauen!
      </div>
    </div>

    <div class="card">
      <div class="section-title">🕸️ Wie funktioniert ein Kunst-Neuron?</div>
      <p>Ein künstliches Neuron bekommt <strong>Eingaben</strong> (z.B. Zahlen), multipliziert sie mit
      <strong>Gewichten</strong> (wie wichtig ist diese Eingabe?), addiert alles auf und vergleicht das Ergebnis
      mit einem <strong>Schwellenwert</strong>. Ist die Summe hoch genug, "feuert" das Neuron – es gibt ein Signal weiter.</p>
    </div>

    <div class="card">
      <div class="section-title">🍕 Trainiere dein Mini-Gehirn: Mag Mia diese Pizza?</div>
      <p class="section-sub">Mia mag <strong>viel Käse</strong>, aber <strong>keine Ananas</strong>. Verstelle die Gewichte und den
      Schwellenwert, bis dein Mini-Neuron bei <strong>allen 5</strong> Beispiel-Pizzen richtig vorhersagt, ob Mia sie mag!</p>

      <div class="canvas-wrap" style="position:relative; height:220px;">
        <svg id="neuron-svg" viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%;"></svg>
        <div id="neuron-nodes" style="position:absolute; inset:0;"></div>
      </div>

      <div class="grid-3" style="margin-top:1rem;">
        <div class="slider-row">
          <label>Gewicht Käse (w1) <span id="w1-val">0.0</span></label>
          <input type="range" id="w1" min="-2" max="2" step="0.1" value="-0.5">
        </div>
        <div class="slider-row">
          <label>Gewicht Ananas (w2) <span id="w2-val">0.0</span></label>
          <input type="range" id="w2" min="-2" max="2" step="0.1" value="1">
        </div>
        <div class="slider-row">
          <label>Schwellenwert <span id="th-val">0</span></label>
          <input type="range" id="th" min="-5" max="10" step="0.5" value="2">
        </div>
      </div>

      <table style="width:100%; border-collapse: collapse; margin-top: .6rem;" id="pizza-table"></table>
      <div class="feedback-box" id="pizza-feedback"></div>
    </div>

    <div class="card" id="bignet-card" style="display:none;">
      <div class="section-title">🧠 So sehen richtig große neuronale Netze aus</div>
      <p class="section-sub">Echte KI-Systeme haben nicht nur ein Neuron, sondern <strong>tausende bis Millionen</strong>,
      angeordnet in mehreren "Schichten" (Layer). Man nennt das <strong>Deep Learning</strong>. Schick ein Signal durch das Netz:</p>
      <div class="canvas-wrap" style="position:relative; height:280px;">
        <svg id="bignet-svg" viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%;"></svg>
        <div id="bignet-nodes" style="position:absolute; inset:0;"></div>
      </div>
      <div class="nav-row">
        <button class="btn-secondary" id="btn-fire-net">▶️ Signal durch das Netz schicken</button>
        <span class="spacer"></span>
      </div>
      <p class="text-dim" style="margin-top:.6rem;">Beim <strong>Training</strong> passt ein Algorithmus (genannt "Backpropagation")
      automatisch <em>alle</em> Gewichte in <em>allen</em> Schichten an – so wie du eben von Hand nur 3 Werte angepasst hast,
      nur viel schneller und für Millionen Werte gleichzeitig!</p>
      <div class="nav-row"><span class="spacer"></span><button class="btn-primary" id="btn-to-quiz-3">Weiter zum Kurz-Check →</button></div>
    </div>

    <div class="card hidden" id="quiz-card-3">
      <div class="section-title">📝 Kurz-Check</div>
      <div id="quiz-mount-3"></div>
    </div>

    <div class="nav-row hidden" id="finish-row-3">
      <span class="spacer"></span>
      <button class="btn-primary btn-huge" id="btn-finish-m3">Weiter zur Karte 🗺️</button>
    </div>
  `;

  /* ---------- Mini-Perzeptron ---------- */
  const examples = [
    {cheese:8, pineapple:1, label:1, name:"Pizza A"},
    {cheese:7, pineapple:8, label:0, name:"Pizza B"},
    {cheese:3, pineapple:0, label:0, name:"Pizza C"},
    {cheese:9, pineapple:2, label:1, name:"Pizza D"},
    {cheese:5, pineapple:6, label:0, name:"Pizza E"}
  ];

  let solvedOnce = false;

  function drawNeuronDiagram(w1, w2){
    const svg = qs("#neuron-svg", mount);
    const holder = qs("#neuron-nodes", mount);
    svg.innerHTML = ""; holder.innerHTML = "";
    const nodes = [
      {id:"i1", x:12, y:25, text:"🧀 Käse", input:true},
      {id:"i2", x:12, y:75, text:"🍍 Ananas", input:true},
      {id:"n",  x:52, y:50, text:"Neuron Σ"},
      {id:"o",  x:88, y:50, text:"Ergebnis", output:true}
    ];
    const edges = [
      {from:"i1", to:"n", w:w1},
      {from:"i2", to:"n", w:w2},
      {from:"n", to:"o", w:1}
    ];
    edges.forEach(e=>{
      const from = nodes.find(n=>n.id===e.from), to = nodes.find(n=>n.id===e.to);
      const line = document.createElementNS("http://www.w3.org/2000/svg","line");
      line.setAttribute("x1", from.x); line.setAttribute("y1", from.y);
      line.setAttribute("x2", to.x); line.setAttribute("y2", to.y);
      line.setAttribute("stroke", e.w >= 0 ? "#2dd4bf" : "#f472b6");
      line.setAttribute("stroke-width", Math.min(4, 0.6+Math.abs(e.w)*1.4));
      svg.appendChild(line);
    });
    nodes.forEach(n=>{
      const box = el(`<div style="position:absolute; left:${n.x}%; top:${n.y}%; transform:translate(-50%,-50%);
        width:80px; padding:.4rem; border-radius:${n.input||n.output? '10px':'50%'}; text-align:center; font-size:.75rem; font-weight:700;
        background: var(--card-light); border:2px solid rgba(255,255,255,0.2); color: var(--text);">${n.text}</div>`);
      holder.appendChild(box);
    });
  }

  function renderTable(){
    const w1 = parseFloat(qs("#w1", mount).value);
    const w2 = parseFloat(qs("#w2", mount).value);
    const th = parseFloat(qs("#th", mount).value);

    qs("#w1-val", mount).textContent = w1.toFixed(1);
    qs("#w2-val", mount).textContent = w2.toFixed(1);
    qs("#th-val", mount).textContent = th.toFixed(1);

    drawNeuronDiagram(w1, w2);

    let correctCount = 0;
    let rows = `<tr style="color:var(--text-dim); text-align:left;">
      <th style="padding:.3rem;">Pizza</th><th>🧀</th><th>🍍</th><th>Summe</th><th>Vorhersage</th><th>Mia mag wirklich</th><th></th>
    </tr>`;
    examples.forEach(ex=>{
      const sum = w1*ex.cheese + w2*ex.pineapple;
      const pred = sum >= th ? 1 : 0;
      const correct = pred === ex.label;
      if(correct) correctCount++;
      rows += `<tr>
        <td style="padding:.3rem;">${ex.name}</td>
        <td>${ex.cheese}</td>
        <td>${ex.pineapple}</td>
        <td>${sum.toFixed(1)}</td>
        <td>${pred===1? "😀 mag" : "🙁 mag nicht"}</td>
        <td>${ex.label===1? "😀 mag" : "🙁 mag nicht"}</td>
        <td style="font-size:1.2rem;">${correct? "✅":"❌"}</td>
      </tr>`;
    });
    qs("#pizza-table", mount).innerHTML = rows;

    const fb = qs("#pizza-feedback", mount);
    if(correctCount === examples.length){
      fb.className = "feedback-box show ok";
      fb.textContent = `🎉 Alle ${examples.length} Pizzen richtig erkannt! Dein Mini-Gehirn ist trainiert.`;
      if(!solvedOnce){
        solvedOnce = true;
        addPoints(25, "Mini-Gehirn erfolgreich trainiert");
        App.confetti(50);
        qs("#bignet-card", mount).style.display = "block";
      }
    } else {
      fb.className = "feedback-box show bad";
      fb.textContent = `${correctCount} von ${examples.length} richtig – verstelle die Regler weiter!`;
    }
  }

  ["w1","w2","th"].forEach(id=>{
    qs("#"+id, mount).addEventListener("input", renderTable);
  });
  renderTable();

  /* ---------- Großes Netz (Animation) ---------- */
  function buildBigNet(){
    const layers = [4, 7, 5, 3];
    const nodes = [];
    layers.forEach((count, li)=>{
      for(let i=0;i<count;i++){
        nodes.push({
          id: `L${li}N${i}`,
          layer: li,
          x: 8 + li*(84/(layers.length-1)),
          y: 10 + i*(80/(count-1 || 1))
        });
      }
    });
    const edges = [];
    for(let li=0; li<layers.length-1; li++){
      const fromNodes = nodes.filter(n=>n.layer===li);
      const toNodes = nodes.filter(n=>n.layer===li+1);
      fromNodes.forEach(f=>{
        toNodes.forEach(t=>{
          edges.push({from:f.id, to:t.id});
        });
      });
    }
    return {nodes, edges};
  }
  const bigNet = buildBigNet();

  function drawBigNet(activeEdges, activeNodes){
    activeEdges = activeEdges || [];
    activeNodes = activeNodes || [];
    const svg = qs("#bignet-svg", mount);
    const holder = qs("#bignet-nodes", mount);
    svg.innerHTML = ""; holder.innerHTML = "";
    bigNet.edges.forEach(e=>{
      const from = bigNet.nodes.find(n=>n.id===e.from);
      const to = bigNet.nodes.find(n=>n.id===e.to);
      const active = activeEdges.includes(e.from+"-"+e.to);
      const line = document.createElementNS("http://www.w3.org/2000/svg","line");
      line.setAttribute("x1", from.x); line.setAttribute("y1", from.y);
      line.setAttribute("x2", to.x); line.setAttribute("y2", to.y);
      line.setAttribute("stroke", active ? "#facc15" : "rgba(255,255,255,0.12)");
      line.setAttribute("stroke-width", active ? "1" : "0.3");
      svg.appendChild(line);
    });
    bigNet.nodes.forEach(n=>{
      const active = activeNodes.includes(n.id);
      const dot = el(`<div style="position:absolute; left:${n.x}%; top:${n.y}%; transform:translate(-50%,-50%);
        width:${active? 16:12}px; height:${active? 16:12}px; border-radius:50%;
        background:${active? "#facc15":"var(--card-light)"};
        box-shadow:${active? "0 0 12px #facc15":"none"};
        border:1px solid rgba(255,255,255,0.25); transition: all .15s;"></div>`);
      holder.appendChild(dot);
    });
  }
  drawBigNet();

  qs("#btn-fire-net", mount).addEventListener("click", ()=>{
    const layers = [0,1,2,3];
    let step = 0;
    const activeNodesSoFar = [];
    const activeEdgesSoFar = [];

    // Startsignal: alle Input-Knoten aktiv
    activeNodesSoFar.push(...bigNet.nodes.filter(n=>n.layer===0).map(n=>n.id));
    drawBigNet(activeEdgesSoFar, activeNodesSoFar);

    function animateLayer(li){
      if(li >= layers.length-1) return;
      const fromIds = bigNet.nodes.filter(n=>n.layer===li).map(n=>n.id);
      const toNodesArr = bigNet.nodes.filter(n=>n.layer===li+1);
      const edgesHere = bigNet.edges.filter(e=> fromIds.includes(e.from) && toNodesArr.some(t=>t.id===e.to));
      activeEdgesSoFar.push(...edgesHere.map(e=>e.from+"-"+e.to));
      setTimeout(()=>{
        activeNodesSoFar.push(...toNodesArr.map(n=>n.id));
        drawBigNet(activeEdgesSoFar, activeNodesSoFar);
        animateLayer(li+1);
      }, 500);
    }
    animateLayer(0);
  });

  qs("#btn-to-quiz-3", mount).addEventListener("click", ()=>{
    qs("#quiz-card-3", mount).classList.remove("hidden");
    startQuiz3();
    qs("#quiz-card-3", mount).scrollIntoView({behavior:"smooth"});
  });

  function startQuiz3(){
    App.buildQuiz(qs("#quiz-mount-3", mount), {
      pointsPerCorrect: 10,
      questions: [
        {
          q:"Was ist ein 'Gewicht' in einem neuronalen Netz?",
          choices:[
            {text:"Eine Zahl, die zeigt, wie wichtig eine Eingabe für das Ergebnis ist.", correct:true},
            {text:"Das physische Gewicht des Computers.", correct:false},
            {text:"Die Anzahl der Neuronen im Netz.", correct:false}
          ],
          explain:"Gewichte bestimmen, wie stark eine Eingabe das Ergebnis beeinflusst."
        },
        {
          q:"Was hast du gemacht, als du die Regler verstellt hast?",
          choices:[
            {text:"Das neuronale Netz 'trainiert', indem du die Gewichte angepasst hast.", correct:true},
            {text:"Die Pizza tatsächlich gebacken.", correct:false},
            {text:"Ein Foto von einer Pizza aufgenommen.", correct:false}
          ],
          explain:"Training bedeutet: Gewichte so anpassen, dass die Vorhersagen stimmen."
        },
        {
          q:"Was bedeutet 'Deep Learning'?",
          choices:[
            {text:"Neuronale Netze mit sehr vielen Schichten und Neuronen.", correct:true},
            {text:"Ein Computer, der besonders tief im Boden vergraben ist.", correct:false},
            {text:"Eine KI, die nur eine einzige Regel befolgt.", correct:false}
          ],
          explain:"'Deep' bezieht sich auf die vielen Schichten (Layer) im Netz."
        }
      ],
      onComplete: (result)=>{
        addPoints(result.points, "Kurz-Check bestanden");
        qs("#finish-row-3", mount).classList.remove("hidden");
      }
    });
  }

  qs("#btn-finish-m3", mount).addEventListener("click", ()=>{
    completeModule(3, 20, {label:"Station 3 abgeschlossen"});
    showMap();
  });
}
