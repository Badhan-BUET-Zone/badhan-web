<template>
  <v-card
      class="mb-1 rounded-xl"
      outlined
      dense
  >
    <v-card-text>
      <v-row>
        <v-col cols="9">
          <span>
            {{ dateObject.date === 0 ? 'Unknown date' : new Date(dateObject.date).toDateString() }}
          </span>
        </v-col>
        <v-col cols="3">
          <v-btn :loading="donationDeletionLoader" :disabled="donationDeletionLoader" @click="promptDonationDeletion" color="warning" x-small fab depressed>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <Dialog
        :message="'Delete this donation?'"
        :dialog-opened="donationDeletionPromptDialog"
        :canceled="cancelDonationDeletion"
        :confirmed="confirmDonationDeletion">
    </Dialog>
  </v-card>
</template>

<script>
import Dialog from '../Dialog'

export default {
  components: { Dialog },
  props: {
    dateObject: {
      type: Object,
      required: true
    },
    deleteDonation: {
      type: Function,
      required: true
    }
  },
  name: 'DonationCard',
  data () {
    return {
      donationDeletionPromptDialog: false,
      donationDeletionLoader: false
    }
  },
  methods: {
    promptDonationDeletion () {
      this.donationDeletionPromptDialog = true
    },
    cancelDonationDeletion () {
      this.donationDeletionPromptDialog = false
    },
    async confirmDonationDeletion () {
      this.donationDeletionPromptDialog = false
      this.donationDeletionLoader = true
      await this.deleteDonation(this.dateObject.date)
      this.donationDeletionLoader = false
    }
  }
}
</script>

<style scoped>

</style>
