module.exports = class Piece{
    constructor(aType,aPlayer){
        this.type = aType;
        this.player = aPlayer;
        this.isDead =false;
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
        if(isDead)
        {
                return "";
        }
        return '<div classe="Piece"><img src="/img/' + this.type + '" alt="' + this.type + '"/></div>'
}
}