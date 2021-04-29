export class Nodo{
    constructor(token, children, level){
        this.token = token
        this.children = children
        this.level = level
    }

    get children(){
        return this.children
    }
}