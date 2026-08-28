let uebersetzungen = {}; // Hier landen die JSON-Daten
export let aktuelleSprache = "de"; // Standard

// 1. Funktion, die die passende JSON-Datei vom Server lädt
export async function ladeSprache(sprache) {
  try {
    const response = await fetch(`lang/${sprache}.json`);
    if (!response.ok) throw new Error("Datei lang/${sprache}.json nicht gefunden`");
    uebersetzungen = await response.json();
    aktuelleSprache = sprache;

    //findet alle HTML-ELemente mit`data-i18n` und ersetzt den Text
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (uebersetzungen[key]) {
            element.textContent = uebersetzungen[key];
        };
    });

    //merkt sich die Sprache für den nächsten Besuch
    localStorage.setItem("preferredLanguage", sprache);

    // Ändert den Text auf dem Haupt-Button (z.B. von "DE" zu "EN")
    const btn = document.getElementById("current-lang-btn");
    if (btn) btn.textContent = sprache.toUpperCase();

    console.log(`Sprachdatei [${sprache}] erfolgreich geladen und UI übersetzt, sofern entsprechende Daten im Json-Format vorhanden sind.`);
  } catch (error) {
    console.error("Fehler beim Laden der JSON-Datei:", error);
  }
}

// 2. Die magische t-Funktion, die vgefehlt hat!
export function t(key, data = {}) {
  // Holt den Text aus der JSON. Falls nicht vorhanden, zeige den Key als Fallback
  let text = uebersetzungen[key] || key;
  
  // Ersetzt Platzhalter wie {{name}} mit echten Daten
  Object.keys(data).forEach(dataKey => {
    text = text.replace(`{{${dataKey}}}`, data[dataKey]);
  });
  
  return text;
}

document.addEventListener("DOMContentLoaded", () => {
    //sprachauswahl
    const dropdownBtn = document.getElementById("current-lang-btn");
    const langList = document.getElementById("lang-list");

    if (!dropdownBtn || !langList) return; // Sicherheit, falls Elemente fehlen

    //1.  Dropdown öffnen und schließen bei Klick auf den Button
    dropdownBtn.addEventListener("click", () => {
        const isExpanded = dropdownBtn.getAttribute("aria-expanded") === "true";
        dropdownBtn.setAttribute("aria-expanded", !isExpanded);
        langList.classList.toggle("show");
    });
    // 2. Klick auf eine Sprache in der Liste
    langList.querySelectorAll("li").forEach(item => {
        item.addEventListener("click", (event) => {
            const selectedLang = event.target.getAttribute("data-lang");

            // Sprache ändern (Nutzt die fetch-Funktion aus der vorherigen Nachricht)
            ladeSprache(selectedLang);

            //Button-Text auf das neue Kürzel (z.b. "EN") updaten
            dropdownBtn.textContent = selectedLang.toUpperCase();
          
            //Dropdown wieder schließen
            langList.classList.remove("show");
            dropdownBtn.setAttribute("aria-expanded","false");
        });
    });
    // 3. Schließen, wenn man irgendwo anderst auf die Seite klickt
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".custom-dropdown")) {
            langList.classList.remove("show");
            dropdownBtn.setAttribute("aria-expanded","false");
        }
    });
        // 4. Beim Start: Gespeicherte Sprache laden oder Fallback auf Deutsch
    const gespeicherteSprache = localStorage.getItem("preferredLanguage") || "de";
    ladeSprache(gespeicherteSprache);
});
//seite vorlesen 
export function ganzeSeiteVorlesen() {
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
const button = document.getElementById("btn-vorlesen");
if (button) {
    button.addEventListener("click", ganzeSeiteVorlesen);
}
export function changeFontSize(action) {
  const root = document.documentElement;
  // Liest die aktuelle Schriftgröße aus (Standard meist 16px)
  let currentSize = parseFloat(window.getComputedStyle(root).fontSize);
  
  if (action === 'increase') {
    root.style.fontSize = (currentSize + 2) + 'px';
  } else if (action === 'decrease') {
    root.style.fontSize = (currentSize - 2) + 'px';
  }
}
// ALLE Schrift-Buttons mit der Klasse 'btn-font' auf einmal aktivieren
const fontButtons = document.querySelectorAll(".btn-font");

fontButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Holt dynamisch 'increase' oder 'decrease' aus dem data-size Attribut
        const action = button.dataset.size; 
        changeFontSize(action);
    });
});
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
    switchPage(ziel); 
    });
});


export function switchPage(zielId) {
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

//für handy
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
               const optionElement = document.createElement('option');
        // OPTIONAL ABER EMPFOHLEN: Jeder Option einen Wert (value) zuweisen
                optionElement.value = options1[i];
                const optionText = document.createTextNode(options1[i]);
                optionElement.appendChild(optionText);
                gradeSelect.appendChild(optionElement);
              }   
            }

        else {
              gradeSelect.style.display = "none";
            }
        } 
    })
};

gradeSelect.addEventListener("change", async (e) => {
    const text = document.getElementById("eingabename").value;
    const note = e.target.value;

    if (!text || !note) return;

    const msgBuffer = new TextEncoder().encode(text + note);
    const hashBuffer = await crypto.subtle.digest("SHA-512", msgBuffer); //64 bytes / 512 bit

    //in Byte-Arry (Uint8Array) umwandeln
    const fullByteArray = new Uint8Array(hashBuffer);
    // TRUNCATION (abschneiden): Nur die ersten 32 Bytes nehmen (32 Bytes = 256 Bit)
    const truncatedArray = fullByteArray.slice(0,32);
    
    const hashHex = Array.from(truncatedArray)
         .map(b => b.toString(16).padStart(2, "0")).join("");

    localStorage.setItem("savedHash", hashHex);
    console.log("Hash gespeichert", hashHex);
});

//leistungen -siehe function umschalten(id)
// Moderner Ansatz: Event-Listener statt 'onclick' im HTML
document.addEventListener('DOMContentLoaded', () => {
    // Finde alle Buttons mit dem data-target Attribut
    document.querySelectorAll('[data-target]').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            umschalten(targetId);
        });
    });

    // 2. NEU: Logik für den Seitenwechsel (Tab-System)
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Verhindert ungewolltes Springen
            
            const zielSeitenId = link.getAttribute('data-page');
            const zielSeite = document.getElementById(zielSeitenId);
            
            if (zielSeite) {
                // Verstecke alle Seiten, indem wir 'aktiv' entfernen
                document.querySelectorAll('.seite').forEach(seite => {
                    seite.classList.remove('aktiv');
                });
                
                // Zeige die geklickte Seite an
                zielSeite.classList.add('aktiv');
                
                // Komfort-Feature: Schließe das Menü nach dem Klick automatisch
                umschalten('listbox');

                // DYNAMISCH: Finde das übergeordnete Menü-Element und schließe es
                const uebergeordnetesMenue = link.closest('.mein-menue');
                if (uebergeordnetesMenue) {
                   umschalten(uebergeordnetesMenue.id);
                }
            }
        });
    });
});
export function umschalten(elementId) {
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
//kontakt //datenübertragen und speichern
// Funktion 1: Wartet auf das Absenden und verknüpft die Speicher-Funktion
document.getElementById('meinKontaktFormular').addEventListener('submit', speichereDatenAlsDatei);
// Funktion 2: Daten lokal als Textdatei auf den PC herunterladen
export function speichereDatenAlsDatei(event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite
    // Werte aus dem Formular holen
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const nachricht = document.getElementById('kontaktarea').value;
    const datum = new Date().toLocaleString(); // Zeitstempel erstellen
    // Den Textinhalt für die Datei strukturieren
    const dateiInhalt = `KONTAKTFORMULAR AUSWERTUNG\n===========================\nDatum: ${datum}\nName: ${name}\nE-Mail: ${email}\nNachricht:\n${nachricht}`;
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
//impressum nur text keine js elemente

//Backgammon import
import { fuehreZugAus, aufhebenSelektion, platziereStartSteine, pruefeSpielerWechsel, darfAusspielen, aktualisiereHighscoreAnzeige }from './backgammon.js';