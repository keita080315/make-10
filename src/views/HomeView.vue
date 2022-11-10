<template>
  <div>
    <button @click="onMatching">対戦を始める</button>
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
        console.log("Document written with ID: ", docRef.id);
        this.$router.push('/wait');
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
  }
}
</script>
