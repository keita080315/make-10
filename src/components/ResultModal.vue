<template>
  <div>
    <div class="result-modal-component">
      <p class="font-weight-bold pt-6 text-h5">YOU...</p>
      <div class="text-center pt-4" v-if="myScore===5">
        <p class="font-weight-bold text-h3" style="color: #37BD7D">WIN!!</p>
      </div>
      <div class="text-center pt-4" v-if="oppScore===5">
        <p class="font-weight-bold text-h3" style="color: #BD3737">LOSE</p>
      </div>
      <v-btn
          class="mt-4"
          width="140px"
          @click="backHome"
      >
        <p class="font-weight-bold">ホームに戻る</p>
      </v-btn>
    </div>
    <div id="bg-overlay-content" class="bg-overlay-content">
    </div>
  </div>
</template>

<script>
export default {
  name: "ResultModal",
  props: {
    myScore: {
      type: Number,
    },
    oppScore: {
      type: Number,
    },
    isFinishedGame:{
      type: Boolean,
    }
  },
  methods:{
    backHome(){
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.result-modal-component {
  background-color: white;
  border-radius: 8px;
  height: 200px;
  width: 85%;
  margin: 0 auto;
  z-index: 15;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
}

.bg-overlay-content {
  background-color: black;
  opacity: 0.3;
  width: 100%;
  height: 100vh;
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
}
</style>