<template>
    <div class="modal" v-show="show">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4>User Preferences</h4>
            <button type="button" class="close" @click="closeModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <p>Select Display: {{ theme }}</p>
              </div>
              <div class="col-md-6">
                <button type="button" class="btn btn-success" @click="toggleLightDark">Toggle Light/Dark</button>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <p>Allow Explicit Songs: {{ explicit }} </p>
                <small>Warning: your playlist may not be full length if explicit is disabled, depending on the artists you choose.</small>
              </div>
              <div class="col-md-6">
                <button type="button" class="btn btn-danger" @click="toggleExplicit">Toggle Explicit Music</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "preferences",
        props: ['show', 'userpref'],
        methods: {
          closeModal() {
            this.$emit("close");
          },
          toggleLightDark () {
            this.$emit("theme");
          },
          toggleExplicit(){
            this.$emit("explicit")
          }
        },
        computed: {
          theme: function(){
            return this.userpref.dark ? "Dark" : "Light";
          },
          explicit: function(){
            return this.userpref.explicit ? "Yes" : "No";
          }
        }
    }
</script>

<style scoped>
  .modal{
    display: block;
  }

  h4 {
    color: #000;
  }

  p{
    color: #000;
  }
  small{
    color: #000;
  }
</style>
