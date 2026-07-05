# KI-Forschungsreise 🤖

Eine interaktive, gamifizierte Lernwebsite zum Thema Künstliche Intelligenz für die 5. Klasse
(Gesamtschule), ausgelegt auf **90 Minuten** und optimiert für **iPads im Querformat**.

## Schnellstart

Die Seite ist eine reine HTML/CSS/JS-Anwendung ohne Build-Schritt und ohne Server-Backend.

**Option A – lokaler Server (empfohlen, funktioniert sicher überall):**

```bash
cd ki-lernwebsite
python -m http.server 5173
```

Dann im Browser (auf dem iPad im gleichen WLAN über die IP des Rechners) öffnen:
`http://<IP-des-Rechners>:5173`

**Option B – Datei direkt öffnen:**
`index.html` doppelklicken bzw. auf dem iPad über die Dateien-App/AirDrop öffnen und mit Safari
starten. Funktioniert ebenfalls, da alle Skripte lokale Dateien ohne Serveranfragen sind.

**Auf dem iPad:**
- Safari verwenden, Gerät ins **Querformat** drehen (im Hochformat erscheint ein Hinweis-Screen).
- Optional: über „Teilen → Zum Home-Bildschirm“ hinzufügen für einen Vollbild-App-ähnlichen Start.

## Ablauf (ca. 90 Minuten)

| Station | Thema | ca. Zeit |
|---|---|---|
| Start | Name eingeben, Einstieg | 5 min |
| 1 | Was ist KI? (Mensch-oder-KI-Spiel, Kurz-Check) | 10 min |
| 2 | Arten von KI & Entscheidungsbaum-Simulation | 15 min |
| 3 | Neuronale Netze (Mini-Perzeptron trainieren + große Netz-Animation) | 15 min |
| 4 | Lernarten: überwacht, unüberwacht, verstärkend (3 Teilspiele) | 20 min |
| 5 | KI im Alltag (Sortier-Spiel) | 8 min |
| 6 | Probleme von KI (Szenario-Karten) | 10 min |
| 7 | Recherche mit KI: Vorteile & Nachteile, Faktencheck | 10 min |
| 8 | Abschlussquiz & Zertifikat | 7 min |

Die Kopfleiste zeigt eine laufende Zeit (färbt sich orange nach 90 Minuten) sowie Punkte und
den Fortschritt – rein informativ, es gibt keine harte Zeitsperre. Lernende bewegen sich über
eine Level-Karte (wie in einem Spiel) von Station zu Station; jede Station schaltet erst nach
Abschluss der vorherigen frei.

## Gamification

- **Punkte** für richtige Antworten und abgeschlossene Übungen.
- **Abzeichen** pro abgeschlossener Station (in der Kopfleiste bzw. auf dem Abschluss-Zertifikat sichtbar).
- **Level-Karte** als Fortschrittsanzeige mit gesperrten/freigeschalteten/erledigten Stationen.
- **Zertifikat** am Ende mit Name, Punktzahl und gesammelten Abzeichen (druckbar / als PDF speicherbar
  über den Safari-Freigabedialog beim Drucken).

## Didaktischer Aufbau

Was ist KI? → Arten von KI (regelbasiert vs. lernend, schwach vs. stark) → Neuronale Netze
(wie lernende KI konkret funktioniert) → Lernarten (die drei Trainingsarten) → Nutzung im Alltag
→ Grenzen und Probleme → kritischer Umgang bei der Recherche. Jede Station endet mit einem
Kurz-Check, der das Gelernte direkt anwendet, bevor es weitergeht.

## Technische Hinweise

- Reines Vanilla JavaScript (keine Frameworks, keine Abhängigkeiten, keine Installation nötig).
- Drag & Drop ist über Pointer-Events umgesetzt und funktioniert mit Finger (iPad), Maus und Stift.
- Fortschritt wird nur im Arbeitsspeicher gehalten (kein `localStorage`) – ein Neuladen der Seite
  setzt die Reise zurück. Das ist für eine einmalige 90-Minuten-Unterrichtseinheit meist erwünscht;
  bei Bedarf kann das leicht ergänzt werden.
- Getestet auf typischen iPad-Auflösungen im Querformat (1024×768 und 1194×834 CSS-Pixel).

## Bekannte Limitation

Die Aufgabenstellung wünschte sich u.a. „kurze generierte Videos“. Echte Videogenerierung stand
in dieser Umgebung nicht zur Verfügung. Ersatzweise wurden alle entsprechenden Inhalte als
**animierte, interaktive Simulationen** umgesetzt (Entscheidungsbaum-Animation, Mini-Perzeptron-
Training, große KNN-Signal-Animation, Reinforcement-Learning-Simulation) – didaktisch in der Regel
sogar wirksamer als reine Videos, da die Lernenden aktiv eingreifen statt nur zuzuschauen.
