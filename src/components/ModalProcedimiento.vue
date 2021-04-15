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
                <b-col sm="12" md="6">
                    <b-button variant="danger" @click="cancel()">
                        Cancelar
                    </b-button>
                </b-col>
                <b-col sm="12" md="6">
                    <b-button variant="success" >
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
                <b-col sn="12" md="6">
                    <b-row align-v="center">
                        <b-col sm="12" md="3">
                            <label for="input-small" class="text-white">Variable de entrada:</label>
                        </b-col>
                        <b-col sm="12" md="4">
                            <b-form-input id="input-small" size="sm" v-model="newVarIn" placeholder="Variable"></b-form-input>
                        </b-col>
                        <b-col sm="12" md="4">
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
                            <b-button class="m-1" variant="primary" size="sm" @click="agregarVariable(true)">+</b-button>
                        </b-col>
                    </b-row>
                </b-col>
                <!-- Contenedor de Entrada de Variables -->
                <!-- Contenedor de Salida de Variables -->
                <b-col sn="12" md="6">
                    <b-row align-v="center">
                        <b-col sm="12" md="6" class="text-right">
                            <b-form-checkbox
                                id="chbReturnVar"
                                v-model="checkVarReturn"
                                name="chbReturnVar"
                                value="true"
                                class="text-white ml-auto"
                            >
                                Variable de retorno
                            </b-form-checkbox>
                        </b-col>
                        <b-col sm="12" md="6">
                            <b-form-select
                                v-model="varReturnSelected"
                                :options="variables.items"
                                value-field="id"
                                text-field="var"
                                class="m-1"
                                size="sm"
                                :disabled="!checkVarReturn"
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
                <b-col sm="12" md="9">
                    <codemirror
                    v-model="code"
                    :options="cmOptions"
                    class="text-left border border-secondary"
                    ></codemirror>
                </b-col>
                <!-- /Contenedor del editor de texto -->
                <!-- Contenedor de variables, constantes y errrores -->
                <b-col sm="12" md="3">
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
                                <b-button class="m-1" variant="primary" size="sm" @click="agregarVariable(false)">+</b-button>
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
                            <b-button class="m-1" variant="primary" size="sm" @click="agregarConstante">+</b-button>
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
                selected: null,
                fields: [
                    {key:"var", label: "Var"}, 
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
                    {key:"valor", label:"Valor"}
                ],
                items: [],
            },
            error: {
                fields: ["Ln.", "Descripcion"],
                items: [
                { Ln: 1, Descripcion: "Esta es una descripcion" },
                { Ln: 2, Descripcion: "Segunda descripcion de la tabla de errores" },
                ],
            },
            code: "// Aqui va su procedimiento\n\n\n\n",
            cmOptions: {
                // codemirror options
                tabSize: 4,
                mode: "text/pascal",
                theme: "base16-dark",
                lineNumbers: true,
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
            const variable = new RegExp("^[a-zA-Z]+([-_][a-zA-Z0-9]+)*$").test(va)?va:null;
            const tipo = this.tipoVariables.find(el => el.value == slct).text
            let id = this.variables.items.length + 1100
            if(variable!=null && tipo!=null)
            {
                this.variables.items.push({id: id, var: variable, tipo: tipo, in:varIn, out:false})
                this.newVarIn = this.newVarSelected = null
                this.variables.newVar = this.variables.selected = null
                /* this.$store.state.stVariable = {id: id, var: variable, tipo: tipo}
                this.$store.dispatch('addVariablesAction') */
            }
        },
        eliminarVariable(id)
            {
            const i = this.variables.items.indexOf(this.variables.items.find(el => el.id==id))
            if(i>=0){
                this.variables.items.splice(i, 1)
                /* this.$store.state.stVariable = i
                this.$store.dispatch('deleteVariableAction')
                this.$store.state.stVariable = null */
            }
        },
        agregarConstante(){
            let ctte = new RegExp("^[a-zA-Z]+([-_][a-zA-Z0-9]+)*$").test(this.constantes.newCtte)?this.constantes.newCtte:null;
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
        }
    },
    mounted(){
        this.id = this.$store.state.stProcedimientos.length + 1000
        this.code = "// Aqui va su procedimiento"
    }
}
</script>