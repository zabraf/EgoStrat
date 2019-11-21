module.exports = class Piece{
    constructor(aType,aPlayer){
        this.type = aType;
        this.player = aPlayer;
        this.isDead = false;
    }
GetType()
{
        return this.type;
}
GetPlayer()
{
        return this.player;
}
Die()
{
        this.isDead = true;
}
GetColor()
{
        return this.player.color;
}
Draw()
{
        if(this.isDead)
        {
                return "";
        }
        if(this.player.color == "blue")
                return '<div class="Piece PlayerBlue '+(this.player.isRacist?'racist':'')+'"><img src="' + this.type.img + '" alt="' + this.type.name + '"/></div>'
        else
                return '<div class="Piece PlayerRed '+(this.player.isRacist?'racist':'')+'"><img src="' + this.type.img + '" alt="' + this.type.name + '"/></div>'
       
}
}