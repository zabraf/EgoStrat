class Tile{
    constructor(anX,anY,canGo = true,aPiece = null){
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
    DrawTile() {
        var draw = "";
        if (this.canGo) {
            if(this.selected){
                draw = '<div class="tile go selected">';
            }else{
                draw = '<div class="tile go">';
            }
           
            if (this.piece != null) {
                draw += this.piece.draw;
            }
        }
        else {
            draw = '<div class="tile cantgo">';
        }
        draw += '</div>';
        return draw;
    }
}