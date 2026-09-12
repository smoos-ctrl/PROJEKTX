export class Würfel {
    constructor(){
        this.würfelId = "";
        this.posX = "";
        this.posY = "";
        this.form = "quadrat";
    }
    #randomNum(){
        return num = Math.floor(Math.random() * 6) + 1;
    }
    sendNum(){
        return this.#randomNum(); 
    }
}
export class Spieler {
    constructor(spielerId){
        this.spielerId = "";
        this.anzahl = "";
        this.spielerName = "";
        this.wins = false;
    }
    anmelden(name){
        this.spielerName = name
    }

}