<template>
  <div class="home">
    <Nav />
    <Editor />
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from "@/components/NavComponent.vue";
import Editor from "@/components/EditorComponent.vue";

export default {
  name: "Home",
  components: {
    Nav,
    Editor
  },
};
</script>
