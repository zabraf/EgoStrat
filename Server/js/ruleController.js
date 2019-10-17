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

    /**
     * 
     * @param {string} aPlayer1Username 
     * @param {string} aPlayer2Username 
     * @param {number} Width 
     * @param {number} Height 
     * @param {Array<GameSet>} aListOfPieces 'PieceName' : nbPieces 
     */
    constructor(aPlayer1Username = "P1",aPlayer2Username = "P2",Width = 10,Height = 10,aListOfPieces = DEFAULT_SET){
        movablePieces = aListOfPieces['CAPTAIN'] +
        aListOfPieces['COLONEL'] +
        aListOfPieces['GENERAL'] +
        aListOfPieces['LIEUTENANT'] +
        aListOfPieces['MAJOR'] +
        aListOfPieces['MARSHAL'] +
        aListOfPieces['MINER'] +
        aListOfPieces['SCOUT'] +
        aListOfPieces['SERGEANT'] +
        aListOfPieces['SPY'];

        if(aPlayer1Username == aPlayer2Username){
            throw new Exception("Cannot have 2 same username");
        }
        this.player1 = new Player(aPlayer1Username,color.RED,movablePieces);
        this.player2 = new Player(aPlayer2Username,color.BLUE,movablePieces);

        this.map = [];

        this.Width = Width;
        this.Height = Height;
        var WidthDivided = 100 / Width
        var HeightDivided = 100 / Height
        for (var i = 0; i < Width; i++) {
            for (var j = 0; j < Height; j++) {
                if (WidthDivided * i == 20 || WidthDivided * i == 30 || WidthDivided * i == 60 || WidthDivided * i == 70 &&HeightDivided * j == 40 || HeightDividedgit * j == 50) {
                    map[i][j] = new tile(false);
                }
                map[i][j] = new tile();
            }

        }
    }
    MovePiece(tileDeparture, tileArrival) {
        var result = false;
        


        return result;
    }
    Fight(piece1, piece2) {
        var result = piece1;

        //Compare the strengths
        if (piece2.GetType().strength > piece1.GetType().strength) {
            result = piece2;
        } else if (piece2.GetType().strength < piece1.GetType().strength) {
            result = piece1;
        } else {
            result = null;

            this.Die(piece1);
            this.Die(piece2);

            this.CheckWin(piece1.GetPlayer());
            this.CheckWin(piece2.GetPlayer());
        }

        //Special cases
        switch (piece1.GetType()) {
            case type.MINER:
                if (piece2.GetType() == type.BOMB) {
                    result = piece1;
                }
                break;
            case type.SPY:
                if (piece2.GetType() == type.MARSHAL) {
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

        if (result == piece1) {
            piece2.Die();
            this.CheckWin(piece1.GetPlayer());
        } else if (result == piece2) {
            piece1.Die();
            this.CheckWin(piece2.GetPlayer());
        }

        return result;
    }
    CheckWin(player) {
        var result = false;

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
    DrawMap() {
        for (var i = 0; i < Width; i++) {
            for (var j = 0; j < Height; i++) {
                map[i][j].DrawTile();
            }

        }

    }
    CheckPieceCanGo(tileDeparture,tileArrival) {
        var result = false;

        return result;
    }


}