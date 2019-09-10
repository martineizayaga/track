import Vue from 'vue'
import Router from 'vue-router'

import Newsfeed from './components/Newsfeed'
import Record from './components/Record'
import Trackers from './components/Trackers'
import Form from './components/Form'
import Goals from './components/Goals'
import firstTracker from './components/firstTracker'
import TrackerForm from './components/TrackerForm'
import EditRecord from './components/EditRecord'
import GoalForm from './components/GoalForm'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Tracker',
      component: Trackers
    },
    {
      path: '/index.html',
      name: 'Tracker',
      component: Trackers
    },
    {
      path: '/:trackername/Newsfeed/',
      name: 'Newsfeed',
      component: Newsfeed
    },
    {
      path: '/:trackername/Record/:id',
      name: 'Record',
      component: Record
    },
    {
      path: '/:trackername/Record/:id/Edit',
      name: 'EditRecord',
      component: EditRecord
    },
    {
      path: '/Trackers',
      name: 'Trackers',
      component: Trackers
    },
    {
      path: '/:trackername/Form',
      name: 'Form',
      component: Form
    },
    {
      path: '/:trackername/Goals',
      name: 'Goals',
      component: Goals
    },
    {
      path: '/firstTracker',
      name: 'firstTracker',
      component: firstTracker
    },
    {
      path: '/createnewtracker',
      name: 'Create New Tracker',
      component: TrackerForm
    },
    {
      path: '/:trackername/Goals/newGoal',
      name: 'GoalForm',
      component: GoalForm
    }
  ]
})
