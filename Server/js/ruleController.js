const color = {
    BLUE : '',
    RED : '',
    SPECTATOR : ''
}
const type = {
    BOMB : '/img/bomb.svg' ,
    CAPTAIN : '/img/captain.svg' ,
    COLONEL : '/img/colonel.svg',
    FLAG : '/img/flag.svg',
    GENERAL : '/img/general.svg' ,
    LIEUTENANT : '/img/lieutenant.svg',
    MAJOR : '/img/major.svg',
    MARSHAL : '/img/marshal.svg' ,
    MINER : '/img/miner.svg' ,
    SCOUT : '/img/scout.svg' ,
    SERGEANT : '/img/sergeant.svg' ,
    SPY : '/img/spy.svg'
}
class RuleController{
    constructor(aMap,aPlayer1,aPlayer2){
        this.map = aMap;
        this.player1 = aPlayer1;
        this.player2 = aPlayer2;
    }
}