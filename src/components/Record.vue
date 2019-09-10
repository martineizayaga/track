<template>
  <v-app id='record'>
    <v-content>
      <v-toolbar fixed color="#619b5b" dark>
        <v-btn icon @click="goToTracker()">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title>{{trackername}}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div class="date-container">{{getDate(record.date)}}</div>
      <!--Get record parms from router - loop through the widgetList in the JSON for that specific record, 
      create if statements to display if a specific type of widget -->
      <div v-for="widget in record.widgetList" :key="widget.id">
        <!--If widget.type = Title then create a container for title -->
        <section v-if="widget.type == 'ImageWidget'">
          <v-img :src="widget.value" align-center width="100%">
          </v-img>
        </section>
        <!-- End of Photo Section -->
        <section v-if="widget.type == 'Title'">
          <v-layout column align-center justify-center class="black--text">
            <h1 v-if="noEdit" class="title-container">{{widget.value}}</h1>
            <input v-else v-model="widget.value" placeholder="edit me" class="black--text mb-2 display-1 text-xs-center edit">
          </v-layout>
        </section>
        <!-- End of Title Section -->
        <section v-if="widget.type == 'NoteWidget'">
          <v-layout column wrap class="my-5" align-center>
                <p v-if="noEdit" class="note-container">{{ widget.value }}</p>
                <input v-else v-model="widget.value" placeholder="edit me" class="headline text-xs-center edit">
          </v-layout>
        </section>
        <!-- End of note Section -->
      </div>
      <div class="center">
        <v-btn v-show="noEdit" color="info" @click="goToEdit()">Edit</v-btn>
        <v-btn v-show="!noEdit" color="info" @click="saveRecord()">Save</v-btn>
        <template>
          <v-dialog v-model="dialog" persistent max-width="290">
            <v-btn slot="activator" color="error" dark>Delete</v-btn>
            <v-card>
              <v-card-title class="headline">Are you sure you want to delete '{{ record.widgetList[1].value }}'?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="warning darken-1" flat @click.native="dialog = false">No, no wait!</v-btn>
                <v-btn color="error darken-1" flat @click="deleteRecord()" @click.native="dialog = false">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </div>
      <v-card-text style="height: 100px; position: absolute">
      </v-card-text>
      <bottomNav></bottomNav>
    </v-content>
  </v-app>
</template>

<script>
import BottomNav from './BottomNav.vue'
import consts from '../assets/consts.js'
export default {
  name: 'Record',
  components: {
    BottomNav
  },
  data: function () {
    return {
      json: JSON.parse(localStorage.getItem('json')),
      trackername: this.$route.params.trackername,
      trackerID: this.$route.params.trackerID,
      record: this.$route.params.record,
      noEdit: true,
      dialog: false
    }
  },
  methods: {
    goToTracker () {
      this.$router.push({ name: 'Newsfeed', params: { 'trackerID': this.trackerID, 'trackername': this.$route.params.trackername }, props: true })
    },
    goToEdit() {
      this.$router.push({ name: 'EditRecord', params: { 'trackerID': this.trackerID, 'trackername': this.$route.params.trackername, 'record': this.record }, props: true })
    },
    deleteRecord () {
      // delete record
        var vm = this;
        var recordIndex = 0;
        this.json.trackers[this.trackerID].records.forEach(function (record, index) {
        if (record.id == vm.record.id) {
          recordIndex = index;
        }
      })
      this.json.trackers[this.trackerID].records.splice(recordIndex, 1)
      localStorage.setItem('json', JSON.stringify(this.json))
      this.goToTracker()
    },
    getDate (dt) {
      // dt object should be in string
      const date = new Date(dt);
      return consts.monthNames[date.getMonth()] + ' ' + (date.getDate() + 1) + ', ' + date.getFullYear();
    },
    imagePath: function (image) {
      return require('../assets/' + image)
    },
    toggleEdit () {
      this.noEdit = !this.noEdit
    },
    saveRecord () {
      this.toggleEdit()
      this.json.trackers[this.trackerID].records[this.record.id] = this.record
      localStorage.setItem('json', JSON.stringify(this.json))
    }
  }
}
</script>

<style>

  #record {
    padding-top: 60px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .title-container {
    margin-top: 20px;
    font-size: 2.8em;
    font-weight: 500;
  }

  .date-container {
    width: 100%;
    text-align: center;
    font-size: 3em;
    font-weight: bold;
    margin: auto;
    margin-top: 70px;
    background-color: rgb(97, 155, 91);
    color: white;
    max-width: 500px;
    border-radius: 50px;
  }

  .note-container {
    display: block;
    text-align: center;
    width: 90%;
    font-size: 30px;;
  }

  .center {
    display: flex;
    justify-content: center;
  }

  input.edit {
    outline: 1px dotted #212121;
    outline: 5px auto -webkit-focus-ring-color;
    background-color: white;
  }

  @media screen and (max-width: 600px) {
    
    #record {
      padding-top: 60px;
      padding-left: 10%;
      padding-right: 10%;
    }

    .date-container {
      font-size: 2.5em;
    }

    .title-container {
      font-size: 2.2em;
    }

    .note-container {
      display: block;
      text-align: center;
      width: 90%;
      font-size: 24px;;
    }
  
  }

</style>
