
import { i18nmanager } from "../i18nmanager.js";
// -------------------------------------------------------------
import { switchPage } from '../script35.js'; 

function i18nAlert(key, data = {}) {
    window.i18n.i18nAlert(key, data);
}

function t(key, data = {}) {
    return window.i18n.t(key, data);
}

//Alles um BAckgammon ab hier ----------
// --- SPIELSTART LOGIK ---
const btnSpielstarten = document.getElementById("spielstarten");
const spieler1Input = document.getElementById("spieler1");
const spieler2Input = document.getElementById("spieler2");
const anzeigeSpieler = document.getElementById("aktueller-spieler");
const fehlerText = window.i18n.t('errors.invalid_input');

if (btnSpielstarten && spieler1Input && spieler2Input) {
    btnSpielstarten.addEventListener("click", () => {
        if (spieler1Input.value.trim() === "" || spieler2Input.value.trim() === "") {
            i18nAlert('alerts.inputname_message',{defaultValue:"Bitte geben Sie die Namen beider Spieler ein!"});
            return;
        }
        if (anzeigeSpieler) {
            anzeigeSpieler.textContent = spieler1Input.value;
        }
        switchPage("backgammon");
    });
}
// --- BACKGAMMON BEREICH: AUSLOSUNG, REGULÄRES WÜRFELN & STEINE MARKIEREN ---
const btnRoll = document.getElementById("btn-roll");
const diceResult = document.getElementById("dice-result");
// Zustandstracking des Matches
let phase = "auslosung"; 
let wurfSpieler1 = 0;
let wurfSpieler2 = 0;
let aktiverSpielerFarbe = ""; 
let ausgewaehlteZacke = null; 
let verbleibendeZuege = []; // Speichert die gewürfelten Augen
let barWeiß = 0;
let barSchwarz = 0;
let ausgespielteSteineWeiß = 0;
let ausgespielteSteineSchwarz = 0;
//let highscore = [];
const farbuebersetzungen = {
  rot: { de: "Rot", en: "Red", fr: "Rouge", es: "rojo"},
  blau: { de: "Blau", en: "Blue", fr: "Bleu", es: "azul"},
  gruen: { de: "Grün", en: "Green", fr: "Vert", es: "Verde"},
  Weiß: { de: "Weiß", en: "White", fr: "Blanc", es: "Blanco/a"},
  Schwarz: { de: "Schwarz", en: "Black", fr: "Noir", es: "Negro/a"}
};
// Der Browser schaut erst im localStorage nach. Wenn da nichts ist, nimmt er den leeren Korb []
//export let highscoreListe = JSON.parse(localStorage.getItem("backgammon_highscores")) || [];

if (btnRoll) {
    btnRoll.textContent = "Startwurf: Spieler 1";
}
if (btnRoll && diceResult) {
    btnRoll.addEventListener("click", () => {            
    // --- A: DIE AUSLOSUNG ---
    if (phase === "auslosung") {
        const wurf = Math.floor(Math.random() * 6) + 1;
        const name1 = spieler1Input ? spieler1Input.value.trim() || "Spieler 1" : "Spieler 1";
        const name2 = spieler2Input ? spieler2Input.value.trim() || "Spieler 2" : "Spieler 2";
        if (wurfSpieler1 === 0) {
            wurfSpieler1 = wurf;
            diceResult.innerHTML = `<span class="wuerfel">${wurfSpieler1}</span>`;
            btnRoll.textContent = `Startwurf: ${name2}`;
        } 
        else if (wurfSpieler2 === 0) {
            wurfSpieler2 = wurf;
            diceResult.innerHTML += `<span class="wuerfel">${wurfSpieler2}</span>`;
            if (wurfSpieler1 > wurfSpieler2) {
                setTimeout(() => {   
                i18nAlert('alerts.startwinname_message',{
                    defaultValue:"{{playerName}} gewinnt den Startwurf und beginnt (Farbe: Weiß)!",
                    playerName:name1});

                aktiverSpielerFarbe = "Weiß";
                if (anzeigeSpieler) anzeigeSpieler.textContent = name1 + " (Weiß)";
                phase = "spiel";
                btnRoll.textContent = "Regulär Würfeln";
                verbleibendeZuege = [wurfSpieler1, wurfSpieler2]; 
                }, 250);
            } 
            else if (wurfSpieler2 > wurfSpieler1) {
                setTimeout(() => {   
                i18nAlert('alerts.startwinname_message',{
                    defaultValue:"{{playerName}} gewinnt den Startwurf und beginnt (Farbe: Weiß)!",
                    playerName:name2});
                aktiverSpielerFarbe = "Weiß";
                if (anzeigeSpieler) anzeigeSpieler.textContent = name2 + " (Weiß)";                        
                phase = "spiel";
                btnRoll.textContent = "Regulär Würfeln";
                // WICHTIG: Die Startwürfel direkt als Züge eintragen!
                verbleibendeZuege = [wurfSpieler1, wurfSpieler2]; 
                }, 250);
            } 
            else {
                i18nAlert('alerts.samedice_message',{defaultValue:"Gleichstand! Bitte noch einmal würfeln."});                        
                wurfSpieler1 = 0;
                wurfSpieler2 = 0;
                diceResult.innerHTML = "";
                btnRoll.textContent = `Startwurf: ${name1}`;
            }             
        }
    } 
    // --- B: DAS REGULÄRE SPIEL ---
    else if (phase === "spiel") {
    // Wenn noch ungenutzte Würfel da sind, darf nicht neu gewürfelt werden
        if (verbleibendeZuege.length > 0) {
            i18nAlert('alerts.makemove_message',{defaultValue:"Du musst erst deine Züge machen!"});
            return;
        }
        aufhebenSelektion();
        const wuerfel1 = Math.floor(Math.random() * 6) + 1;
        const wuerfel2 = Math.floor(Math.random() * 6) + 1;
        diceResult.innerHTML = `<span class="wuerfel">${wuerfel1}</span><span class="wuerfel">${wuerfel2}</span>`;
        // Würfe für die Logik speichern
        if (wuerfel1 === wuerfel2) {
            // Pasch im Backgammon: Alle Zahlen zählen 4-mal!
            verbleibendeZuege = [wuerfel1, wuerfel1, wuerfel1, wuerfel1];
        } else {
            verbleibendeZuege = [wuerfel1, wuerfel2];
        }    
        // HINWEIS: Der Spielerwechsel wurde hier entfernt. 
        // Er findet jetzt statt, wenn verbleibendeZuege leer ist!
    }
   });
}
//Button zum passen fals man nicht ziehen kann um eine funktion zur berechnung zu umgehen
const btnPass = document.getElementById("btn-pass");
if (btnPass) {
btnPass.addEventListener("click", () => {
    if (phase === "spiel" && verbleibendeZuege.length > 0) {
            verbleibendeZuege = []; // Züge verwerfen
            pruefeSpielerWechsel(); // Spielerwechsel erzwingen
        }
    });
}
// --- KLICK-LOGIK FÜR DIE STEINE (INKLUSIVE BAR-REGELN) ---
document.querySelectorAll('.point').forEach(zacke => {
    zacke.addEventListener('click', () => {
        if (phase === "auslosung") return;
        if (verbleibendeZuege.length === 0) {
            i18nAlert('alerts.rolldice1_message',{defaultValue:"Bitte zuerst würfeln!"});
            return;
        }
        const zuId = parseInt(zacke.getAttribute('data-point'));
        const istObereReihe = zacke.parentElement.classList.contains('top-row');
        // --- PRÜFUNG: HAT DER SPIELER STEINE AUF DER BAR? ---
        const hatSteineAufBar = (aktiverSpielerFarbe === "Weiß" && barWeiß > 0) || (aktiverSpielerFarbe === "Schwarz" && barSchwarz > 0);
        // ABGEPASST AN DEIN CSS:
        // In der top-row ist der oberste Stein das LETZTE Element (lastElementChild)
        // In der bottom-row (wegen column-reverse) ist der oberste Stein das ERSTE Element (firstElementChild)
        const alleSteineInZacke = zacke.querySelectorAll('.checker');
        let obersterStein = null;
        if (alleSteineInZacke.length > 0) {
           obersterStein = alleSteineInZacke[alleSteineInZacke.length - 1];
        }
        // FALL 1: Stein auswählen (Nur erlaubt, wenn man KEINE Steine auf der Bar hat!)
        if (!ausgewaehlteZacke) {
        // --- NEU: LOGIK FÜR DAS WIEDEREINSETZEN VON DER BAR ---
            if (hatSteineAufBar) {
                // Berechnen, wie weit der Schritt von "außerhalb" auf dieses Feld wäre
                // Weiß startet vor Feld 1 (quasi bei 0) -> distanz ist die Feldnummer selbst
                // Schwarz startet nach Feld 24 (quasi bei 25) -> distanz ist 25 - Feldnummer
                let barDistanz = aktiverSpielerFarbe === "Weiß" ? zuId : (25 - zuId);
                // Prüfen, ob die gewürfelten Augen zu diesem Einstiegsfeld passen
                const wuerfelIndex = verbleibendeZuege.indexOf(barDistanz);
                if (wuerfelIndex !== -1) {
                    // Prüfen, ob das Feld frei ist (weniger als 2 gegnerische Steine)
                    const gegnerFarbe = aktiverSpielerFarbe === "Weiß" ? "Schwarz" : "Weiß";
                    const gegnerSteineAnzahl = zacke.querySelectorAll(`.checker.${gegnerFarbe}`).length;
                    if (gegnerSteineAnzahl >= 2) {
                        i18nAlert('alerts.blocked_message',{defaultValue:"Dieses Einstiegsfeld ist vom Gegner blockiert!"});
                        return;
                    }
                    // --- ZUG VON DER BAR AUSFÜHREN ---
                    const barZoneId = aktiverSpielerFarbe === "Weiß" ? "Bar-Weiß-Zone" : "Bar-Schwarz-Zone";
                    const barZone = document.getElementById(barZoneId);                
                    if (barZone && barZone.lastElementChild) {
                        const steinVonBar = barZone.lastElementChild;               
                        // Falls der Gegner dort genau 1 Stein hat -> Schlagen!
                        if (gegnerSteineAnzahl === 1) {
                            const geschlagenerStein = zacke.querySelector(`.checker.${gegnerFarbe}`);
                            const zielBarZone = document.getElementById(gegnerFarbe === "Weiß" ? "Bar-Weiß-Zone" : "Bar-Schwarz-Zone");
                            i18nAlert('alerts.kickedoutagain_message',{defaultValue:`💥 Direkt beim Einstieg gekickt! Der {{farbe}}e Stein muss auf die Bar!`,
                            farbe: gegnerFarbe
                            });
                            if (geschlagenerStein && zielBarZone) {
                                zielBarZone.appendChild(geschlagenerStein);
                            }
                            if (gegnerFarbe === "Weiß") barWeiß++; else barSchwarz++;
                        }
                        // Stein von der Bar auf das angeklickte Feld setzen
                        zacke.appendChild(steinVonBar);       
                        // Zähler verringern
                        if (aktiverSpielerFarbe === "Weiß") barWeiß--; else barSchwarz--;             
                        // Würfel abziehen und Zug beenden
                        verbleibendeZuege.splice(wuerfelIndex, 1);
                        i18nAlert('alerts.backingame_message',{defaultValue:`Stein erfolgreich von der Bar ins Feld {{feld}} eingesetzt!`,
                            feld: zuId
                        });
                        pruefeSpielerWechsel();
                    }
                } else {
                    i18nAlert('alerts.noentry_message',{defaultValue:`Ungültiger Einstieg! Du kannst mit deinen Würfeln [{{zuege}}] nicht auf Feld {{feld}} einsteigen (benötigte Augenzahl: {{distanz}}).`,
                    zuege: verbleibendeZuege.join(", "),
                    feld: zuId,
                    distanz: barDistanz
                });
                }
                return; // Wichtig: Verhindert, dass der normale Auswahlcode danach ausgeführt wird!
            }
                if (obersterStein && obersterStein.classList.contains(aktiverSpielerFarbe)) {
                    document.querySelectorAll('.checker.selected').forEach(s => s.classList.remove('selected'));
                    obersterStein.classList.add('selected');
                    ausgewaehlteZacke = zacke;
                } else if (obersterStein) {
                    i18nAlert('alerts.notyourstone_message',{defaultValue:"Das ist nicht dein Stein!"});
                }
            } 
            // FALL 2: Abbrechen bei Klick auf dieselbe Zacke
            else if (ausgewaehlteZacke === zacke) {
                aufhebenSelektion();
            } 
            // FALL 3: Stein bewegen / Schlagen (Normaler Zug vom Feld)
            else {
                const vonId = parseInt(ausgewaehlteZacke.getAttribute('data-point'));
                let distanz = aktiverSpielerFarbe === "Weiß" ? (zuId - vonId) : (vonId - zuId);
                if (distanz <= 0) {
                    i18nAlert('alerts.wrongdirection_message',{defaultValue:"Falsche Richtung! Du musst dich vorwärts bewegen."});
                    aufhebenSelektion();
                    return;
                }
                fuehreZugAus(distanz, zacke, () => {
                    // Wenn der Zug erfolgreich war, bewegen wir den ausgewählten Stein
                    const steinZumBewegen = ausgewaehlteZacke.querySelector('.checker.selected');
                    if (steinZumBewegen) {
                        zacke.appendChild(steinZumBewegen);
                    }
                });
            }
        });
    });
    // --- DOPPELKLICK-LOGIK FÜR DAS AUSSPIELEN AM SPIELENDE ---
    document.querySelectorAll('.point').forEach(zacke => {
        zacke.addEventListener('dblclick', () => {
            if (phase !== "spiel" || verbleibendeZuege.length === 0) return;
            // Prüfen, ob dieser Spieler überhaupt schon ausspielen darf
            if (!darfAusspielen(aktiverSpielerFarbe)) {
                i18nAlert('alerts.allstonesinside1_message',{defaultValue:"Du musst erst ALLE deine Steine in dein Heimfeld bringen!"});
                return;
            }
            const vonId = parseInt(zacke.getAttribute('data-point'));
            const alleSteineInZacke = zacke.querySelectorAll('.checker');
            // Liegt hier überhaupt ein Stein des aktiven Spielers?
            let obersterStein = alleSteineInZacke.length > 0 ? alleSteineInZacke[alleSteineInZacke.length - 1] : null;
            if (!obersterStein || !obersterStein.classList.contains(aktiverSpielerFarbe)) return;
            // Berechnen, wie viele Augen man exakt braucht, um das Feld zu verlassen:
            // Weiß steht auf 19-24. Von 24 braucht man 1 Auge, von 23 braucht man 2... also: 25 - vonId
            // Schwarz steht auf 1-6. Von 1 braucht man 1 Auge, von 2 braucht man 2... also exakt: vonId
            let benoetigteAugen = aktiverSpielerFarbe === "Weiß" ? (25 - vonId) : vonId;
            // Schauen, ob wir die exakte Würfelzahl im Array haben
            let wuerfelIndex = verbleibendeZuege.indexOf(benoetigteAugen);
            // Offizielle Backgammon-Regel: Wenn man eine höhere Zahl gewürfelt hat, als man eigentlich braucht 
            // (z.B. man steht auf der 23, braucht eine 2, hat aber nur eine 6), darf man den am weitesten hinten 
            // liegenden Stein trotzdem rauswerfen, wenn keine Steine weiter hinten stehen.
            if (wuerfelIndex === -1) {
                // Wir suchen nach dem höchsten verfügbaren Würfel, der GRÖSSER ist als benötigt
                const hoehererWuerfel = verbleibendeZuege.find(w => w > benoetigteAugen);
                if (hoehererWuerfel) {
                    // TODO: Für die einfachste Version erlauben wir den Zug direkt mit dem höheren Würfel
                    wuerfelIndex = verbleibendeZuege.indexOf(hoehererWuerfel);
                }
            }
            if (wuerfelIndex !== -1) {
                // Stein vom Brett löschen
                zacke.removeChild(obersterStein);
                // Zähler erhöhen
                if (aktiverSpielerFarbe === "Weiß") {
                    ausgespielteSteineWeiß++;
                } else {
                    ausgespielteSteineSchwarz++;
                }
                // Würfel abziehen und Auswahl säubern
                verbleibendeZuege.splice(wuerfelIndex, 1);
                aufhebenSelektion();
                i18nAlert('alerts.stoneout_message',{aktiverSpielerFarbe});
                // GEWINN-PRÜFUNG: Wer 15 Steine draußen hat, gewinnt das Match!
                if (ausgespielteSteineWeiß === 15) {
                    const sieger = spieler1Input ? spieler1Input.value.trim() || "Spieler Weiß" : "Spieler Weiß"; 
                    i18nAlert('alerts.winnergame_message',{defaultValue:`🏆 Herzlichen Glückwunsch! {{sieger}} WEIß hat das Spiel gewonnen!`,
                        sieger:sieger
                    });
                    // Name UND Datum/Punkte als Objekt speichern (besser für die Highscore-Logik!)
                    highscoreListe.push({ name: sieger, farbe: "Weiß", datum: new Date().toLocaleDateString() }); 
                    localStorage.setItem(
                        "backgammon_highscores",
                        JSON.stringify(highscoreListe)
                    );
                    if (typeof aktualisiereHighscoreAnzeige === "function") aktualisiereHighscoreAnzeige();                
                    // ZÜGE SOFORT SPERREN (Damit der andere nicht weiterspielt!)
                    //hier sollten noch alle steine vom feld gelöscht werden
                    verbleibendeZuege = []; 
                    phase = "beendet"; // Spiel ende
                    //zu spielende springen
                    switchPage("spielende");
                } else if (ausgespielteSteineSchwarz === 15) {
                    const sieger = spieler2Input ? spieler2Input.value.trim() || "Spieler Schwarz" : "Spieler Schwarz";
                    i18nAlert('alerts.winnergame2_message',{defaultValue:`🏆 Herzlichen Glückwunsch! {{sieger}}  SCHWARZ hat das Spiel gewonnen!`, 
                        sieger:sieger
                    });
                    // Name UND Datum/Punkte als Objekt speichern (besser für die Highscore-Logik!)
                    highscoreListe.push({ name: sieger, farbe: "Schwarz", datum: new Date().toLocaleDateString() }); 
                    localStorage.setItem(
                        "backgammon_highscores",
                        JSON.stringify(highscoreListe)
                    );
                    if (typeof aktualisiereHighscoreAnzeige === "function") aktualisiereHighscoreAnzeige();     
                    // ZÜGE SOFORT SPERREN (Damit der andere nicht weiterspielt!)
                    //hier sollten noch alle steine vom feld gelöscht werden (oder steine neu aufstellen)
                    verbleibendeZuege = []; 
                    phase = "beendet";
                    //zu spielende springen
                    switchPage("spielende");
                }
                pruefeSpielerWechsel();
            } else {
                i18nAlert('alerts.wrongvalueout_message',{vonId, benoetigteAugen});
            }
        });
    });
    // --- HILFSFUNKTION FÜR ZUGBERECHNUNG UND SCHLAGEN ---
export function fuehreZugAus(distanz, zielZacke, bewegeSteinDOMFunktion) {
        const wuerfelIndex = verbleibendeZuege.indexOf(distanz);
        if (wuerfelIndex !== -1) {
            const gegnerFarbe = aktiverSpielerFarbe === "Weiß" ? "Schwarz" : "Weiß";
            const gegnerSteine = zielZacke.querySelectorAll(`.checker.${gegnerFarbe}`);
            const gegnerSteineAnzahl = gegnerSteine.length;

            if (gegnerSteineAnzahl >= 2) {
                i18nAlert('alerts.blockedpoint_message',{defaultValue:"Dieser Point ist vom Gegner blockiert!"});
                aufhebenSelektion();
                return;
            }
            // 1. ZUERST den eigenen Stein im DOM bewegen!
        bewegeSteinDOMFunktion();
        verbleibendeZuege.splice(wuerfelIndex, 1);
        aufhebenSelektion();

        // 2. JETZT VERZÖGERT PRÜFEN (Schlagen & Spielerwechsel nach der Animation)
        setTimeout(() => {
            // SCHLAGEN: 1 gegnerischer Stein wandert auf die Bar
            if (gegnerSteineAnzahl === 1) {
                const geschlagenerStein = zielZacke.querySelector(`.checker.${gegnerFarbe}`);
                if (geschlagenerStein) {
                    // i18n-alert für das Schlagen abfeuern
                    i18nAlert('alerts.kickedatbar_message', { 
                        farbe: gegnerFarbe, 
                        defaultValue: `💥 Gekickt! Der {{farbe}}e Stein wurde auf die Bar geschlagen!` 
                    });

                    // Stein von der Zacke lösen und in die richtige Bar-Zone verschieben
                    const barZoneId = gegnerFarbe === "Weiß" ? "Bar-Weiß-Zone" : "Bar-Schwarz-Zone";
                    const barZone = document.getElementById(barZoneId); 
                    if (barZone) {
                        geschlagenerStein.classList.remove('selected');
                        barZone.appendChild(geschlagenerStein); // Physisch verschieben!
                    }   
                    
                    // Counter im Hintergrund erhöhen
                    if (gegnerFarbe === "Weiß") barWeiß++; else barSchwarz++;
                }
            }
            
            // WICHTIG: Der Spielerwechsel muss IN das Timeout, 
            // damit er wartet, bis das Schlagen physisch beendet ist!
            pruefeSpielerWechsel();
          
        }, 250); // 250 Millisekunden warten (entspricht der CSS-Animation + Puffer)

    } else {
        i18nAlert('alerts.wrongvalueingame_message', { 
            defaultValue: `Ungültiger Zug! Keine passende Würfelzahl für ${distanz} Felder.` 
        });
        aufhebenSelektion();
    }
}

export function aufhebenSelektion() 
        {document.querySelectorAll('.checker.selected').forEach(stein => {stein.classList.remove('selected');});
		ausgewaehlteZacke = null;}
	// --- BACKGAMMON SPIELSTEINE-STARTAUFSTELLUNG INIZIALISIEREN ---
	const startAufstellung = {1:  { spieler: 'Weiß', anzahl: 2 },
    	6:  { spieler: 'Schwarz', anzahl: 5 },
		8:  { spieler: 'Schwarz', anzahl: 3 },
		12: { spieler: 'Weiß', anzahl: 5 } ,
		13: { spieler: 'Schwarz', anzahl: 5 },
		17: { spieler: 'Weiß', anzahl: 3 },
		19: { spieler: 'Weiß', anzahl: 5 },
		24: { spieler: 'Schwarz', anzahl: 2 }};
export function platziereStartSteine() {document.querySelectorAll('.point').forEach(zacke => {zacke.innerHTML = '';});
		for (const zackeId in startAufstellung) {const zackeInfo = startAufstellung[zackeId];
			const zackeElement = document.querySelector(`.point[data-point="${zackeId}"]`);
				if (zackeElement) {for (let i = 0; i < zackeInfo.anzahl; i++) {
					const stein = document.createElement('div');
					stein.className = `checker ${zackeInfo.spieler}`;
					zackeElement.appendChild(stein);}}}}
	// Startaufstellung sofort beim Laden triggern  
    platziereStartSteine();
export function pruefeSpielerWechsel() {
        if (verbleibendeZuege.length === 0) {
            const name1 = spieler1Input ? spieler1Input.value.trim() || "Spieler 1" : "Spieler 1";
            const name2 = spieler2Input ? spieler2Input.value.trim() || "Spieler 2" : "Spieler 2";

            if (aktiverSpielerFarbe === "Weiß") {
                aktiverSpielerFarbe = "Schwarz";
                if (anzeigeSpieler) anzeigeSpieler.textContent = name2 + " (Schwarz)";
            } else {
                aktiverSpielerFarbe = "Weiß";
                if (anzeigeSpieler) anzeigeSpieler.textContent = name1 + " (Weiß)";
            }
            i18nAlert('alerts.changeplayer_message', {
                defaultValue: 'Spielerwechsel! {{playerName}} ist am Zug.',
                playerName: aktiverSpielerFarbe === "Weiß" ? name1 : name2
            });
            //i18nAlert('changeplayer_message',{defaultValue:`Spielerwechsel! ${aktiverSpielerFarbe === "Weiß" ? name1 : name2} ist am Zug.`});
        }
    }
export function darfAusspielen(spielerFarbe) {
    // Wenn noch Steine auf der Bar liegen, darf man nicht ausspielen!
    if (spielerFarbe === "Weiß" && barWeiß > 0) return false;
    if (spielerFarbe === "Schwarz" && barSchwarz > 0) return false;

    // Alle Points auf dem Brett durchsuchen
    const allePoints = document.querySelectorAll('.point');
    let steineAuserhalb = 0;

    allePoints.forEach(zacke => {
        const punktId = parseInt(zacke.getAttribute('data-point'));
        const steineDesSpielers = zacke.querySelectorAll(`.checker.${spielerFarbe}`).length;

        if (spielerFarbe === "Weiß") {
            // Weiß darf NUR noch auf den Feldern 19-24 Steine haben. 
            // Also zählen wir alle Steine auf den Feldern 1 bis 18:
            if (punktId <= 18) steineAuserhalb += steineDesSpielers;
        } else {
            // Schwarz darf NUR noch auf den Feldern 1-6 Steine haben.
            // Also zählen wir alle Steine auf den Feldern 7 bis 24:
            if (punktId >= 7) steineAuserhalb += steineDesSpielers;
        }
    });

    // Wenn 0 Steine außerhalb sind, ist der Weg frei fürs Finale!
    return steineAuserhalb === 0;
    }
	// --- DIALOG FENSTER SPIELANLEITUNG ---
	const modal = document.getElementById('rules-modal');
	const openBtn = document.getElementById('open-rules');
	const closeBtn = document.getElementById('close-rules');
	if (modal && openBtn && closeBtn) {openBtn.addEventListener('click', () => { modal.showModal(); });
		closeBtn.addEventListener('click', () => { modal.close(); });
		modal.addEventListener('click', (e) => {const dialogDimensions = modal.getBoundingClientRect();
			if (e.clientX < dialogDimensions.left ||e.clientX > dialogDimensions.right ||e.clientY < dialogDimensions.top ||e.clientY > dialogDimensions.bottom) 
				{modal.close();
					}});
	};
////Spielende - once again ?
// --- HIGHSCORE AUS LOCALSTORAGE LADEN ODER NEU STARTEN ---
// Diese Zeile ganz oben in deiner Datei (oder dort, wo highscoreListe definiert ist) platzieren:
export let highscoreListe = JSON.parse(localStorage.getItem("backgammon_highscores")) || [];
// --- HIGHSCORE-ANZEIGE IM HTML AKTUALISIEREN ---
export function aktualisiereHighscoreAnzeige() {
    const listenElement = document.getElementById("highscore-liste");
    if (!listenElement) return; // Falls das Element auf der aktuellen Seite nicht existiert, abbrechen

    listenElement.innerHTML = ""; // Liste zuerst leeren, um Dopplungen zu vermeiden

    // Jeden Namen aus dem Array als Listeneintrag hinzufügen
    highscoreListe.forEach((eintrag) => {
        const li = document.createElement("li");
        
        // Da 'eintrag' jetzt ein Objekt ist, greifen wir gezielt auf .name, .farbe und .datum zu!
        li.innerHTML = `
            <strong style="color: #333;">${eintrag.name}</strong> 
            <span style="font-size: 0.85em; color: #666;">
                (${farbuebersetzungen}) - ${eintrag.datum}
            </span>
        `;
        
        listenElement.appendChild(li);
    });
}
// --- SPIELENDE: EINFACHER SEITENWECHSEL ---
const btnRestart = document.getElementById("btn-restart-same");
const btnAgain = document.getElementById("btn-restart-new");

// Mit denselben Spielern noch einmal (zurück zum leeren Spielbrett)
if (btnRestart) {
    btnRestart.addEventListener("click", () => {
        switchPage("backgammon");
    });
}

// Ganz von vorn (zurück zur Namenseingabe)
if (btnAgain) {
    btnAgain.addEventListener("click", () => {
        switchPage("spielstart");
    });
}
//if (typeof aktualisiereHighscoreAnzeige === "function") {
//    aktualisiereHighscoreAnzeige();
//}
// --- HIGHSCORE BUTTON: EIN- UND AUSBLENDEN ---
const btnToggleHighscore = document.getElementById("btn-toggle-highscore");
if (btnToggleHighscore) {
    btnToggleHighscore.addEventListener("click", () => {
        const container = document.querySelector(".highscore-container");
        if (container) {
            // Wenn unsichtbar oder leer, dann anzeigen, sonst verstecken
            if (container.style.display === "none" || container.style.display === "") {
                container.style.display = "block";
            } else {
                container.style.display = "none";
            }
        }
    });
}
// Statt dem alten t('key') schreiben Sie jetzt einfach:
//const fehlerText = i18n.t('errors.invalid_input');