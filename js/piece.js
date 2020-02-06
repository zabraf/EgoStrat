module.exports = class Piece {
        constructor(aType, aPlayer) {
                this.type = aType;
                this.player = aPlayer;
                this.isDead = false;
        }
        //retourne le type de la pièce
        GetType() {
                return this.type;
        }
        //retourne le joueur de la pièce
        GetPlayer() {
                return this.player;
        }
        //fais mourir la pièce
        Die() {
                this.isDead = true;
                this.player.listPieces[this.type.name]--;
        }
        //retourne la couleur de la pièce
        GetColor() {
                return this.player.color;
        }
        //dessine la pièce
        Draw(isLastArrival,selected,myPiece = false, x = 0, y = 0) {
                var str = "";
                if (!this.isDead) {
                        
                        str+= '<div class="Piece Player'+(this.player.color == "blue"?"Blue":"Red")+' ' + (this.player.isRacist ? 'racist' : 'notRacist') + ' '+(selected?"selected":"")+' '+(isLastArrival?"lastArr ":" ")+'">';
                        if(myPiece){
                         str += '<img src="' + this.type.img + '" alt="' + this.type.name + '" onclick="Clicked('+x+','+y+')"/>';
                        }
                        str += '</div>';
                }
                return str;
        }
}