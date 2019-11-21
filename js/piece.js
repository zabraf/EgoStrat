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
        }
        GetColor() {
                return this.player.color;
        }
        Draw(myPiece = false) {
                var str = "";
                if (!this.isDead) {
                        if (this.player.color == "blue") {
                                str+= '<div class="Piece PlayerBlue ' + (this.player.isRacist ? 'racist' : '') + '">';
                                if(myPiece){
                                 str += '<img src="' + this.type.img + '" alt="' + this.type.name + '"/>';
                                }
                                str += '</div>'
                        }
                        else {
                                str+= '<div class="Piece PlayerRed ' + (this.player.isRacist ? 'racist' : '') + '">';
                                if(myPiece){
                                 str += '<img src="' + this.type.img + '" alt="' + this.type.name + '"/>';
                                }
                                str += '</div>'
                        }
                }
                return str;
        }
}