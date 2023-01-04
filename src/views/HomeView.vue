<template>
  <v-app class="bg-indigo-lighten-2">
    <div class="fill-height w-50 mx-auto">
      <div class="mb-10 mt-170px">
        <h1 class="font-weight-bold">MAKE<br>10</h1>
      </div>
      <div class="d-flex justify-space-around align-center flex-column flex-sm-row h-25">
        <v-btn
            color="primary"
            @click="onMatching"
        >
          Start Game
        </v-btn>

        <v-btn
            variant="tonal"
            @click="logout"
        >
          Logout
        </v-btn>
      </div>
    </div>
  </v-app>
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
        this.$router.push({path: '/signIn'});
      });
    },
  }
}
</script>
<style>
.mt-170px {
  margin-top: 170px;
}
</style>