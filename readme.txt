Hier ist deine neue, saubere Ordnerstruktur. Erstelle am besten einen neuen Ordner und lege diese drei Dateien genau so nebeneinander an:1. index.html (Die Struktur)html<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ausbildungsprojekt Single Page</title>
    <!-- Hier binden wir deine externe CSS-Datei ein -->
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <nav>
        <button class="mein-button" onclick="zeigeSeite('home')">Main/Home</button>
        <button class="mein-button" onclick="zeigeSeite('buttonfield')">Buttonfield</button>
        <button class="mein-button" onclick="zeigeSeite('leistungen')">Leistungen</button>
        <button class="mein-button" onclick="zeigeSeite('kontakt')">Kontakt</button>
    </nav>

    <main class="layout-container">
        <!-- SEITE 1: HOME -->
        <div id="home" class="seite aktiv">
            <h1>Iiiiiihhh bims – Hauptseite</h1>
            <p>Willkommen auf meiner lokalen Lern-Website.</p>
        </div>

        <!-- SEITE 2: BUTTONFIELD -->
        <div id="buttonfield" class="seite">
            <h1>Buttonfield for ever</h1>
            <p>Hier kannst du deinen alten Noten-Grid-Code einfügen!</p>
        </div>

        <!-- SEITE 3: LEISTUNGEN -->
        <div id="leistungen" class="seite">
            <h1>Unsere Leistungen</h1>
            <p>HTML, CSS und JS lernen durch Ausprobieren.</p>
        </div>

        <!-- SEITE 4: KONTAKT -->
        <div id="kontakt" class="seite">
            <h1>Kontakt</h1>
            <form onsubmit="speichereDatenAlsDatei(event)">
                <div>
                    <label for="kontaktarea">Nachricht*:</label>
                    <textarea id="kontaktarea" rows="5" placeholder="Ihre Nachricht..." required></textarea>
                    <br>
                </div>
                <div>
                    <label for="name">Name*:</label>
                    <input id="name" autocomplete="off" required>
                </div>
                <button type="submit" class="mein-button">Nachricht als TXT speichern</button>
            </form>
        </div>
    </main>

    <!-- Hier binden wir deine externe JavaScript-Datei ganz unten ein -->
    <script src="script.js"></script>
</body>
</html>
Verwende Code mit Vorsicht.2. style.css (Das Design)cssbody { 
    font-family: sans-serif; 
    padding: 20px; 
    background-color: lightcoral; 
}

nav { 
    text-align: center; 
    margin-bottom: 30px; 
}

/* Versteckt alle Seiten standardmäßig */
.seite { 
    display: none; 
    background: white; 
    padding: 20px; 
    border-radius: 8px; 
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

/* Zeigt nur die aktive Seite an */
.seite.aktiv { 
    display: block; 
}

.mein-button { 
    padding: 10px 20px; 
    cursor: pointer; 
    margin: 5px; 
    background-color: #333;
    color: white;
    border: none;
    border-radius: 4px;
}

.mein-button:hover {
    background-color: #555;
}

form div { 
    margin-bottom: 15px; 
}

label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
}

input, textarea {
    width: 100%;
    max-width: 400px;
    padding: 8px;
    box-sizing: border-box;
}
Verwende Code mit Vorsicht.3. script.js (Die Logik & Datenverarbeitung)javascript// Funktion 1: Seiten umschalten
function zeigeSeite(seitenId) {
    const seiten = document.querySelectorAll('.seite');
    seiten.forEach(s => s.classList.remove('aktiv'));
    
    document.getElementById(seitenId).classList.add('aktiv');
}

// Funktion 2: Daten lokal als Textdatei auf den PC herunterladen
function speichereDatenAlsDatei(event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite

    // Werte aus dem Formular holen
    const name = document.getElementById('name').value;
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
Verwende Code mit Vorsicht.Was du jetzt gelernt hast:Verknüpfung: 
Das HTML bleibt schlank und zieht sich das Aussehen aus der .css und das Verhalten aus der .js.Blob-Technologie: 
Über new Blob() kann JavaScript Daten im Browser sammeln und dem Nutzer als echten Datei-Download anbieten, 
ganz ohne Server-Backend.Möchtest du als Nächstes deinen Noten-Grid-Code aus den vorherigen Schritten sauber in diese neue Struktur einbauen, 
oder sollen wir uns anschauen, wie du die heruntergeladenen Textdateien mit noch mehr Infos füllen kannst?
Ein Backgammon-Spiel als freiwilliges Schulprojekt ist ein richtig starkes Vorhaben! Respekt dafür, das ist logisch gar nicht so ohne.
Für genau das, was du vorhast – also die Spielernamen vom Anmeldebildschirm rüber zum Spielfeld zu transportieren und am Ende
 eine Highscore-Liste zu führen –, ist der localStorage des Browsers die absolut perfekte Lösung. 
 Der speichert Daten wie eine kleine, lokale Datenbank direkt im Browser, selbst wenn du den Tab schließt oder die Seite wechselst.
 Mach jetzt aber erst einmal die wohlverdiente Pause! Wenn man zu lange auf den Code starrt, sieht man irgendwann den
  Wald vor lauter Bäumen nicht mehr.Wenn du danach weiterarbeitest, kannst du dir diese drei Kern-Befehle für
   dein Backgammon-Spiel im Hinterkopf behalten:Namen beim Login speichern:javascriptlocalStorage.setItem('spieler1', nameAusFormular);
Verwende Code mit Vorsicht.Namen auf dem Spielfeld auslesen:javascriptconst spieler1 = localStorage.getItem('spieler1');
document.getElementById('anzeigeSpieler1').textContent = spieler1;
Verwende Code mit Vorsicht.Highscore als Liste (Array) speichern:Da nutzt man JSON.stringify() und JSON.parse(), um ganze Listen zu sichern.
Richtig guter Fortschritt für heute! Melde dich einfach hier wieder in diesem Chat, wenn du erholt bist und wir die Spieleranmeldung 
oder die Highscore-Liste für dein Backgammon-Projekt angehen sollen. Viel Spaß bei der Pause!
