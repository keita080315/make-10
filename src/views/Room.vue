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
        <div v-for="card in cards" class="card-wrap">
          <v-col cols="3" class="card-content">
            {{ card }}
          </v-col>
        </div>
      </v-row>

      <div>
        <div class="circle-out mt-12" id="answer-button">
          <div class="circle-inner align-center" @click="answer">
          </div>
        </div>
        <p class="font-weight-bold text-center" style="font-size: 16px">Push!!</p>
      </div>

      <answer-modal
          :fakeCards="fakeCards"
          :isAnswerModal="isAnswerModal"
          :isVisibleCard="isVisibleCard"
          v-show="isAnswerModal&&!isFinishedGame"
          @is-answer-modal='isAnswerModal = $event'
          @scored="scored"
      ></answer-modal>
      <result-modal
          :myScore="myScore"
          :oppScore="oppScore"
          :isFinishedGame="isFinishedGame"
          v-show="isFinishedGame"
      ></result-modal>

      <div class="notice-content">
        <p>先に5問正解した人が勝ち！ <br>数字は1つずつ計算されるよ</p>
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
import ResultModal from "../components/ResultModal.vue";

export default {
  name: "Room",
  components: {
    ResultModal,
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
      randomNumber: 0,
      isVisibleCard: true,
      isFinishedGame: false,
    }
  },
  async mounted() {
    const docSnap = await getDoc(doc(db, "rooms", this.$route.params.roomId));
    this.userNum = docSnap.data().participants[0] === getAuth().currentUser.uid ? 'user1' : 'user2';
    const oppUser = this.userNum !== 'user1' ? 'user1' : 'user2';
    const questionUser = "questionNumber" + "." + this.userNum;
    await updateDoc(doc(db, "questions", this.$route.params.roomId), {
      [questionUser]: 1,
    });
    this.count();
    onSnapshot(doc(db, "rooms", this.$route.params.roomId), (doc) => {
      console.log("Current data: ", doc.data());
      if (doc.data().score[oppUser]!==this.oppScore){
        if (this.oppScore < doc.data().score[oppUser]){
          document.getElementById('progress').classList.remove("move");
        }
        this.oppScore = doc.data().score[oppUser];
      }
      if (doc.data().isAnswerModal['isDisplay']!==this.isAnswerModal){
        this.isAnswerModal = Boolean(doc.data().isAnswerModal['isDisplay']);
        this.isVisibleCard = getAuth().currentUser.uid === doc.data().isAnswerModal['user'];
        document.getElementById('progress').style.animationPlayState =
            this.isAnswerModal === true ?  "paused" : "running";
      }
      if (doc.data().randomNumber!==this.randomNumber){
        this.questionNumber = doc.data().questionNumber;
        this.randomNumber = doc.data().randomNumber;
        if (this.questionNumber !== 1){
          this.setQuestion();
        }
      }
      if (this.oppScore === 5){
        document.getElementById('progress').style.animationPlayState = "paused";
        this.isFinishedGame = true;
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
      this.myScore += this.myScore + score >= 0 ? score : 0;
      const scoreUser = "score" + "." + this.userNum;
      if (score === 1){
        // ここでプログレスバーの表示を0にした
        document.getElementById('progress').classList.remove("move");
        await updateDoc(doc(db, "questions", this.$route.params.roomId), {
          "questionNumber.user1": this.questionNumber + 1,
          "questionNumber.user2": this.questionNumber + 1,
        });
        await updateDoc(doc(db, "rooms", this.$route.params.roomId), {
          [scoreUser]: this.myScore,
          "isAnswerModal.isDisplay": false,
        });
      }
      if (this.myScore === 5){
        document.getElementById('progress').style.animationPlayState = "paused";
        this.isFinishedGame = true;
        return;
      }
      if(score === -1){
        await updateDoc(doc(db, "rooms", this.$route.params.roomId), {
          [scoreUser]: this.myScore,
          "isAnswerModal.isDisplay": false,
        });
        document.getElementById('answer-button').style.pointerEvents = "none";
      }
    },
    answer() {
      updateDoc(doc(db, "rooms", this.$route.params.roomId), {
        "isAnswerModal.isDisplay": true,
        "isAnswerModal.user": getAuth().currentUser.uid,
      });
    },
    // 先
    async setQuestion() {
      this.cards = [];
      this.cards = questionArr[this.randomNumber];
      this.fakeCards = this.cards.concat();
      document.getElementById('answer-button').style.pointerEvents = "auto";
      // プログレスバーの進捗再設定
      let progressElem = document.getElementById('progress');
      progressElem.classList.add("move");
      await this.nextQuestion();
      // this.questionNumber++;
      // setTimeout(this.setQuestion, 0);
    },
    async nextQuestion() {
      return new Promise((resolve, reject) => {
        document.getElementById('progress').addEventListener('animationend', () => {
          const questionUser = "questionNumber" + "." + this.userNum;
          updateDoc(doc(db, "questions", this.$route.params.roomId), {
            [questionUser]: this.questionNumber + 1,
          });
          document.getElementById('progress').classList.remove("move");
          resolve();
        });
      });
    },
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

.notice-content {
  text-align: center;
  justify-content: center;
  margin: 35px auto 0;
  background-color: white;
  border-radius: 8px;
  width: 276px;
  height: 66px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  padding: 14px 0;
}

.notice-content p {
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.03em;
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
