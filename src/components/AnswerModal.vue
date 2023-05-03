<template>
  <div>
    <div class="answer-modal-component">
      <p class="font-weight-bold pt-3">解答中...</p>
      <div class="text-center pt-4" v-if="isFinishedAnswer">
        <p class="font-weight-bold text-h4">{{ this.answer }}</p>
      </div>
      <div class="text-center pt-4" v-if="isFinishedAnswer">
        <p class="font-weight-bold text-h3">= {{ this.resultCal }}</p>
      </div>
      <div class="text-center pt-8" v-if="!isFinishedAnswer">
        <p class="font-weight-bold text-h3">= ?</p>
      </div>
      <div style="text-align: right;padding: 20px 10px;"  v-if="!isFinishedAnswer">
        <v-progress-circular
            :rotate="360"
            :size="50"
            :width="6"
            :model-value="cardCount*20"
            color="#39679D"
        >
          {{ cardCount }}
        </v-progress-circular>
      </div>
      <div class="correct-mark" id="correct-mark">
      </div>
      <div class="error-mark" id="error-mark">
        <p class="">×</p>
      </div>
    </div>
    <v-row justify="center" class="mx-auto mt-14 card-row" id="card-row">
      <div v-for="(card,index) in fakeCards" :key="card" class="card-wrap" id="card-wrap"
           @click="pushCard(card,index,1)">
        <v-col cols="3" class="card-content">
          {{ card }}
        </v-col>
      </div>
    </v-row>
    <v-row justify="center" class="mx-auto mt-14 math-row" id="math-row">
      <div v-for="(mathCard,index) in mathCards" :key="mathCard" class="card-wrap" id="math-card-wrap"
           @click="pushCard(mathCard,index,0)">
        <v-col cols="3" class="card-content">
          {{ mathCard }}
        </v-col>
      </div>
    </v-row>
    <div id="bg-overlay-content" class="bg-overlay-content">
    </div>
  </div>
</template>

<script>

export default {
  name: "AnswerModal",
  props: {
    fakeCards: {
      type: Array,
      required: true
    },
    isAnswerModal: {
      type: Boolean,
    }
  },
  data() {
    return {
      mathCards: ['+', '−', '×', '÷'],
      answer: '',
      resultCal: 0,
      method: '',
      isFinishedAnswer: false,
      cardCount: 5,
    }
  },
  mounted() {
  },
  methods: {
    pushCard(card, index, isNum) {
      if (isNum === 1) {
        this.answer = this.answer + ' ' + card;
        document.getElementById("card-row").style.display = "none";
        document.getElementById("math-row").style.display = "flex";
        this.fakeCards.splice(index, 1);
        if (this.method){
          this.resultCal = this.calculation(this.method,this.resultCal,card);
        } else {
          this.resultCal = card;
        }
        if (this.fakeCards.length === 0){
          this.isFinishedAnswer = true;
          this.judgeAnswer();
        }
      }
      if (isNum === 0) {
        this.method = card;
        this.answer = this.answer + ' ' + card;
        document.getElementById("math-row").style.display = "none";
        document.getElementById("card-row").style.display = "flex";
      }
    },
    returnFalse() {
      Object.assign(this.$data, this.$options.data());
      document.getElementById('correct-mark').style.display = "none";
      document.getElementById('error-mark').style.display = "none";
    },
    calculation(method, makeNum, nextNum) {
      switch (method) {
        case '+':
          makeNum += nextNum
          break
        case '−':
          makeNum -= nextNum
          break;
        case '×':
          makeNum *= nextNum
          break;
        case '÷':
          makeNum /= nextNum
          break;
      }
      return makeNum;
    },
    judgeAnswer() {
      if (this.resultCal === 10){
        document.getElementById('correct-mark').style.display = "block";
        setTimeout(() => {
          this.$emit("scored",1)
        },1000);
      } else {
        document.getElementById('error-mark').style.display = "block";
        setTimeout(() => {
          this.$emit("scored",-1)
        },1000);
      }
      document.getElementById("math-row").style.display = "none";
      setTimeout(this.returnFalse,1000);
    },
  },
  watch:{
    fakeCards() {
      document.getElementById("card-row").style.display = "flex";
    },
    isAnswerModal() {
      if (this.isAnswerModal === true){
        const interval = setInterval(() => {
          if (this.isFinishedAnswer === true){
            clearInterval(interval);
          }
          else if (this.cardCount === 0) {
            clearInterval(interval);
            if (!(this.fakeCards.length === 0)){
              this.resultCal = 0;
              this.judgeAnswer();
            }
            this.cardCount = 5;
          } else {
            this.cardCount--;
          }
        }, 1000);
      }
    }
  }
}
</script>

<style scoped>
.answer-modal-component {
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

.card-wrap {
  background-color: white;
  width: 75px;
  height: 87px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0 7px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
}

.card-content {
  font-size: 50px;
  color: #347CA4;
  font-weight: bold;
  text-align: center;
  max-width: fit-content;
}

.card-row {
  position: fixed;
  top: 70%;
  z-index: 15;
  left: 50%;
  transform: translate(-50%, -50%);
}

.math-row {
  position: fixed;
  top: 70%;
  z-index: 15;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
}
.correct-mark{
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: 55%;
  transform: translate(-50%, -50%);
  width: 125px;
  height: 125px;
  border: 12px solid #3AD38A;
  border-radius: 50%;
  display: none;
}
.error-mark{
  position: absolute;
  left: 50%;
  top: 45%;
  width: 180px;
  text-align: center;
  color: #B8463F;
  transform: translate(-50%, -50%);
  display: none;
}
.error-mark p{
  font-style: normal;
  font-size: 200px;
}
</style>