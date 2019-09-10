<template>
  <v-app id='trackers'>
    <v-layout row>
      <v-flex xs12 sm12 lg12>
        <v-card color="#e5e5e5">
          <v-toolbar color="#619b5b" dark>
            <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
            <v-toolbar-title>My Trackers</v-toolbar-title>
          </v-toolbar>
          <v-flex class="tracker-container-outer" xs12 md12 lg12>
            <div class="tracker-container" v-for="tracker in trackersList" :key="tracker.id" @click="goToTracker(tracker)" style="display:inline-block;">
              <v-container>
                <v-card color="white" hover style="width: 15em; height:20em; color:#619b5b">
                  <v-flex style="text-align:right; padding:1.5em 1em;">
                    <span>{{tracker.records.length}} Entries</span>
                  </v-flex>
                  <v-flex style="padding:1em;">
                    <v-img :src="imagePath(tracker.image)" align-center height="7em" width="7em" style="margin:auto">
                    </v-img>
                  </v-flex>
                  <v-flex style="padding-left:1em; padding-top:2em;">
                    <span class="headline">{{tracker.name}}</span>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <!-- <v-img src="src/assets/workout.png" aspect-ratio="1" class="mt-4" /> -->
                </v-card>
              </v-container>
            </div>
          </v-flex>
          <v-btn fixed dark fab right large color="#619b5b" @click="addNewTracker()" style="bottom:0; margin-bottom:5em;">
            <v-icon>add</v-icon>
          </v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>

export default {
  name: 'Trackers',
  data () {
    return {
      trackersList: JSON.parse(localStorage.getItem('json')).trackers
    }
  },
  methods: {
    goToTracker (tracker) {
      this.$router.push({ name: 'Newsfeed', params: { 'trackerID': tracker.id, 'tracker': tracker, 'trackername': tracker.name }, props: true })
    },
    addNewTracker () {
      this.$router.push({ name: 'Create New Tracker', props: true })
    },
    imagePath: function (image) {
      return require('../assets/' + image)
    }
  }
}
</script>

<style>
  .tracker-container-outer {
    text-align: center;
    padding: 20px 0px;
  }

  .tracker-container {
    text-align: left;
  }
</style>
