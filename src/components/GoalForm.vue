<template>
    <v-app>
        <v-content>
            <v-toolbar style="background-color: rgb(97, 155, 91) !important; border-color: rgb(97, 155, 91) !important" color="#619b5b" dark>
                <v-btn icon @click="goToGoals()">
                    <v-icon>arrow_back</v-icon>
                </v-btn>
                <v-toolbar-title>Create New Goal</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-container>
                <v-flex align-center justify-center>
                    <v-form ref='form' v-model="valid">
                        <v-text-field 
                            v-model='goal' 
                            :rules="[v => !!v || 'Goal is required']"
                            label='Write a goal (e.g. Did I workout today?)' 
                            box 
                            required>
                        </v-text-field>
                        <!-- end of TITLE field -->
                        <v-flex xs12 sm6 md5 lg4 d-flex>
                            <v-select
                            v-model='frequency'
                            :items="freqOpts"
                            :rules="[v => !!v || 'Frequency is required']"
                            box
                            label="Frequency asked"
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6 md5 lg4 d-flex>
                            <v-dialog
                                ref="dialog"
                                v-model="timeToggle"
                                :return-value.sync="time"
                                persistent
                                lazy
                                full-width
                                width="290px"
                            >
                                <v-text-field
                                slot="activator"
                                v-model="time"
                                :rules="[v => !!v || 'Time required!']"
                                label="At what time would you be asked?"
                                prepend-icon="access_time"
                                readonly
                                ></v-text-field>
                                <v-time-picker
                                v-if="timeToggle"
                                v-model="time"
                                full-width
                                >
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="timeToggle = false">Cancel</v-btn>
                                <v-btn flat color="primary" @click="$refs.dialog.save(time)">OK</v-btn>
                                </v-time-picker>
                            </v-dialog>
                        </v-flex>
                        <v-btn :disabled="!valid" color='success' @click='submit'>
                            Submit
                        </v-btn>
                    </v-form>
                </v-flex>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
export default {
  name: 'GoalForm',
  data () {
    var json = JSON.parse(localStorage.getItem('json'))
    var tracker = this.getTracker(this.$route.params.trackerID, json)
    return {
        valid: false,
        json: json,
        tracker: tracker,
        goal: '',
        image: '',
        frequency: '',
        time: '',
        newID: tracker.goals.length,
        freqOpts: ['daily', 'weekly', 'monthly'],
        timeToggle: false,
    }
  },
  methods: {
    submit () {
        var nextDate = new Date()
        const hour = parseInt(this.time.substring(0, 2))
        const min = parseInt(this.time.substring(3))
        nextDate.setHours(hour)
        nextDate.setMinutes(min)
      this.tracker.goals.push({
        id: this.newID,
        question: this.goal,
        frequency: this.frequency,
        time: this.time,
        date: [nextDate],
        answers: [null]
      })
      for (var i = 0; i < this.json.trackers.length; i++) {
        if (this.json.trackers[i].id === this.$route.params.trackerID) {
          this.$set(this.$data.json.trackers, i, this.tracker)
        }
      }
      var updated = JSON.stringify(this.json)
      window.localStorage.setItem('json', updated)
      this.goToGoals()
    },
    getTracker (id, json) {
      for (var i = 0; i < json.trackers.length; i++) {
        if (json.trackers[i].id === id) {
          return json.trackers[i]
        }
      }
      return {}
    },
    goToGoals () {
      this.$router.push({
        name: 'Goals',
        params: {
          'trackerID': this.$route.params.trackerID,
          'trackername': this.$route.params.trackername },
        props: true })
    },
    goToNewsfeed () {
      this.$router.push({
          name: 'Newsfeed',
          params: { 'trackerID': this.$route.params.trackerID,
          'trackername': this.$route.params.trackername },
          props: true })
    },

  }
}

</script>
