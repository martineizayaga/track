<template>
    <v-bottom-nav
      :active.sync="activeBtn"
      :value="showNav"
      fixed
      color="white"
    >
      <v-btn flat color="teal" @click="goToTrackerList()">
        <span>Trackers</span>
        <v-icon>history</v-icon>
      </v-btn>

      <v-btn flat color="teal" @click="goToTracker()">
        <span>Newsfeed</span>
        <v-icon>horizontal_split</v-icon>
      </v-btn>

      <v-btn flat color="teal" @click="goToGoals()">
        <span>Goals</span>
        <v-icon>done</v-icon>
      </v-btn>
    </v-bottom-nav>
</template>

<script>
export default {
  props: {
    active: Number
  },
  data () {
    return {
      activeBtn: this.active,
      showNav: true
    }
  },
  methods: {
    goToTracker () {
      this.$router.push({ name: 'Newsfeed', params: { 'trackerID': this.$route.params.trackerID, 'trackername': this.$route.params.trackername }, props: true })
    },
    goToTrackerList () {
      this.$router.push({ name: 'Trackers', props: true })
    },
    goToGoals () {
      this.$router.push({ name: 'Goals', params: { 'trackerID': this.$route.params.trackerID, 'trackername': this.$route.params.trackername }, props: true })
    }
  }
}
</script>
