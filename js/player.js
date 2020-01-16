let Pieces = require('./piece');
let RuleController = require('./ruleController');
module.exports = class Player {
        constructor(anUsername, aColor, ruleControlleur, aListOfPieces) {
                this.isRacist = Math.round(Math.random()*100)>=80;
                this.color = aColor;
                this.username = anUsername;
                this.isAlive = true;
                this.listPieces = {...aListOfPieces}
                this.ruleControlleur = ruleControlleur;
        }
        HasFlag(){
                return this.listPieces['FLAG'] > 0;
        }
        GetNbMovablePieces() {
                var movablePieces = this.listPieces['CAPTAIN'] +
                        this.listPieces['COLONEL'] +
                        this.listPieces['GENERAL'] +
                        this.listPieces['LIEUTENANT'] +
                        this.listPieces['MAJOR'] +
                        this.listPieces['MARSHAL'] +
                        this.listPieces['MINER'] +
                        this.listPieces['SCOUT'] +
                        this.listPieces['SERGEANT'] +
                        this.listPieces['SPY'];
                return movablePieces;
        }
        SetUsername(username) {
                this.username = username;
        }
        GetUsername() {
                return this.username;
        }
        PutPieces(TileCanHere) {
                var arrayPieces = [];
                //Rajoute les pièces
                for (var key in this.listPieces) {
                        for (var i = 0; i < this.listPieces[key]; i++) {
                                var pieceType;
                                switch (key) {
                                        case 'MARSHAL':
                                                pieceType = this.ruleControlleur.TYPE.MARSHAL;
                                                break;
                                        case 'GENERAL':
                                                pieceType = this.ruleControlleur.TYPE.GENERAL;
                                                break;
                                        case 'COLONEL':
                                                pieceType = this.ruleControlleur.TYPE.COLONEL;
                                                break;
                                        case 'MAJOR':
                                                pieceType = this.ruleControlleur.TYPE.MAJOR;
                                                break;
                                        case 'CAPTAIN':
                                                pieceType = this.ruleControlleur.TYPE.CAPTAIN;
                                                break;
                                        case 'LIEUTENANT':
                                                pieceType = this.ruleControlleur.TYPE.LIEUTENANT;
                                                break;
                                        case 'SERGEANT':
                                                pieceType = this.ruleControlleur.TYPE.SERGEANT;
                                                break;
                                        case 'MINER':
                                                pieceType = this.ruleControlleur.TYPE.MINER;
                                                break;
                                        case 'SCOUT':
                                                pieceType = this.ruleControlleur.TYPE.SCOUT;
                                                break;
                                        case 'SPY':
                                                pieceType = this.ruleControlleur.TYPE.SPY;
                                                break;
                                        case 'FLAG':
                                                pieceType = this.ruleControlleur.TYPE.FLAG;
                                                break;
                                        case 'BOMB':
                                                pieceType = this.ruleControlleur.TYPE.BOMB;
                                                break;
                                }
                                arrayPieces.push(new Pieces(pieceType, this));
                        }
                }
                
                //Place les pieces dans la zone donnée
                for (var x = 0; x < TileCanHere.length; x++) {

                        for (var y = 0; y < TileCanHere[0].length; y++) {
                                TileCanHere[x][y].SetPiece(arrayPieces[(TileCanHere[0].length * x) + y]);
                                /* Random version
                                if(arrayPieces.length > 0){
                                        var p = arrayPieces[Math.floor(Math.random()*arrayPieces.length)];
                                        var i = arrayPieces.indexOf(p);
                                        TileCanHere[x][y].SetPiece(arrayPieces[i]);
                                        arrayPieces.splice(i,1);
                                }*/
                        }
                }
                return TileCanHere;
        }
        GetColor() {
                return this.color;
        }
}