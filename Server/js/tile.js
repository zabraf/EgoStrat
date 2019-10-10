class Tile {
    constructor(canGo = true, aPiece = null) {
        this.canGo = canGo;
        this.piece = aPiece;
    }
    GetPieces() {
        return this.piece;
    }
    SetPieces(piece) {
        this.piece = piece;
    }
    DrawTile() {
        var draw = "";
        if (canGo) {
            draw = '<div class="tile-go">';
            if (piece != null) {
                draw += this.piece.draw;
            }
        }
        else {
            draw = '<div class="tile-cantgo">';
        }
        draw += '</div>';
        return draw;
    }
}