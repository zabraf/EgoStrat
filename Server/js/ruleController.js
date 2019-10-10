const color = {
    BLUE : 'blue',
    RED : 'red',
    SPECTATOR : 'grey'
}
const type = {
    MARSHAL     : {name:'MARSHAL',img : '/img/marshal.svg', strength : 10} ,
    GENERAL     : {name:'GENERAL',img : '/img/general.svg', strength : 9} ,
    COLONEL     : {name:'COLONEL',img : '/img/colonel.svg', strength : 8},
    MAJOR       : {name:'MAJOR',img : '/img/major.svg', strength : 7},
    CAPTAIN     : {name:'CAPTAIN',img : '/img/captain.svg', strength : 6} ,
    LIEUTENANT  : {name:'LIEUTENANT',img : '/img/lieutenant.svg', strength : 5},
    SERGEANT    : {name:'SERGEANT',img : '/img/sergeant.svg', strength : 4} ,
    MINER       : {name:'MINER',img : '/img/miner.svg', strength : 3} ,
    SCOUT       : {name:'SCOUT',img : '/img/scout.svg', strength : 2} ,
    SPY         : {name:'SPY',img : '/img/spy.svg', strength : 1},
    FLAG        : {name:'FLAG',img : '/img/flag.svg', strength : 0},
    BOMB        : {name:'BOMB',img : '/img/bomb.svg',strength : 11} ,
}

const DEFAULT_SET = {
    'MARSHAL'    : 1 ,
    'GENERAL'    : 1 ,
    'COLONEL'    : 2 ,
    'MAJOR'      : 3 ,
    'CAPTAIN'    : 4 ,
    'LIEUTENANT' : 4 ,
    'SERGEANT'   : 4 ,
    'MINER'      : 5 ,
    'SCOUT'      : 8 ,
    'SPY'        : 1 ,
    'FLAG'       : 1 ,
    'BOMB'       : 6 ,
}

class RuleController{
    constructor(aMap,aPlayer1,aPlayer2,aListOfPieces = DEFAULT_SET){
        this.map = aMap;
        this.player1 = aPlayer1;
        this.player2 = aPlayer2;
        this.piecesPlayer1 = aListOfPieces;
        this.piecesPlayer2 = aListOfPieces;
    }
    MovePiece(piece,tileDeparture,tileArrival){
        var result = false;

        return result;
    }
    Die(piece){
        if (piece.player == this.player1){
            this.piecesPlayer1[piece.GetType().name] -= 1;
        }else{
            this.piecesPlayer2[piece.GetType().name] -= 1;
        }
        piece.Die();
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

            this.Die(piece1);
            this.Die(piece2);

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
            
            this.Die(piece2);
            this.CheckWinP1();
        }else if(result == piece2){
            this.Die(piece1);
            this.CheckWinP2();
        }

        return result;
    }
    CheckWinP1(){
        var remainingOpponent = this.piecesPlayer1['CAPTAIN'] +
        this.piecesPlayer1['COLONEL'] +
        this.piecesPlayer1['GENERAL'] +
        this.piecesPlayer1['LIEUTENANT'] +
        this.piecesPlayer1['MAJOR'] +
        this.piecesPlayer1['MARSHAL'] +
        this.piecesPlayer1['MINER'] +
        this.piecesPlayer1['SCOUT'] +
        this.piecesPlayer1['SERGEANT'] +
        this.piecesPlayer1['SPY'];

        return remainingOpponent <= 0 || this.piecesPlayer2['FLAG'] == 0;
    }
    CheckWinP2(){
        var remainingOpponent = this.piecesPlayer2['CAPTAIN'] +
        this.piecesPlayer2['COLONEL'] +
        this.piecesPlayer2['GENERAL'] +
        this.piecesPlayer2['LIEUTENANT'] +
        this.piecesPlayer2['MAJOR'] +
        this.piecesPlayer2['MARSHAL'] +
        this.piecesPlayer2['MINER'] +
        this.piecesPlayer2['SCOUT'] +
        this.piecesPlayer2['SERGEANT'] +
        this.piecesPlayer2['SPY'];

        return remainingOpponent <= 0 || this.piecesPlayer1['FLAG'] == 0;
    }
    DrawMap(){

    }
    CheckPieceEmplacement(piece,tile){
        var result = false;

        return result;
    }


}