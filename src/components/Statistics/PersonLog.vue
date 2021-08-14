<template>
  <div>
    Name: {{ dateLog.name }} <br>
    Hall: {{ dateLog.hall | getHallName }} <br>
    Count: {{ dateLog.count }}
    <br>
    <v-btn @click="getPersonActivities" v-if="personLogs.length===0 && !personLogLoading" x-small rounded color="primary">Expand</v-btn>
    <v-skeleton-loader type="text@3" v-if="personLogLoading"></v-skeleton-loader>

    <div v-for="(personLog,i) in personLogs">
      {{i+1}}) Time: {{new Date(personLog.date).toDateString()+' '+new Date(personLog.date).toLocaleTimeString()}} <br>
      Operation: {{personLog.operation}} <br>
      Details: <LogObject :object="personLog.details"></LogObject>
    </div>
    <hr>
  </div>
</template>

<script>
import {badhanAxios} from "../../api";
import LogObject from "./LogObject";

export default {
  name: "PersonLog",
  props: ["dateLog", "dateString"],
  components:{
    LogObject
  },
  data: function () {
    return {
      personLogs: [],
      personLogLoading: false,
    }
  },
  methods: {
    async getPersonActivities() {
      let splitDate = this.dateString.split('-');
      let timeStamp = new Date(parseInt(splitDate[0]), parseInt(splitDate[1]) - 1, parseInt(splitDate[2])).getTime();

      this.personLogLoading = true;
      try{
        let response = await badhanAxios.get(`/log/date/${timeStamp}/donorId/${this.dateLog.donorId}`);
        this.personLogs = response.data.logs;
      }catch (e) {

      }finally {
        this.personLogLoading = false;
      }

    }
  }
}
</script>

<style scoped>

</style>
