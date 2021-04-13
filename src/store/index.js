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
    stError: null
  },
  mutations: {
    addLenguajes(state){
      state.stLenguajes = [state.stLenguaje,...state.stLenguajes]
    },
    addParametricas(state){
      state.stParametricas = [state.stParametrica,...state.stParametricas]
    },
    addVariables(state){
      state.stVariables = [state.stVariable,...state.stVariables]
    },
    addConstantes(state){
      state.stConstantes = [state.stConstante,...state.stConstantes]
    },
    addProcedimientos(state){
      state.stProcedimientos = [state.stProcedimiento,...state.stProcedimientos]
    },
    addErrores(state){
      state.stErrores = [state.stError,...state.stErrores]
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
    }
  },
});
