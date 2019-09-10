<template>
    <div v-if="notDeleted">
        <div class="remove-widget" @click="deleteWidget()">&times;</div>
        <v-textarea v-model='notes' label='Notes' box height='100px' required>
        </v-textarea>
        <!-- <v-text-field v-model='notes' label='Notes' required></v-text-field> -->
    </div>
</template>

<script>
export default {
  name: 'NoteWidget',
  data: function(){
    return {
        notDeleted: true,
        notes: ''
    }
  },
  methods: {
    isNotDeleted() {
      return this.notDeleted;
    },
    deleteWidget() {
      this.notDeleted = false;
    },
    getValue () {
      return this.notes;
    },
    setValue (val) {
      this.notes = val;
    }
  }
}
</script>
}
</script>
