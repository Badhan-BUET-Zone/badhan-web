<template>
  <v-card flat>
    <v-card-title>
      {{ groupedLog.dateString }}
    </v-card-title>
    <v-card-subtitle>
      Activity count: {{ groupedLog.group.length }}<br>
      Active user count: {{ logsGroupedPerPerson.length }}
    </v-card-subtitle>
    <v-card-text>
      <v-btn v-if="!dateLogsLoaded" :id="`dateLogDetailsButtonId_${groupedLog.dateString}`" rounded color="primary" x-small @click="detailsClick">
        Details
      </v-btn>
      <div v-else>
        <div v-for="(log,index) in logsGroupedPerPerson" :key="index">
          <PersonLog :date-log="log"></PersonLog>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import PersonLog from './PersonLog'

export default {
  props: ['groupedLog'],
  name: 'DateLog',

  data: function () {
    return {
      logsGroupedPerPerson: [],
      dateLogsLoaded: false
    }
  },
  components: {
    PersonLog
  },
  methods: {
    async detailsClick () {
      this.dateLogsLoaded = true
    }
  },
  mounted(){
    this.logsGroupedPerPerson = this.groupedLog.group.reduce((acc, val) => {
      let o = acc.find((obj) => obj.name === val.name);
      if (o) {
        o.group.push({operation: val.operation, date: val.date});
      } else {
        acc.push({name: val.name, hall: val.hall, group: [{operation: val.operation, date: val.date}]});
      }
      return acc;
    }, []);
  }
}
</script>

<style lang="sass">

</style>
