<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="row" id="main">
          <!-- Contenedor de Editor de Texto -->
          <div class="col-9 p-2 h-100">
            <div class="border rounded border-light" id="pnl_pseudo">
              <div class="bg-dark d-flex justify-content-between small">
                <div class="d-flex">
                  <b-button
                    v-b-modal.modal-changeFileName
                    size="sm"
                    variant="dark"
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
                <b-button
                  v-b-modal.modal-generarCodigo
                  variant="success"
                  class="rounded-0"
                  size="sm"
                  >Generar</b-button
                >
              </div>
              <codemirror
                v-model="code"
                :options="cmOptions"
                class="text-left w-100"
              ></codemirror>
            </div>
          </div>
          <!-- Contenedores -->
          <div class="col-3 p-2 h-100">
            <!-- Acordeon de Variable -->
            <div class="mb-2">
              <b-button
                v-b-toggle.collapse-var
                variant="outline-light"
                block
                class="text-left text-dark"
              >
                <i class="fas fa-i-cursor fa-sm mr-1"></i>
                <span class="ms-2">Variables</span>
              </b-button>
              <b-collapse id="collapse-var">
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
                      :options="tiposVarCons"
                      class="m-1"
                      size="sm"
                    >
                      <template #first>
                        <b-form-select-option :value="null" disabled>-- Tipo --</b-form-select-option>
                      </template>
                    </b-form-select>
                    <button class="btn btn-sm btn-primary m-1" @click="agregarVariable">+</button>
                  </div>
                  <!-- /Formulario de Adicion de Variable -->
                  <!-- Tabla de Variables -->
                  <b-table
                    hover
                    small
                    primary-key="id"
                    :items="variables.items"
                    :fields="variables.fields"
                  >
                    <template #cell(id)="data">
                      <button class="btn btn-sm btn-danger m-1" @click="eliminarVariable(data.value)">-</button>
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
                variant="outline-light"
                block
                class="text-left text-dark"
              >
                <i class="fas fa-i-cursor fa-sm mr-1"></i>
                <span class="ms-2">Constantes</span>
              </b-button>
              <b-collapse id="collapse-const" class="mb-2">
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
                    <button class="btn btn-sm btn-primary m-1" @click="agregarConstante">+</button>
                  </div>
                  <!-- /Formulario de Adicion de Constante -->
                  <!-- Tabla de Constantes -->
                  <b-table
                    hover
                    small
                    primary-key="id"
                    :items="constantes.items"
                    :fields="constantes.fields"
                  >
                    <template #cell(id)="data">
                      <button class="btn btn-sm btn-danger m-1" @click="eliminarVariable(data.value)">-</button>
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
                variant="outline-light"
                block
                class="text-left text-dark"
              >
                <i class="fas fa-i-cursor fa-sm mr-1"></i>
                <span class="ms-2">Procedimientos</span>
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
                  <!-- TODO -->
                  <b-table
                    hover
                    small
                    primary-key="id"
                    :items="procedimientos.items"
                    :fields="procedimientos.fields"
                  >
                    <template #cell(id)="data">
                      <button class="btn btn-sm btn-danger m-1" @click="eliminarVariable(data.value)">-</button>
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
              <b-collapse id="collapse-error" class="mb-2">
                <b-card no-body class="p-0">
                  <!-- Tabla de Errores -->
                  <b-table
                    hover
                    small
                    primary-key="id"
                    :items="error.items"
                    :fields="error.fields"
                  ></b-table>
                  <!-- /Tabla de Errores -->
                </b-card>
              </b-collapse>
            </div>
            <!-- /Acordeon de Errores -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/mode/pascal/pascal.js";
import { db } from "./../firebase.js";

import mdlProcedimiento from "./ModalProcedimiento.vue"

export default {
  data() {
    return {
      nombreArchivo: "Archivo_01",
      newNombreArchivo: null,
      lenguajes:{
        in: [],
        out: []
      },
      parametricas:[],
      code: 'algo := 5;\nif &var>=0 then\nwrite("Numero positivo");\nelse\nwrite("Numero negativo");',
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: "text/pascal",
        theme: "base16-dark",
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
        selected: null,
        fields: [{key:"var", label: "Var"}, 
                  {key:"tipo", label:"Tipo"},
                  {key:"id", label:""}
        ],
        items: []
      },
      constantes: {
        newCtte: null,
        newVal: null,
        selected: null,
        fields: [{key:"var", label: "Var"}, 
                  {key:"tipo", label:"Tipo"}, 
                  {key:"valor", label:"Valor"},
                  {key:"id", label:""}],
        items: [],
      },
      procedimientos:{
        fields: [{key:"procedure", label: "Procedimiento"}, 
                  {key:"procIn", label:"Entrada"}, 
                  {key:"procOut", label:"Salida"},
                  {key:"id", label:""}],
        items: [],
      },
      error: {
        fields: ["Ln.", "Descripcion"],
        items: [
          { Ln: 1, Descripcion: "Esta es una descripcion" },
          { Ln: 2, Descripcion: "Segunda descripcion de la tabla de errores" },
        ],
      },
    };
  },
  firebase: {
    lenguajes: db.collection("T_Lenguaje"),
  },
  components: {
    codemirror,
    mdlProcedimiento
  },
  created() {
    this.$store.dispatch('cleanLenguajesAction')
    this.$store.dispatch('cleanParametricasAction')
    this.extraeLenguajes();
    this.extraeParametricas();
  },
  methods: {
    extraeLenguajes(){
      this.lenguajes.in = []
      this.lenguajes.out = []
      /* Extrae los lenguajes de entrada */
      db.collection("T_Lenguaje").where('codeIn', '==', true).get()
      .then(data=>{
          data.forEach(line => {
            this.$store.state.stLenguaje = line.data()
            this.$store.dispatch('addLenguajesAction')
            this.lenguajes.in.push(line.data())
            this.$store.state.stLenguaje = null
          });
      })
      /* Extrae los lenguajes de salida */
      db.collection("T_Lenguaje").where('codeOut', '==', true).get()
      .then(data=>{
          data.forEach(line => {
            this.$store.state.stLenguaje = line.data()
            this.$store.dispatch('addLenguajesAction')
            this.lenguajes.out.push(line.data())
            this.$store.state.stLenguaje = null
          });
      })
    },
    extraeParametricas(){
          this.$parametros = []
          db.collection("T_Parametrica").get()
          .then(data=>{
              data.forEach(line => {
                this.$store.state.stParametrica = line.data()
                this.$store.dispatch('addParametricasAction')
                this.$parametros.push(line.data())
                this.$store.state.stParametrica = null
              });
          })
    },
    agregarVariable(){
      let variable = this.variables.newVar
      let tipo = this.tiposVarCons.find(el => el.value == this.variables.selected).text;
      let id = this.variables.items.length + 100
      console.log(id, tipo, this.variables.selected)
      this.variables.items.push({id: id, var: variable, tipo: tipo})
    },
    eliminarVariable(id)
    {
      //TODO
      let i = this.variables.items.find(el => el.id==id)
      console.log(i)
    },
    agregarConstante(){
      let ctte = this.constantes.newCtte
      let valor = this.constantes.newVal
      let tipo = this.tiposVarCons.find(el => el.value == this.constantes.selected).text;
      let valorTipo = this.tiposVarCons.find(el => el.value == this.constantes.selected).value;
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
          regex = new RegExp('\\d+')
          if(regex.test(valor))
            sw = true
          break;
        case 3:
          regex = new RegExp("^\\d+([.]\\d+)*$")
          if(regex.test(valor))
            sw = true
          break;
      }
      if(sw){
        this.constantes.items.push({id: id, var: ctte, tipo: tipo, valor: valor})
        this.constantes.newCtte = this.constantes.newVal = this.constantes.selected = null
      }
    },
    eliminarConstante(id)
    {
      //TODO
      let i = this.constantes.items.find(el => el.id==id)
      console.log(i)
    }
    /* async verificaSintaxisPseudo(){
            console.log(this.code)
            let i = 0
            this.code.split("\n").forEach((value, line) =>{
                let linea = value.trim();
                if(linea!=="")
                {
                    let findAnswer = {
                        linea: i,
                        token: null,
                        parent: null,
                        valor: this.nombreArchivo,
                        children:[]
                    }
                    this.$parametros.forEach(parm => {
                        var expreg = parm.expresionEstructura===''?parm.inicioEstructura:parm.expresionEstructura
                        var regex = new RegExp(expreg)
                        let newChildren = findAnswer
                        if(regex.test(linea)){
                            newChildren.linea = i //Set linea
                            newChildren.token = parm.token //Set token
                            newChildren.parent = "" //Set parent
                            for(let j=0; j<=i; j++)
                            {
                                newChildren = newChildren.children
                            }
                            console.log(line+1, expreg, parm.token, linea)
                        }else{
                            //console.log(line+1, "no es")
                        }
                    })
                }
            })
        } */
  },
};
</script>
