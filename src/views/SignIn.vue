<template>
  <v-app>
    <v-btn
        color="secondary"
        elevation="2"
        @click="login"
    >サインインする</v-btn>
  </v-app>
</template>

<script>
import {getAuth, signInAnonymously, onAuthStateChanged} from "firebase/auth";
export default {
  name: "SignIn",
  methods:{
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
          this.$router.push({ path: '/' });
        }
      });
    }
  }
}
</script>

<style scoped>

</style>