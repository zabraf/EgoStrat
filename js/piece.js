module.exports = class Piece {
        constructor(aType, aPlayer) {
                this.type = aType;
                this.player = aPlayer;
                this.isDead = false;
        }
        GetType() {
                return this.type;
        }
        GetPlayer() {
                return this.player;
        }
        Die() {
                this.isDead = true;
                this.player.listPieces[this.type.name]--;
        }
        GetColor() {
                return this.player.color;
        }
        Draw(selected,myPiece = false, x = 0, y = 0) {
                var str = "";
                if (!this.isDead) {
                        
                        str+= '<div class="Piece Player'+(this.player.color == "blue"?"Blue":"Red")+' ' + (this.player.isRacist ? 'racist' : 'notRacist') + ' '+(selected?"selected":"")+'">';
                        if(myPiece){
                         str += '<img src="' + this.type.img + '" alt="' + this.type.name + '" onclick="Clicked('+x+','+y+',this)"/>';
                        }
                        str += '</div>'
                }
                return str;
        }
}