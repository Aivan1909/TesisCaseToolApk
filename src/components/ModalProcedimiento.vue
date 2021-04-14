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
                            <b-form-input id="input-small" size="sm" placeholder="Variable"></b-form-input>
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
                            <button class="btn btn-sm btn-primary m-1">+</button>
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
                                v-model="VarReturnSelected"
                                :options="tipoVariables"
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
                            <button class="btn btn-sm btn-primary m-1">+</button>
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
                            <button class="btn btn-sm btn-primary m-1">+</button>
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
            VarReturnSelected: null,  
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
    },
    created(){
        this.id = this.$store.state.stProcedimientos.length + 300
        this.code = "// Aqui va su procedimiento"
    }
}
</script>