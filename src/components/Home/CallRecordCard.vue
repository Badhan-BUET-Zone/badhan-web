<template>
  <v-card
      class="mb-2 rounded-xl"
      outlined
      dense
  >
    <v-card-text>
      <v-row>
        <v-col cols="9">
          <p>
            {{ callRecord.callerId.name }}<br>
            <b>Hall: </b>{{ callRecord.callerId.hall | getHallName }}<br>
            <b>Designation: </b>{{ designations[callRecord.callerId.designation] }}<br>
            <b>Time: </b>{{ dateString }} at {{ time }}
          </p>
        </v-col>
        <v-col cols="3">
          <v-btn :id="`callRecordDeleteButtonId_${callRecord._id}`" @click="deletePrompt" :disabled="deleteLoaderFlag" color="warning" x-small
                 fab depressed>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { designations } from '@/mixins/constants'

export default {
  name: 'CallRecordCard',
  props: ['callRecord', 'deleted'],
  data: () => {
    return {
      deleteLoaderFlag: false,
      designations,
      date: 0,
      month: 0,
      year: 0,
      time: '0',
      dateString: '0',
      deletePromptFlag: false
    }
  },
  components: {
    // Dialog
  },
  methods: {
    ...mapActions('callrecord', ['deleteCallRecord']),
    ...mapMutations('confirmationBox', ['setConfirmationMessage']),
    async deletePrompt () {
      this.setConfirmationMessage({
        confirmationMessage: 'Delete this call record?',
        confirmationAction: this.deletionConfirmed
      })
    },
    async deletionConfirmed () {
      this.deleteLoaderFlag = true
      await this.deleteCallRecord({ donorId: this.callRecord.calleeId, callRecordId: this.callRecord._id })
      this.deleteLoaderFlag = false
      this.deleted(this.callRecord._id)
    }
  },
  mounted () {
    const dateObject = new Date(this.callRecord.date)
    this.dateString = dateObject.toDateString()
    this.time = dateObject.toLocaleTimeString()
  }
}
</script>

<style scoped>

</style>
