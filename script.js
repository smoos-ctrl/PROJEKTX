// GANZ OBEN IN SCRIPT.JS (Globaler Zustand)
let spielZustand = {
    aktuellerSpieler: 1,
    phase: "auslosung",
    spieler1Name: "",
    spieler2Name: ""
};

//seite vorlesen 
          function ganzeSeiteVorlesen() {
            window.speechSynthesis.cancel();
            // Greift sich den gesamten sichtbaren Text der Seite
            const text = document.body.innerText;
            const sprachAusgabe = new SpeechSynthesisUtterance(text);
            sprachAusgabe.lang = "de-DE";
                // --- DIAGNOSE-LOGIK ---
            // Falls ein Fehler auftritt, gibt uns das Aufschluss
            sprachAusgabe.onerror = function(event) {
            console.error("Sprachausgabe-Fehler detektiert: ", event.error);
            alert("Der Browser verweigert das Vorlesen. Grund: " + event.error);
            };

            // Falls es startet, wissen wir, dass der Code läuft
            sprachAusgabe.onstart = function() {
            console.log("Sprachausgabe erfolgreich gestartet.");
            };
            // -----------------------

            // 4. Stimmen-Check erzwingen (Weckt die Browser-Engine auf)
            window.speechSynthesis.getVoices();

            // 5. Starten
            window.speechSynthesis.speak(sprachAusgabe);
          }
//menuebutton und liste
  const menuButtonMain = document.getElementById("menuButtonMain");
    const listboxmain = document.getElementById("listboxmain");

    menuButtonMain.addEventListener("click",() => {
    if(listboxmain.style.display === "" ||listboxmain.style.display === "none") {
      listboxmain.style.display = "block";
    }
    else {
      listboxmain.style.display = "none";
    }
    });

//linksverknüpfung
// Sucht JEDEN Link (<a href="...">) im Menü auf einmal heraus
document.querySelectorAll("header a, nav a,footer a").forEach(link => {

    // Verpasst JEDEM dieser Links automatisch die Funktion beim Klicken
    link.addEventListener("click", (event) => {
        
        // 1. Verhindert das Laden einer neuen Datei
        event.preventDefault(); 
        
        // 2. Holt sich das Ziel (z.B. "#leistungen") aus dem href des geklickten Links
        const ziel = link.getAttribute("href");
        
        // 3. Schaltet die Seite um (Nutzt die Funktion, die wir schon haben)
        switchPage(ziel); 
    });
  });
// DIESE FUNKTION MUSS IN DEINER SCRIPT.JS STEHEN!
function switchPage(zielId) {
    if (!zielId) return;
    
    // Raute entfernen
    const gesäuberteId = zielId.replace("#", "").toLowerCase();

        // NEU: Das zeigt dir morgen beim Klicken in der F12-Konsole, wonach gesucht wird!
    console.log("Navigiere zu ID:", gesäuberteId); 
    // 1. Alle Seiten verstecken
    document.querySelectorAll(".seite").forEach(seite => {
        seite.classList.remove("aktiv");
    });

    // 2. Gewählte Seite anzeigen
    const zielSeite = document.getElementById(gesäuberteId);
    if (zielSeite) {
        zielSeite.classList.add("aktiv");
    } else {
        // NEU: Falls die ID im HTML fehlt, wirst du sofort gewarnt!
        console.error("FEHLER: Keine Seite mit der ID gefunden:", gesäuberteId);
    }
}

function umschalten(elementId) {
    // 1. Das gewünschte Element anhand der ID finden
    const element = document.getElementById(elementId);
    
    // 2. Prüfen, ob es gerade unsichtbar ist
    if (element.style.display === 'none') {
        // Wenn unsichtbar: wieder anzeigen
        element.style.display = '';
    } else {
        // Wenn sichtbar: unsichtbar machen
        element.style.display = 'none';
    }
}
  document.addEventListener("DOMContentLoaded", () => {
    const selectMenue = document.querySelector("#listboxmain select");
    

    // Reagiert, sobald der Nutzer eine andere Option auswählt
    selectMenue.addEventListener("change", (event) => {
        const zielId = event.target.value; // Holt z.B. "kontakt"

        // 1. Alle Seiten verstecken
        document.querySelectorAll(".seite").forEach(seite => {
            seite.classList.remove("aktiv");
        });

        // 2. Die ausgewählte Seite anzeigen
        const zielSeite = document.getElementById(zielId);
        if (zielSeite) {
            zielSeite.classList.add("aktiv");
        }
    });


//home ist eig index und das bild also kommt hier eig erstmal nichts

//buttonfield

  const zweiButton = document.getElementById("zweibutton");
    const gradeSelect = document.getElementById("grade");
    if (zweiButton && gradeSelect) {
    zweiButton.addEventListener("click", () => {

     if(gradeSelect.style.display === "" ||gradeSelect.style.display === "none") {
      gradeSelect.style.display = "block";
    
            // 2. Optionen nur erstellen, wenn das Feld noch leer ist (verhindert doppelte Einträge!)
            if (gradeSelect.children.length === 0) {


    //const selectElement = document.getElementById('grade anzeige');
              const options1 = ['Sehr gut','Gut','Befriedigend','Ausreichend','Mangelhaft','Ungenügend','out of order'];
              for(let i=0; i<options1.length; i++) {
               const optionElement =document.createElement('option');
      // OPTIONAL ABER EMPFOHLEN: Jeder Option einen Wert (value) zuweisen
                optionElement.value = options1[i];
                const optionText =document.createTextNode(options1[i]);
                optionElement.appendChild(optionText);
                gradeSelect.appendChild(optionElement);
              }   
            }

            else {
              gradeSelect.style.display = "none";
            }
        } 
    })};

//leistungen -siehe function umschalten(id)




//kontakt //datenübertragen und speichern?
// Funktion 1: Wartet auf das Absenden und verknüpft die Speicher-Funktion
document.getElementById('meinKontaktFormular').addEventListener('submit', speichereDatenAlsDatei);

// Wartet, bis das Formular im Browser bereit ist /* 
//document.getElementById('meinKontaktFormular').addEventListener('submit', function(event) {
   // event.preventDefault(); // Stoppt JEDEN Server-Sendeversuch sofort! 
//})
// Funktion 2: Daten lokal als Textdatei auf den PC herunterladen
function speichereDatenAlsDatei(event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite

    // Werte aus dem Formular holen
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const nachricht = document.getElementById('kontaktarea').value;
    const datum = new Date().toLocaleString(); // Zeitstempel erstellen

    // Den Textinhalt für die Datei strukturieren
    const dateiInhalt = `KONTAKTFORMULAR AUSWERTUNG\n===========================\nDatum: ${datum}\nName: ${name}\nNachricht:\n${nachricht}`;

    // Das Blob-Objekt erstellt eine virtuelle Datei im Browser-Speicher
    const blob = new Blob([dateiInhalt], { type: "text/plain;charset=utf-8" });
    
    // Ein unsichtbarer Link wird erstellt, um den Download auszulösen
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `nachricht_${name.replace(/\s+/g, '_')}.txt`; // Dateiname z.B. nachricht_Max.txt
    
    // Klick simulieren und Element wieder löschen
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Formular zurücksetzen
    event.target.reset();
}

//impressum
// Wir packen es in ein DOMContentLoaded, damit JavaScript die Buttons im HTML auch findet!

//spielstart /namen übertragen und speichern
// --- SPIELSTART LOGIK ---
const btnSpielstarten = document.getElementById("spielstarten");
const spieler1Input = document.getElementById("spieler1");
const spieler2Input = document.getElementById("spieler2");
const anzeigeSpieler = document.getElementById("aktueller-spieler");

if (btnSpielstarten && spieler1Input && spieler2Input) {
    btnSpielstarten.addEventListener("click", () => {
        // Prüfen, ob beide Felder ausgefüllt sind
        if (spieler1Input.value.trim() === "" || spieler2Input.value.trim() === "") {
            alert("Bitte geben Sie die Namen beider Spieler ein!");
            return;
        }

        // Namen im Spiel hinterlegen (z.B. in der Anzeige über dem Brett)
        if (anzeigeSpieler) {
            anzeigeSpieler.textContent = spieler1Input.value;
        }

        // Deine switchPage-Funktion nutzen, um zu Seite 7 zu springen
        switchPage("backgammon");
    });
}
//backgammon
//Würfellogik
const btnRoll = document.getElementById("btn-roll");
    const diceResult = document.getElementById("dice-result");
    let aktuellerSpieler = 1; 

    if (btnRoll && diceResult) {
        btnRoll.addEventListener("click", () => {
            const wuerfel1 = Math.floor(Math.random() * 6) + 1;
            const wuerfel2 = Math.floor(Math.random() * 6) + 1;
            diceResult.innerHTML = `<span class="wuerfel">${wuerfel1}</span><span class="wuerfel">${wuerfel2}</span>`;

            if (aktuellerSpieler === 1) {
                aktuellerSpieler = 2;
                if (anzeigeSpieler && spieler2Input) anzeigeSpieler.textContent = spieler2Input.value || "Spieler 2";
            } else {
                aktuellerSpieler = 1;
                if (anzeigeSpieler && spieler1Input) anzeigeSpieler.textContent = spieler1Input.value || "Spieler 1";
            }
        });
    }

    // --- BACKGAMMON SPIELSTEINE-STARTAUFSTELLUNG ---
    
    // 1. Die mathematische Startaufstellung (Zacke: {spieler: 'farbe', anzahl: X})
    const startAufstellung = {
        1:  { spieler: 'weiss', anzahl: 2 },
        6:  { spieler: 'schwarz', anzahl: 5 },
        8:  { spieler: 'schwarz', anzahl: 3 },
        12: { spieler: 'weiss', anzahl: 5 },
        13: { spieler: 'schwarz', anzahl: 5 },
        17: { spieler: 'weiss', anzahl: 3 },
        19: { spieler: 'weiss', anzahl: 5 },
        24: { spieler: 'schwarz', anzahl: 2 }
    };

    // 2. Funktion, die das Brett komplett neu mit Steinen befüllt
    function platziereStartSteine() {
        // Zuerst alle alten Steine von den Zacken löschen, falls vorhanden
        document.querySelectorAll('.point').forEach(zacke => {
            zacke.innerHTML = '';
        });

        // Schleife durch unsere Aufstellungs-Tabelle
        for (const zackeId in startAufstellung) {
            const zackeInfo = startAufstellung[zackeId];
            // Finde die passende Zacke im HTML über das data-point Attribut
            const zackeElement = document.querySelector(`.point[data-point="${zackeId}"]`);

            if (zackeElement) {
                // Erstelle so viele Steine wie definiert
                for (let i = 0; i < zackeInfo.anzahl; i++) {
                    const stein = document.createElement('div');
                    // Der Stein bekommt die allgemeine Klasse 'checker' und seine Farbe
                    stein.className = `checker ${zackeInfo.spieler}`;
                    zackeElement.appendChild(stein);
                }
            }
        }
    }

    // 3. Die Funktion sofort einmal ausführen, damit das Brett beim Laden bereit ist
    platziereStartSteine();

   
// --- DIALOG FENSTER SPIELANLEITUNG ---

    // Elemente aus dem HTML auswählen
    const modal = document.getElementById('rules-modal');
    const openBtn = document.getElementById('open-rules');
    const closeBtn = document.getElementById('close-rules');

    // Nur wenn alle drei Elemente im HTML existieren, aktivieren wir die Klicks
    if (modal && openBtn && closeBtn) {
        // Öffnen
        openBtn.addEventListener('click', () => { modal.showModal(); });
        
        // Schließen über den Button
        closeBtn.addEventListener('click', () => { modal.close(); });

        // NEU: Schließen, wenn man außerhalb auf den Hintergrund klickt
        modal.addEventListener('click', (e) => {
            const dialogDimensions = modal.getBoundingClientRect();
            if (
                e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom
            ) {
                modal.close();
            }
        });
    }

});


//spielende  77highscore
