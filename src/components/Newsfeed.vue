<template>
  <v-app id='newsfeed'>
    <v-layout row>
      <v-flex>
        <v-card color="#e5e5e5">
          <v-toolbar fixed color="#619b5b" dark>
            <v-btn icon  @click="goToTrackerList()">
              <v-icon>arrow_back</v-icon>
            </v-btn>
            <!--Display Title of Specific Tracker selected with the parms passed through the router-->
            <v-toolbar-title>{{tracker.name}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon @click="showFilter = !showFilter" style="padding-right:1em;">filter_list</v-icon>
             <v-select
              v-if="showFilter"
              v-model="filters"
              :items="tracker.tags"
              box
              chips
              label="Filters"
              multiple
              @change="doFilter()"
            ></v-select>
            <v-icon>search</v-icon>
            <v-text-field label="Search" display single-line color="white" v-model="search" v-bind:value="search" @keyup="doSearch()"></v-text-field>
          </v-toolbar>
          <div style="padding-bottom:5em;">
          <!--Create a Div to loop through the list of records for the selected Tracker (get specific tracker from router parms)  -->
          <div v-for="records in recordsList" :key="records.type+records.date+records.id">
            <!--Go to record component, when specific record is clicked. Pass in record parms through router to the Record component -->
            <v-container class="record-container-outer" v-if="records.type == 'event'" @click="goToRecord(records)">
              <v-card class="record-container" hover style="position:static; z-index:-1; padding-top:2em; margin-left:2em; margin-right:2em;">
                <div style="display:inline-block; width:30%;padding-left:5%;float:left">
                  <v-card-text class="month-container" style="font-size:2em; padding:0; color:#adadad">
                    {{getMonthRecord(records.date)}}
                  </v-card-text>
                  <v-card-text style="font-size:3em; padding:0;">
                    {{getDateRecord(records.date)}}
                  </v-card-text>
                </div>
                <v-divider vertical style="height:10em"></v-divider>
                <div style="display:inline-block; width:60%; float:right">
                  <div class="widgets-inner-container">
                    <div v-for="widget in records.widgetList" :key="widget.id">
                      <!--If widget.type = Title then create a container to display title -->
                      <v-container v-if="widget.type == 'Title'" fill-height fluid style="padding:0;">
                        <span class="headline">{{widget.value}}</span>
                      </v-container>
                      <!--If widget.type = note then create text for note -->
                      <v-card-text v-if="widget.type == 'NoteWidget'" style="padding-left:0;">
                        {{widget.value}}
                      </v-card-text>
                    </div>
                  </div>
                  <!--close div for loop for widgetList -->
                  <!--display tags - loop through the tags for the specific record-->
                  <div v-for="tag in records.tags" :key="tag.id" style="display:inline-block">
                    <v-chip outline color=green>{{tag}}</v-chip>
                  </div>
                </div>
              </v-card>
            </v-container>
            <!-- GOAL CARDS -->
            <v-container v-if="records.type == 'goal'">
              <v-card style="margin-left:2em; margin-right:2em;">
              <v-layout row>
                <v-flex xs4 sm4 md4 lg4 style="padding-left:5%; padding-top:1em; padding-bottom:1em;">
                  <v-card-text class="month-container" style="font-size:2em; padding:0; color:#adadad">
                    {{getMonth(records.date)}}
                  </v-card-text>
                  <v-card-text style="font-size:3em; padding:0;">
                    {{getDate(records.date)}}
                  </v-card-text>
                </v-flex>
                <v-flex xs8 sm8 md8 lg8 style="padding-top:2em;">
                  <span class="grey--text">My goal:</span>
                  <div class="headline">{{records.question}}</div>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex class="hide-on-mobile" xs4 sm4 md4 lg4>
                </v-flex>
                <v-flex xs8 sm8 md8 lg8>
                  <div v-show="records.answer === null">
                    <v-container>
                      <v-layout row>
                        <div style="display:inline-block">
                        <v-flex xs6 sm6 md6 lg6>
                          <v-btn color="success" @click="changeAnswer(true, records)">
                            <v-icon>check</v-icon>
                          </v-btn>
                        </v-flex>
                        </div>
                        <div style="display:inline-block">
                        <v-flex xs6 sm6 md6 lg6>
                        <v-btn color="error" @click="changeAnswer(false, records)">
                          <v-icon>block</v-icon>
                        </v-btn>
                        </v-flex>
                        </div>
                      </v-layout>
                    </v-container>
                  </div>
                  <div v-show="records.answer === true">
                    <v-container>
                      <v-layout row>
                        <v-flex xs6 sm6 md6 lg6>
                          <v-btn disabled color="success">
                            <v-icon>check</v-icon>
                          </v-btn>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </div>
                  <div v-show="records.answer === false">
                    <v-container>
                      <v-layout row>
                        <v-flex xs6 sm6 md6 lg6>
                          <v-btn disabled color="error">
                            <v-icon>block</v-icon>
                          </v-btn>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </div>
                </v-flex>
    
              </v-layout>
              </v-card>
            </v-container>
          </div>
          <!-- end of records for loop div-->
          </div>
        </v-card>
      </v-flex>
      <v-btn fixed dark fab right large color="#619b5b" @click="addNewRecord()" style="bottom:0; margin-bottom:5em;">
        <v-icon>add</v-icon>
      </v-btn>
      <bottomNav v-bind:active="1"></bottomNav>
    </v-layout>
  </v-app>
</template>

<script>
import BottomNav from './BottomNav.vue'
import consts from '../assets/consts.js'
export default {
  name: 'Newsfeed',
  components: {
    BottomNav
  },
  data () {

    var now = new Date()
    var json = JSON.parse(localStorage.getItem('json'))
    var goals = json.trackers[this.$route.params.trackerID].goals
    for (let i = 0; i < goals.length; i++) {
      var freq = this.getFrequencyMillisecs(goals[i].frequency) 
      var mostRecent = new Date(goals[i].date[goals[i].date.length - 1])
      const numMissing = (now - mostRecent) / freq
      for (let j = 1; j <= numMissing; j++) {  
        mostRecent.setMilliseconds(mostRecent.getMilliseconds() + freq)
        goals[i].answers.push(null)
        goals[i].date.push(new Date(mostRecent))
      }
      json.trackers[this.$route.params.trackerID].goals[i] = goals[i]
      window.localStorage.setItem('json', JSON.stringify(json))
      
    }
    JSON.parse(window.localStorage.getItem('json'))

    
    var json = JSON.parse(localStorage.getItem('json'))
    var tracker = this.getTracker(this.$route.params.trackerID, json)
    return {
      json: json,
      trackername: this.$route.params.trackername,
      tracker: tracker,
      recordsList: this.getRecords(tracker),
      origRecords: this.getRecords(tracker),
      search: '',
      filters: '',
      showSearch: false,
      showFilter: false
    }
  },
  methods: {
    getFrequencyMillisecs(frequency) {
      if(frequency == "daily") {
        return 86400000
      } else if (frequency == "weekly") {
        return 604800000
      } else {
        return 2629800000
      }
    },
    goToRecord (rec) {
      this.$router.push({
        name: 'Record',
        params: {
          id: rec.id,
          record: rec,
          trackerID: this.$route.params.trackerID,
          trackername: this.$route.params.trackername
        },
        props: true
      })
    },
    addNewRecord () {
      this.$router.push({
        name: 'Form',
        params: {
          trackerID: this.$route.params.trackerID,
          trackername: this.$route.params.trackername
        },
        props: true
      })
    },
    doSearch () {
      const s = this.search.toLowerCase()
      const searchResult = this.origRecords.filter(function (rec) {
        if (s === '') {
          return true
        }
        if (rec.type === 'event') {
          for (var i = 0; i < rec.widgetList.length; i++) {
            if (rec.widgetList[i].value.toLowerCase().includes(s)) {
              return true
            }
          }
        }
        return false
      })
      this.$set(this.$data, 'recordsList', searchResult)
    },
    doFilter() {
      const f = this.filters
      const filterResult = this.origRecords.filter(function (rec) {
        if (f.length == 0) {
          return true
        }
        if (rec.type === 'event') {
          if (f.every((curF) => rec.tags.includes(curF))) {
            return true
          }
        }
        return false
      })
      this.$set(this.$data, 'recordsList', filterResult)
    },
    goToTrackerList () {
      this.$router.push({ name: 'Trackers', props: true })
    },
    getTracker (id, json) {
      for (var i = 0; i < json.trackers.length; i++) {
        if (json.trackers[i].id === id) {
          return json.trackers[i]
        }
      }
      return {}
    },
    getRecords (tracker) {
      let allRecs = []
      allRecs = allRecs.concat(tracker.records.map(rec => {
        rec['type'] = 'event'
        return rec
      }))
      const now = new Date()
      tracker.goals.forEach(function (g) {
        g.date.forEach(function (d, i) {
          var tempD = new Date(d)
          if (Number(tempD) < Number(now)) {
            allRecs.push({
              'type': 'goal',
              'id': i,
              'date': tempD,
              'answer': g.answers[i],
              'question': g.question
            })  
          }
        })
      })
      // sort all records by date
      allRecs.sort((a, b) => (new Date(a.date) < new Date(b.date)) ? 1 : (new Date(b.date) < new Date(a.date) ? -1 : 0))
      return allRecs
    },
    getMonth (dt) {
      // dt object should be in string
      const date = new Date(dt)
      return consts.monthNames[date.getMonth()]
    },
    getMonthRecord(dt) {
      const date = new Date(dt)
      date.setDate(date.getDate() + 1)
      return consts.monthNames[date.getMonth()]
    },
    getDateRecord (dt) {
      // dt object should be in string
      const date = new Date(dt)
      date.setDate(date.getDate() + 1)
      return (date.getDate())
    },
    getDate (dt) {
      // dt object should be in string
      const date = new Date(dt)
      return (date.getDate())
    },
    getQuestion (qID) {
      let q = ''
      this.tracker.goals.forEach(function (g) {
        if (g.id === qID) {
          q = g.question
        }
      })
      return q
    }, 
    changeAnswer(ans, rec) {
      let newAns = []
      let newDates = []
      let ind = 0
      this.tracker.goals.forEach(function(g, i) {
        if (g.question === rec.question) {
          ind = i
          g.date.forEach(function (d, i) {
            var x = new Date(d)
            // x.setHours(x.getHours() + 5)
            var y = new Date(rec.date)
            if (Number(x) == Number(y)) {
              
              newAns.push(ans)
              newDates.push(d)
            } else{
              newAns.push(g.answers[i])
              newDates.push(d)
            }
          })
        }
      })
      this.$set(this.$data.tracker.goals[ind], 'date', newDates)
      this.$set(this.$data.tracker.goals[ind], 'answers', newAns)
      var newRecs = this.getRecords(this.tracker)
      this.$set(this.$data, 'recordsList', newRecs)
      // setting these changes in local storage
      for (var i = 0; i < this.json.trackers.length; i++) {
        if (this.json.trackers[i].id === this.$route.params.trackerID) {
          this.$set(this.$data.json.trackers, i, this.tracker)
        }
      }
      localStorage.setItem('json', JSON.stringify(this.json))

    }
  }
}
</script>

<style>
#newsfeed {
  background-color: rgb(229, 229, 229);
  padding-top: 60px;
}

.record-container {
  height: 200px;
  overflow-y: hidden;
}

.widgets-inner-container {
  padding-top: 10px;
  position: relative;
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 10px;
}

.widgets-inner-container:after {
    content:'';
    width:100%;
    height:100%;    
    position:absolute;
    left:0;
    top:0;
    background: linear-gradient(transparent 80px, white);
}

.flex.xs4 {
  transform: translateY(25%);
}

@media screen and (max-width: 600px) {
  .month-container {
    font-family: monospace;
    width: 3ch;
    overflow: hidden;
  }

  .flex.xs8 {
    margin: auto;
    max-width: 100%;
  } 

  .hide-on-mobile {
    display: none;
  }

  .flex.xs4 {
    transform: translateY(15%);
  }
}

</style>