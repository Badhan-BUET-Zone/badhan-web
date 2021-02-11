<template>
    <div>
    <v-app-bar
        color="red accent-4"
        app
        dark
        clipped-left
    >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-avatar rounded>
            <img
                src="../../assets/images/badhanlogo.png"
                alt="John"
            >
        </v-avatar>

        <v-toolbar-title>Badhan</v-toolbar-title>

        <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        left
        app
        clipped
    >
        <v-list
            nav
            dense
        >
            <v-list-item-group
                v-model="group"
                active-class="red--text text--accent-4"
            >
                <v-list-item v-for="(item,index) in drawerLinks" :key="index" :to="item.to" style="text-decoration: none;">
                    <v-list-item-icon>
                        <v-icon>{{item.icon}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{item.title}}</v-list-item-title>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
    </div>
</template>

<script>
export default {
name: "Navbar",
    data: () => ({
        drawer: false,
        group: null,

        drawerLinks:[
            {icon:'mdi-home',to:'/home',title: 'Home'},
            {icon:'mdi-shield-account',to:'/halladmin',title: 'Hall Admin'},
            {icon:'mdi-star',to:'/superadmin', title: 'Super Admin'},
            {icon:'mdi-account',to:'/myprofile',title: 'My Profile'},
            {icon:'mdi-logout',to:'/',title: 'Sign Out'},
        ]
    }),

    watch: {
        group () {
            this.drawer = false
        },
    },
}
</script>

<style scoped>

</style>