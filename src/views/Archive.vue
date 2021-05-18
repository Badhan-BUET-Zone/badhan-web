<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
<v-container>

    <v-row>
        <v-col
            cols="12"
            sm="4">
            <v-form>
                <v-container>
                    <!--        Input field for name-->
                    <v-text-field
                        outlined
                        label="Name of Donor"
                        clearable
                        dense
                        disabled
                    ></v-text-field>

                    <v-select
                        label="Blood Group"
                        outlined
                        dense
                        disabled
                    ></v-select>

                    <!--        Input field for batch-->
                    <v-text-field
                        outlined
                        label="Batch"
                        clearable
                        dense
                        disabled
                    ></v-text-field>

                    <!--        Input field for hall-->
                    <v-select
                        label="Select Hall"
                        outlined
                        dense
                        disabled
                    ></v-select>

                    <v-text-field
                        outlined
                        label="Address"
                        clearable
                        dense
                        disabled
                    ></v-text-field>


                    <!--        A button to reset the form fields-->
                    <v-btn rounded color="warning" disabled> Reset</v-btn>

                    <!--        The button for executing search-->
                    <v-btn
                        rounded
                        color="primary"
                        class="ml-2"
                        disabled
                    >
                        Search
                    </v-btn>
                </v-container>
            </v-form>
        </v-col>
        <v-col cols="12"
        sm="8">
            <v-btn color="primary" rounded class="mb-4" style="width: 100%" disabled>
                Restore these from archive
            </v-btn>
            <ArchivedPersonList>

            </ArchivedPersonList>
        </v-col>
    </v-row>
</v-container>
  </div>
</template>

<script>
import ArchivedPersonList from "../components/Archive/ArchivedPersonList";
import {mapActions} from "vuex";
import PageTitle from "../components/PageTitle";
export default {
name: "Archive",
    components: {ArchivedPersonList, PageTitle},
    methods:{
    ...mapActions('notification',['notifyInfo'])
    },
    mounted() {
        this.notifyInfo('Section under construction');
    }
}
</script>

<style scoped>

</style>