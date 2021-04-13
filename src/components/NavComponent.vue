<template>
  <div>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark">
        <!-- <b-navbar-brand href="#">NavBar</b-navbar-brand> -->

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item href="#">
                    <i class="fas fa-file fa-md mr-1"></i>
                    <span>Nuevo</span>
                </b-nav-item>
                <b-nav-item href="#">
                    <i class="fas fa-folder-open fa-md mr-1"></i>
                    Abrir
                </b-nav-item>
                <b-nav-item href="#">
                    <i class="fas fa-save fa-md mr-1"></i>
                    Guardar
                </b-nav-item>
                <b-nav-item-dropdown>
                    <template #button-content>
                        <i class="fas fa-life-ring fa-md mr-1"></i>
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
