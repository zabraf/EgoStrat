module.exports = class Tile{
    constructor(anX,anY,canGo = true,aPiece = null){
        this.isLastDeparture = false;
        this.isLastArrival = false;
        this.canGo = canGo;
        this.piece = aPiece;
        this.x = anX;
        this.y = anY;
        this.selected = false;
    }
    GetPiece() {
        return this.piece;
    }
    GetX() {
        return this.x;
    }
    GetY() {
        return this.y;
    }
    SetPiece(piece) {
        this.piece = piece;
    }
    DrawTile(player,positioning) {
        var draw = "";
        if (this.canGo) {
            draw = '<div class="tile go '+(this.isLastDeparture?"lastDep ":" ")+(this.isLastArrival?"lastArr ":" ");
            if(this.selected && !positioning){
                draw += ' selected" onclick="HeyMateGoHere('+this.x+','+this.y+')"';
            }else{
                draw+= '"';
            }
           draw +=  ' >';
            if (this.piece != null && player == this.piece.player.username) {
                draw += this.piece.Draw(this.isLastArrival,this.selected,true,this.GetX(),this.GetY());
            }else if (this.piece != null){
                draw+= this.piece.Draw(this.isLastArrival,this.selected,false);
            }
        }
        else {
            draw = '<div class="tile cantgo">';
        }
        draw += '</div>';
        return draw;
    }
}