<template>
  <div>
    <div class="answer-modal-component">
      <p class="font-weight-bold pt-3">解答中...</p>
      <div class="text-center pt-4">
        <p class="font-weight-bold text-h4">{{this.answer}}</p>
      </div>
      <div class="text-center pt-4">
        <p class="font-weight-bold text-h3">= 10</p>
      </div>
    </div>
    <v-row justify="center" class="mx-auto mt-14 card-row">
      <div v-for="card in cards" :key="card" class="card-wrap" id="card-wrap" @click="pushCard(card)">
        <v-col cols="3" class="card-content">
          {{ card }}
        </v-col>
      </div>
    </v-row>
    <v-row justify="center" class="mx-auto mt-14 math-row">
      <div v-for="mathCard in mathCards" :key="mathCard" class="card-wrap" id="math-card-wrap" @click="pushCard(mathCard)">
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
import questionArr from "@/assets/arr";

export default {
  name: "AnswerModal",
  props: {
    cards: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      mathCards: ['+','-','×','÷'],
      answer: '',
    }
  },
  mounted() {

  },
  methods: {
    pushCard(card){
      this.answer = this.answer + ' ' + card;
    },
    returnFalse() {
      this.$emit("execute-method", false);
    },
    returnTrue() {
      this.$emit("execute-method", true);
    },
  },
}
</script>

<style scoped>
.answer-modal-component{
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
.card-row{
  position: fixed;
  top:70%;
  z-index: 15;
  left: 50%;
  transform: translate(-50%, -50%);
}
.math-row{
  position: fixed;
  top:70%;
  z-index: 15;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
}
</style>