<template>
  <v-app id='firstTracker'>
    <v-layout row>
    <v-flex xs12 sm12 lg12>
        <v-toolbar color="#619b5b" dark>
          <v-toolbar-side-icon></v-toolbar-side-icon>
        </v-toolbar>
        <v-flex xs12 md12 lg12 style="margin: 4em; text-align:center">
            <h1>Create Your First Tracker!</h1>
          </v-flex>
          <v-flex style="margin: auto; width: 15%">
          <v-btn dark fab large color="#619b5b" @click="addNewTracker()" style="margin:1em;">
              <v-icon>add</v-icon>
            </v-btn>
          </v-flex>
    </v-flex>
  </v-layout>
    </v-app>
</template>

<script>
export default {
  name: 'firstTracker',
  methods: {
    addNewTracker () {
      this.$router.push({ name: 'Create New Tracker', props: true })
    }
  }
}
</script>
