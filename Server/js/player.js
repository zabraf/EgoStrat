module.exports = class Player {
        constructor(anUsername, aColor, ruleControlleur,aListMovablePieces) {
                this.isRacist = Math.floor(Math.random() * 1000) == 1;
                this.color = aColor;
                this.username = anUsername;
                this.isAlive = true;
                this.listMovablePieces = aListMovablePieces
                this.ruleControlleur = ruleControlleur;
        }
        GetNbMovablePieces(){
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