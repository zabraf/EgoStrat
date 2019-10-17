class Player{
    constructor(anUsername,aColor,aNbMovablePieces){
        this.isRacist = Math.floor(Math.random()*1000) == 1;
        this.color = aColor;
        this.username = anUsername;
        this.flagAlive = true;
        this.nbMovablePiece = aNbMovablePieces;
    }
}