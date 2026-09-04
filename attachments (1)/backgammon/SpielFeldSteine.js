export class SpielFeld {
    constructor(){
        this.spielFeldId = "";
        this.felder = [];
        this.sizeX = "";
        this.sizeY = "";
    }
    NumSteine(){

    }
}
export class Felder {
    constructor(){
        this.feldId = "";
        this.posX = "";
        this.posY = "";
        this.form = "dreieck"
    }
}
export class SpezialFelder {
    constructor(){
        this.spezialFeldId = "";
        this.FeldName = "";
        this.posX = "";
        this.posY =""; 

    }
}
export class Steine {
    constructor(farbe){
        this.farbe = farbe;
        this.position=[];
        this.anzahl="";
        this.form="rund";
    }
    steinBewegen(neuePos) {
    }
}
export class SteineWeiß extends Steine{
    constructor(steinId, startPos, feldId){
        super('weiß', startPos);

        this.steinId=steinId;
        this.feldId = feldId;
        this.anzahlmax = 15;
    }

}
export class SteineSchwarz extends Steine {
    constructor(steinId, startPos, feldId){
        super('schwarz', startPos);

        this.steinId = steinId;
        this.feldId = feldId;
        this.anzahlmax = 15;
    }

}