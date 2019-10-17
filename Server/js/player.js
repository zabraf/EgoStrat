module.exports = class Player {
        constructor(anUsername, aColor, ruleControlleur,anNbMovablePieces) {
                this.isRacist = Math.floor(Math.random() * 1000) == 1;
                this.color = aColor;
                this.username = anUsername;
                this.isAlive = true;
                this.nbMovablePieces = anNbMovablePieces
                this.ruleControlleur = ruleControlleur;
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