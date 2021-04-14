<template>
  <div class="home">
    <HelloWorld v-if="user" msg="Welcome to the Champions League"/>
    <Login v-else />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Login from '@/components/Login.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld,
    Login
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  }
}
</script>

<style>
  .home {
    width: 100%;
    height: 100%;
    background-image: url('../images/cl.jpg');
    background-size: cover;
  }
</style>
