<template>
  <v-app class="bg-indigo-lighten-2">
    <div class="fill-height w-50 mx-auto">
      <div class="mb-10 mt-170px">
        <h1 class="font-weight-bold">MAKE<br>10</h1>
      </div>
      <div class="d-flex justify-space-around align-center flex-column flex-sm-row h-25">
        <v-btn
            color="primary"
            elevation="2"
            @click="login"
        >サインインする
        </v-btn>
      </div>
    </div>
  </v-app>
</template>

<script>
import {getAuth, signInAnonymously, onAuthStateChanged} from "firebase/auth";

export default {
  name: "SignIn",
  methods: {
    login() {
      const auth = getAuth();
      signInAnonymously(auth)
          .then(() => {
            console.log('Signed in')
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
          });

      onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          this.$router.push({path: '/'});
        }
      });
    }
  }
}
</script>

<style scoped>

</style>