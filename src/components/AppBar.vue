<template>
    <div>
        <v-app-bar
            color="red"
            dark
            app
            clipped-left
            collapse-on-scroll
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>


                <img src="../assets/images/badhanlogo.png" alt="Badhan" style="height: 40px; width: 40px" class="mr-4">

            <v-toolbar-title>Badhan</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-progress-circular
                indeterminate
                color="white"
                v-if="$store.getters.getLoadingFlag"
            ></v-progress-circular>

        </v-app-bar>

        <v-navigation-drawer
            v-model="drawer"
            left
            app
            clipped
        >
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title">
                        {{ $store.getters.getName }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        <span v-if="$store.getters.getDesignation===2">Hall admin</span>
                        <span v-else-if="$store.getters.getDesignation===3">Super admin</span>
                        <span v-else-if="$store.getters.getDesignation===1">Volunteer</span>
                        <span v-else-if="$store.getters.getDesignation===0">Donor</span>
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
            <v-list
                nav
                dense
            >
                <v-list-item-group
                    v-model="group"
                    active-class="red--text text--accent-4"
                >
                    <v-list-item link to="/home" style="text-decoration: none">
                        <v-list-item-icon>
                            <v-icon>mdi-home</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Home</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item link to="/halladmin" v-if="$store.getters.getDesignation >=2"  style="text-decoration: none">
                        <v-list-item-icon>
                            <v-icon>mdi-shield-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Hall Admin Panel</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item link to="/superadmin" v-if="$store.getters.getDesignation === 3" style="text-decoration: none">
                        <v-list-item-icon>
                            <v-icon>mdi-star</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Super Admin Panel</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item @click="myProfileclicked" style="text-decoration: none">
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>My Profile</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                     <v-list-item link to="/settings" style="text-decoration: none">
                        <v-list-item-icon>
                            <v-icon>mdi-cog</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Settings</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item link to="/credits" style="text-decoration: none">
                        <v-list-item-icon>
                            <v-icon>mdi-hand-heart</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Credits</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item @click="signOutClicked" style="text-decoration: none">
                        <v-list-item-icon>

                            <v-icon>mdi-logout</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Sign Out</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>

    </div>
</template>

<script>
import axios from "axios";
import {eventBus} from "@/main";

export default {
    data: () => ({
        drawer: false,
        group: null,
    }),
    computed:{
        isMobile(){
            let check = false;
            (function (a) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
            })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        }
    },
    methods: {
        async myProfileclicked() {
            // this.$store.commit('showSearchPanel');

            await this.$router.push({path:'/home/details', query: { phone: this.$store.getters.getPhone }});
            
/*
            let sendData = {
                donorPhone: parseInt(this.$store.getters.getPhone)
            };
            let headers = {
                'x-auth': this.$store.getters.getToken
            }
            console.log('REQUEST TO /donor/details: ', sendData);

            this.$store.commit('setLoadingTrue');

            try {
                let response = await axios.post('/donor/details', sendData, {headers: headers});
                console.log("RESPONSE FROM /donor/details: ",response);
                if (response.status !== 200) {
                    this.error = "Status code not 200";
                    return;
                }

                eventBus.$emit('dataloaded', response.data.donor);


            } catch (error) {
                eventBus.$emit('errorFound', error.response);
            } finally {
                this.$store.commit('setLoadingFalse');
            }
            */
        },
        async signOutClicked() {
            
            await this.$store.dispatch('logout');
            this.$router.push('/');
        },
    },
    watch: {
        group() {
            this.drawer = false
        },
    },
}
</script>