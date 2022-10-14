<template>
  <div>
    <button @click="onMatching">送信</button>
  </div>
</template>

<script>
import db from "../../firebase/firebase";
import {addDoc, collection, doc, setDoc} from "firebase/firestore";

export default {
  methods: {
    onMatching: async function () {
      try {
        const docRef = await addDoc(collection(db, "users"), {
          first: "Ada",
          last: "Lovelace",
          born: 1815
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  }
}
</script>
