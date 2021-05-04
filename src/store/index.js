import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    stLenguajes: [],
    stLenguaje: null,
    stParametricas: [],
    stParametrica: null,
    stVariables: [],
    stVariable: null,
    stConstantes: [],
    stConstante: null,
    stProcedimientos: [],
    stProcedimiento: null,
    stErrores: [],
    stError: null,
    codePython: ""
  },
  mutations: {
    addLenguajes(state){
      state.stLenguajes.push(state.stLenguaje)
      state.stLenguaje = null
    },
    addParametricas(state){
      state.stParametricas.push(state.stParametrica)
      state.stParametrica = null
    },
    addVariables(state){
      state.stVariables.push(state.stVariable)
      state.stVariable = null
    },
    addConstantes(state){
      state.stConstantes.push(state.stConstante)
      state.stConstante = null
    },
    addProcedimientos(state){
      state.stProcedimientos.push(state.stProcedimiento)
      state.stProcedimiento = null
    },
    addErrores(state){
      state.stErrores.push(state.stError)
      state.stError = null
    },
    cleanLenguajes(state){
      state.stLenguajes = []
    },
    cleanParametricas(state){
      state.stParametricas = []
    },
    deleteVariable(state){
      state.stVariables.splice(parseInt(state.stVariable), 1)
    },
    setCodepython(state){
      state.codePython
    },
  },
  actions: {
    addLenguajesAction(context){
      context.commit('addLenguajes')
    },
    addParametricasAction(context){
      context.commit('addParametricas')
    },
    addConstantesAction(context){
      context.commit('addConstantes')
    },
    addVariablesAction(context){
      context.commit('addVariables')
    },
    addProcedimientosAction(context){
      context.commit('addProcedimientos')
    },
    addErroresAction(context){
      context.commit('addErrores')
    },
    cleanLenguajesAction(context){
      context.commit('cleanLenguajes')
    },
    cleanParametricasAction(context){
      context.commit('cleanParametricas')
    },
    deleteVariableAction(context){
      context.commit('deleteVariable')
    },
    setCodepythonAction(context){
      context.commit('setCodepython')
    },
  },
  getters: {
    getLenguajes(state){
      return state.stLenguajes
    },
    getVariables(state){
      return state.stVariables
    },
    getConstantes(state){
      return state.stConstantes
    },
    getParametricas(state){
      return state.stParametricas
    },
    getProcedimientos(state){
      return state.stProcedimientos
    },
    getErrores(state){
      return state.stErrores
    },
    getCodePython(state){
      return state.codePython
    }
  },
});
