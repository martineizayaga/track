<template>
    <v-app>
        <v-content>
            <v-toolbar color="#619b5b" dark>
                <v-btn icon @click="goToTracker()">
                    <v-icon>arrow_back</v-icon>
                </v-btn>
                <v-toolbar-title>Create New Tracker</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-container>
                <v-flex align-center justify-center>
                    <v-form ref='form' v-model="valid">
                        <v-text-field 
                            v-model='title' 
                            :rules="[v => !!v || 'Name Required!']"
                            label='Title' 
                            box 
                            required></v-text-field>
                        <!-- end of TITLE field -->
                        <div>
                            <v-card-title>Select Icon: {{this.imageName}} </v-card-title>
                            <div @click="selectIcon('Travel')" style="display:inline-block; border: 1px solid green; border-radius:40px; height:6em; width:6em; margin:1em;">
                                <v-img :src="require('../assets/Travel.png')" align-center height="4em" width="4em" style="margin:auto; margin-top:1em;">
                                </v-img>
                            </div>
                            <div @click="selectIcon('Exercise')" style="display:inline-block; border: 1px solid green; border-radius:40px; height:6em; width:6em; margin:1em;">
                                <v-img :src="require('../assets/Exercise.png')" align-center height="4em" width="4em" style="margin:auto; margin-top:1em;">
                                </v-img>
                            </div>
                            <div @click="selectIcon('Spending')" style="display:inline-block; border: 1px solid green; border-radius:40px; height:6em; width:6em; margin:1em;">
                                <v-img :src="require('../assets/Spending.png')" align-center height="4em" width="4em" style="margin:auto; margin-top:1em;">
                                </v-img>
                            </div>
                            <div @click="selectIcon('Food')" style="display:inline-block; border: 1px solid green; border-radius:40px; height:6em; width:6em; margin:1em;">
                                <v-img :src="require('../assets/Food.png')" align-center height="4em" width="4em" style="margin:auto; margin-top:1em;">
                                </v-img>
                            </div>
                            <div @click="selectIcon('Sleep')" style="display:inline-block; border: 1px solid green; border-radius:40px; height:6em; width:6em; margin:1em;">
                                <v-img :src="require('../assets/Sleep.png')" align-center height="4em" width="4em" style="margin:auto; margin-top:1em;">
                                </v-img>
                            </div>
                        </div>
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
  name: 'TrackerForm',
  data () {
    var json = JSON.parse(localStorage.getItem('json'))
    return {
        valid: false,
        json: json,
        title: '',
        image: '',
        newID: json.trackers.length,
        changeColor: false,
        imageName:''
    }
  },
  methods: {
    submit () {
      this.json.trackers.push({
        id: this.newID,
        name: this.title,
        image: this.image,
        records: [],
        defaultWidgets: {"title": "title", "note": "note", "photo": "photo" },
        tags: [],
        goals: []
      })
      var updatedJSON = this.json
      window.localStorage.setItem('json', JSON.stringify(updatedJSON))
      this.goToTracker()
    },
    goToTracker () {
      this.$router.push({
        name: 'Trackers',
        params: {
          'trackerID': this.newID,
          'trackername': this.$route.params.trackername },
        props: true })
    },
    selectIcon (icon) {
        this.image = icon + '.png',
        this.imageName = icon,
        this.changeColor = true
    }
  }
}

</script>
