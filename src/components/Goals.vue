<template>
  <v-app id='goals'>
    <v-content>
        <v-toolbar color="#619b5b" dark>
            <v-btn icon class="hidden-xs-only" @click="goToTracker()">
              <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title>{{tracker.name + " Goals"}}</v-toolbar-title>
        </v-toolbar>
        <v-flex xs12 sm6 md4 lg4 offset-lg4 offset-md4 offset-sm3 row mt-5 d-flex>
            <v-select
            :items="getGoalQuestions()"
            outline
            placeholder="Pick a Goal"
            color="#619b5b"
            v-model="goal_id"
            item-text="question"
            item-value="id"
            v-on:change="getJsonGoalRecords()"
            ></v-select>
        </v-flex>
        <v-flex v-if="goal_id != null" xs12 sm6 md6 lg6 offset-lg3 offset-md3 offset-sm3 row>
            <span>grid view<v-switch style="display: inline-block" v-model="switch1"></v-switch>list view</span>
            <v-flex v-if="switch1 == false">
                <v-container fluid grid-list-sm v-if="this.formattedGoals !== []">
                <h2>Goal asked {{ this.formattedGoals.length }} times  <span style="float: right">{{ Math.round(successRate*100) }}% Success Rate</span></h2>
                <v-layout row wrap>
                    <v-flex xs3 style="horizontal-align: center" class="checkbox" v-for="goal in this.formattedGoals" :key="goal.id">
                        <v-tooltip v-if="goal.answer == true" bottom>
                            <div class="check-success" slot="activator" @click="toggleQuestion(goal.id)">
                                <v-icon class="check-spacing">check_circle</v-icon>
                            </div>
                            <span>{{ goal.date }}</span>
                        </v-tooltip>
                        <v-tooltip v-if="goal.answer == null" bottom>
                            <div class="check-null" slot="activator" @click="toggleQuestion(goal.id)">
                                <v-icon class="check-spacing">help_outline</v-icon>
                            </div>
                            <span>{{ goal.date }}</span>
                        </v-tooltip>
                        <v-tooltip v-if="goal.answer == false" bottom>
                            <div class="check-block" slot="activator" @click="toggleQuestion(goal.id)">
                                <v-icon class="check-spacing">block</v-icon>
                            </div>
                            <span>{{ goal.date }}</span>
                        </v-tooltip>
                    </v-flex>
                </v-layout>
                </v-container>
            </v-flex>
            <v-flex v-else>
                <h2>{{ this.formattedGoals[0].question }}</h2>
                <v-flex style="horizontal-align: center" class="checkbox" v-for="goal in this.formattedGoals" :key="goal.id">
                    <div style="width: 100%; height: 20px">
                        <h4 style="width: 60%; float:left">{{ goal.date }}</h4>
                        <span style="float: right; width: 40%">
                        <v-tooltip v-if="goal.answer == true" bottom>
                            <div class="check-success" slot="activator" @click="toggleQuestion(goal.id)">
                                <v-icon class="check-spacing">check_circle</v-icon>
                            </div>
                            <span>{{ goal.date }}</span>
                        </v-tooltip>
                        <v-tooltip v-if="goal.answer == null" bottom>
                            <div class="check-null" slot="activator" @click="toggleQuestion(goal.id)">
                                <v-icon class="check-spacing">help_outline</v-icon>
                            </div>
                            <span>{{ goal.date }}</span>
                        </v-tooltip>
                        <v-tooltip v-if="goal.answer == false" bottom>
                            <div class="check-block" slot="activator" @click="toggleQuestion(goal.id)">
                                <v-icon class="check-spacing">block</v-icon>
                            </div>
                            <span>{{ goal.date }}</span>
                        </v-tooltip>
                        </span>
                    </div>
                </v-flex>
            </v-flex>
        </v-flex>
        <v-flex v-if="this.tracker.goals.length == 0" xs12 sm6 md6 lg6 offset-lg3 offset-md3 offset-sm3 row>
            <p style="text-align:center">Add a goal to get started</p>
        </v-flex>
        <v-btn fixed dark fab right large color="#619b5b" @click="addNewGoal()" style="bottom:0; margin-bottom:5em;">
            <v-icon>add</v-icon>
        </v-btn>
      <bottomNav v-bind:active="2"></bottomNav>
    </v-content>
  </v-app>
</template>

<script>
import BottomNav from './BottomNav.vue'
export default {
  name: 'Goals',
  components: {
    BottomNav
  },
  data: function () {
    const json = JSON.parse(localStorage.getItem('json'))
    console.log("json", json)
    return {
        tracker: this.getTracker(this.$route.params.trackerID, json),
        trackername: this.$route.params.trackername,
        trackerID: this.$route.params.trackerID,
        goal_id: null,
        switch1: true,
        formattedGoals: []
    }
  },
  methods: {
    goToTracker () {
      this.$router.push({ name: 'Newsfeed', params: { 'trackerID': this.trackerID, 'trackername': this.trackername }, props: true })
    },
    getTracker (id, json) {
      for (var i = 0; i < json.trackers.length; i++) {
        if (json.trackers[i].id === id) {
          return json.trackers[i]
        }
      }
      return {}
    },
    getGoalQuestions() {
        return this.tracker.goals
    },
    getJsonGoalRecords() {
        for (let i = 0; i < this.tracker.goals.length; i++) {
            if (this.tracker.goals[i].id == this.goal_id) {
                this.current_goal = this.tracker.goals[i]
                this.getFormattedGoalRecords()
            }
        }
    },
    getFormattedGoalRecords() {
        console.log("got to getformattedrecords")
        var currentGoal = this.current_goal
        var answers = currentGoal.answers
        var dates = currentGoal.date
        var totalQuestions = answers.length
        var formattedGoals = []
        var numberOfSuccess = 0
        console.log("dates", dates)
        for (let i = 0; i < answers.length; i++) {
            var goalDate = new Date(dates[i])
            var goalMonth = goalDate.getMonth() + 1
            if (answers[i] == true) {
                numberOfSuccess += 1
                var formattedGoalDate = "answered yes for " + goalMonth + "/" + goalDate.getDate() + "/" + goalDate.getFullYear()
            } else if (answers[i] == null) {
                var formattedGoalDate = "asked on " + goalMonth + "/" + goalDate.getDate() + "/" + goalDate.getFullYear()
            } else {
                var formattedGoalDate = "answered no for " + goalMonth + "/" + goalDate.getDate() + "/" + goalDate.getFullYear()
            }
            formattedGoals.push({'id': i, 'answer': answers[i], 'date': formattedGoalDate, 'formattedDate': goalDate, 'question': this.current_goal.question})
        }
        this.successRate = numberOfSuccess / answers.length
        if (answers.length == 0) {
            this.successRate = 0
        }
        this.formattedGoals = formattedGoals.reverse()
    },
    getGoalStats() {
        let numYes = 0
        let total = 0
        this.tracker.goals.forEach(function(g) {
            g.answers.forEach(function (a) {
                if (a) {
                    numYes++
                }
                total++
            })
        })
        if (total == 0) {
            return 0
        }
        return numYes/total
    },
    toggleQuestion(id) {
        var newJson = JSON.parse(localStorage.getItem('json'))
        var goalQuestion = this.tracker.goals[this.goal_id]
        var currentAnswer = goalQuestion.answers[id]
        if (currentAnswer == null) {
            this.tracker.goals[this.goal_id].answers[id] = true
        } else if (currentAnswer == true) {
            this.tracker.goals[this.goal_id].answers[id] = false
        } else if (currentAnswer == false) {
            this.tracker.goals[this.goal_id].answers[id] = null
        }
        newJson.trackers[this.trackerID] = this.tracker
        localStorage.setItem('json', JSON.stringify(newJson))
        this.getJsonGoalRecords()
    },
    addNewGoal () {
      this.$router.push({
        name: 'GoalForm',
        params: {
          trackerID: this.$route.params.trackerID,
          trackername: this.$route.params.trackername
        },
        props: true
      })
    },
  }
}
</script>

<style>
.check-spacing {
    width: 100%;
    margin-top: 2px;
    cursor: pointer;
}
.check-block {
    background-color: #ff5252;
}
.check-success {
    background-color: #4caf50;
}
.check-null {
    background-color: #e1e1e1;
}
.checkbox {
    margin-bottom: 1em;
    padding: 0 !important;
}

.goals-container {
  margin-bottom: 30px;
}

@media screen and (max-width: 600px) {

  .flex.xs6 {
    max-width: 90%;
    margin: auto;
  } 
}

</style>

