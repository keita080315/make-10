<template>
  <div>
    <button @click="onMatching">対戦を始める</button>
  </div>
  <div>
    <button @click="logout">ログアウトする</button>
  </div>
</template>

<script>
import db from "../../firebase/firebase";
import {addDoc, collection} from "firebase/firestore";
import {getAuth} from "firebase/auth";

export default {
  methods: {
    async onMatching() {
      const date = new Date()
      try {
        let userId = getAuth().currentUser.uid
        const docRef = await addDoc(collection(db, "users"), {
          uid: userId,
          status: 'waiting',
          created: date.toLocaleString(),
        });
        this.$router.push('/wait/' + docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    logout() {
      getAuth().signOut().then(() => {
        this.$router.push({ path: '/signIn' });
      });
    },
  }
}
</script>
