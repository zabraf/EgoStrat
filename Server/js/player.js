class Player{
    constructor(anUsername,aColor){
        this.isRacist = Math.floor(Math.random()*1000) == 1;
        this.color = aColor;
        this.username = anUsername;
    }
}