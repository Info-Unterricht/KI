/* ===================== Modul 2: Arten von KI & Entscheidungsbäume ===================== */
function renderModule2(mount, App){
  const { el, qs, qsa, addPoints, completeModule, showMap } = App;

  mount.innerHTML = `
    <div class="mascot-row">
      <div class="mascot-icon">🤖</div>
      <div class="speech-bubble">
        Nicht jede KI funktioniert gleich! Manche KIs folgen <strong>festen Regeln</strong> –
        wie ein Flussdiagramm mit Wenn-Dann-Entscheidungen. Das nennt man einen
        <strong>Entscheidungsbaum</strong>. Probier es gleich selbst aus!
      </div>
    </div>

    <div class="card">
      <div class="section-title">🌳 Was ist ein Entscheidungsbaum?</div>
      <p>Ein Entscheidungsbaum besteht aus <strong>Fragen (Knoten)</strong>, die jeweils nur mit
      "Ja" oder "Nein" beantwortet werden. Je nachdem, wie du antwortest, führt dich der Baum über
      einen <strong>Ast</strong> zur nächsten Frage – so lange, bis du bei einem <strong>Ergebnis
      (Blatt)</strong> ankommst, das dir sagt, was zu tun ist.</p>
      <p class="text-dim">Man nennt es "Baum", weil die Fragen sich immer weiter verzweigen –
      genau wie die Äste eines echten Baumes. Ganz oben steht die erste, wichtigste Frage (die
      "Wurzel"), und ganz unten stehen die möglichen Ergebnisse. Eine KI, die so funktioniert,
      muss nicht "nachdenken" – sie arbeitet nur die Fragen der Reihe nach ab, die vorher ein
      Mensch für sie festgelegt hat.</p>
    </div>

    <div class="card">
      <div class="section-title">☂️ Simulation: Der Regenschirm-Entscheidungsbaum</div>
      <p class="section-sub">Beantworte die Fragen – beobachte, wie sich der Baum durch deine Antworten "entscheidet".</p>
      <div class="canvas-wrap" style="position:relative; height: 340px;">
        <svg id="tree-svg" viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%;"></svg>
        <div id="tree-nodes" style="position:absolute; inset:0;"></div>
      </div>
      <div class="card" style="margin-top:1rem; background: var(--bg-1);" id="tree-question-panel"></div>
    </div>

    <div class="card" id="info-card-1" style="display:none;">
      <div class="section-title">🧩 Regelbasierte KI vs. lernende KI</div>
      <div class="grid-2">
        <div class="story-card">
          <div class="story-emoji">🌳</div>
          <div><strong>Regelbasierte KI</strong><br>Eine regelbasierte KI folgt fest programmierten
          Wenn-Dann-Regeln, genau so, wie du es gerade in deinem Regenschirm-Baum ausprobiert hast.
          Das funktioniert gut für klare, einfache Entscheidungen. Sobald aber eine ganz neue,
          unbekannte Situation auftritt, für die es keine passende Regel gibt, ist diese KI
          hilflos – sie kann nicht selbstständig dazulernen.</div>
        </div>
        <div class="story-card">
          <div class="story-emoji">🕸️</div>
          <div><strong>Lernende KI</strong><br>Eine lernende KI erkennt Muster selbstständig, indem
          sie viele Beispieldaten auswertet – genau das machen zum Beispiel neuronale Netze.
          Dadurch ist sie flexibler als eine regelbasierte KI und kommt auch mit unbekannten
          Situationen besser zurecht. Der Nachteil: Sie braucht dafür sehr viele Trainingsdaten.
          Mehr dazu erfährst du in der nächsten Station!</div>
        </div>
      </div>
      <div class="grid-2" style="margin-top:1rem;">
        <div class="story-card">
          <div class="story-emoji">🔧</div>
          <div><strong>Schwache KI</strong> (existiert heute überall)<br>Eine schwache KI ist auf
          genau <em>eine</em> Aufgabe spezialisiert, zum Beispiel Schach spielen, Gesichter
          erkennen oder Sprache übersetzen. Außerhalb dieser einen Aufgabe kann sie nicht
          "mitdenken" – sie versteht nichts anderes.</div>
        </div>
        <div class="story-card">
          <div class="story-emoji">🛸</div>
          <div><strong>Starke KI</strong> (nur Science-Fiction – gibt es noch nicht!)<br>
          Eine starke KI könnte wie ein Mensch über <em>alles</em> nachdenken und jedes beliebige
          Problem verstehen. So eine KI existiert bisher nur in Filmen und Büchern, nicht in der
          echten Welt.</div>
        </div>
      </div>
      <div class="nav-row"><span class="spacer"></span><button class="btn-primary" id="btn-to-example2">Weiter zum nächsten Beispiel →</button></div>
    </div>

    <div class="card" id="example2-card" style="display:none;">
      <div class="section-title">🚦 Beispiel: Die Ampel-KI eines selbstfahrenden Autos</div>
      <p class="section-sub">So könnte ein Entscheidungsbaum aussehen, der einem Auto sagt, ob es bremsen soll:</p>
      <div class="canvas-wrap" style="position:relative; height: 300px;">
        <svg id="tree-svg-2" viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%;"></svg>
        <div id="tree-nodes-2" style="position:absolute; inset:0;"></div>
      </div>
      <div id="reasoning-quiz" style="margin-top:1rem;"></div>
    </div>

    <div class="card hidden" id="quiz-card-2">
      <div class="section-title">📝 Kurz-Check</div>
      <div id="quiz-mount-2"></div>
    </div>

    <div class="nav-row hidden" id="finish-row-2">
      <span class="spacer"></span>
      <button class="btn-primary btn-huge" id="btn-finish-m2">Weiter zur Karte 🗺️</button>
    </div>
  `;

  /* ---------- generischer Baum-Renderer ---------- */
  function drawTree(svgEl, nodesHolder, nodes, edges, activePathIds, activeEdgeKeys){
    svgEl.innerHTML = "";
    edges.forEach(edge=>{
      const from = nodes.find(n=>n.id===edge.from);
      const to = nodes.find(n=>n.id===edge.to);
      const key = edge.from+"-"+edge.to;
      const active = activeEdgeKeys.includes(key);
      const line = document.createElementNS("http://www.w3.org/2000/svg","line");
      line.setAttribute("x1", from.x); line.setAttribute("y1", from.y+4);
      line.setAttribute("x2", to.x); line.setAttribute("y2", to.y-4);
      line.setAttribute("stroke", active ? "#2dd4bf" : "rgba(255,255,255,0.2)");
      line.setAttribute("stroke-width", active ? "1.2" : "0.6");
      svgEl.appendChild(line);

      const midX = (from.x+to.x)/2, midY=(from.y+to.y)/2;
      const label = document.createElementNS("http://www.w3.org/2000/svg","text");
      label.setAttribute("x", midX); label.setAttribute("y", midY);
      label.setAttribute("font-size","3.4");
      label.setAttribute("fill", active ? "#2dd4bf" : "rgba(255,255,255,0.5)");
      label.setAttribute("text-anchor","middle");
      label.textContent = edge.label;
      svgEl.appendChild(label);
    });

    nodesHolder.innerHTML = "";
    nodes.forEach(n=>{
      const active = activePathIds.includes(n.id);
      const box = el(`<div style="
        position:absolute; left:${n.x}%; top:${n.y}%; transform:translate(-50%,-50%);
        width:${n.leaf? 110: 120}px; padding:.4rem .5rem; border-radius:10px; font-size:.72rem; font-weight:700; text-align:center;
        background:${active? (n.leaf? "rgba(74,222,128,0.25)":"rgba(45,212,191,0.25)") : "rgba(255,255,255,0.06)"};
        border:2px solid ${active? (n.leaf? "#4ade80":"#2dd4bf") : "rgba(255,255,255,0.15)"};
        color: ${active? "#eef1ff" : "rgba(255,255,255,0.55)"};
      ">${n.text}</div>`);
      nodesHolder.appendChild(box);
    });
  }

  /* ---------- Baum 1: Regenschirm (interaktiv) ---------- */
  const umbrellaNodes = [
    {id:"root", x:50, y:8,  text:"Regnet es gerade?"},
    {id:"n1",   x:22, y:38, text:"Ist es stark windig?"},
    {id:"n2",   x:78, y:38, text:"Regen später vorhergesagt?"},
    {id:"l1",   x:10, y:76, text:"Drinnen bleiben / Regenjacke ☔🌬️", leaf:true},
    {id:"l2",   x:34, y:76, text:"Schirm mitnehmen! ☂️", leaf:true},
    {id:"l3",   x:66, y:76, text:"Sicherheitshalber Schirm einpacken 🎒", leaf:true},
    {id:"l4",   x:90, y:76, text:"Kein Schirm nötig – viel Spaß! ☀️", leaf:true}
  ];
  const umbrellaEdges = [
    {from:"root", to:"n1", label:"Ja"},
    {from:"root", to:"n2", label:"Nein"},
    {from:"n1", to:"l1", label:"Ja"},
    {from:"n1", to:"l2", label:"Nein"},
    {from:"n2", to:"l3", label:"Ja"},
    {from:"n2", to:"l4", label:"Nein"}
  ];

  let currentNodeId = "root";
  let visitedPath = ["root"];
  let visitedEdges = [];
  let umbrellaDone = false;

  function renderUmbrellaStep(){
    drawTree(qs("#tree-svg", mount), qs("#tree-nodes", mount), umbrellaNodes, umbrellaEdges, visitedPath, visitedEdges);
    const node = umbrellaNodes.find(n=>n.id===currentNodeId);
    const panel = qs("#tree-question-panel", mount);
    if(node.leaf){
      panel.innerHTML = `
        <p style="font-size:1.1rem; font-weight:700;">Ergebnis: ${node.text}</p>
        <button class="btn-secondary" id="btn-retry-tree">🔁 Nochmal mit anderem Wetter probieren</button>
      `;
      qs("#btn-retry-tree", mount).addEventListener("click", ()=>{
        currentNodeId = "root"; visitedPath=["root"]; visitedEdges=[];
        renderUmbrellaStep();
      });
      if(!umbrellaDone){
        umbrellaDone = true;
        addPoints(15, "Entscheidungsbaum durchlaufen");
        setTimeout(()=>{
          qs("#info-card-1", mount).style.display = "block";
        }, 300);
      }
    } else {
      panel.innerHTML = `
        <p style="font-size:1.1rem; font-weight:700;">${node.text}</p>
        <div class="grid-2">
          <button class="btn-primary" id="btn-ja">✅ Ja</button>
          <button class="btn-secondary" id="btn-nein">➖ Nein</button>
        </div>
      `;
      qs("#btn-ja", mount).addEventListener("click", ()=>chooseBranch("Ja"));
      qs("#btn-nein", mount).addEventListener("click", ()=>chooseBranch("Nein"));
    }
  }

  function chooseBranch(label){
    const edge = umbrellaEdges.find(e=>e.from===currentNodeId && e.label===label);
    visitedEdges.push(edge.from+"-"+edge.to);
    currentNodeId = edge.to;
    visitedPath.push(currentNodeId);
    renderUmbrellaStep();
  }
  renderUmbrellaStep();

  /* ---------- Baum 2: Ampel-KI (statisch, als Beispiel) ---------- */
  const trafficNodes = [
    {id:"r", x:50, y:8,  text:"Ist die Ampel rot oder gelb?"},
    {id:"a", x:22, y:38, text:"Fußgänger auf der Straße?"},
    {id:"b", x:78, y:38, text:"Ist genug Abstand zum Bremsen?"},
    {id:"l1", x:10, y:76, text:"Sofort bremsen! 🛑", leaf:true},
    {id:"l2", x:34, y:76, text:"Bremsen einleiten 🛑", leaf:true},
    {id:"l3", x:66, y:76, text:"Normal weiterfahren ✅", leaf:true},
    {id:"l4", x:90, y:76, text:"Weiterfahren, beobachten 👀", leaf:true}
  ];
  const trafficEdges = [
    {from:"r", to:"a", label:"Ja"},
    {from:"r", to:"b", label:"Nein"},
    {from:"a", to:"l1", label:"Ja"},
    {from:"a", to:"l2", label:"Nein"},
    {from:"b", to:"l3", label:"Ja"},
    {from:"b", to:"l4", label:"Nein"}
  ];
  const allTrafficIds = trafficNodes.map(n=>n.id);
  const allTrafficEdgeKeys = trafficEdges.map(e=>e.from+"-"+e.to);

  qs("#btn-to-example2", mount).addEventListener("click", ()=>{
    qs("#example2-card", mount).style.display = "block";
    drawTree(qs("#tree-svg-2", mount), qs("#tree-nodes-2", mount), trafficNodes, trafficEdges, allTrafficIds, allTrafficEdgeKeys);
    startReasoningQuiz();
    qs("#example2-card", mount).scrollIntoView({behavior:"smooth"});
  });

  function startReasoningQuiz(){
    App.buildQuiz(qs("#reasoning-quiz", mount), {
      pointsPerCorrect: 10,
      questions: [
        {
          q:"Warum prüft die Ampel-KI zuerst, ob Fußgänger auf der Straße sind, wenn die Ampel rot/gelb ist?",
          choices:[
            {text:"Weil Sicherheit die höchste Priorität hat – Menschen dürfen nicht gefährdet werden.", correct:true},
            {text:"Weil Fußgänger unwichtig für die Entscheidung sind.", correct:false},
            {text:"Weil das Auto sonst zu schnell fahren würde.", correct:false}
          ],
          explain:"Bei Entscheidungsbäumen wird oft zuerst nach der wichtigsten/sichersten Bedingung gefragt."
        },
        {
          q:"Was passiert, wenn eine Situation eintritt, die im Baum gar nicht vorgesehen wurde (z.B. ein Ball rollt auf die Straße)?",
          choices:[
            {text:"Die regelbasierte KI kann damit gut umgehen, ganz automatisch.", correct:false},
            {text:"Eine rein regelbasierte KI kennt keine Regel dafür – das ist eine Schwäche fester Entscheidungsbäume.", correct:true},
            {text:"Das Auto denkt sich automatisch eine neue, passende Regel aus.", correct:false}
          ],
          explain:"Genau das ist die Grenze regelbasierter Systeme – sie brauchen für jede Situation eine vordefinierte Regel."
        }
      ],
      onComplete: (result)=>{
        addPoints(result.points, "Ampel-KI verstanden");
        startFinalQuiz();
      }
    });
  }

  function startFinalQuiz(){
    qs("#quiz-card-2", mount).classList.remove("hidden");
    App.buildQuiz(qs("#quiz-mount-2", mount), {
      pointsPerCorrect: 10,
      questions: [
        {
          q:"Was ist ein Entscheidungsbaum?",
          choices:[
            {text:"Eine Reihe von Wenn-Dann-Fragen, die zu einer Entscheidung führen.", correct:true},
            {text:"Ein echter Baum, der Entscheidungen trifft.", correct:false},
            {text:"Ein Programm, das nur zufällig entscheidet.", correct:false}
          ]
        },
        {
          q:"'Schwache KI' bedeutet, dass eine KI...",
          choices:[
            {text:"...nur für eine bestimmte Aufgabe gut funktioniert.", correct:true},
            {text:"...schlecht programmiert wurde.", correct:false},
            {text:"...wie ein Mensch über alles nachdenken kann.", correct:false}
          ]
        },
        {
          q:"'Starke KI', die wie ein Mensch denkt und alles versteht...",
          choices:[
            {text:"...gibt es bereits in jedem Smartphone.", correct:false},
            {text:"...existiert bisher nur in Science-Fiction-Filmen.", correct:true},
            {text:"...ist dasselbe wie ein Entscheidungsbaum.", correct:false}
          ]
        }
      ],
      onComplete: (result)=>{
        addPoints(result.points, "Abschluss-Check Modul 2");
        qs("#finish-row-2", mount).classList.remove("hidden");
      }
    });
  }

  qs("#btn-finish-m2", mount).addEventListener("click", ()=>{
    completeModule(2, 20, {label:"Station 2 abgeschlossen"});
    showMap();
  });
}
