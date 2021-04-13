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
                      <b-button v-b-modal.modal-changeFileName size="sm" variant="dark" @click="newNombreArchivo=nombreArchivo">{{ nombreArchivo }}<i class="ml-3 fas fa-edit"></i></b-button>
                    <!-- Modal Cambio de Nombre -->
                    <b-modal id="modal-changeFileName" size="sm" title="Cambiar Nombre" @ok="nombreArchivo=newNombreArchivo">
                        <b-form-input v-model="newNombreArchivo" placeholder="Nombre de archivo" autofocus></b-form-input>
                    </b-modal>
                    <!-- /Modal Cambio de Nombre -->
                  </div>
                <div class="d-flex">
                    <b-button variant='light' class="rounded-0" size="sm">Limpiar</b-button>
                    <b-button variant='light' class="rounded-0" size="sm">Deshacer</b-button>
                    <b-button variant='light' class="rounded-0" size="sm">Rehacer</b-button>
                </div>
                <b-button v-b-modal.modal-generarCodigo variant="success" class="rounded-0" size="sm" @click="enviarLenguaje">Generar</b-button>
              </div>
                <codemirror v-model="code" :options="cmOptions" class="text-left w-100"></codemirror>
            </div>
          </div>
          <!-- Contenedores -->
          <div class="col-3 p-2 h-100">
            <!-- Acordion de Variable -->
            <div class="mb-2">
                <b-button v-b-toggle.collapse-var variant="secondary" block class="text-left">
                    <i class="fas fa-i-cursor fa-sm mr-1"></i>
                    <span class="ms-2">Variables</span>
                </b-button>
                <b-collapse id="collapse-var">
                    <b-card no-body class="p-0">
                        <!-- Formulario de Adicion de Variable -->
                        <div class="d-flex justify-content-center mb-3">
                            <input type="text" class="form-control form-control-sm m-1" placeholder="Variable">
                            <b-form-select v-model="variable.selected" :options="variable.options" class="m-1" size="sm">
                                <template #first>
                                    <b-form-select-option :value="null" disabled>-- Tipo --</b-form-select-option>
                                </template>
                            </b-form-select>
                            <button class="btn btn-sm btn-primary m-1">+</button>
                        </div>
                        <!-- /Formulario de Adicion de Variable -->
                        <!-- Tabla de Variables -->
                        <b-table hover small primary-key="id" :items="variable.items" :fields="variable.fields"></b-table>
                        <!-- /Tabla de Variables -->
                    </b-card>
                </b-collapse>
            </div>
            <!-- /Acordion de Variable -->
            <!-- Acordion de Constantes -->
            <div class="mb-2">
                <b-button v-b-toggle.collapse-const variant="secondary" block class="text-left">
                    <i class="fas fa-i-cursor fa-sm mr-1"></i>
                    <span class="ms-2">Constantes</span>
                </b-button>
                <b-collapse id="collapse-const" class="mb-2">
                    <b-card no-body class="p-0">
                        <!-- Formulario de Adicion de Constante -->
                        <div class="d-flex justify-content-center mb-3">
                            <input type="text" class="form-control form-control-sm m-1" placeholder="Constante">
                            <b-form-select v-model="constante.selected" :options="constante.options" class="m-1" size="sm">
                                <template #first>
                                    <b-form-select-option :value="null" disabled>-- Tipo --</b-form-select-option>
                                </template>
                            </b-form-select>
                            <button class="btn btn-sm btn-primary m-1">+</button>
                        </div>
                        <!-- /Formulario de Adicion de Constante -->
                        <!-- Tabla de Constantes -->
                        <b-table hover small primary-key="id" :items="constante.items" :fields="constante.fields"></b-table>
                        <!-- /Tabla de Constantes -->
                    </b-card>
                </b-collapse>
            </div>
            <!-- /Acordion de Constantes -->
            <!-- Acordion de Errores -->
            <div class="mb-2">
                <b-button v-b-toggle.collapse-error variant="secondary" block class="text-left">
                    <i class="fas fa-i-cursor fa-sm mr-1"></i>
                    <span class="mr-3">Errores</span>
                    <b-badge variant="danger" :v-model="error.items.lenght">{{ error.items.length }}</b-badge>
                </b-button>
                <b-collapse id="collapse-error" class="mb-2">
                    <b-card no-body class="p-0">
                        <!-- Tabla de Errores -->
                        <b-table hover small primary-key="id" :items="error.items" :fields="error.fields"></b-table>
                        <!-- /Tabla de Errores -->
                    </b-card>
                </b-collapse>
            </div>
            <!-- /Acordion de Errores -->
          </div>
        </div>
      </div>
    </div>  
  </div>
</template>

<script>
// require component
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/pascal/pascal.js'
import firebase from 'firebase'

export default {
    data(){
        return{
            nombreArchivo: "Archivo_01",
            newNombreArchivo: null,
            code: '&var := 5;\nif &var>=0 then\nwrite("Numero positivo");\nelse\nwrite("Numero negativo");',
            cmOptions: {
                // codemirror options
                tabSize: 4,
                mode: 'text/pascal',
                theme: 'base16-dark',
                lineNumbers: true
            },
            variable: {
                selected: null,
                options:[
                    {value: 1, text: "Cadena/Texto"},
                    {value: 2, text: "Numero Entero"},
                    {value: 3, text: "Decimal"}
                ],
                fields:['Var','Tipo','A.'],
                items: [
                    {id:1, Var:'a', Tipo:'Cadena'},
                    {id:2, Var:'b', Tipo:'Cadena'}
                ]
            },
            constante: {
                selected: null,
                options:[
                    {value: 1, text: "Cadena/Texto"},
                    {value: 2, text: "Numero Entero"},
                    {value: 3, text: "Decimal"}
                ],
                fields:['Var','Tipo','Valor','A.'],
                items: [
                    {id:1, Var:'a', Tipo:'Cadena', Valor:3},
                    {id:2, Var:'b', Tipo:'Cadena', Valor:2}
                ]
            },
            error: {
                fields:['Ln.','Descripcion'],
                items: [
                    {Ln:1, Descripcion:'Esta es una descripcion'},
                    {Ln:2, Descripcion:'Segunda descripcion de la tabla de errores'}
                ]
            }
        }
    },
    components: {
        codemirror
    },
    created() {
        this.extraeLenguajes()
        this.extraeParametricas();
    },
    methods: {
        extraeLenguajes(){
            this.$lenguajes = []
            firebase.firestore().collection("T_Lenguajes").get()
            .then(data=>{
                data.forEach(line => {
                    this.$store.state.lenguaje = line.data()
                    this.$store.dispatch('addLenguajesAction')
                    //this.$lenguajes.push(line.data())
                });
            })
        },
         extraeParametricas(){
            this.$parametros = []
            firebase.firestore().collection("T_Parametrica").get()
            .then(data=>{
                data.forEach(line => {
                    this.$parametros.push(line.data())
                });
            })
        },
        async verificaSintaxisPseudo(){
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
        }
    },
}
</script>