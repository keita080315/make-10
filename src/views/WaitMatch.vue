<template>
  <v-app>
    <p>対戦相手を探しています、、、</p>
  </v-app>
</template>

<script>
import {collection, getDocs, limit, orderBy, query, where} from "firebase/firestore";
import db from "../../firebase/firebase";

export default {
  name: "WaitMatch",
  mounted() {
    this.searchUser();
  },
  methods: {
    async searchUser() {
      const q = query(collection(db, "users"), orderBy('created'), limit(1), where("status", "==", "waiting"));
      const querySnapshot = await getDocs(q);

      if ((querySnapshot)){
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
        });
      }
      else{

      }
    },
}
}
</script>

<style scoped>

</style>