import Nodo from './Nodo.js'

export class Arbol extends Nodo{

    constructor(obj){
        super(obj.token, obj.children, obj.level)
        this.nodos = []
    }

    set nodos(obj){
        this.nodos.push(this.super.children)
    }
}