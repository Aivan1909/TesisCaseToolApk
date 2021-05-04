<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12" md="12">
        <b-row>
          <!-- Contenedor de Editor de Texto -->
          <b-col sm="12" md="9" class="my-2">
            <div class="border rounded border-light" id="pnl_pseudo">
              <!-- Primer header de editor de texto -->
              <div class="bg-dark d-flex justify-content-between small">
                <b-row align-v="center" class="pl-3">
                  <b-col sm="12" md="6">
                    <b-row align-v="center">
                      <b-col sm="12" md="3">
                        <span class="text-white ">Entrada: </span>
                      </b-col>
                      <b-col sm="12" md="8">
                        <b-form-select
                          v-model="lenguajes.in.selected"
                          :options="lenguajes.in.data"
                          value-field="idLenguaje"
                          text-field = "nombre"
                          class="m-1"
                          size="sm"
                          @change="setModeCodemirrorIn"
                        >
                          <!-- <template #first>
                            <b-form-select-option :value="null" disabled
                              >-- Entrada --</b-form-select-option
                            >
                          </template> -->
                        </b-form-select>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col sm="12" md="6">
                    <b-row align-v="center">
                      <b-col sm="12" md="3">
                        <span class="text-white">Salida: </span>
                      </b-col>
                      <b-col sm="12" md="8">
                        <b-form-select
                          v-model="lenguajes.out.selected"
                          :options="lenguajes.out.data"
                          value-field="idLenguaje"
                          text-field="nombre"
                          class="m-1"
                          size="sm"
                        >
                          <!-- <template #first>
                            <b-form-select-option :value="null" disabled
                              >-- Salida --</b-form-select-option
                            >
                          </template> -->
                        </b-form-select>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
                <b-button
                  v-b-modal.mdlCodigoGenerado
                  variant="success"
                  class="rounded-0"
                  size="sm"
                >Generar
                </b-button>
                <mdlCodigoGenerado :codigo="codePython" :tituloPseudo="nombreArchivo"/>
              </div>
              <!-- /Primer header de editor de texto -->
              <!-- Segundo header de editor de texto -->
              <div class="bg-secondary d-flex justify-content-between small">
                  <b-button
                    v-b-modal.modal-changeFileName
                    size="sm"
                    variant="secondary"
                    class="pl-3"
                    @click="newNombreArchivo = nombreArchivo"
                    >{{ nombreArchivo }}<font-awesome-icon icon="edit" class="ml-3" />
                  </b-button>
                  <!-- Modal Cambio de Nombre -->
                  <b-modal
                    id="modal-changeFileName"
                    size="sm"
                    title="Cambiar Nombre"
                    @ok="nombreArchivo = newNombreArchivo"
                  >
                    <b-form-input
                      v-model="newNombreArchivo"
                      placeholder="Nombre de archivo"
                      autofocus
                    ></b-form-input>
                  </b-modal>
                  <!-- /Modal Cambio de Nombre -->
              </div>
              <!-- /Segundo header de editor de texto -->
              <!-- Editor de Texto verificaSintaxisPseudo-->
              <codemirror
                v-model="code"
                :value="code"
                :options="cmOptions"
                class="text-left w-100"
                @input="pruebaSin1"
              ></codemirror>
              <!-- /Editor de Texto -->
            </div>
          </b-col>
          <!-- /Contenedor de Editor de Texto -->
          <!-- Contenedores de Variables, Constantes, Procedimientos y Errores -->
          <b-col sm="12" md="3" class="my-2">
            <!-- Acordeon de Variable -->
            <div class="mb-2">
              <b-button
                v-b-toggle.collapse-var
                variant="outline-secondary"
                block
                class="text-left text-dark"
              >
                <font-awesome-icon icon="i-cursor"/>
                <span class="ml-2">Variables</span>
              </b-button>
              <b-collapse id="collapse-var" visible>
                <b-card no-body class="p-0">
                  <!-- Formulario de Adicion de Variable -->
                  <div class="d-flex justify-content-center mb-3">
                    <b-form-input
                      class="form-control form-control-sm m-1"
                      placeholder="Variable"
                      aria-describedby="input-live-error"
                      trim
                      :state="variables.newVarState"
                      v-model="variables.newVar"
                    >
                    </b-form-input>
                    <b-form-select
                      v-model="variables.selected"
                      :options="tiposVarCons"
                      class="m-1"
                      size="sm"
                    >
                      <template #first>
                        <b-form-select-option :value="null" disabled>-- Tipo --</b-form-select-option>
                      </template>
                    </b-form-select>
                    <button class="btn btn-sm btn-primary m-1" @click="agregarVariable">
                      <font-awesome-icon icon="plus-circle"/>
                    </button>
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
                  </b-table>
                  <!-- /Tabla de Variables -->
                </b-card>
              </b-collapse>
            </div>
            <!-- /Acordeon de Variable -->
            <!-- Acordeon de Constantes -->
            <div class="mb-2">
              <b-button
                v-b-toggle.collapse-const
                variant="outline-secondary"
                block
                class="text-left text-dark"
              >
                <font-awesome-icon icon="i-cursor"/>
                <span class="ml-2">Constantes</span>
              </b-button>
              <b-collapse id="collapse-const" class="mb-2" visible>
                <b-card no-body class="p-0">
                  <!-- Formulario de Adicion de Constante -->
                  <div class="d-flex justify-content-center mb-3">
                    <input
                      type="text"
                      class="form-control form-control-sm m-1"
                      placeholder="Constante"
                      v-model="constantes.newCtte"
                      trim
                    />
                    <b-form-select
                      v-model="constantes.selected"
                      :options="tiposVarCons"
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
                      trim
                    />
                    <b-button class="m-1" size="sm" variant="primary" @click="agregarConstante">
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
            <!-- Acordeon de Procedimientos -->
            <div class="mb-2">
              <b-button
                v-b-toggle.collapse-proc
                variant="outline-secondary"
                block
                class="text-left text-dark"
              >
                <font-awesome-icon icon="i-cursor"/>
                <span class="ml-2">Procedimientos</span>
              </b-button>
              <b-collapse id="collapse-proc" class="mb-2">
                <b-card no-body class="p-0">
                  <!-- Formulario de Adicion de Constante -->
                  <div class="d-flex justify-content-center mb-3">
                    <button class="btn btn-sm btn-primary m-1 btn-block"
                      v-b-modal.mdlProcedimiento>
                      <font-awesome-icon icon="plus-circle" />
                      Agregar procedimiento
                    </button>
                    <mdlProcedimiento :tipoVariables="tiposVarCons"/>
                  </div>
                  <!-- /Formulario de Adicion de Constante -->
                  <!-- Tabla de Procedimientos -->
                  <b-table
                    hover
                    small
                    primary-key="id"
                    :items="procedimientos.items"
                    :fields="procedimientos.fields"
                    v-if="procedimientos.items.length!==0"
                  >
                    <template #cell(id)="data">
                      <button class="btn btn-sm btn-danger m-1" @click="eliminarProcedimiento(data.value)">-</button>
                    </template>
                  </b-table>
                  <!-- /Tabla de Procedimientos -->
                </b-card>
              </b-collapse>
            </div>
            <!-- /Acordeon de Procedimientos -->
            <!-- Acordeon de Errores -->
            <div class="mb-2">
              <b-button
                v-b-toggle.collapse-error
                variant="outline-secondary"
                block
                class="text-left text-dark"
              >
                <font-awesome-icon icon="i-cursor"/>
                <span class="mx-2">Errores</span>
                <b-badge variant="danger" :v-model="error.items.lenght">{{
                  error.items.length
                }}</b-badge>
              </b-button>
              <b-collapse id="collapse-error" class="mb-2" visible>
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
          <!-- /Contenedores de Variables, Constantes, Procedimientos y Errores -->
        </b-row>
      </b-col>
      <b-col sm="12" md="12"></b-col>
    </b-row>
  </b-container>
</template>

<script>
import { codemirror } from "vue-codemirror";
import { db } from "./../firebase.js";
import 'codemirror/mode/pascal/pascal.js';

import mdlProcedimiento from "./ModalProcedimiento.vue";
import mdlCodigoGenerado from "./ModalCodigoGenerado.vue"
/* import Arbol from './../class/Arbol.js' */

export default {
  data() {
    return {
      nombreArchivo: "Archivo_01",
      newNombreArchivo: null,
      lenguajes:{
        in: {
          selected: null,
          data: []
        },
        out: {
          selected: null,
          data: []
        }
      },
      codeGenerado: {},
      codePython: "",
      parametricas:[],
      code: '',
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: "text/x-pascal",
        lineNumbers: true,
      },
      tiposVarCons: [
          { value: 1, text: "Cadena/Texto" },
          { value: 2, text: "Entero" },
          { value: 3, text: "Decimal" },
          { value: 4, text: "Bool" }
      ],
      variables: {
        newVar: null,
        newVarState: null,
        selected: null,
        fields: [
          {key:"vari", label: "Var"}, 
          {key:"tipo", label:"Tipo"},
        ],
        items: []
      },
      constantes: {
        newCtte: null,
        newVal: null,
        selected: null,
        fields: [
          {key:"var", label: "Ctte"}, 
          {key:"tipo", label:"Tipo"}, 
          {key:"valor", label:"Valor"}
        ],
        items: [],
      },
      procedimientos:{
        fields: [
          {key:"procedure", label: "Procedimiento"},
          {key:"procIn", label:"Entrada"},
          {key:"procOut", label:"Salida"},
          {key:"id", label:""}
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
        arbolObj: []
      },
      auxPy:{
        forVariable: "",
        forTope: ""
      }
    };
  },
  firebase: {
    lenguajes: db.collection("T_Lenguaje"),
  },
  components: {
    codemirror,
    mdlProcedimiento,
    mdlCodigoGenerado
  },
  created() {
    this.$store.dispatch('cleanLenguajesAction')
    this.$store.dispatch('cleanParametricasAction')
    this.extraeLenguajes();
    this.extraeParametricas()
  },
  methods: {
    //#region Metodos de variables, ctts, proc, err
    extraeLenguajes(){
      this.lenguajes.in.data = []
      this.lenguajes.out.data = []
      /* Extrae los lenguajes de entrada */
      db.collection("T_Lenguaje").where('codeIn', '==', true).get()
      .then(data=>{
          data.forEach(line => {
            this.$store.state.stLenguaje = line.data()
            this.$store.dispatch('addLenguajesAction')
            this.lenguajes.in.data.push(line.data())
            this.lenguajes.in.selected = this.lenguajes.in.data[0].idLenguaje
            this.$store.state.stLenguaje = null
          });
      })
      /* Extrae los lenguajes de salida */
      db.collection("T_Lenguaje").where('codeOut', '==', true).get()
      .then(data=>{
          data.forEach(line => {
            this.$store.state.stLenguaje = line.data()
            this.$store.dispatch('addLenguajesAction')
            this.lenguajes.out.data.push(line.data())
            this.lenguajes.out.selected = this.lenguajes.out.data[0].idLenguaje
            this.$store.state.stLenguaje = null
          });
      })
    },
    async extraeParametricas(){
          this.$parametros = []
          const col = await db.collection("T_Parametrica").orderBy('prioridad').get()
          col.docs.forEach(data => {
            this.$store.state.stParametrica = data.data()
            this.$store.dispatch('addParametricasAction')
            /* this.$parametros.push(data.data()) */
            this.$store.state.stParametrica = null
          })
    },
    agregarVariable(){
      let variable = new RegExp("^[a-zA-Z]+([-_]?[a-zA-Z0-9]+)*$").test(this.variables.newVar)?this.variables.newVar:null;
      let tipo = this.tiposVarCons.find(el => el.value == this.variables.selected).text;
      let id = this.variables.items.length + 100
      if(variable!=null && tipo!=null)
      {
        this.variables.items.push({id: id, vari: variable, tipo: tipo})
        this.variables.newVar = this.variables.selected = null
        this.$store.state.stVariable = {id: id, vari: variable, tipo: tipo}
        this.$store.dispatch('addVariablesAction')
      }
    },
    eliminarVariable(id)
    {
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
      let tipo = this.tiposVarCons.find(el => el.value == this.constantes.selected).text;
      let valorTipo = this.tiposVarCons.find(el => el.value == this.constantes.selected).value;
      let id = this.constantes.items.length + 200
      /* console.log(id, tipo, this.constantes.selected) */
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
    eliminarConstante(id)
    {
      const i = this.constantes.items.indexOf(this.constantes.items.find(el => el.id==id))
      if(i>=0)
        this.constantes.items.splice(i, 1)
    },
    eliminarProcedimiento(id)
    {
      const i = this.procedimientos.items.indexOf(this.procedimientos.items.find(el => el.id==id))
      if(i>=0)
        this.procedimientos.items.splice(i, 1)
    },
    setModeCodemirrorIn()
    {
      /* this.cmOptions.mode = this.lenguajes.in.data.find(el => el.idLenguaje == this.lenguajes.in.selected).libCodemirror
      console.log(this.cmOptions) */
    },
    //#endregion
    //#region GENERACION
    async btn_Generar(){
      let res= await this.cargarVarConsProc()
      let pila = await this.myPilaObjetos
      console.log("PILA:",pila)
      /* pila.shift() */
      for(let [i,hijo] of pila.entries()){
        console.log("HIJO:", hijo, i)
        if(hijo.token!==null){
          let linea = ""
          for(let [i, valor] of hijo.value.entries()){
            let operadores = []
            let j = i+1
            valor = valor.replace(";", "")
            if(this.aux.caseSw && hijo.level>0){
              hijo.level = parseInt(hijo.level) - 1
            }
            /* console.log(hijo.token) */
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
                valor = valor.replace(" to", "in")
                valor = valor.replace(" do", ":")
                break;
              case 'BUWHILE':
                valor = valor.replace("=", "==")
                valor = valor.replace("<>", "!=")
                valor = valor.replace("do", ":")
                break;
              case 'DATREAD':
                valor = ""
                if(i==0){
                  /* console.log(this.variables.items) */
                  let tipo = ""
                  for(let el of this.variables.items){
                    if(el.vari==hijo.value[(j+1)])
                      tipo = el.tipo
                  }
                  if(tipo=="Entero"){
                    valor = `${hijo.value[(j+1)]} = int(input())`
                  }else{
                    valor = `${hijo.value[(j+1)]} = input()`
                  }
                }
                break;
              case 'DATWRITE':
                /* console.log("WRITE", valor) */
                if (valor=="write")
                  valor=valor.replace("write", "print")
                else if(valor!="("||valor!=")"){
                  let tipo = ""
                  for(let el of this.variables.items){
                    if(el.vari==valor)
                      tipo = el.tipo
                  }
                  if(tipo=="Entero"){
                    valor = `str(${valor})`
                  }
                }
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
              case 'SUBPRSIM':
                console.log("PROC", valor)
                valor = valor.replace("do(", "")
                if(valor===")")
                  valor = valor.replace(")", "")
              break;
              default:
                break;
            }
            linea += valor + " "
          }
          if(typeof(hijo.level)=='undefined' || hijo.level==null)
            hijo.level = 0
          let espacio = '    '.repeat(hijo.level)
          res += espacio +linea+"\n"
        }
      }
      console.log("FINAL:", res)
      this.codePython = await res
      this.$store.state.codePython = await res
      await this.$store.dispatch('setCodepythonAction')
    },
    cargarVarConsProc(){
      let respuesta = ""

      //Se agrega variables
      if(this.variables.items.length!==0){
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
        if(res.numero!=="")
          respuesta += `${res.numero}0\n`
        if(res.cadena!=="")
          respuesta += `${res.cadena}""\n`
        if(res.booleano!=="")
          respuesta += `${res.booleano}true\n`
      }

      //Se agrega constantes
      if(this.constantes.items.length!==0)
        respuesta += "#Declaracion de constantes\n"
      for(let item of this.constantes.items){
        const {ctte, valor} = item
        respuesta += `${ctte} = ${valor}\n`
      }

      //Se agregan procedimientos
      if(this.procedimientos.items.length!==0){
        respuesta	+= "#Procedimientos\n"
        for(let proc of this.procedimientos.items){
          const {pyt} = proc
          respuesta	+= pyt
        }
      }
      return respuesta+"\n"
    },
    async pruebaSin1(){
      this.aux.levelOriginal = 0
      this.aux.id = 99
      this.aux.arbolObj = []
      this.error.items = []
      let nodo = await {id: this.myId, token:null, value: this.nombreArchivo, level: this.myLevelOriginm, parentId:this.myIdParent}
      this.aux.arbolObj.push(nodo)
      this.aux.idParent = await this.myId
      for(let [i, linea] of this.code.split('\n').entries()){
        let lineaIn = linea.trim()
        if(lineaIn!==""){
          await this.getToken(lineaIn)
          .then(token => {
            if(token!=null){
              this.nuevoNodo1(linea, this.myId, token, this.myLevelOrigin, this.myIdParent)
              .then(newNodo => {
                this.aux.arbolObj.push(newNodo)
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
      let nodo = await {id: this.myId, token:null, value: this.nombreArchivo, level: this.myLevelOriginm, parentId:this.myIdParent}
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
          console.log("WRITE sep", this.myBloqueEsp, separador)
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
            /* console.log("CONIF APERTURA", separador, cadena, this.aux.levelOriginal) */
          }else{
            separador = cadena.split('else').join('elseØ').split('if').join('ifØ').split('then').join('thenØ')
            /* console.log("CONIF ELSE", separador, cadena, this.aux.levelOriginal) */
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
        case 'SUBPRSIM':
          separador = cadena.split('do(').join('do(Ø').split(');').join('Ø);')
          console.log(separador)
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
    armarArbol1(){
      for(let el of this.myPilaObjetos){
        // Handle the root element
        if (el.parentId === null) {
          el;
          return;
        }
        // Use our mapping to locate the parent element in our data array
        const parentEl = this.myPilaObjetos[this.aux.mapIndices[el.parentId]];
        // Add our current el to its parent's `children` array
        parentEl.children = [...(parentEl.children || []), el];
      }
    },
    //#endregion
    //#region IvanTePaz
    async verificaSintaxisPseudo(){
      this.error.items = []

      //Armado de la primera iteracion del arbol
      this.aux.levelOriginal = 0
      let nodo = {id: this.myId, token: this.nombreArchivo, level: this.myLevelOriginm, parentId:null, children: []}
      this.codeGenerado = nodo
      for(let [i, linea] of this.code.split('\n').entries()){
        if(linea!=""){
          await this.analizarLinea(linea.trim()).then(token => {
            if(token!=null){
              this.nuevoNodo(linea, token, this.myLevelOrigin).then(child => {
                nodo.children.push(child)
                this.aux.id++
              })
              .catch(error => console.log(error));
            }else{
              this.error.items.push({line: i+1, description:"Error de Sintaxis"})
              nodo.children.push(linea)
            }
          }).catch(() => {
            this.error.items.push({line: i+1, description:"Error de Sintaxis"})
          })
        }
      }
      await this.limpiarNodos()
      await this.armarBloques()
    },
    async armarBloques(){
    },
    async limpiarNodos(){
      let arbol = this.codeGenerado
      const {children} = arbol
      for(let [i, nodo] of children.entries()){
        const {children, level} = nodo
        for(let [j, hoja] of children.entries()){
        /* children.forEach((hoja, j) => { */
          this.analizarCampo(hoja).then(token => {
            if(token!=null && token!="BLOCOD"){
              this.nuevoNodo(hoja, token, level).then(newNodo => {
                arbol.children[i].children[j] = newNodo
              })
            }
          })
        }
      }
      this.codeGenerado = await arbol
    },
    analizarLinea(linea){
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
        reject(false)
      })
    },
    async nuevoNodo(cadena, token, level)
    {
      let nodo = {token:token, level:level, children:[]}
      await this.armarSplit(cadena, token).then(node => {
        nodo.children = node
      })
      return nodo
    },
    async armarSplit(cadena, token){
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
          separador = cadena.split('case').join('caseØ').split('of').join('ØofØ')
          this.aux.levelOriginal += 1
          break;
        case 'BUFOR':
          separador = cadena.split('for').join('forØ').split('to').join('ØtoØ').split('do').join('Ødo')
          this.aux.levelOriginal += 1
          break;
        case 'BUWHILE':
          separador = cadena.split('while').join('whileØ').split('do').join('Ødo')
          this.aux.levelOriginal += 1
          break;
        case 'DATREAD':
          separador = cadena.split('read').join('readØ').split('(').join('(Ø').split(')').join('Ø)').split(';').join('Ø;')
          break;
        case 'DATWRITE':
          separador = cadena.split('write').join('writeØ').split('(').join('(Ø').split(')').join('Ø)').split(';').join('Ø;')
          break;
        case 'CONIF':
          this.aux.levelOriginal += 1
          if(cadena.trim().substr(0,4)!=="else"){
            separador = cadena.split('if').join('ifØ').split('then').join('thenØ')
            /* console.log("CONIF APERTURA", separador, cadena, this.aux.levelOriginal) */
          }else{
            separador = cadena.split('else').join('elseØ').split('if').join('ifØ').split('then').join('thenØ')
            /* console.log("CONIF ELSE", separador, cadena, this.aux.levelOriginal) */
          }
          break;
        case 'BLOCOD':
          sw = false
          if(cadena.trim()==="end"){
            this.aux.levelOriginal -= 1
            separador = "endØ"
          }else if(cadena.trim()==="begin"){
            separador = "beginØ"
          }
          break;
        case 'ASIGVAR':
          separador = cadena.split('var').join('varØ').split(',').join('Ø,Ø').split(':=').join('Ø:=Ø').split('+').join('Ø+Ø').split('-').join('Ø-Ø').split('*').join('Ø*Ø').split('/').join('Ø/Ø').split(';').join('Ø;')
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
        /* console.log("Levels:", this.aux.levelOriginal, this.aux.levelAux) */
        this.aux.levelAux = await this.aux.levelOriginal
      }
      return await sw?separador.split('Ø').map(item=>item.trim()):[];
    },
    verificaEstructura(cadena){
      let res = ""
      cadena.split('Ø').forEach(elm => {
        this.analizarLinea(elm).then(token => {
          if(token!=null){
            this.nuevoNodo(elm, token).then(child => {
              res += `${child}Ø`
            })
            .catch(error => console.log(error));
          }else{
            res += elm+"Ø"
          }
        }).catch(error => console.log(error));
      })
      return res.substr(0, res.length-1)
    },
    async analizarCampo(campo){
      let token
      await this.$store.getters.getParametricas.forEach(parm => {
        let rgx = ""
        if (parm.expresionEstructura!="")
          rgx = parm.expresionEstructura.replace(";", "")
        else
          rgx = parm.inicioEstructura.replace(";", "")
        let val = new RegExp(rgx)
        if (val.test(campo))
          token = parm.token
      })
      return await token
    },
    //#endregion
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
      return this.aux.arbolObj
    }
  },
  updated(){
    this.procedimientos.items = this.$store.getters.getProcedimientos
  }
};
</script>
