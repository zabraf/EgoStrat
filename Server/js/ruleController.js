const color = {
    BLUE : '',
    RED : '',
    SPECTATOR : ''
}
const type = {
    MARSHAL : {img : '/img/marshal.svg', strength : 10} ,
    GENERAL : {img : '/img/general.svg', strength : 9} ,
    COLONEL : {img : '/img/colonel.svg', strength : 8},
    MAJOR : {img : '/img/major.svg', strength : 7},
    CAPTAIN : {img : '/img/captain.svg', strength : 6} ,
    LIEUTENANT : {img : '/img/lieutenant.svg', strength : 5},
    SERGEANT : {img : '/img/sergeant.svg', strength : 4} ,
    MINER : {img : '/img/miner.svg', strength : 3} ,
    SCOUT : {img : '/img/scout.svg', strength : 2} ,
    SPY : {img : '/img/spy.svg', strength : 1},
    FLAG : {img : '/img/flag.svg', strength : 0},
    BOMB : {img : '/img/bomb.svg',strength : 11} ,
}
class RuleController{
    constructor(aMap,aPlayer1,aPlayer2){
        this.map = aMap;
        this.player1 = aPlayer1;
        this.player2 = aPlayer2;
    }
    MovePiece(piece,tileDeparture,tileArrival){
        var result = false;

        return result;
    }
    Fight(piece1, piece2){
        var result = piece1;

        //Compare the strengths
        if(piece2.GetType().strength > piece1.GetType().strength){
            result = piece2;
        }else if (piece2.GetType().strength < piece1.GetType().strength){
            result = piece1;
        }else{
            result = null;

            piece1.Die();
            piece2.Die();

            this.CheckWin(piece1.GetPlayer());
            this.CheckWin(piece2.GetPlayer());
        }

        //Special cases
        switch(piece1.GetType()){
            case type.MINER:
                    if(piece2.GetType() == type.BOMB){
                        result = piece1;
                    }
                break;
            case type.SPY:
                if(piece2.GetType() == type.MARSHAL){
                    result = piece1;
                }
                break;
            case type.MARSHAL:
            case type.GENERAL:
            case type.COLONEL:
            case type.MAJOR:
            case type.CAPTAIN:
            case type.LIEUTENANT:
            case type.SERGEANT:
            case type.SCOUT:
                break;
            case type.FLAG:
            case type.BOMB:
            default:
                throw new Exception('Impossible Fight');
                break;
            
        }

        if(result == piece1){
            piece2.Die();
            this.CheckWin(piece1.GetPlayer());
        }else if(result == piece2){
            piece1.Die();
            this.CheckWin(piece2.GetPlayer());
        }

        return result;
    }
    CheckWin(player){
        var result = false;

        return result;
    }
    DrawMap(){

    }
    CheckPieceEmplacement(piece,tile){
        var result = false;

        return result;
    }


}