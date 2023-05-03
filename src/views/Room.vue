<template>
  <v-app class="bg-clr-sky">
    <div class="w-96">
      <div
          style="background-color: #DF6464;height: 16px;border-radius: 10px"
      >
        <v-progress-linear
            model-value="100"
            :height="16"
            color="#FFF9D7"
            style="border-radius: 10px"
            id="progress"
        ></v-progress-linear>
      </div>

      <div class="start-count" id="start-count">
        <p>{{ startCount }}</p>
      </div>

      <v-row class="mx-auto mt-14" justify="center">
        <v-col cols="3" class="px-0">
          <div class="circle-profile mx-auto">
            <img src="../assets/avatar-1.png">
          </div>
        </v-col>
        <v-col cols="6" class="px-0 text-center">
          <p class="font-weight-bold text-h5">第 <span class="font-weight-bold text-h4">{{ this.questionNumber }}</span>
            問</p>
          <v-row class="mx-auto">
            <v-col cols="4" class="px-0">
              <div>
                <p class="font-weight-bold text-size-50 border-white">{{ this.myScore }}</p>
              </div>
            </v-col>
            <v-col cols="4" class="px-0">
              <div>
                <p class="font-weight-bold text-size-32 mt-4">VS</p>
              </div>
            </v-col>
            <v-col cols="4" class="px-0">
              <div>
                <p class="font-weight-bold text-size-50 border-white">{{ this.oppScore }}</p>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="3" class="px-0">
          <div class="circle-profile mx-auto">
            <img src="../assets/avatar-2.png">
          </div>
        </v-col>
      </v-row>

      <v-row justify="center" class="mx-auto mt-14">
        <div v-for="card in cards" :key="card" class="card-wrap">
          <v-col cols="3" class="card-content">
            {{ card }}
          </v-col>
        </div>
      </v-row>

      <div class="circle-out mt-12" id="answer-button">
        <div class="circle-inner align-center" @click="answer">
        </div>
      </div>

      <answer-modal
          :fakeCards="fakeCards"
          :isAnswerModal="isAnswerModal"
          v-show="isAnswerModal"
          @is-answer-modal='isAnswerModal = $event'
          @scored="scored"
      ></answer-modal>

      <div class="answer-content">
        <div class="number-content">
          <p>1</p>
        </div>
        <div class="method-content">
          <p>×</p>
        </div>
        <div class="number-content">
          <p>3</p>
        </div>
        <div class="method-content">
          <p></p>
        </div>
        <div class="number-content">
          <p></p>
        </div>
        <div class="method-content">
          <p></p>
        </div>
        <div class="number-content">
          <p></p>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import {doc, getDoc, updateDoc, onSnapshot} from "firebase/firestore";
import db from "../../firebase/firebase";
import {getAuth} from "firebase/auth";
import questionArr from "../assets/arr";
import AnswerModal from "../components/AnswerModal.vue";

export default {
  name: "Room",
  components: {
    AnswerModal
  },
  data() {
    return {
      questionArr: questionArr,
      myScore: 0,
      oppScore: 0,
      cards: [0, 0, 0, 0],
      fakeCards: [0, 0, 0, 0],
      questionNumber: 1,
      isAnswerModal: false,
      startCount: '',
      userNum: '',
    }
  },
  async mounted() {
    const docSnap = await getDoc(doc(db, "rooms", this.$route.params.roomId));
    let uid = getAuth().currentUser.uid;
    this.userNum = docSnap.data().participants[0] === uid ? 'user1' : 'user2';
    const oppUser = this.userNum !== 'user1' ? 'user1' : 'user2';
    this.count();
    onSnapshot(doc(db, "rooms", this.$route.params.roomId), (doc) => {
      console.log("Current data: ", doc.data());
      if (doc.data().score[oppUser]!==this.oppScore){
        this.oppScore = doc.data().score[oppUser];
      }
      if (doc.data().isAnswerModal!==this.isAnswerModal){

      }
    });
  },
  methods: {
    count() {
      const countList = [3, 2, 1, 'Start!'];
      let i = 0;
      const interval = setInterval(function () {
        if (i === 4) {
          clearInterval(interval);
          document.getElementById("start-count").style.display = "none";
          this.setQuestion();
        }
        this.startCount = countList[i];
        i++;
      }.bind(this), 1000, countList, i, this.startCount);
    },
    async scored(score) {
      // ここでプログレスバーの表示を0にした
      document.getElementById('progress').classList.remove("move");
      if (this.myScore + score === 2){
        console.log('You Win!');
        this.$router.push('/result');
      }
      this.myScore += this.myScore + score >= 0 ? score : 0;
      let user = "score" + "." + this.userNum;
      await updateDoc(doc(db, "rooms", this.$route.params.roomId), {
        [user]: this.myScore
      });
      setTimeout(this.skipQuestion, 500);
      setTimeout(function () {
        document.getElementById('progress').classList.add("move");
      }, 500);
    },
    answer() {
      // updateDoc(doc(db, "rooms", this.$route.params.roomId), {
      //   "isAnswerModal": true
      // });
      this.isAnswerModal = true;
      document.getElementById('progress').style.animationPlayState = "paused";
      document.getElementById('answer-button').style.pointerEvents = "none";
    },
    // 先
    async setQuestion() {
      this.cards = [];
      this.cards = questionArr[Math.floor(Math.random() * 5223) - 1];
      this.fakeCards = this.cards.concat();
      document.getElementById('answer-button').style.pointerEvents = "auto";
      // プログレスバーの進捗再設定
      let progressElem = document.getElementById('progress');
      progressElem.classList.add("move");
      await this.nextQuestion();
      this.questionNumber++;
      setTimeout(this.setQuestion, 0);
    },
    async nextQuestion() {
      return new Promise((resolve, reject) => {
        document.getElementById('progress').addEventListener('animationend', () => {
          updateDoc(doc(db, "rooms", this.$route.params.roomId), {
            "questionNumber.user1": this.questionNumber + 1
          });
          document.getElementById('progress').classList.remove("move");
          resolve();
        });
      });
    },
    skipQuestion() {
      this.cards = [];
      this.cards = questionArr[Math.floor(Math.random() * 5223) - 1];
      this.fakeCards = this.cards.concat();
      document.getElementById('answer-button').style.pointerEvents = "auto";
      this.questionNumber++;
    }
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap");

* {
  font-family: 'Inter', sans-serif;
  color: #323232;
}

.w-96 {
  width: 95%;
  margin: 35px auto;
  z-index: 5;
  position: relative;
}

.bg-clr-sky {
  background-color: #AED3FF;
}

.circle-out {
  border-radius: 50%;
  width: 87px;
  height: 87px;
  background-color: #FFF9D7;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.circle-inner {
  border-radius: 50%;
  width: 52px;
  height: 52px;
  background-color: #DF6464;
  margin: 0 auto;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.circle-profile {
  border-radius: 50%;
  width: 88px;
  height: 88px;
  background-color: #fff;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle-profile img {
  border-radius: 50%;
  width: 70px;
  height: 70px;
  text-align: center;
}

.text-size-32 {
  font-size: 32px;
}

.text-size-50 {
  font-size: 50px;
}

.border-white {
  line-height: 40px;
  border-bottom: white 10px solid;
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
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.card-content {
  font-size: 50px;
  color: #347CA4;
  font-weight: bold;
  text-align: center;
  max-width: fit-content;
}

.answer-content {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  margin-top: 45px;
}

.answer-content p {
  font-weight: bold;
}

.number-content {
  width: 50px;
  height: 67px;
  background-color: white;
  border: 5px #EBEBEB solid;
  text-align: center;
  color: black;
  font-size: 34px;
  display: inline-block;
  margin: 0 3px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.method-content {
  width: 34px;
  height: 34px;
  background-color: white;
  border-radius: 50%;
  text-align: center;
  color: black;
  font-size: 30px;
  display: flex;
  margin: 16px 3px;
  align-items: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.move {
  animation: move 10s;
}

@keyframes move {
  0% {
    width: 100%;
  }
  100% {
    width: 0;
  }
}

.start-count {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 11;
  transform: translate(-50%, -50%);
}

.start-count p {
  font-size: 80px;
  font-weight: bold;
  text-align: center;
}
</style>
