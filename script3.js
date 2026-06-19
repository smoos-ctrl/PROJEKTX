// =========================================================================
// BEREICH 1: GLOBALE FUNKTIONEN (Müssen frei stehen, ohne DOMContentLoaded)
// =========================================================================

// Seite vorlesen 
function ganzeSeiteVorlesen() {
    window.speechSynthesis.cancel();
    const text = document.body.innerText;
    const sprachAusgabe = new SpeechSynthesisUtterance(text);
    sprachAusgabe.lang = "de-DE";

    sprachAusgabe.onerror = function(event) {
        console.error("Sprachausgabe-Fehler detektiert: ", event.error);
        alert("Der Browser verweigert das Vorlesen. Grund: " + event.error);
    };

    sprachAusgabe.onstart = function() {
        console.log("Sprachausgabe erfolgreich gestartet.");
    };

    window.speechSynthesis.getVoices();
    window.speechSynthesis.speak(sprachAusgabe);
}

function changeFontSize(action) {
  const root = document.documentElement;
  // Liest die aktuelle Schriftgröße aus (Standard meist 16px)
  let currentSize = parseFloat(window.getComputedStyle(root).fontSize);
  
  if (action === 'increase') {
    root.style.fontSize = (currentSize + 2) + 'px';
  } else if (action === 'decrease') {
    root.style.fontSize = (currentSize - 2) + 'px';
  }
}

// Seiten umschalten (Navigation)
function switchPage(zielId) {
    if (!zielId) return;
    
    const gesäuberteId = zielId.replace("#", "").toLowerCase();

    document.querySelectorAll(".seite").forEach(seite => {
        seite.classList.remove("aktiv");
    });

    const zielSeite = document.getElementById(gesäuberteId);
    if (zielSeite) {
        zielSeite.classList.add("aktiv");
    }
}

// Elemente ein-/ausblenden (Leistungen)
function umschalten(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (element.style.display === 'none') {
        element.style.display = '';
    } else {
        element.style.display = 'none';
    }
}

// Kontaktformulardaten als Datei speichern
function speichereDatenAlsDatei(event) {
    event.preventDefault(); 

    const name = document.getElementById('name')?.value || "Unbekannt";
    const email = document.getElementById('email')?.value || "Keine E-Mail";
    const nachricht = document.getElementById('kontaktarea')?.value || "";
    const datum = new Date().toLocaleString(); 

    const dateiInhalt = `KONTAKTFORMULAR AUSWERTUNG\n===========================\nDatum: ${datum}\nName: ${name}\nE-Mail: ${email}\nNachricht:\n${nachricht}`;

    const blob = new Blob([dateiInhalt], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `nachricht_${name.replace(/\s+/g, '_')}.txt`; 
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    event.target.reset();
}


// =========================================================================
// BEREICH 2: DAS REPARIERTE HAUPT-NEST (Wartet, bis das HTML bereit ist)
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {

    // --- MENÜBUTTON UND LISTE ---
    const menuButtonMain = document.getElementById("menuButtonMain");
    const listboxmain = document.getElementById("listboxmain");

    if (menuButtonMain && listboxmain) {
        menuButtonMain.addEventListener("click", () => {
            if (listboxmain.style.display === "" || listboxmain.style.display === "none") {
                listboxmain.style.display = "block";
            } else {
                listboxmain.style.display = "none";
            }
        });
    }

    // --- LINKSVERKNÜPFUNG ---
    document.querySelectorAll("header a, nav a, footer a").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); 
            const ziel = link.getAttribute("href");
            switchPage(ziel); 
        });
    });

    // --- SELECT MENÜ NAVIGATION ---
    const selectMenue = document.querySelector("#listboxmain select");
    if (selectMenue) {
        selectMenue.addEventListener("change", (event) => {
            switchPage(event.target.value);
        });
    }

    // --- NOTEN- / GRADE-BUTTON ---
    const zweiButton = document.getElementById("zweibutton");
    const gradeSelect = document.getElementById("grade");
    if (zweiButton && gradeSelect) {
        zweiButton.addEventListener("click", () => {
            if (gradeSelect.style.display === "" || gradeSelect.style.display === "none") {
                gradeSelect.style.display = "block";
                if (gradeSelect.children.length === 0) {
                    const options1 = ['Sehr gut', 'Gut', 'Befriedigend', 'Ausreichend', 'Mangelhaft', 'Ungenügend', 'out of order'];
                    for (let i = 0; i < options1.length; i++) {
                        const optionElement = document.createElement('option');
                        optionElement.value = options1[i];
                        optionElement.appendChild(document.createTextNode(options1[i]));
                        gradeSelect.appendChild(optionElement);
                    }   
                }
            } else {
                gradeSelect.style.display = "none";
            }
        });
    }

    // --- KONTAKTFORMULAR VERKNÜPFUNG ---
    const kontaktFormular = document.getElementById('meinKontaktFormular');
    if (kontaktFormular) {
        kontaktFormular.addEventListener('submit', speichereDatenAlsDatei);
    }
    //Alles um BAckgammon ab hier ----------
    // -------------------------------------------------------------
    // --- SPIELSTART LOGIK ---
    const btnSpielstarten = document.getElementById("spielstarten");
    const spieler1Input = document.getElementById("spieler1");
    const spieler2Input = document.getElementById("spieler2");
    const anzeigeSpieler = document.getElementById("aktueller-spieler");

    if (btnSpielstarten && spieler1Input && spieler2Input) {
        btnSpielstarten.addEventListener("click", () => {
            if (spieler1Input.value.trim() === "" || spieler2Input.value.trim() === "") {
                alert("Bitte geben Sie die Namen beider Spieler ein!");
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
    let barWeiss = 0;
    let barSchwarz = 0;
    let ausgespielteSteineWeiss = 0;
    let ausgespielteSteineSchwarz = 0;
    let highscore = [];

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
                        alert(name1 + " gewinnt den Startwurf und beginnt (Farbe: Weiß)!");
                        aktiverSpielerFarbe = "weiss";
                        if (anzeigeSpieler) anzeigeSpieler.textContent = name1 + " (Weiß)";
                        phase = "spiel";
                        btnRoll.textContent = "Regulär Würfeln";
                        // WICHTIG: Die Startwürfel direkt als Züge eintragen!
                        verbleibendeZuege = [wurfSpieler1, wurfSpieler2]; 
                    } 
                    else if (wurfSpieler2 > wurfSpieler1) {
                        alert(name2 + " gewinnt den Startwurf und beginnt (Farbe: Weiss)!");
                        aktiverSpielerFarbe = "weiss";
                        if (anzeigeSpieler) anzeigeSpieler.textContent = name2 + " (weiss)";
                        phase = "spiel";
                        btnRoll.textContent = "Regulär Würfeln";
                        // WICHTIG: Die Startwürfel direkt als Züge eintragen!
                        verbleibendeZuege = [wurfSpieler1, wurfSpieler2]; 
                    } 
                    else {
                        alert("Gleichstand! Bitte noch einmal würfeln.");
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
                    alert("Du musst erst deine Züge machen!");
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
                alert("Bitte zuerst würfeln!");
                return;
            }

            const zuId = parseInt(zacke.getAttribute('data-point'));
            const istObereReihe = zacke.parentElement.classList.contains('top-row');

            // --- PRÜFUNG: HAT DER SPIELER STEINE AUF DER BAR? ---
            const hatSteineAufBar = (aktiverSpielerFarbe === "weiss" && barWeiss > 0) || (aktiverSpielerFarbe === "schwarz" && barSchwarz > 0);

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
                let barDistanz = aktiverSpielerFarbe === "weiss" ? zuId : (25 - zuId);

                // Prüfen, ob die gewürfelten Augen zu diesem Einstiegsfeld passen
                const wuerfelIndex = verbleibendeZuege.indexOf(barDistanz);

                if (wuerfelIndex !== -1) {
                    // Prüfen, ob das Feld frei ist (weniger als 2 gegnerische Steine)
                    const gegnerFarbe = aktiverSpielerFarbe === "weiss" ? "schwarz" : "weiss";
                    const gegnerSteineAnzahl = zacke.querySelectorAll(`.checker.${gegnerFarbe}`).length;

                    if (gegnerSteineAnzahl >= 2) {
                        alert("Dieses Einstiegsfeld ist vom Gegner blockiert!");
                        return;
                    }

                    // --- ZUG VON DER BAR AUSFÜHREN ---
                    const barZoneId = aktiverSpielerFarbe === "weiss" ? "bar-weiss-zone" : "bar-schwarz-zone";
                    const barZone = document.getElementById(barZoneId);
                    
                    if (barZone && barZone.lastElementChild) {
                        const steinVonBar = barZone.lastElementChild;
                        
                        // Falls der Gegner dort genau 1 Stein hat -> Schlagen!
                        if (gegnerSteineAnzahl === 1) {
                            alert(`💥 Direkt beim Einstieg gekickt! Der ${gegnerFarbe}e Stein muss auf die Bar!`);
                            const geschlagenerStein = zacke.querySelector(`.checker.${gegnerFarbe}`);
                            const zielBarZone = document.getElementById(gegnerFarbe === "weiss" ? "bar-weiss-zone" : "bar-schwarz-zone");
                            if (geschlagenerStein && zielBarZone) {
                                zielBarZone.appendChild(geschlagenerStein);
                            }
                            if (gegnerFarbe === "weiss") barWeiss++; else barSchwarz++;
                        }

                        // Stein von der Bar auf das angeklickte Feld setzen
                        zacke.appendChild(steinVonBar);
                        
                        // Zähler verringern
                        if (aktiverSpielerFarbe === "weiss") barWeiss--; else barSchwarz--;
                        
                        // Würfel abziehen und Zug beenden
                        verbleibendeZuege.splice(wuerfelIndex, 1);
                        pruefeSpielerWechsel();
                        alert(`Stein erfolgreich von der Bar ins Feld ${zuId} eingesetzt!`);
                    }
                } else {
                    alert(`Ungültiger Einstieg! Du kannst mit deinen Würfeln [${verbleibendeZuege.join(", ")}] nicht auf Feld ${zuId} einsteigen (benötigte Augenzahl: ${barDistanz}).`);
                }
                return; // Wichtig: Verhindert, dass der normale Auswahlcode danach ausgeführt wird!
            }

                if (obersterStein && obersterStein.classList.contains(aktiverSpielerFarbe)) {
                    document.querySelectorAll('.checker.selected').forEach(s => s.classList.remove('selected'));
                    obersterStein.classList.add('selected');
                    ausgewaehlteZacke = zacke;
                } else if (obersterStein) {
                    alert("Das ist nicht dein Stein!");
                }
            } 
            // FALL 2: Abbrechen bei Klick auf dieselbe Zacke
            else if (ausgewaehlteZacke === zacke) {
                aufhebenSelektion();
            } 
            // FALL 3: Stein bewegen / Schlagen (Normaler Zug vom Feld)
            else {
                const vonId = parseInt(ausgewaehlteZacke.getAttribute('data-point'));
                let distanz = aktiverSpielerFarbe === "weiss" ? (zuId - vonId) : (vonId - zuId);

                if (distanz <= 0) {
                    alert("Falsche Richtung! Du musst dich vorwärts bewegen.");
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
                alert("Du musst erst ALLE deine Steine in dein Heimfeld bringen!");
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
            let benoetigteAugen = aktiverSpielerFarbe === "weiss" ? (25 - vonId) : vonId;

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
                if (aktiverSpielerFarbe === "weiss") {
                    ausgespielteSteineWeiss++;
                } else {
                    ausgespielteSteineSchwarz++;
                }

                // Würfel abziehen und Auswahl säubern
                verbleibendeZuege.splice(wuerfelIndex, 1);
                aufhebenSelektion();

                alert(`Ein ${aktiverSpielerFarbe}er Stein wurde ausgespielt!`);

                // GEWINN-PRÜFUNG: Wer 15 Steine draußen hat, gewinnt das Match!
                if (ausgespielteSteineWeiss === 15) {
                    const sieger = spieler1Input ? spieler1Input.value.trim() || "Spieler 1" : "Spieler 1";
                    alert(`🏆 Herzlichen Glückwunsch! ${sieger} WEISS hat das Spiel gewonnen!`);
                    highscoreListe.push(sieger); // Name ins Array speichern
                    if (typeof aktualisiereHighscoreAnzeige === "function") aktualisiereHighscoreAnzeige(); 
                    
                    // ZÜGE SOFORT SPERREN (Damit der andere nicht weiterspielt!)
                    verbleibendeZuege = []; 
                    phase = "auslosung"; // Spiel zurücksetzen
                    //zu spielende springen
                    switchPage("spielende");

                } else if (ausgespielteSteineSchwarz === 15) {
                    const sieger = spieler2Input ? spieler2Input.value.trim() || "Spieler 2" : "Spieler 2";
                    alert(`🏆 Herzlichen Glückwunsch! ${sieger}  SCHWARZ hat das Spiel gewonnen!`);

                    highscoreListe.push(sieger); // Name ins Array speichern
                    if (typeof aktualisiereHighscoreAnzeige === "function") aktualisiereHighscoreAnzeige(); 
                    
                    // ZÜGE SOFORT SPERREN (Damit der andere nicht weiterspielt!)
                    verbleibendeZuege = []; 
                    phase = "auslosung";
                    //zu spielende springen
                    switchPage("spielende");
                }

                pruefeSpielerWechsel();
            } else {
                alert(`Du hast keinen passenden Würfel, um einen Stein von Feld ${vonId} herauszuspielen (benötigt: ${benoetigteAugen}).`);
            }
        });
    });

    // --- HILFSFUNKTION FÜR ZUGBERECHNUNG UND SCHLAGEN ---
    function fuehreZugAus(distanz, zielZacke, bewegeSteinDOMFunktion) {
        const wuerfelIndex = verbleibendeZuege.indexOf(distanz);

        if (wuerfelIndex !== -1) {
            const gegnerFarbe = aktiverSpielerFarbe === "weiss" ? "schwarz" : "weiss";
            const gegnerSteine = zielZacke.querySelectorAll(`.checker.${gegnerFarbe}`);
            const gegnerSteineAnzahl = gegnerSteine.length;

            if (gegnerSteineAnzahl >= 2) {
                alert("Dieser Point ist vom Gegner blockiert!");
                aufhebenSelektion();
                return;
            }

        // SCHLAGEN: 1 gegnerischer Stein wandert auf die Bar
        if (gegnerSteineAnzahl === 1) {
            const gegnerFarbe = aktiverSpielerFarbe === "weiss" ? "schwarz" : "weiss";
            const geschlagenerStein = zielZacke.querySelector(`.checker.${gegnerFarbe}`);
            
            if (geschlagenerStein) {
                alert(`💥 Gekickt! Der ${gegnerFarbe}e Stein wurde auf die Bar geschlagen!`);
                
                // Stein von der Zacke lösen und in die richtige Bar-Zone verschieben
                const barZoneId = gegnerFarbe === "weiss" ? "bar-weiss-zone" : "bar-schwarz-zone";
                const barZone = document.getElementById(barZoneId);
                
                if (barZone) {
                    // Auswahl-Klasse zur Sicherheit entfernen, falls er markiert war
                    geschlagenerStein.classList.remove('selected');
                    barZone.appendChild(geschlagenerStein); // Physisch verschieben!
                }
                
                // Counter im Hintergrund erhöhen
                if (gegnerFarbe === "weiss") barWeiss++;
                else barSchwarz++;
            }
        }
            
            

            // Physischen Stein im DOM verschieben
            bewegeSteinDOMFunktion();
            
            verbleibendeZuege.splice(wuerfelIndex, 1);
            aufhebenSelektion();
            pruefeSpielerWechsel();
        } else {
            alert(`Ungültiger Zug! Keine passende Würfelzahl für ${distanz} Felder.`);
            aufhebenSelektion();
        }
    }

    function aufhebenSelektion() 
        {document.querySelectorAll('.checker.selected').forEach(stein => {stein.classList.remove('selected');});
		ausgewaehlteZacke = null;}
	// --- BACKGAMMON SPIELSTEINE-STARTAUFSTELLUNG INIZIALISIEREN ---
	const startAufstellung = {1:  { spieler: 'weiss', anzahl: 2 },
    	6:  { spieler: 'schwarz', anzahl: 5 },
		8:  { spieler: 'schwarz', anzahl: 3 },
		12: { spieler: 'weiss', anzahl: 5 } ,
		13: { spieler: 'schwarz', anzahl: 5 },
		17: { spieler: 'weiss', anzahl: 3 },
		19: { spieler: 'weiss', anzahl: 5 },
		24: { spieler: 'schwarz', anzahl: 2 }};
	
    function platziereStartSteine() {document.querySelectorAll('.point').forEach(zacke => {zacke.innerHTML = '';});
		for (const zackeId in startAufstellung) {const zackeInfo = startAufstellung[zackeId];
			const zackeElement = document.querySelector(`.point[data-point="${zackeId}"]`);
				if (zackeElement) {for (let i = 0; i < zackeInfo.anzahl; i++) {
					const stein = document.createElement('div');
					stein.className = `checker ${zackeInfo.spieler}`;
					zackeElement.appendChild(stein);}}}}
	// Startaufstellung sofort beim Laden triggern  
    platziereStartSteine();
      
    function pruefeSpielerWechsel() {
        if (verbleibendeZuege.length === 0) {
            const name1 = spieler1Input ? spieler1Input.value.trim() || "Spieler 1" : "Spieler 1";
            const name2 = spieler2Input ? spieler2Input.value.trim() || "Spieler 2" : "Spieler 2";

            if (aktiverSpielerFarbe === "weiss") {
                aktiverSpielerFarbe = "schwarz";
                if (anzeigeSpieler) anzeigeSpieler.textContent = name2 + " (Schwarz)";
            } else {
                aktiverSpielerFarbe = "weiss";
                if (anzeigeSpieler) anzeigeSpieler.textContent = name1 + " (Weiß)";
            }
            alert(`Spielerwechsel! ${aktiverSpielerFarbe === "weiss" ? name1 : name2} ist am Zug.`);
        }
    }
    function darfAusspielen(spielerFarbe) {
    // Wenn noch Steine auf der Bar liegen, darf man nicht ausspielen!
    if (spielerFarbe === "weiss" && barWeiss > 0) return false;
    if (spielerFarbe === "schwarz" && barSchwarz > 0) return false;

    // Alle Points auf dem Brett durchsuchen
    const allePoints = document.querySelectorAll('.point');
    let steineAuserhalb = 0;

    allePoints.forEach(zacke => {
        const punktId = parseInt(zacke.getAttribute('data-point'));
        const steineDesSpielers = zacke.querySelectorAll(`.checker.${spielerFarbe}`).length;

        if (spielerFarbe === "weiss") {
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
	}});
////Spielende - once again ?

// --- HIGHSCORE-ANZEIGE IM HTML AKTUALISIEREN ---
function aktualisiereHighscoreAnzeige() {
    const listenElement = document.getElementById("highscore-liste");
    if (!listenElement) return; // Falls das Element auf der aktuellen Seite nicht existiert, abbrechen

    listenElement.innerHTML = ""; // Liste zuerst leeren, um Dopplungen zu vermeiden

    // Jeden Namen aus dem Array als Listeneintrag hinzufügen
    highscoreListe.forEach((name) => {
        const eintrag = document.createElement("li");
        eintrag.textContent = name;
        listenElement.appendChild(eintrag);
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