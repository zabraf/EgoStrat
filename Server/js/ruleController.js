let Tile = require('./tile');
let Piece = require('./piece');
let Player = require('./player');

const color = {
    BLUE: 'blue',
    RED: 'red',
    SPECTATOR: 'grey'
}
const type = {
    MARSHAL: { name: 'MARSHAL', img: '/img/marshal.svg', strength: 10 },
    GENERAL: { name: 'GENERAL', img: '/img/general.svg', strength: 9 },
    COLONEL: { name: 'COLONEL', img: '/img/colonel.svg', strength: 8 },
    MAJOR: { name: 'MAJOR', img: '/img/major.svg', strength: 7 },
    CAPTAIN: { name: 'CAPTAIN', img: '/img/captain.svg', strength: 6 },
    LIEUTENANT: { name: 'LIEUTENANT', img: '/img/lieutenant.svg', strength: 5 },
    SERGEANT: { name: 'SERGEANT', img: '/img/sergeant.svg', strength: 4 },
    MINER: { name: 'MINER', img: '/img/miner.svg', strength: 3 },
    SCOUT: { name: 'SCOUT', img: '/img/scout.svg', strength: 2 },
    SPY: { name: 'SPY', img: '/img/spy.svg', strength: 1 },
    FLAG: { name: 'FLAG', img: '/img/flag.svg', strength: 0 },
    BOMB: { name: 'BOMB', img: '/img/bomb.svg', strength: 11 },
}

const DEFAULT_SET = {
    'MARSHAL': 1,
    'GENERAL': 1,
    'COLONEL': 2,
    'MAJOR': 3,
    'CAPTAIN': 4,
    'LIEUTENANT': 4,
    'SERGEANT': 4,
    'MINER': 5,
    'SCOUT': 8,
    'SPY': 1,
    'FLAG': 1,
    'BOMB': 6,
}

module.exports = class RuleController {

    /**
     * 
     * @param {string} aPlayer1Username 
     * @param {string} aPlayer2Username 
     * @param {number} Width 
     * @param {number} Height 
     * @param {Array<GameSet>} aListOfPieces 'PieceName' : nbPieces 
     */
    constructor(aPlayer1Username = "P1", aPlayer2Username = "P2", Width = 10, Height = 10, aListOfPieces = DEFAULT_SET) {
        var movablePieces = aListOfPieces['CAPTAIN'] +
            aListOfPieces['COLONEL'] +
            aListOfPieces['GENERAL'] +
            aListOfPieces['LIEUTENANT'] +
            aListOfPieces['MAJOR'] +
            aListOfPieces['MARSHAL'] +
            aListOfPieces['MINER'] +
            aListOfPieces['SCOUT'] +
            aListOfPieces['SERGEANT'] +
            aListOfPieces['SPY'];

        if (aPlayer1Username == aPlayer2Username) {
            throw new Exception("Cannot have 2 same username");
        }
        this.player1 = new Player(aPlayer1Username, color.RED, movablePieces);
        this.player2 = new Player(aPlayer2Username, color.BLUE, movablePieces);


        this.Width = Width;
        this.Height = Height;
        
        this.map = new Array(Width);
        for (let i = 0; i < Width; i++) {
            this.map[i] = new Array(Height);            
        }

        var WidthDivided = 100 / Width
        var HeightDivided = 100 / Height
        for (var i = 0; i < Width; i++) {
            for (var j = 0; j < Height; j++) {
                if (WidthDivided * i == 20 || WidthDivided * i == 30 || WidthDivided * i == 60 || WidthDivided * i == 70 && HeightDivided * j == 40 || HeightDivided * j == 50) {
                    this.map[i][j] = new Tile(i,j,false);
                }else{
                    this.map[i][j] = new Tile(i,j);
                }
            }
        }
        
    }
    MovePiece(tileDeparture, tileArrival) {
        
        if(tileArrival.piece != null){
            if(tileArrival.piece.player === tileDeparture.piece.player){
                throw new Exception("Oh nooooooon");
            }else{
                tileArrival.piece = this.Fight(tileDeparture.piece,tileArrival.piece);
                tileDeparture.piece = null;
            }
        }else{
            tileArrival.piece = tileDeparture.piece;
            tileDeparture.piece = null;
        }
        
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
    CheckWinP2() {
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
        var drawedMap = "";
        for (var i = 0; i < this.Width; i++) {
            for (var j = 0; j < this.Height; j++) {
                drawedMap += this.map[i][j].DrawTile();
            }
        }
        return drawedMap;
    }
    WherePieceCanGo(tileDeparture) {
        var canGoTopY = false;
        var canGoBotY = false;
        var canGoRightX = false;
        var canGoLeftX = false;
        if (tileDeparture.piece.GetType() == type.SCOUT) {
            canGoTopY = true;
            canGoBotY = true;
            canGoRightX = true;
            canGoLeftX = true;
        }

        var X = tileDeparture.GetX();
        var Y = tileDeparture.GetY() + 1;
        do {
            if (this.map[X][Y] == null || this.map[X][Y].getPiece() != null || this.map[X][Y].canGo == false) {
                canGoTopY = false;
            }
            else {
                this.map[X][Y].selected = true;
                Y = Y + 1;
            }

        } while (canGoTopY)

        X = tileDeparture.GetX();
        Y = tileDeparture.GetY() - 1;
        do {
            if (this.map[X][Y] == null || this.map[X][Y].getPiece() != null || this.map[X][Y].canGo == false) {
                canGoBotY = false;
            }
            else {
                this.map[X][Y].selected = true;
                Y = Y - 1;
            }
        } while (canGoBotY)

        X = tileDeparture.GetX() + 1;
        Y = tileDeparture.GetY();
        do {
            if (this.map[X][Y] == null || this.map[X][Y].getPiece() != null || this.map[X][Y].canGo == false) {
                canGoRightX = false;
            }
            else {
                this.map[X][Y].selected = true;
                X = X + 1;
            }
        } while (canGoRightX)

        X = tileDeparture.GetX() - 1;
        Y = tileDeparture.GetY();
        do {
            if (this.map[X][Y] == null || this.map[X][Y].getPiece() != null || this.map[X][Y].canGo == false) {
                canGoLeftX = false;
            }
            else {
                this.map[X][Y].selected = true;
                X = X - 1;
            }
        } while (canGoLeftX)
    }
    Unselect()
    {
        map.forEach(mapx => {
            mapx.forEach(tile => {tile.selected = false;});
            
        });
    }
}