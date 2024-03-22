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
        </v-card-text>
        <v-card-actions>
            <Button :disabled="disableGenerateReportButton"
            :icon="'mdi-file-chart'"
            :click="generateReport"
            :color="'primary'"
            :text="'Generate Report'"
            ></Button>
        </v-card-actions>
        <transition name="slide-fade-down-snapout" mode="out-in">
            <LoadingMessage v-if="reportLoader" :key="'reportLoader'"/>
            <v-card-text v-else-if="report.length!==0" :key="'donationReportLoaded'">
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <td v-for="header in headers" :key="header.text">{{ header.text }}</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="singleMonth in report" :key="singleMonth.nameOfMonth">
                                <td v-for="(key,index) in Object.keys(singleMonth)" :key="index">{{ singleMonth[key] }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card-text>
            <v-card-text v-else :key="'nothingToShowId'">Nothing to show</v-card-text>
        </transition>
    </Container>
</template>
  
<script>
import { mapGetters } from 'vuex'
import Container from '../../components/Wrappers/Container'
import { handleGETDonationsReport } from '@/api'
import LoadingMessage from '@/components/LoadingMessage.vue'
import Button from '@/components/UI Components/Button.vue'
import { bloodGroups } from '@/mixins/constants'
  
export default {
    name: 'DonationsReport',
    components: {
      Container,
      LoadingMessage,
      Button
    },
    data () {
      return {
        report: [],
        reportLoader: false,
        startDateMenu: false,
        startDate: '',
        endDateMenu: false,
        endDate: '',
        headers: [
          { text: 'Name of Month', value: 'nameOfMonth' },
          { text: 'A+', value: 'A+' },
          { text: 'A-', value: 'A-' },
          { text: 'B+', value: 'B+' },
          { text: 'B-', value: 'B-' },
          { text: 'O+', value: 'O+' },
          { text: 'O-', value: 'O-' },
          { text: 'AB+', value: 'AB+' },
          { text: 'AB-', value: 'AB-' },
          { text: 'Total', value: 'total'}
        ],
      }
    },
    computed: {
        ...mapGetters(['getDesignation']),
        disableGenerateReportButton(){
            return this.startDate === '' && this.endDate === ''
        }
    },
    methods: {
        async generateReport(){
            const startTimeStamp = new Date(this.startDate).getTime()
            const endTimeStamp = new Date(this.endDate).getTime()
            this.reportLoader = true
            const response = await handleGETDonationsReport({startDate: startTimeStamp, endDate: endTimeStamp})
            this.reportLoader = false
            if (response.status !== 200) return

            let groupByYear = response.data.report.reduce((acc, item) => {
            item.counts.forEach(count => {
                let yearObj = acc.find(y => y.year === count.year);
                if (!yearObj) {
                yearObj = { year: count.year, months: [] };
                acc.push(yearObj);
                }
                let monthObj = yearObj.months.find(m => m.month === count.month);
                if (!monthObj) {
                monthObj = { month: count.month, bloodGroups: [] };
                yearObj.months.push(monthObj);
                }
                monthObj.bloodGroups.push({ bloodGroup: item.bloodGroup, count: count.count });
            });
            return acc;
            }, []);

            groupByYear.sort((a, b) => a.year - b.year);
            groupByYear.forEach(yearObj => {
                yearObj.months.sort((a, b) => a.month - b.month);
                yearObj.months.forEach(monthObj => {
                    monthObj.bloodGroups.sort((a, b) => a.bloodGroup - b.bloodGroup);
                });
            });

            const tableEntries = []

            groupByYear.forEach(yearData=>{
                yearData['months'].forEach(monthData=>{
                    let singleRow = {}
                    singleRow['nameOfMonth'] = `${new Date(0, monthData.month - 1).toLocaleString('default', { month: 'long' })} ${yearData.year}`
                    bloodGroups.forEach(bloodGroup=>{
                        singleRow[bloodGroup] = 0
                    })
                    let totalCountInMonth = 0
                    monthData['bloodGroups'].forEach(bloodGroupData=>{
                        singleRow[bloodGroups[bloodGroupData.bloodGroup]] = bloodGroupData.count
                        totalCountInMonth += bloodGroupData.count
                    })
                    singleRow['total'] = totalCountInMonth
                    tableEntries.push(singleRow)
                })
            })

            const lastTotalEntry = {'nameOfMonth': 'Total'}
            let sumTotalDonations = 0
            bloodGroups.forEach(bloodGroup=>{
                let totalForOneBloodGroup = 0
                tableEntries.forEach(entry=>{
                    totalForOneBloodGroup += entry[bloodGroup]
                    sumTotalDonations += entry[bloodGroup]
                })
                lastTotalEntry[bloodGroup] = totalForOneBloodGroup
            })
            lastTotalEntry['total']= sumTotalDonations

            tableEntries.push(lastTotalEntry)

            this.report = tableEntries
        }
    },
    async mounted () {
        if (this.getDesignation !== 3) {
            this.$router.push({ name: 'NotFound' })
            return
        }
    }
}
</script>
  
<style scoped>
  
</style>