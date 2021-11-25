<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item">
      <h1>Upload File</h1>
      <hr>

        <md-card class="md-layout-item md-size-50 md-small-size-100">
          <md-card-header>
            <div class="md-title">Select your Files</div>
          </md-card-header>

          <md-card-content>
            <div class="md-layout md-gutter">


              <div class="md-layout-item md-small-size-100">
                <md-field :class="getValidationClass('files')">

                  <label for="files">Files</label>
                  <md-file v-model="form.files" multiple name="files[]" id="files" :disabled="sending" @change="onChange"  />


                  <span class="md-error" v-if="!$v.form.files.required">The files are required</span>
                  <span class="md-error" v-if="!$v.form.files.imageRule">The format must be PNG</span>
                </md-field>


              </div>
            </div>


          </md-card-content>

          <md-progress-bar md-mode="indeterminate" v-if="sending" />

          <md-card-actions>

            <md-button class="md-primary" :disabled="sending" v-on:click="validate()">Upload Files</md-button>
          </md-card-actions>
        </md-card>

        <md-snackbar :md-active.sync="imagesUploaded">{{ countFiles }} files were saved with success!</md-snackbar>
        <md-snackbar :md-active.sync="errorUploading">The files could not be uploaded! - {{errorsDisplay}}</md-snackbar>

    </div>

    <div class="md-layout-item" >
      <ul v-for="image in uploadedImages">
        <li>
          <md-card>
            <md-card-media-cover md-text-scrim>
              <md-card-media md-ratio="16:9">
                <img :src="image" alt="Skyscraper">

              </md-card-media>

              <md-card-area>
                <md-card-header>
                  <span class="md-title">{{ image }}</span>
                </md-card-header>

              </md-card-area>
            </md-card-media-cover>
          </md-card>
        </li>
      </ul>



    </div>
  </div>
</template>

<script>

import { validationMixin } from 'vuelidate'
import {
  required,
  helpers
} from 'vuelidate/lib/validators'
import axios from'axios'

const imageRule = helpers.regex('image', /\.(png)$/)

export default {
  mixins: [validationMixin],
  data: () => ({
    form: {
      files: []
    },
    imagesUploaded: false,
    errorUploading: false,
    errorsDisplay: null,
    sending: false,
    countFiles: 0,
    endpoint: 'https://test.rxflodev.com/uploads/index.php',
    files : [],
    file : null,
    uploadedImages : []
  }),
  validations: {
    form: {
      files: {
        required,
        imageRule
      }
    }
  },
  methods: {
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    clearForm () {
      this.$v.$reset()
      this.form.lastName = null
      this.form.age = null
      this.form.gender = null
      this.form.email = null
    },
    uploadImages () {
      this.sending = true
      let count = this.files.length;

      for (const i of Object.keys(this.files)) {

        let formData = new FormData();
        formData.append('file', this.files[i]);


        axios.post(this.endpoint,formData,{})
          .then(
            response => {
              console.log(response.data);
              if(response.data.status === 'success'){
                this.uploadedImages.unshift(response.data.url);
              }else{
                console.log(response.data.message);
                this.errorUploading = true;
                this.errorsDisplay = response.data.message;
              }
            })
          .catch(
            error => {
              console.log('-----error-------');
              console.log(error);
              this.errorsDisplay = error;
              this.errorUploading = true;
            })

      }


      window.setTimeout(() => {
        this.countFiles = `${count}`
        this.imagesUploaded = true
        this.sending = false
      }, 1500)
    },
    validate () {

      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.uploadImages()
      }
    },
    onChange (event) {
      this.form.files = event.target.files;
      this.files = event.target.files;
    },
  }
}
</script>


