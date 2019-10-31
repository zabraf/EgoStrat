module.exports = class Player {
        constructor(anUsername, aColor, ruleControlleur,aListOfPieces) {
                this.isRacist = Math.floor(Math.random() * 1000) == 1;
                this.color = aColor;
                this.username = anUsername;
                this.isAlive = true;
                this.listPieces = aListOfPieces
                this.ruleControlleur = ruleControlleur;
        }
        GetNbMovablePieces(){
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
        GetUsername(username) {
                this.username = username;
        }
        GetUsername() {
                return this.username;
        }
        async PutPieces(PiecesToPut, TileCanHere) {
              PiecesToPut.forEach(element => {
                      do
                      {
                        randomX = Math.floor(Math.random() * TileCanHere.length)
                        randomY = Math.floor(Math.random() * TileCanHere[0].length)
                        if(TileCanHere[randomX,randomY] == null)
                        {
                                TileCanHere[randomX,randomY].SetPieces(element);
                                element = null;
                        }
                      }while (element != null)
              });
                resolve(true);
        }
        GetColor() {
                return this.color;
        }
    }