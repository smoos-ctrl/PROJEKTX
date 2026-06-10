// 1. FUNKTION: SEITE VORLESEN
function ganzeSeiteVorlesen() {
    window.speechSynthesis.cancel();
    const text = document.body.innerText;
    const sprachAusgabe = new SpeechSynthesisUtterance(text);
    sprachAusgabe.lang = "de-DE";
    window.speechSynthesis.getVoices();
    window.speechSynthesis.speak(sprachAusgabe);
    // Falls ein Fehler auftritt, gibt uns das Aufschluss
    sprachAusgabe.onerror = function(event) {
    console.error("Sprachausgabe-Fehler detektiert: ", event.error);
    alert("Der Browser verweigert das Vorlesen. Grund: " + event.error);
    };
}

// 2. ZENTRALE FUNKTION FÜR DEN SEITENWECHSEL
function switchPage(zielId) {
    if (!zielId) return;

    // Schneidet die Raute weg
    const gesäuberteId = zielId.replace("#", "").toLowerCase();

    // 1. Versteckt alle Seiten (entfernt "aktiv")
    document.querySelectorAll(".seite").forEach(seite => {
        seite.classList.remove("aktiv"); // HIER KEIN PUNKT!
    });

    // 2. Zeigt die neue Seite an (fügt "aktiv" hinzu)
    const zielSeite = document.getElementById(gesäuberteId);
    if (zielSeite) {
        zielSeite.classList.add("aktiv"); // HIER KEIN PUNKT!
    }
}

// 3. MENÜBUTTON IM HEADER ÖFFNEN / SCHLIESSEN
const menuButtonMain = document.getElementById("menuButtonMain");
const listboxmain = document.querySelector("#listboxmain");
if (menuButtonMain && listboxmain) {
    menuButtonMain.addEventListener("click", () => {
        if (listboxmain.style.display === "" || listboxmain.style.display === "none") {
            listboxmain.style.display = "block";
        } else {
            listboxmain.style.display = "none";
        }
    });
}
/*if (menuButtonMain && listboxmain) {
    menuButtonMain.addEventListener("click", () => {
        if (menuButtonMain && listboxmain) {
          menuButtonMain.addEventListener("click", () => {
        // Toggled die CSS-Klasse 'anzeigen' einfach an und aus!
           listboxmain.classList.toggle("anzeigen");
          
    }  ); } }
    )  } iwas geht nicht aber ich ahb mir so viel zeit zum klammern sortieren genommen xD */

// 4. LINKS AKTIVIEREN
document.querySelectorAll("header a,nav a,footer a").forEach(link => {
    link.addEventListener("click", (event) => {
        
        const ziel = link.getAttribute("href");
        event.preventDefault();
        switchPage(ziel);
    });
});

// 5. EVENT-LISTENER FÜR DROPDOWN UND MODAL
document.addEventListener("DOMContentLoaded", () => {
    // Dropdown (Auswahlmenü)
    const selectMenue = document.querySelector("#listboxmain select");
    if (selectMenue) {
        selectMenue.addEventListener("change", (event) => {
            const zielId = event.target.value;
            switchPage(zielId);
        });
    }

    // Spielanleitung (Modal)
    const modal = document.getElementById('rules-modal');
    const openBtn = document.getElementById('open-rules');
    const closeBtn = document.getElementById('close-rules');

    if (modal && openBtn && closeBtn) {
        openBtn.addEventListener('click', () => { modal.showModal(); });
        closeBtn.addEventListener('click', () => { modal.close(); });
    }
});

