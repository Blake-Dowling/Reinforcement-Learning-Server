export default class Piece{
    constructor(x, y, val){
        this.x = x
        this.y = y
        this.val = val
    }
    getY(){
        return this.y
    }
    collidedWithPiece(otherPiece){
        return (this.x === otherPiece.x && 
            this.y === otherPiece.y)
    }

}