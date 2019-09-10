<template>
  <v-app id="EditRecord">
    <v-content>
      <v-toolbar fixed color="#619b5b" dark>
        <v-btn icon @click="goToRecord()">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title>Edit Record</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-container>
        <v-flex align-center justify-center>
          <v-form ref='form'>
            <v-text-field v-model='title' label='Title' box required></v-text-field>
            <!-- end of TITLE field -->
            <v-flex xs12 sm6 md4>
              <v-menu :close-on-content-click="false" v-model="dateValue" :nudge-right="40" lazy transition="scale-transition" offset-y full-width min-width="290px">
                <v-text-field slot="activator" v-model="date" label="Date" prepend-icon="event" readonly box></v-text-field>
                <v-date-picker v-model="date" @input="dateValue = false" min-width="100px"></v-date-picker>
              </v-menu>
            </v-flex>
            <!-- end of DATE field -->
            <!-- <v-textarea v-model='notes' label='Notes' box height='100px' required>
            </v-textarea> -->
            <div id="widgets-container">
              <!-- <note-widget ref="w2"></note-widget> -->
              <template v-for="(widget, index) in recordWidgets">
                <!-- <div class="remove-widget" :id="'remove-' + index" @click="deleteWidget(index)" :key="'c' + index">&times;</div> -->
                <note-widget v-if="widget.name == 'NoteWidget'" ref="w" :key="'w' + index" class="note-widget"></note-widget>
                <image-widget v-if="widget.name == 'ImageWidget'" ref="w" :key="'w' + index" class="image-widget"></image-widget>
              </template>
            </div>
            <div id="add-widgets-container">
              <v-btn color="info" @click='addNewNote'>
                Add new note
              </v-btn>
              <v-btn color="info" @click='addNewImage'>
                Add new image
              </v-btn>
            </div>
            <!-- end of NOTES field -->
            <v-combobox v-model="selectedTags" :items="allTags" label="Add Tags" chips clearable prepend-icon="filter_list" box multiple>
              <template slot="selection" slot-scope="data">
                <v-chip :selected="data.selected" close @input="remove(data.item)">
                  <strong>{{ data.item }}</strong>&nbsp;
                </v-chip>
              </template>
            </v-combobox>
            <!-- end of TAGS field -->
            <v-btn color='success' @click='submit'>
              Save
            </v-btn>
          </v-form>
        </v-flex>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import NoteWidget from './NoteWidget.vue'
import ImageWidget from './ImageWidget.vue'
export default {
  name: 'EditRecord',
  components: {
    NoteWidget,
    ImageWidget
  },
  data () {
    var json = JSON.parse(localStorage.getItem('json'))
    return {
      json: json,
      trackerID: this.$route.params.trackerID,
      record: this.$route.params.record,
      trackername: this.$route.params.trackername,
      recordsList: [],
      title: '',
      notes: '',
      tags: '',
      trackerID: this.$route.params.trackerID,
      selectedTags: [],
      date: new Date().toISOString().substr(0, 10),

      recordWidgets: [],
      allTags: json.trackers[this.$route.params.trackerID].tags
    }
  },
  created () {
    var vm = this;
    console.log(this.record.date);
    vm.date = this.record.date;
    this.record.widgetList.forEach(function (widget, index) {
      if (widget.type == "Title") {
        vm.title = widget.value;
      }
      console.log(widget.type);
      if (widget.type == "NoteWidget") {
        vm.recordWidgets.push(NoteWidget)
      }
      else if (widget.type == "ImageWidget") {
        vm.recordWidgets.push(ImageWidget)
      }
    });
    this.record.tags.forEach(function (tag, index) {
      vm.selectedTags.push(tag);
    });
  },
  mounted () {
      var widgetIndex = 0;
      var vm = this;
      this.record.widgetList.forEach(function (widget, index) {
      if (widget.type == "NoteWidget") {
        vm.$refs.w[widgetIndex].setValue(widget.value)
        widgetIndex += 1;
      }
      else if (widget.type == "ImageWidget") {
        vm.$refs.w[widgetIndex].setValue(widget.value)
        widgetIndex += 1;
      }
    });
  },
  methods: {
    submit () {
      this.recordsList = this.getRecords(this.trackerID, this.json);
      var recordId = this.record.id;
      var widgetList = [{ type: 'Title', value: this.title }]
      var vm = this;
      var recordIndex = 0;
      this.recordsList.forEach(function (record, index) {
        if (record.id == vm.record.id) {
          recordIndex = index;
        }
      })

      this.recordWidgets.forEach(function (widget, index) {
        // console.log(widget.name);
        if (vm.$refs.w[index].isNotDeleted()) {
          widgetList.push({ type: widget.name, value: vm.$refs.w[index].getValue()})
        }
      })

      this.recordsList[recordIndex] = 
      {
        id: recordId,
        date: this.date,
        tags: this.selectedTags,
        widgetList: widgetList
      };
      var updatedJSON = this.updateJSON(this.trackerID, this.json);
      window.localStorage.setItem('json', JSON.stringify(updatedJSON));
      console.log(updatedJSON)
      this.goToTracker();
    },
    getRecords (id, json) {
      for (var i = 0; i < json.trackers.length; i++) {
        if (json.trackers[i].id === id) {
          return json.trackers[i].records;
        }
      }
      return {}
    },
    updateJSON (trackerID, json) {
      var selectedTags = this.selectedTags;
      var allTags = this.allTags;
      var recordsList = this.recordsList;
      json.trackers.forEach(function (item) {
        if (item.id === trackerID) {
          item.records = recordsList;
          selectedTags.forEach(function (newTag) {
            if (allTags.includes(newTag) == false) {
              item.tags.push(newTag)
            }
          })
        }
      })
      return json
    },
    remove (item) {
      this.selectedTags.splice(this.selectedTags.indexOf(item), 1)
      this.selectedTags = [...this.selectedTags]
    },
    addNewNote () {
      this.recordWidgets.push(NoteWidget);
      // this.widgetDeleteCheckpoint = this.recordWidgets.length - 1;
      this.removedWidgetIndices = [];
    },
    addNewImage () {
      this.recordWidgets.push(ImageWidget);   
      this.removedWidgetIndices = [];
    },
    goToTracker () {
      this.$router.push({ 
        name: 'Newsfeed', 
        params: { 
          'trackerID': this.trackerID, 
          'trackername': this.$route.params.trackername },
        props: true })
    },
    goToRecord () {
      this.$router.push({
        name: 'Record',
        params: {
          id: this.record.id,
          record: this.record,
          trackerID: this.trackerID,
          trackername: this.trackername
        },
        props: true
      })
    },
  }
}

</script>

<style>
#EditRecord {
  padding-top: 50px;
}

#add-widgets-container {
  margin-bottom: 30px;
}

.image-widget {
  margin-bottom: 20px;
}

.change-profile-image {
  background-color: green;
}

.remove-widget {
  transition: 0.3s all;
  float: right;
  height: 60px;
  width: 60px; 
  font-size: 50px;
  line-height: 60px;
  text-align: center;
  color: rgb(255, 56, 56);
  border-radius: 50%;
  margin: 10px;
}

.remove-widget:hover {
  cursor: pointer;
  background-color: rgba(241, 235, 235);
}

.remove-widget:active {
  cursor: pointer;
  background-color: rgb(221, 213, 213);
}

</style>