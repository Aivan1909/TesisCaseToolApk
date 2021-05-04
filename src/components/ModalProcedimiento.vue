<template>
    <b-modal id="mdlProcedimiento" 
        size="xl"
        body-class="p-0"
        header-bg-variant="secondary"
    >
        <template #modal-header="{ close }" class="p-0">
            <b-button
                v-b-modal.mdlChangeNameProc
                size="sm"
                variant="secondary"
                @click="newTitle = title"
            >{{ title }}<font-awesome-icon icon="edit" class="ml-3"/>
            </b-button>
            <!-- Modal Cambio de Nombre -->
            <b-modal
                id="mdlChangeNameProc"
                size="sm"
                title="Cambiar Nombre"
                @ok="title = newTitle"
            >
                <b-form-input
                v-model="newTitle"
                placeholder="Nombre de archivo"
                autofocus
                ></b-form-input>
            </b-modal>
            <b-button variant="secondary" class="float-right" @click="close()">
                <font-awesome-icon icon="times" />
            </b-button>
        </template>
        <template #modal-footer="{cancel}" class="p-0">
            <b-row>
                <b-col sm="12" lg="6" class="p-1">
                    <b-button variant="danger" block @click="cancel()">
                        Cancelar
                    </b-button>
                </b-col>
                <b-col sm="12" lg="6" class="p-1">
                    <b-button variant="success" block @click="guardarProcedimiento">
                        Guardar
                    </b-button>
                </b-col>
            </b-row>
        </template>
        <!-- Cuerpo del Modal -->
        <b-container class="bg-dark" fluid>
            <!-- Contenedor de Entrada y Salida de Variables -->
            <b-row  align-v="center">
                <!-- Contenedor de Entrada de Variables -->
                <b-col sn="12" lg="6">
                    <b-row align-v="center">
                        <b-col sm="12" lg="3">
                            <label for="input-small" class="text-white">Variable de entrada:</label>
                        </b-col>
                        <b-col sm="12" lg="4">
                            <b-form-input id="input-small" size="sm" v-model="newVarIn" placeholder="Variable"></b-form-input>
                        </b-col>
                        <b-col sm="12" lg="4">
                            <b-form-select
                                v-model="newVarSelected"
                                :options="tipoVariables"
                                class="m-1"
                                size="sm"
                            >
                                <template #first>
                                <b-form-select-option :value="null" disabled
                                    >-- Tipo --</b-form-select-option
                                >
                                </template>
                            </b-form-select>
                        </b-col>
                        <b-col sm="1">
                            <b-button class="m-1" variant="primary" size="sm" @click="agregarVariable(true)">
                                <font-awesome-icon icon="plus-circle"/>
                            </b-button>
                        </b-col>
                    </b-row>
                </b-col>
                <!-- Contenedor de Entrada de Variables -->
                <!-- Contenedor de Salida de Variables -->
                <b-col sn="12" lg="6">
                    <b-row align-v="center">
                        <b-col sm="12" lg="6" class="text-right">
                            <b-form-checkbox
                                id="chbReturnVar"
                                v-model="checkVarReturn"
                                name="chbReturnVar"
                                value="true"
                                class="text-white ml-auto"
                                @change="selectVarOut"
                            >
                                Variable de retorno
                            </b-form-checkbox>
                        </b-col>
                        <b-col sm="12" lg="6">
                            <b-form-select
                                v-model="varReturnSelected"
                                :options="variables.items"
                                value-field="id"
                                text-field="vari"
                                class="m-1"
                                size="sm"
                                :disabled="!checkVarReturn"
                                @change="adicionarVarSalida"
                            >
                                <template #first>
                                <b-form-select-option :value="null" disabled
                                    >-- Variable --</b-form-select-option
                                >
                                </template>
                            </b-form-select>
                        </b-col>
                    </b-row>
                </b-col>
                <!-- Contenedor de Salida de Variables -->
            </b-row>
            <!-- /Contenedor de Entrada y Salida de Variables -->
        </b-container>
        <b-container class="pt-2 pb-2" fluid>
            <b-row>
                <!-- Contenedor del editor de texto -->
                <b-col sm="12" lg="9">
                    <codemirror
                    v-model="code"
                    :options="cmOptions"
                    class="text-left border border-secondary"
                    @input="pruebaSin1"
                    ></codemirror>
                </b-col>
                <!-- /Contenedor del editor de texto -->
                <!-- Contenedor de variables, constantes y errrores -->
                <b-col sm="12" lg="3">
                    <!-- Acordeon de Variable -->
                    <div class="mb-2">
                        <b-button
                            v-b-toggle.collapse-var-proc
                            variant="outline-light"
                            block
                            class="text-left text-dark"
                        >
                            <i class="fas fa-i-cursor fa-sm mr-1"></i>
                            <span class="ms-2">Variables</span>
                        </b-button>
                        <b-collapse id="collapse-var-proc">
                            <b-card no-body class="p-0">
                            <!-- Formulario de Adicion de Variable -->
                            <div class="d-flex justify-content-center mb-3">
                                <input
                                type="text"
                                class="form-control form-control-sm m-1"
                                placeholder="Variable"
                                v-model="variables.newVar"
                                />
                                <b-form-select
                                v-model="variables.selected"
                                :options="tipoVariables"
                                class="m-1"
                                size="sm"
                                >
                                <template #first>
                                    <b-form-select-option :value="null" disabled>-- Tipo --</b-form-select-option>
                                </template>
                                </b-form-select>
                                <b-button class="m-1" variant="primary" size="sm" @click="agregarVariable(false)">
                                    <font-awesome-icon icon="plus-circle"/>
                                </b-button>
                            </div>
                            <!-- /Formulario de Adicion de Variable -->
                            <!-- Tabla de Variables -->
                            <b-table
                                hover
                                small
                                primary-key="id"
                                :items="variables.items"
                                :fields="variables.fields"
                                v-if="variables.items.length!==0"
                            >
                                <template #cell(var)="data">
                                    <b-button size="sm" variant="light" @click="eliminarVariable(data.item.id)">
                                        <font-awesome-icon icon="trash" class="text-danger"/>
                                    </b-button> {{data.item.var}}
                                </template>
                                <template #cell(in)="data">
                                    <font-awesome-icon icon="check" variant="success" v-if="data.item.in"/>
                                </template>
                                <template #cell(out)="data">
                                    <font-awesome-icon icon="check" variant="success" v-if="data.item.out"/>
                                </template>
                            </b-table>
                            <!-- /Tabla de Variables -->
                            </b-card>
                        </b-collapse>
                    </div>
                    <!-- /Acordeon de Variable -->
                    <!-- Acordeon de Constantes -->
                    <div class="mb-2">
                    <b-button
                        v-b-toggle.collapse-const-proc
                        variant="outline-light"
                        block
                        class="text-left text-dark"
                    >
                        <i class="fas fa-i-cursor fa-sm mr-1"></i>
                        <span class="ms-2">Constantes</span>
                    </b-button>
                    <b-collapse id="collapse-const-proc" class="mb-2">
                        <b-card no-body class="p-0">
                        <!-- Formulario de Adicion de Constante -->
                        <div class="d-flex justify-content-center mb-3">
                            <input
                            type="text"
                            class="form-control form-control-sm m-1"
                            placeholder="Constante"
                            v-model="constantes.newCtte"
                            />
                            <b-form-select
                            v-model="constantes.selected"
                            :options="tipoVariables"
                            class="m-1"
                            size="sm"
                            >
                            <template #first>
                                <b-form-select-option :value="null" disabled
                                >-- Tipo --</b-form-select-option
                                >
                            </template>
                            </b-form-select>
                            <input
                            type="text"
                            class="form-control form-control-sm m-1"
                            placeholder="Valor"
                            v-model="constantes.newVal"
                            />
                            <b-button class="m-1" variant="primary" size="sm" @click="agregarConstante">
                                <font-awesome-icon icon="plus-circle"/>
                            </b-button>
                        </div>
                        <!-- /Formulario de Adicion de Constante -->
                        <!-- Tabla de Constantes -->
                        <b-table
                            hover
                            small
                            primary-key="id"
                            :items="constantes.items"
                            :fields="constantes.fields"
                            v-if="constantes.items.length!==0"
                        >
                            <template #cell(var)="data">
                                <b-button size="sm" variant="light" @click="eliminarConstante(data.item.id)">
                                    <font-awesome-icon icon="trash" class="text-danger"/>
                                </b-button> {{data.item.var}}
                            </template>
                        </b-table>
                        <!-- /Tabla de Constantes -->
                        </b-card>
                    </b-collapse>
                    </div>
                    <!-- /Acordeon de Constantes -->
                    <!-- Acordeon de Errores -->
                    <div class="mb-2">
                    <b-button
                        v-b-toggle.collapse-error-proc
                        variant="outline-light"
                        block
                        class="text-left text-dark"
                    >
                        <i class="fas fa-i-cursor fa-sm mr-1"></i>
                        <span class="mr-3">Errores</span>
                        <b-badge variant="danger" :v-model="error.items.lenght">{{
                        error.items.length
                        }}</b-badge>
                    </b-button>
                    <b-collapse id="collapse-error-proc" class="mb-2">
                        <b-card no-body class="p-0">
                        <!-- Tabla de Errores -->
                        <b-table
                            hover
                            small
                            primary-key="id"
                            :items="error.items"
                            :fields="error.fields"
                            v-if="error.items.length!==0"
                        ></b-table>
                        <!-- /Tabla de Errores -->
                        </b-card>
                    </b-collapse>
                    </div>
                    <!-- /Acordeon de Errores -->
                </b-col>
                <!-- /Contenedor de variables, constantes y errrores -->
            </b-row>
        </b-container>
    </b-modal>
</template>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/mode/pascal/pascal.js";

export default{
    data(){
        return{
            id: null,
            title: "proc_01",
            newTitle: null,
            newVarIn: null,
            newVarSelected: null,
            checkVarReturn: false,
            varReturnSelected: null,
            variables: {
                newVar: null,
                newVarState: null,
                selected: null,
                fields: [
                {key:"vari", label: "Var"}, 
                {key:"tipo", label:"Tipo"},
                {key:"in", label:"In"},
                {key:"out", label:"Out"}
                ],
                items: []
            },
            constantes: {
                newCtte: null,
                newVal: null,
                selected: null,
                fields: [
                {key:"var", label: "Var"}, 
                {key:"tipo", label:"Tipo"}, 
                {key:"var", label: "Ctte"}, 
                {key:"tipo", label:"Tipo"}, 
                {key:"valor", label:"Valor"}
                ],
                items: [],
            },
            error: {
                fields: [
                {key:"line", label: "Ln."},
                {key:"description", label: "Descripcion"}
                ],
                items: [],
            },
            code: "// Aqui va su procedimiento\n\n\n\n",
            cmOptions: {
                // codemirror options
                tabSize: 4,
                mode: "text/x-pascal",
                lineNumbers: true,
            },
            aux: {
                id: 100,
                idParent: null,
                bloqueEsp: false,
                pilaIds: [],
                mapIndices: {},
                caseSw: false,
                caseFirst: false,
                levelOriginal: 0,
                levelAux: 0,
                comentarioMultiple: false,
                pilaObjetos: []
            },
            auxPy:{
                forVariable: "",
                forTope: ""
            }
        }
    },
    components:{
        codemirror
    },
    props:{
        tipoVariables: Array
    },
    methods:{

        selectVarOut(){
            if(!this.checkVarReturn)
            {
                this.variables.items.forEach(itm => {
                    itm.out = false
                })
                this.varReturnSelected = null
            }    
        },
        adicionarVarSalida(){
            this.variables.items.forEach(itm => {
                itm.out = false
                if(itm.id == this.varReturnSelected)
                    itm.out = true
            })
        },
        agregarVariable(varIn){
            var va = null;
            var slct = null;
            if(varIn){
                va = this.newVarIn
                slct = this.newVarSelected
            }else{
                va = this.variables.newVar
                slct = this.variables.selected
            }
            console.log(varIn, slct, va)
            const variable = new RegExp("^[a-zA-Z]+([-_]?[a-zA-Z0-9]+)*$").test(va)?va:null

            let tipo = this.tipoVariables.find(el => el.value == slct).text;
            let id = this.variables.items.length + 100
            if(variable!=null && tipo!=null)
            {
                this.variables.items.push({id: id, vari: variable, tipo: tipo, in:varIn, out: false})
                this.variables.newVar = this.variables.selected = null
            }
        },
        eliminarVariable(id){
            const i = this.variables.items.indexOf(this.variables.items.find(el => el.id==id))
            if(i>=0){
                this.variables.items.splice(i, 1)
                this.$store.state.stVariable = i
                this.$store.dispatch('deleteVariableAction')
                this.$store.state.stVariable = null
            }
        },
        agregarConstante(){
            let ctte = new RegExp("^[a-zA-Z]+([-_]?[a-zA-Z0-9]+)*$").test(this.constantes.newCtte)?this.constantes.newCtte:null;
            let valor = this.constantes.newVal
            let tipo = this.tipoVariables.find(el => el.value == this.constantes.selected).text;
            let valorTipo = this.tipoVariables.find(el => el.value == this.constantes.selected).value;
            let id = this.constantes.items.length + 200
            console.log(id, tipo, this.constantes.selected)
            let sw = false;
            let regex;
            switch (valorTipo) {
                case 1:
                valor = `"${valor}"`
                sw = true
                break;
                case 2:
                regex = new RegExp('^[0-9]+$')
                if(regex.test(valor))
                    sw = true
                break;
                case 3:
                regex = new RegExp("^[0-9]+([.][0-9]+)?$")
                if(regex.test(valor))
                    sw = true
                break;
                case 4:
                regex = new RegExp("(true|false)$")
                if(regex.test(valor))
                    sw = true
                break;
            }
            if(sw && ctte!=null && valor!=null){
                this.constantes.items.push({id: id, var: ctte, tipo: tipo, valor: valor})
                this.constantes.newCtte = this.constantes.newVal = this.constantes.selected = null
            }
        },
        //#region ARBOLES
        guardarProcedimiento(){
            console.log(this.error.items.length)
            if(this.error.items.length==0){
                let proc = this.$store.getters.getProcedimientos
                let idProc = proc.length + 1
                let varInTipo = ""
                let varOutTipo = ""
                let varInValor = ""
                let varOutValor = ""

                this.variables.items.map(el => {
                    if(el.in){
                        varInTipo += el.tipo + "\n"
                        varInValor += el.vari + ","
                    }
                    if(el.out){
                        varOutTipo = el.tipo
                        varOutValor += el.vari+","
                    }
                })
                varInValor = varInValor.length>0?varInValor.substring(0,varInValor.length-1):varInValor
                
                let codPython = `def ${this.title}(${varInValor}):\n${this.codePython}\n   ${varOutValor}`

                this.$store.state.stProcedimiento = {id: idProc, procIn: varInTipo, procOut: varOutTipo, procedure: this.title, pseudo: this.code, pyt: codPython, variables:this.variables, constantes:this.constantes}
                this.$store.dispatch('addProcedimientosAction')
                this.$store.state.stProcedimiento = null
            }
        },
        async btn_Generar(){
            let res= await this.cargarVarConsProc()
            let pila = this.myPilaObjetos
            pila.shift()
            for(let hijo of pila){
                let linea = ""
                for(let [i, valor] of hijo.value.entries()){
                let operadores = []
                let j = i+1
                valor = valor.replace(";", "")
                if(this.aux.caseSw && hijo.level>0){
                    hijo.level = parseInt(hijo.level) - 1
                }
                switch (hijo.token)
                {
                    case 'CONCASE':              
                    valor = valor.replace("of", "")
                    if (valor=="case"){
                        valor = valor.replace("case", "")
                        this.caseValor = hijo.value[j]
                        hijo.value[j] = ""
                        this.aux.caseSw = true
                        this.aux.caseFirst = true
                    }

                    if(hijo.value[j]==":"){
                        hijo.value[j] = ""
                        let auxiConcatena =""
                        let k = j + 1
                        if(this.aux.caseFirst){
                        valor = `if ${this.caseValor}==${valor} :`
                        this.aux.caseFirst = false
                        }else{
                        valor = `elif ${this.caseValor}==${valor} :`
                        }
                        if(hijo.value[k].includes("write")){
                        auxiConcatena = hijo.value[k].replace("write", "print")
                        console.log(auxiConcatena)
                        hijo.value[k] = ""
                        let espacio = '    '.repeat(hijo.level)
                        valor += `\n${espacio}   ${auxiConcatena}`
                        }
                    }
                    break;
                    case 'BUFOR':
                    if(valor.includes(":=")){
                        this.auxPy.forVariable = valor.split(":=")[0]
                        this.auxPy.forTope = valor.split(":=")[1]
                        valor = this.auxPy.forVariable
                    }
                    if(this.auxPy.nextRange){
                        valor = `range(${this.auxPy.forTope}, ${valor})`
                        this.auxPy.nextRange = false
                    }
                    if(valor=="to")
                        this.auxPy.nextRange = true
                    valor = valor.replace("to", "in")
                    valor = valor.replace("do", ":")
                    break;
                    case 'BUWHILE':
                    valor = valor.replace("do", ":")
                    break;
                    case 'DATREAD':
                    valor = ""
                    if(i==0)
                        valor = `${hijo.value[(j+1)]} = input()`
                    break;
                    case 'DATWRITE':
                    if (valor=="write")
                        valor=valor.replace("write", "print")
                    break;
                    case 'CONIF':
                    operadores = ["<=", ">="]
                    if(!operadores.some(operador => valor.includes(operador)))
                        valor = valor.replace("=", "==")
                    valor = valor.replace("<>", "!=")
                    valor = valor.replace("then", ":")
                    if(valor=="else"){
                        if(hijo.value[j]==("if")){
                        valor = valor.replace("else", "elif")
                        hijo.value[j] = ""
                        }else{
                        valor += ":"
                        }
                    }
                    break;
                    case 'BLOCOD':
                    this.aux.caseSw = false
                    break;
                    case 'ASIGVAR':
                    valor = valor.replace("var", "")
                    valor = valor.replace(":=", "=")
                    break;
                    case 'COMSIM':
                    valor = valor.replace("//", "#")
                    break;
                    case 'COMMUL':
                    valor = valor.replace("(*", "'''")
                    valor = valor.replace("*)", "'''")
                    break;
                    default:
                    break;
                }
                linea += valor + " "
                }
                if(typeof(hijo.level)=='undefined' || hijo.level==null)
                hijo.level = 0
                let espacio = '    '.repeat(hijo.level)
                res += '   ' + espacio +linea+"\n"
            }
            console.log("FINAL:", res)
            this.codePython = await res
            this.$store.state.codePython = await res
            await this.$store.dispatch('setCodepythonAction')
        },
        cargarVarConsProc(){
        //Se agrega variables
        if(this.constantes.items.length!==0)
            respuesta += "#Declaracion de variables\n"
        let res = {booleano:"", numero:"", cadena:""}
        for(let item of this.variables.items){
            const {vari, tipo} = item
            let myVar = `${vari} = `
            if(tipo=="Cadena")
            res.cadena += myVar
            else if(tipo=="Entero" || tipo=="Decimal")
            res.numero += myVar
            else if(tipo=="Cadena")
            res.booleano += myVar
        }
        let respuesta = ""
        if(res.numero!=="")
            respuesta += `${res.numero}0\n`
        if(res.cadena!=="")
            respuesta += `${res.cadena}""\n`
        if(res.booleano!=="")
            respuesta += `${res.booleano}true\n`

        //Se agrega constantes
        if(this.constantes.items.length!==0)
            respuesta += "#Declaracion de constantes\n"
        for(let item of this.constantes.items){
            const {ctte, valor} = item
            respuesta += `${ctte} = ${valor}\n`
        }
        return respuesta
        },
        async pruebaSin1(){
            this.aux.levelOriginal = 0
            this.aux.id = 99
            this.aux.pilaObjetos = []
            this.error.items = []
            let nodo = await {id: this.myId, token:null, value: this.nombreArchivo, level: this.myLevelOriginm, parentId:this.myIdParent}
            this.aux.pilaObjetos.push(nodo)
            this.aux.idParent = await this.myId
            for(let [i, linea] of this.code.split('\n').entries()){
                let lineaIn = linea.trim()
                if(lineaIn!==""){
                await this.getToken(lineaIn)
                .then(token => {
                    if(token!=null){
                    this.nuevoNodo1(linea, this.myId, token, this.myLevelOrigin, this.myIdParent)
                    .then(newNodo => {
                        this.aux.pilaObjetos.push(newNodo)
                    })
                    }
                })
                .catch(()=>{
                    this.error.items.push({line: i+1, description:"Error de Sintaxis"})
                })
                }
            }
            await this.mapearIndices()
            /* await this.armarArbol1() */
            await this.btn_Generar()
        },
        getToken(linea){
        return new Promise((resolve, reject)=>{
            for(let parm of this.$store.getters.getParametricas ) {
            let rgx = ""
            if (parm.expresionEstructura != "")
                rgx = parm.expresionEstructura
            else if(parm.inicioEstructura!="")
                rgx = parm.inicioEstructura
            if(rgx!=="")
            {
                let val = new RegExp(rgx)
                if(val.test(linea)){
                resolve(parm.token)
                }else{
                if (parm.finEstructura != ""){
                    rgx = parm.finEstructura
                }else if(parm.medioEstructura != ""){
                    rgx = parm.medioEstructura
                }
                if(rgx!=="")
                {
                    val = new RegExp(rgx)
                    if (val.test(linea)){
                    resolve(parm.token)
                    }
                }
                }
            }
            }
            reject(null)
        })
        },
        async prueba1(){
        this.error.items = []

        //Armado de la primera iteracion del arbol
        this.aux.levelOriginal = 0
        this.aux.myIdParent = null
        let nodo = {id: this.myId, token:null, value: this.nombreArchivo, level: this.myLevelOriginm, parentId:this.myIdParent}
        this.aux.myIdParent = this.myId
        this.codeGenerado = nodo
        for(let [i, linea] of this.code.split('\n').entries()){
            await this.analizarLinea(linea.trim()).then(token => {
            if(token!=null){
                this.nuevoNodo1(this.myId, linea, token, this.myLevelOrigin, this.myIdParent).then(child => {
                nodo.children.push(child)
                this.aux.id++
                })
            }else{
                console.log(i, "Error de sintaxis")
            }
            })
        }
        },
        async nuevoNodo1(linea, id, token, level, idParent){
        let idA = id+1
        let nodo = {id: idA, value:"", token: token, level: level, parentId: idParent}
        await this.armarSplit1(linea, token).then(node => {
            nodo.value = node
        })
        return nodo
        },
        async armarSplit1(cadena, token){
        this.aux.id += 1
        let separador
        let sw = true
        switch (token)
        {
            case 'OPEARIT':
            separador = cadena.split('+').join('Ø+Ø').split('-').join('Ø-Ø').split('*').join('Ø*Ø').split('/').join('Ø/Ø')
            break;
            case 'OPEREL':
            separador = cadena.split('=').join('Ø=Ø').split('<').join('Ø<Ø').split('<=').join('Ø<=Ø').split('>=').join('Ø>=Ø').split('<>').join('Ø<>Ø')
            break;
            case 'OPELOG':
            separador = cadena.split('not').join('ØnotØ').split('and').join('ØandØ').split('or').join('ØorØ')
            break;
            case 'CONCASE':
            if(cadena.includes(":"))
                separador = cadena.split(':').join('Ø:Ø').split(';').join('Ø;')
            else{
                separador = cadena.split('case').join('caseØ').split('of').join('ØofØ')
                this.aux.levelOriginal += 1
                this.aux.idParent = this.myId
            }
            break;
            case 'BUFOR':
            separador = cadena.split('for').join('forØ').split('to').join('ØtoØ').split('do').join('Ødo')
            this.aux.levelOriginal += 1
            this.aux.pilaIds.push(this.myIdParent)
            this.aux.idParent = this.myId
            this.aux.bloqueEsp = true
            break;
            case 'BUWHILE':
            separador = cadena.split('while').join('whileØ').split('do').join('Ødo')
            this.aux.levelOriginal += 1
            this.aux.pilaIds.push(this.myIdParent)
            this.aux.idParent = this.myId
            this.aux.bloqueEsp = true
            break;
            case 'DATREAD':
            separador = cadena.split('read').join('readØ').split('(').join('(Ø').split(')').join('Ø)').split(';').join('Ø;')
            if(this.myBloqueEsp){
                this.aux.bloqueEsp = false
                this.aux.idParent = this.aux.pilaIds.pop()
            }
            break;
            case 'DATWRITE':
            separador = cadena.split('write').join('writeØ').split('(').join('(Ø').split(')').join('Ø)').split(';').join('Ø;')
            if(this.myBloqueEsp){
                this.aux.bloqueEsp = false
                this.aux.idParent = this.aux.pilaIds.pop()
            }
            break;
            case 'CONIF':
            this.aux.levelOriginal += 1
            this.aux.pilaIds.push(this.myIdParent)
            this.aux.idParent = this.myId
            this.aux.bloqueEsp = true
            if(cadena.trim().substr(0,4)!=="else"){
                separador = cadena.split('if').join('ifØ').split('then').join('Øthen')
                console.log("CONIF APERTURA", separador, cadena, this.aux.levelOriginal)
            }else{
                separador = cadena.split('else').join('elseØ').split('if').join('ifØ').split('then').join('thenØ')
                console.log("CONIF ELSE", separador, cadena, this.aux.levelOriginal)
            }
            break;
            case 'BLOCOD':
            sw = false
            if(cadena.trim()==="end"){
                this.aux.bloqueEsp = false
                this.aux.idParent = this.aux.pilaIds.pop()
                this.aux.levelOriginal -= 1
                separador = "endØ"
            }else if(cadena.trim()==="begin"){
                this.aux.idParent = this.myId
                this.aux.pilaIds.push(this.myId)
                separador = "beginØ"
            }
            break;
            case 'ASIGVAR':
            separador = cadena.split('var').join('varØ').split(',').join('Ø,Ø').split(':=').join('Ø:=Ø').split('+').join('Ø+Ø').split('-').join('Ø-Ø').split('*').join('Ø*Ø').split('/').join('Ø/Ø').split(';').join('Ø;')
            if(this.myBloqueEsp){
                this.aux.bloqueEsp = false
                this.aux.idParent = this.aux.pilaIds.pop()
            }
            break;
            case 'COMSIM':
            separador = cadena.split('//').join('//Ø')
            break;
            case 'COMMUL':
            separador = cadena.split('(*').join('(*Ø').split('*)').join('Ø*)')
            if(!separador.includes('Ø*)'))
                this.aux.comentarioMultiple = true
            else
                this.aux.comentarioMultiple = false
            break;
            default:
            sw = false
            break;
        }
        if(this.aux.levelOriginal >= this.aux.levelAux){
            this.aux.levelAux = await this.aux.levelOriginal
        }
        return await sw?separador.split('Ø').map(item=>item.trim()):[];
        },
        mapearIndices(){
        this.aux.mapIndices = {}
        /* let ind = {} */
        for(let [i, el] of this.myPilaObjetos.entries()){
            this.aux.mapIndices[`${el.id}`] = i
        }
        },
        //#endregion
    },
    created(){
        this.id = this.$store.state.stProcedimientos.length + 1000
        this.code = "// Aqui va su procedimiento"
    },
    computed:{
        myCode: function(){
        return this.codeGenerado
        },
        myBloqueEsp: function(){
        return this.aux.bloqueEsp
        },
        myId: function(){
        return this.aux.id
        },
        myIdParent: function(){
        return this.aux.idParent
        },
        myLevelOrigin: function(){
        return this.aux.levelOriginal
        },
        myLevelAux: function(){
        return this.aux.levelAux
        },
        myComentarioMultiple: function(){
        return this.aux.comentarioMultiple
        },
        myPilaObjetos: function(){
        return this.aux.pilaObjetos
        }
    }
}
</script>