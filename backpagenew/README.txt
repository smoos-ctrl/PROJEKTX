Test Homepage mit Testfunktionen aus Büchern und Unterrichtsmaterialen zur Übung und um Html Css und Javascript zu erlernen
+Backgammon , das wollte ich shcon lange mal machen :) 
here it is :D 
edit : new()
hashfunktion bei buttonfield eingebaut (siehe console) bzw name in fed eingeben button drücken note auswählen :D

im umbau zu mehrsprachigkeit befindlich next step

also eigentlich war der plan shcon das ich die json nehm bzw machen werde
Das ist ein absolut verständlicher und professioneller Plan! 
Eine echte .json-Datei (oder mehrere für jede Sprache) zu nutzen, ist der Industriestandard für größere Webprojekte. 
Es hält deinen JavaScript-Code sauber und trennt Logik von Texten.
Damit dieser Plan funktioniert und deine Seite nicht mehr wegen ReferenceError: t is not defined abstürzt, 
musst du das Übersetzungssystem (das Framework) im Hintergrund laden.
Hier ist der Fahrplan, wie du deine .json-Dateien aufbaust und die magische t()-Funktion zum Laufen bringst.
Schritt 1: Die .json-Dateien erstellenErstelle in deinem Projektordner einen neuen Ordner namens locales/ (oder halt lang).
 Darin legst du für jede Sprache eine Datei an:
 locales/de.json also lang/de.json
 json{
  "startwinname_message": "{{name}} gewinnt den Startwurf und beginnt (Farbe: Weiß)!",
  "samedice_message": "Gleichstand! Bitte noch einmal würfeln.",
  "makemove_message": "Du musst erst deine Züge machen!"
}
Verwende Code mit Vorsicht.locales/en.json
json{
  "startwinname_message": "{{name}} wins the opening roll and starts (Color: White)!",
  "samedice_message": "Tie! Please roll again.",
  "makemove_message": "You must make your moves first!"
}
Verwende Code mit Vorsicht.(Hinweis: Das {{name}} ist ein Platzhalter für die dynamischen Spielernamen).
Schritt 2: Die Funktion t() im JavaScript bereitstellen
Da du aktuell kein schweres Framework geladen hast, schreiben wir eine extrem schlanke, 
native Lade-Funktion, die genau das tut, was du von einer echten JSON-Übersetzung erwartest.
Füge das ganz oben in deine script33.js oder backgammon.js ein:
javascript
let uebersetzungen = {}; // Hier landen die JSON-Daten
let aktuelleSprache = "de"; // Standard

// 1. Funktion, die die passende JSON-Datei vom Server lädt
async function ladeSprache(sprache) {
  try {
    const response = await fetch(`locales/${sprache}.json`);
    if (!response.ok) throw new Error("Datei nicht gefunden");
    uebersetzungen = await response.json();
    aktuelleSprache = sprache;
    console.log(`Sprachdatei [${sprache}] erfolgreich geladen.`);
  } catch (error) {
    console.error("Fehler beim Laden der JSON-Datei:", error);
  }
}

// 2. Die magische t-Funktion, die vorhin gefehlt hat!
function t(key, data = {}) {
  // Holt den Text aus der JSON. Falls nicht vorhanden, zeige den Key als Fallback
  let text = uebersetzungen[key] || key;
  
  // Ersetzt Platzhalter wie {{name}} mit echten Daten
  Object.keys(data).forEach(dataKey => {
    text = text.replace(`{{${dataKey}}}`, data[dataKey]);
  });
  
  return text;
}

// 3. Beim Start der Seite direkt Deutsch laden
ladeSprache("de");
Verwende Code mit Vorsicht.
Schritt 3: Deine i18nAlert-Funktion anpassen
Jetzt existiert die Funktion t(). Damit dein bisheriger Code mit den .json-Dateien zusammenarbeitet, 
passen wir die i18nAlert so an, dass sie die Variablen (wie die Spielernamen) sauber an die JSON übergibt:
javascriptfunction i18nAlert(key, options) {
  let name = "";
  
  // Versuchen, den Spielernamen aus deinem bisherigen DefaultValue zu fischen
  if (options && options.defaultValue && key === 'startwinname_message') {
    name = options.defaultValue.split(" gewinnt")[0];
  }

  // Aufruf der t()-Funktion mit dem Key und dem dynamischen Namen
  const text = t(key, { name: name });
  
  alert(text);
}
Verwende Code mit Vorsicht.Ein ganz wichtiger technischer Hinweis (Live-Server)Sobald du mit fetch() echte .json-Dateien lädst, 
greifen die Sicherheitsmechanismen deines Browsers. Wenn du die index.html einfach nur per Doppelklick von der Festplatte öffnest, 
blockiert der Browser das Laden der JSON-Datei (CORS-Fehler).Die Lösung: Du musst einen lokalen Server verwenden. 
In VS Code nutzt man dafür am besten die Erweiterung "Live Server" (unten rechts auf "Go Live" klicken). 
Dann funktioniert das Laden der JSONs fehlerfrei.
Wie möchtest du mit den JSON-Dateien weiterverfahren?
Sollen wir die Logik einbauen, mit der das Sprach-Dropdown im Header (DE, EN, ES, FR) automatisch die Funktion ladeSprache() aufruft? sollte schon vorhanden sein
Möchtest du sehen, wie wir die data-i18n-Attribute in deinem HTML automatisch mit den Texten aus der JSON befüllen?
Sollen wir prüfen, ob der CORS-Fehler bei dir auftritt, wenn du die JSON-Dateien testest?
