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
                          <template #first>
                            <b-form-select-option :value="null" disabled
                              >-- Entrada --</b-form-select-option
                            >
                          </template>
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
                          <template #first>
                            <b-form-select-option :value="null" disabled
                              >-- Salida --</b-form-select-option
                            >
                          </template>
                        </b-form-select>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
                <b-button
                  v-b-modal.modal-generarCodigo
                  variant="success"
                  class="rounded-0"
                  size="sm"
                  @click="verificaSintaxisPseudo"
                  >Generar</b-button
                >
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
              <!-- Editor de Texto -->
              <codemirror
                v-model="code"
                :options="cmOptions"
                class="text-left w-100"
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
                  <!-- TODO -->
                  <b-table
                    hover
                    small
                    primary-key="id"
                    :items="procedimientos.items"
                    :fields="procedimientos.fields"
                    v-if="procedimientos.items.length!==0"
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

import mdlProcedimiento from "./ModalProcedimiento.vue"

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
      parametricas:[],
      code: 'algo := 5;\nfor i=0 to n do\nwrite("Numero positivo");\nwrite("Numero negativo");',
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
        newVarState: null,
        selected: null,
        fields: [
          {key:"var", label: "Var"}, 
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
    this.extraeParametricas()
  },
  methods: {
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
              this.$parametros.push(data.data())
              this.$store.state.stParametrica = null
          })
    },
    agregarVariable(){
      let variable = new RegExp("^[a-zA-Z]+([-_]?[a-zA-Z0-9]+)*$").test(this.variables.newVar)?this.variables.newVar:null;
      let tipo = this.tiposVarCons.find(el => el.value == this.variables.selected).text;
      let id = this.variables.items.length + 100
      if(variable!=null && tipo!=null)
      {
        this.variables.items.push({id: id, var: variable, tipo: tipo})
        this.variables.newVar = this.variables.selected = null
        this.$store.state.stVariable = {id: id, var: variable, tipo: tipo}
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
    eliminarConstante(id)
    {
      const i = this.constantes.items.indexOf(this.constantes.items.find(el => el.id==id))
      if(i>=0)
        this.constantes.items.splice(i, 1)
    },
    setModeCodemirrorIn()
    {
      this.cmOptions.mode = this.lenguajes.in.data.find(el => el.idLenguaje == this.lenguajes.in.selected).libCodemirror
      console.log(this.cmOptions)
    },
    verificaSintaxisPseudo(){
      console.log(this.genera(this.code))
    },
    Var(name,value,type){
      this.name=name;
      this.value=value;
      this.type=type;
      this.asigTipo=()=>{
        return ({
          token:'ASIGTIPO',
          children:[
            'var',
            this.name,
            ':=',
            this.value,
            ':',
            this.type,
            ';'
          ]
        })
      }
      this.asigVar=()=>{
        return ({
          token:'ASIGVAR',
          children:[
            this.name,
            ':=',
            this.value,
            ';'
          ]
        })
      }
    },
    For(init,limit){
      this.init=init;
      this.limit=limit;
      //this.children=genera(tmpString);
      this.display=()=>{
        return ({
          token:'BUFOR',
          children:[
            'for',
            this.init,
            'to',
            this.limit,
            'do',
            this.children
          ]
        })
      }
    },
    Arit(value1,operator,value2){
      this.value1=value1;
      this.value2=value2;
      this.operator=operator;
      this.display=()=>{
        return ({
          token:'OPEARIT',
          children:[
            this.value1,
            this.operator,
            this.value2
          ]
        })
      }
    },
    Read(value){
      this.value=value;
      this.display=()=>{
        return({
          token:'DATREAD',
          children:[
            'read',
            '(',
            this.value,
            ')',
            ';'
          ]
        })
      }
    },
    Block(){
      //this.children=genera(stringChildren);
      this.addChildren=(child)=>{
        this.children.push(child);
      }
      this.display=()=>{
        return ({
          token:'BLOCOD',
          children:[
            'begin',
            this.children,
            'end'
          ]
        })
      }
    },
    Write(value){
      this.value=value;
      this.display=()=>{
        return({
          token:'DATWRITE',
          children:[
            'write',
            '(',
            this.value,
            ')',
            ';'
          ]
        })
      }
    },
    cases(values,args,stringChildren){
      let tmp='';
      let regSpace=new RegExp(/\S+/,'g');
      switch(values){
        case 'ASIGVAR':
          if((args.input.indexOf('var'))!==-1){
            tmp=args.input.match(regSpace).join('')
            tmp=tmp.split(/(var|:=|:|;)/)
            tmp=new this.Var(tmp[2],tmp[4],tmp[6])
            return tmp.asigTipo();
          }else{
            tmp=args[0].match(regSpace).join('')
            tmp=tmp.split(/(:=|:)/)
            tmp=new this.Var(tmp[0],tmp[2])
            return tmp.asigVar();
          }
        case 'BUFOR':
          tmp = new this.For(args[1],args[2],stringChildren)
          return tmp.display()
        case 'DATREAD':
          tmp=new this.Read(args[1])
          return tmp.display();
        case 'DATWRITE':
          tmp =new this.Write(args[1])
          return tmp.display();
        case 'BLOCOD':
          tmp =new this.Block(stringChildren)
          return tmp.display();
        default:
          '';
      }
    },
    obtieneKeys(lines){
      let pivote=1;
      let tmpPivote=0;
      let beforeLine='';
      let sw = false;
      var parmA = this.$store.state.stParametricas.filter(d => d.prioridad==0)
      return lines.split("\n").map((line)=>{
        for(const regA of parmA){
          console.log(regA, line)

          if(beforeLine.match(regA.expresionEstructura==''?regA.inicioEstructura:regA.expresionEstructura) && regA.token!=='BLOCOD' && !/begin/.test(line.trim())){
            sw = true;
            pivote+=1;
            break;
          }
        }
        tmpPivote=pivote;
        //Si la linea Coincide con PrioridadA Significa que habra un bloque de codigo o unsa sola linea
        for(const regA in parmA){
          if(line.match(regA.expresionEstructura==''?regA.inicioEstructura:regA.expresionEstructura)){
            pivote+=1;
            break;
          }
        }
        if(/end/.test(line)||sw){
          sw=false;
          tmpPivote-=1;
          pivote-=2;
        }
        beforeLine=line;
        return tmpPivote;
      })
    },
    genera(lines){
      let keys=this.obtieneKeys(lines)
      let j=0
      let nodo=[]
      let parmA = this.$store.state.stParametricas.filter(d => d.prioridad==0)
      let parmB = this.$store.state.stParametricas.filter(d => d.prioridad==1)
      //var parmC = this.$store.state.stParametricas.filter(d => d.prioridad==2)
      lines = lines.split('\n')
      while(j<lines.length){
        let sw=true;

        for(const regA of parmA){
          let regx = lines[j].match(regA.expresionEstructura==''?regA.inicioEstructura:regA.expresionEstructura)
          if(regx){
            let lastIndex=keys.indexOf(keys[j],j+1)
            let Mj=lastIndex===-1?lines.length:lastIndex;
            let subArray=lines.slice(j+1,lines.length-j)
            nodo.push(this.cases(regA.token,regx,subArray))
            sw=false;
            j=Mj;
            j++
            break;
          }
        }
        if(sw){
          for(const regB of parmB){
            let regx = lines[j].match(regB.expresionEstructura==''?regB.inicioEstructura:regB.expresionEstructura)
            if(regx){
              nodo.push(this.cases(regB.token,regx))
              j++;
              break;
            }
          }
        }
      }
      return nodo
    }
  }
};
</script>
