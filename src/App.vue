<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Trackers from './components/Trackers.vue'
import Newsfeed from './components/Newsfeed.vue'
import Record from './components/Record.vue'
import firstTracker from './components/firstTracker.vue'
import json from './assets/data.json'

if (localStorage.getItem('json') === null) {
  localStorage.setItem('json', JSON.stringify(json))
}

export default {
  name: 'app',
  components: {
    Trackers,
    Newsfeed,
    Record,
    firstTracker
  }
}
</script>

<style>
</style>
