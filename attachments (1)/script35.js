// ==========================================
// 1. STATISCHE IMPORTE
// ==========================================
import { fuehreZugAus, aufhebenSelektion, platziereStartSteine, pruefeSpielerWechsel, darfAusspielen, aktualisiereHighscoreAnzeige } from './backgammon/backgammonjs.js';
import { i18nmanager } from './i18nmanager.js';
// ==========================================
// 2. GLOBALE VARIABLEN & INT-LOGIK
// ==========================================
let backgammonWurdeBereitsGeladen = false;
//let uebersetzungen = {}; 
//export let aktuelleSprache = "de"; 
const i18n = new i18nmanager('lang/');
i18n.init();

// ==========================================
// 3. SEITEN-UMSCHALT-ZENTRALE
// ==========================================
export function switchPage(zielId) {
    if (!zielId) return;
    
    // Raute entfernen und bereinigen
    const gesauberteId = zielId.replace("#", "").trim().toLowerCase();
    console.log("Navigiere zu ID:", gesauberteId); 

    // Alle Standard-Seiten der Hauptdatei unsichtbar machen
    document.querySelectorAll(".seite").forEach(seite => {
        seite.classList.remove("aktiv");
        seite.style.display = ''; // Setzt eventuelle Inline-Blockaden zurück
    });
    const footer = document.querySelector('.main-footer');
    if (footer) {
       footer.style.display = (gesauberteId === 'spielstart' || gesauberteId === 'spielende') ? 'none' : 'block';
    }
    // Sonderlogik für Backgammon-Phasen (Spielstart / Spielende)
    if (gesauberteId === 'spielstart' || gesauberteId === 'spielende') {
        const spielContainer = document.getElementById("backgammon-container");
        if (spielContainer) {
            spielContainer.classList.add("aktiv");
            
            // Innerhalb des Spiels die richtige Phase einblenden
            spielContainer.querySelectorAll('.seite').forEach(spielSeite => {
                spielSeite.style.display = 'none';
                spielSeite.classList.remove('aktiv');
            });
            
            const aktivePhase = document.getElementById(gesauberteId);
            if (aktivePhase) {
                aktivePhase.style.display = 'block';
                aktivePhase.classList.add('aktiv');
            }
        }
        return;
    }

    // Normale Seitenaktivierung (inklusive Case-Insensitive Check für Impressum)
    const zielSeite = document.getElementById(gesauberteId) || document.querySelector(`[id="${gesauberteId}" i]`);
    if (zielSeite) {
        zielSeite.classList.add("aktiv");
    } else {
        console.warn("Seite nicht im DOM gefunden:", gesauberteId);
    }
}

function ladeBackgammonUeberFetch(vollstaendigesZiel) {
    const [dateipfad, anker] = vollstaendigesZiel.split('#');
    const zielAnker = anker ? anker.toLowerCase() : 'spielstart';

    // Wenn das Spiel bereits geladen ist, springen wir nur zur Phase
    if (backgammonWurdeBereitsGeladen) {
        switchPage(zielAnker);
        return;
    }

    fetch(dateipfad)
        .then(response => {
            if (!response.ok) throw new Error('HTML-Datei nicht gefunden');
            return response.text();
        })
        .then(html => {
            const spielContainer = document.getElementById("backgammon-container"); 
            if (spielContainer) {
                // Wir spritzen das Spiel in den EIGENEN Container, NICHT in home!
                spielContainer.innerHTML = html;
                backgammonWurdeBereitsGeladen = true; 
                console.log("Backgammon-html erfolgreich isoliert geladen!");
                
                // Wir verstecken alle Phasen im geladenen HTML vorab
                spielContainer.querySelectorAll('.seite').forEach(seite => {
                    seite.style.display = 'none';
                    seite.classList.remove('aktiv');
                });
                
                // Initialisieren
                if (typeof platziereStartSteine === "function") {
                    platziereStartSteine();
                    typeof aktualisiereHighscoreAnzeige === "function" && aktualisiereHighscoreAnzeige();
                }
                
                // Schalte die gewählte Phase sichtbar
                switchPage(zielAnker);
            }
        })
        .catch(error => {
            console.error("Fehler beim Ajax-Laden von Backgammon:", error);
        });
}

// ==========================================
// 4. DOM-READY INITIALISIERUNG
// ==========================================
document.addEventListener("DOMContentLoaded", () => {

    // A) Klick-Manager für ALLE Links (Header, Nav, Footer & data-page Attribute)
    document.querySelectorAll("header a, nav a, footer a, .menue-link").forEach(link => {
        link.addEventListener("click", (event) => {       
            const hrefZiel = link.getAttribute("href");
            const dataZiel = link.getAttribute("data-page");
            const ziel = hrefZiel || dataZiel;

            if (!ziel || ziel === "#") return;

            event.preventDefault(); 

            if (ziel.includes('backgammonhtml.html')) {
                ladeBackgammonUeberFetch(ziel);
            } else {
                switchPage(ziel); 
            }

            // Automatisches Schließen von Menüs
            const uebergeordnetesMenue = link.closest('.mein-menue');
            if (uebergeordnetesMenue) {
               umschalten(uebergeordnetesMenue.id);
            }
        });
    });

    // B) Dropdown-Auswahl für Mobilgeräte
    const selectMenue = document.querySelector("#listboxmain select");
    if (selectMenue) {
        selectMenue.addEventListener("change", (event) => {
            const zielId = event.target.value;
            if (!zielId) return;
            if (zielId.includes('backgammonhtml.html')) {
                ladeBackgammonUeberFetch(zielId);
            } else {
                switchPage(zielId);
            }
        });
    }

    // C) Togglen von Listen über [data-target]
    document.querySelectorAll('[data-target]').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            umschalten(targetId);
        });
    });

    // D) Hamburger-Menü Button Hauptseite
    const menuButtonMain = document.getElementById("menuButtonMain");
    if (menuButtonMain) {
        menuButtonMain.addEventListener("click", () => umschalten("listboxmain"));
    }

    // E) Grade-Select Logik (Klammern korrigiert) (Buttonfield)
    const zweiButton = document.getElementById("zweibutton");
    const gradeSelect = document.getElementById("grade");
    if (zweiButton && gradeSelect) {
        zweiButton.addEventListener("click", () => {
        if (gradeSelect.style.display === "" || gradeSelect.style.display === "none") {
            gradeSelect.style.display = "block"  
        } else {
            gradeSelect.style.display = "none";
        }
    });

        gradeSelect.addEventListener("change", async (e) => {
            const text = document.getElementById("eingabename").value;
            const note = e.target.value;
            if (!text || !note) return;

            const msgBuffer = new TextEncoder().encode(text + note);
            const hashBuffer = await crypto.subtle.digest("SHA-512", msgBuffer);
            const hashHex = Array.from(new Uint8Array(hashBuffer).slice(0, 32))
                 .map(b => b.toString(16).padStart(2, "0")).join("");
            localStorage.setItem("savedHash", hashHex);
            console.log("Hash gespeichert", hashHex);
        });
    }

    // F) Kontaktformular Event-Verknüpfung
    const kontaktForm = document.getElementById('meinKontaktFormular');
    if (kontaktForm) {
        kontaktForm.addEventListener('submit', speichereDatenAlsDatei);
    }

    // G) Vorlese-Button
    const vorleseBtn = document.getElementById("btn-vorlesen");
    if (vorleseBtn) {
        vorleseBtn.addEventListener("click", ganzeSeiteVorlesen);
    }

    // H) Schriftgrößen-Buttons
    document.querySelectorAll(".btn-font").forEach(button => {
        button.addEventListener("click", () => changeFontSize(button.dataset.size));
    });
    document.addEventListener("DOMContentLoaded", () => {
        i18n.init(); 
    });
    // I) Sprachsteuerung Setup
   // setupSprachDropdown();
   // const gespeicherteSprache = localStorage.getItem("preferredLanguage") || "de";
   // ladeSprache(gespeicherteSprache);
});

// ==========================================
// 5. EXPORTIERTE HILFSFUNKTIONEN
// ==========================================
export function umschalten(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.style.display = (element.style.display === 'none' || element.style.display === '') ? 'block' : 'none';
}

export function changeFontSize(action) {
    const root = document.documentElement;
    let currentSize = parseFloat(window.getComputedStyle(root).fontSize);
    root.style.fontSize = (action === 'increase' ? currentSize + 2 : currentSize - 2) + 'px';
}

export function ganzeSeiteVorlesen() {
    window.speechSynthesis.cancel();
    const text = document.body.innerText;
    const sprachAusgabe = new SpeechSynthesisUtterance(text);
    sprachAusgabe.lang = "de-DE";
    window.speechSynthesis.getVoices();
    window.speechSynthesis.speak(sprachAusgabe);
}

export function speichereDatenAlsDatei(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const nachricht = document.getElementById('kontaktarea').value;
    const datum = new Date().toLocaleString();
    const dateiInhalt = `KONTAKTFORMULAR AUSWERTUNG\n===========================\n
    Datum: ${datum}\nName: 
    ${name}\nE-Mail: 
    ${email}\nNachricht:\n${nachricht}`;
    const blob = new Blob([dateiInhalt], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `nachricht_${name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();document.body.removeChild(link);
    event.target.reset();
    }



// Macht die Instanz überall auf der Seite im JavaScript lesbar
window.i18n = i18n;     
// Hilfsfunktion: Löst Pfade wie "elements.btn_start" im JSON-Objekt auf
/*export function getNestedTranslation(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
    }, obj);
}

export function t(key, data = {}) {let text = getNestedTranslation(uebersetzungen, key) || data.defaultValue || key;
    Object.keys(data).forEach(dataKey => {if (dataKey !== "defaultValue") {text = text.replaceAll(`{{${dataKey}}}`, data[dataKey]);}});
    return text;
}
export function i18nAlert(key, data = {}) {const meldung = t(key, data);alert(meldung);
}
export async function ladeSprache(sprache) {try {const response = await fetch(`lang/${sprache}.json`);
    if (!response.ok) throw new Error(`Datei lang/${sprache}.json nicht gefunden`);
    uebersetzungen = await response.json();
    aktuelleSprache = sprache;
    document.querySelectorAll("[data-i18n]").forEach(element => {let key = element.getAttribute("data-i18n");
    // if (uebersetzungen[key]) element.textContent = uebersetzungen[key];});
        // Prüfen, ob es sich um einen Platzhalter handelt
    if (key.startsWith("placeholder:")) {
        // Schneidet das "placeholder:" vorne ab, um den echten JSON-Pfad zu bekommen
        const realKey = key.replace("placeholder:", "");
        const text = getNestedTranslation(uebersetzungen, realKey);
        if (text) element.setAttribute("placeholder", text);
    } else {
    const text = getNestedTranslation(uebersetzungen, key) ;
      if (text) element.textContent = text;
    }
    });
    localStorage.setItem("preferredLanguage", sprache);
    const btn = document.getElementById("current-lang-btn");
    if (btn) btn.textContent = sprache.toUpperCase();
    }
    catch (error) {console.error("Fehler beim Laden der JSON-Datei:", error);
}}
export function setupSprachDropdown() {const dropdownBtn = document.getElementById("current-lang-btn");
    const langList = document.getElementById("lang-list");
    if (!dropdownBtn || !langList) return;
    dropdownBtn.addEventListener("click", () => {const isExpanded = dropdownBtn.getAttribute("aria-expanded") === "true";
    dropdownBtn.setAttribute("aria-expanded", !isExpanded);langList.classList.toggle("show");
    });
    langList.querySelectorAll("li").forEach(item => {item.addEventListener("click", (event) => {const selectedLang = event.target.getAttribute("data-lang");
    ladeSprache(selectedLang);
    langList.classList.remove("show");
    dropdownBtn.setAttribute("aria-expanded","false");
    });
    });}*/