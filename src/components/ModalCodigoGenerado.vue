<template>
    <b-modal id="mdlCodigoGenerado"
        ref="mdlCodigoGenerado" 
        size="xl"
        body-class="p-0"
        header-bg-variant="secondary"
    >
        <template #modal-header="{ close }" class="p-0">
            <b-button
                size="sm"
                variant="secondary"
            >{{ title }}<font-awesome-icon icon="edit" class="ml-3"/>
            </b-button>
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
                    <b-button variant="success" block>
                        Guardar
                    </b-button>
                </b-col>
            </b-row>
        </template>
        <!-- Cuerpo del Modal -->
        <b-container class="pt-2 pb-2" fluid>
            <b-row>
                <!-- Contenedor del editor de texto -->
                <b-col sm="12">
                    <codemirror
                    v-model="codigo"
                    :options="cmOptions"
                    class="text-left border border-secondary"
                    ></codemirror>
                </b-col>
                <!-- /Contenedor del editor de texto -->
            </b-row>
        </b-container>
    </b-modal>
</template>

<script>
import { codemirror } from "vue-codemirror";
import 'codemirror/mode/python/python.js';

export default{
    data(){
        return{
            id: null,
            title: "proc_01",
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
                mode: "text/x-python",
                lineNumbers: true,
            }
        }
    },
    components:{
        codemirror
    },
    props:{
        codigo: String,
        tituloPseudo: String
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
            const variable = new RegExp("^[a-zA-Z]+([-_]?[a-zA-Z0-9]+)*$").test(va)?va:null;
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
        eliminarConstante(id)
        {
            const i = this.constantes.items.indexOf(this.constantes.items.find(el => el.id==id))
            if(i>=0)
                this.constantes.items.splice(i, 1)
        }
    },
    mounted(){
        this.id = this.$store.state.stProcedimientos.length + 1000
        this.code = this.codigo
    }
}
</script>