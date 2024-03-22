<template>
    <Container>
        <v-card-title>Donations Report</v-card-title>
        <v-card-text>
            <div class="mt-2">
                <v-menu
                    ref="startDateMenu"
                    v-model="startDateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="startDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field rounded v-model="startDate" label="Start Date" prepend-icon="mdi-calendar" readonly outlined v-bind="attrs" v-on="on" dense></v-text-field>
                </template>
                <v-date-picker v-model="startDate" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="startDateMenu = false">Cancel</v-btn>
                    <v-btn text
                        color="primary"
                        @click="$refs.startDateMenu.save(startDate)"
                    >OK
                    </v-btn
                    >
                </v-date-picker>
                </v-menu>
            </div>
            {{ startDate }}
            <div class="mt-2">
                <v-menu
                    ref="endDateMenu"
                    v-model="endDateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="endDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field rounded v-model="endDate" label="End Date" prepend-icon="mdi-calendar" readonly outlined v-bind="attrs" v-on="on" dense></v-text-field>
                </template>
                <v-date-picker v-model="endDate" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="endDateMenu = false">Cancel</v-btn>
                    <v-btn text
                        color="primary"
                        @click="$refs.endDateMenu.save(endDate)"
                    >OK
                    </v-btn>
                </v-date-picker>
                </v-menu>
            </div>
            {{ endDate }}
        </v-card-text>
      <transition name="slide-fade-down-snapout" mode="out-in">
        <LoadingMessage v-if="reportLoader" :key="'reportLoader'"/>
        <v-card-text v-else :key="'donationReportLoaded'">
            {{ report }}
        </v-card-text>
      </transition>
    </Container>
</template>
  
<script>
import { mapGetters } from 'vuex'
import Container from '../../components/Wrappers/Container'
import { handleGETDonationsReport } from '@/api'
import LoadingMessage from '@/components/LoadingMessage.vue'
  
export default {
    name: 'DonationsReport',
    components: {
      Container,
      LoadingMessage
    },
    data () {
      return {
        report: null,
        reportLoader: false,
        startDateMenu: false,
        startDate: '',
        endDateMenu: false,
        endDate: ''
      }
    },
    computed: {
        ...mapGetters(['getDesignation'])
    },
    methods: {

    },
    async mounted () {
        if (this.getDesignation !== 3) {
            this.$router.push({ name: 'NotFound' })
            return
        }
        this.reportLoader = true
        const response = await handleGETDonationsReport({startDate: 1679357772000, endDate: 1710980266000})
        this.reportLoader = false
        if (response.status !== 200) return
        this.report = response.data.report
    }
}
</script>
  
<style scoped>
  
</style>