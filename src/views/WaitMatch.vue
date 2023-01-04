<template>
  <v-app class="bg-indigo-lighten-2">
    <div class="status-message-wrap">
      <div class="status-message-content">
        <v-progress-circular
            class="mb-10"
            :size="50"
            indeterminate
            color="cyan-lighten-5"
        ></v-progress-circular>
        <p class="d-flex justify-space-around align-center flex-column flex-sm-row fill-height font-weight-bold">{{statusMessage}}</p>

      </div>
    </div>
  </v-app>
</template>

<script>
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  runTransaction,
  onSnapshot,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import db from "../../firebase/firebase";
import {getAuth} from "firebase/auth";

export default {
  name: "WaitMatch",
  data() {
    return {
      roomId: '',
      statusMessage: '対戦相手を探しています'
    }
  },
  mounted() {
    this.searchUser();
    const unsub = onSnapshot(doc(db, "users", this.$route.params.docId), async (document) => {
      if (document.data().status === 'matched') {
        await updateDoc(doc(db, "rooms", document.data().roomId), {
          participants: arrayUnion(document.data().uid)
        });
        this.roomId = document.data().roomId;
        await this.watchRoom();
      }
    });
    // Todo:マッチしたことを通知などで伝えたい
  },
  methods: {
    async searchUser() {
      let q = query(collection(db, "users"), where("uid", "!=", getAuth().currentUser.uid), where("status", "==", "waiting"), orderBy('uid'), orderBy('created'), limit(10));
      let querySnapshot = await getDocs(q);
      let randomUser = querySnapshot.docs[Math.floor(Math.random() * querySnapshot.docs.length)];

      await runTransaction(db, async (transaction) => {
        if (randomUser) {
          if (randomUser.data()["status"] === 'waiting') {
            let myDocSnap = await transaction.get(doc(db, "users", this.$route.params.docId));
            let oppDocSnap = await transaction.get(doc(db, "users", randomUser.id));

            // 日時を用いてroomIDを作成
            let date = new Date();
            let roomId = date.getTime().toString(16) + myDocSnap.data().uid.split('').map(v => v.charCodeAt(0).toString(16)).join('') + oppDocSnap.data().uid.split('').map(v => v.charCodeAt(0).toString(16)).join('');

            //roomsテーブルでレコード作成
            await setDoc(doc(db, "rooms", roomId), {
              roomId: roomId,
              participants: [],
              created: date.toLocaleString(),
            });
            let roomIdColumn = 'roomId';
            let status = 'status';
            transaction.update(doc(db, "users", this.$route.params.docId), {[roomIdColumn]: roomId, [status]: 'matched'});
            transaction.update(doc(db, "users", randomUser.id), {[roomIdColumn]: roomId, [status]: 'matched'});
            this.statusMessage = '対戦相手が見つかりました' + "\n" + '処理中です'
            console.log("matched!");
          } else {
            console.log('Not found!');
            await this.searchUser();
          }
        } else {
          console.log('対戦ユーザーがいません')
        }
      })
    },
    watchRoom() {
      const waitUser = setTimeout(this.backSearch, 10000);
      onSnapshot(doc(db, "rooms", this.roomId), (doc) => {
        if (doc.data().participants.length === 2) {
          clearTimeout(waitUser);
          this.goRoom(this.roomId);
        }
      });
    },
    async backSearch() {
      this.statusMessage = '再度対戦相手を探しています'
      await updateDoc(doc(db, "users", this.$route.params.docId), {
        status: 'waiting'
      });
      console.log('再度検索中！')
      await this.searchUser();
    },
    goRoom(roomId) {
      this.$router.push('/room/' + roomId);
    },
  },
}
</script>

<style scoped>
.status-message-wrap{
  height:100vh;
  text-align:center;
  position:relative;
}
.status-message-content{
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  width:100%;
}
</style>