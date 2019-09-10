<template>  
    <div v-if="notDeleted">
        <div class="remove-widget" @click="deleteWidget()">&times;</div>
        <div v-if="uploadVersion"></div>
        <img class="image" :src="userImage" />

        <div>
            <label class="image-label"><input id="image-upload" type="file" round class="change-profile-image" @change="onFileChange" /><span v-html="uploadLabel"></span></label>
            <!-- <label id="image-label" for="image-upload"> upload </label> -->
        </div>
        <!-- <div v-else>
            <button class="delete-profile-image" color="secondary" icon="delete" @click="removeImage">Delete</button>
        </div> -->
            
        <!-- <img class="profile-image" :src="userImage" />
        <input type="file" @change="onFileChange"> -->
        <!-- <button @click="onUpload">Upload!</button> -->
    </div>
</template>

<script>
export default {
  name: 'ImageWidget',
  props: ['uploadVersion'],
  data: function () {
        return {
            notDeleted: true,
            userImage: "",
            uploadLabel: "Upload Image"
        }
    }
  ,
  methods: {
    isNotDeleted() {
        return this.notDeleted;
    },
    deleteWidget() {
        this.notDeleted = false;
    },
    getValue() {
        return this.userImage;
    },
    setValue(val) {
        this.userImage = val;
    },
    onFileChange(e) {
        var files = e.target.files || e.dataTransfer.files
        if (!files.length) {
            return
        }
        var fileName = e.target.value;
        console.log(fileName);
        this.uploadLabel = fileName;
        this.createImage(files[0])
        },
        createImage(file) {
        var reader = new FileReader()

        reader.onload = (e) => {
            this.userImage = e.target.result;
            this.uploadVersion += 1;
        }
        reader.readAsDataURL(file)
        },
        removeImage: function (e) {
            this.userImage = '';
            this.uploadVersion += 1;
        }
    }
}
</script>

<style>

.image {
    width: 100%;
}

#image-upload {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.image-label {
  padding: 5px;
  box-sizing: border-box;
  color: white;
  background-color: rgba(138, 138, 138, 0.5);
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  font-size: 24px;
  width: 80%;
  margin: auto;
  margin-bottom: 35px;
}

.image-label:hover {
  background-color: rgb(97, 155, 91);
  color: white;
}

.image-label {
	cursor: pointer;
}
</style>
