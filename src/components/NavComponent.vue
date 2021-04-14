<template>
  <div>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark">
        <!-- <b-navbar-brand href="#">NavBar</b-navbar-brand> -->

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item href="#">
                    <font-awesome-icon icon="file" class="mr-1"/>
                    <span>Nuevo</span>
                </b-nav-item>
                <b-nav-item href="#">
                    <font-awesome-icon icon="folder-open" class="mr-1"/>
                    Abrir
                </b-nav-item>
                <b-nav-item href="#">
                    <font-awesome-icon icon="save" class="mr-1"/>
                    Guardar
                </b-nav-item>
                <b-nav-item-dropdown>
                    <template #button-content>
                        <font-awesome-icon icon="life-ring" class="mr-1"/>
                        Ayuda
                    </template>
                    <b-dropdown-item>Ayuda</b-dropdown-item>
                    <b-dropdown-item>Ejemplos de pseudocódigos</b-dropdown-item>
                    <b-dropdown-item>Manual de pseudocódigo</b-dropdown-item>
                    <b-dropdown-item>Acerca de</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown text="Lang" right>
                <b-dropdown-item href="#">EN</b-dropdown-item>
                <b-dropdown-item href="#">ES</b-dropdown-item>
                <b-dropdown-item href="#">RU</b-dropdown-item>
                <b-dropdown-item href="#">FA</b-dropdown-item>
                </b-nav-item-dropdown>

                <b-nav-item-dropdown right>
                <!-- Using 'button-content' slot -->
                <template #button-content>
                    <em>User</em>
                </template>
                <b-dropdown-item href="#">Profile</b-dropdown-item>
                <b-dropdown-item href="#">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
    </div>
  </div>
</template>

<script>
export default {
  name: "Nav",
  props: {},
};
</script>
