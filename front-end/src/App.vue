<template>
  <div class="app">
    <div class="nav">
      <ul class='mainNav'>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/teams">Teams</router-link></li>
        <li><router-link to="/games">Knockout Games</router-link></li>
      </ul>
      <ul v-if='user' id="name">
        <li><a>{{user.firstName}} {{user.lastName}}</a></li>
      </ul>
      <ul v-if="user">
        <li @click='logout'><a>Logout</a></li>
      </ul>
    </div>
    <div class='view'>
      <router-view/>
    </div>
    <footer>
      <p><a href="https://github.com/btmiller264/cp5">Github Link - 4 Hours</a></p>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'app',
  data() {
    return {}
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
  async created() {
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  methods: {
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300&display=swap');

* {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  width: 100%;
}

.app {
  font-family: 'Ubuntu', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  display: flex;
  flex-flow: column;
  justify-content: stretch;
  height: 100%;
  flex: 1;
}

.view {
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  height: auto;
  flex: 1;
}

.nav {
  background-color: rgb(2, 2, 26);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.nav ul {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0;
  padding: 0;
  height: 100%;
}

.nav li {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  cursor: pointer;
  color: white;
  text-decoration: none;
}

.nav a,
.nav a.router-link-active {
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px;
  text-decoration: none;
  flex: 1;
  height: 70px;
  font-size: 1.3em;
}

.mainNav {
  flex: 2;
}

#name li {
  cursor:unset;
}

#name a:hover {
  background-color: rgb(2, 2, 26);
  color: white;
}

@media only screen and (max-width: 426px) { 
  .nav a,
  .nav a.router-link-exact-active {
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px;
  text-decoration: none;
  flex: 1;
  height: 70px;
  font-size: 1.1em;
}
}

.nav li:hover,
.nav a:hover,
.nav a.router-link-active:hover {
  color: black;
  background-color: white;
  text-decoration: none;
}

footer {
  bottom: 0;
  width: 100%;
  color: white; 
  text-align: center;
  background-color: rgb(2, 2, 26);
}
  
footer a {
  font-size: 1.5em;
  color: white;
  text-decoration: none; 
}

footer p {
  padding: 0;
  margin: 0;
}

footer a:hover {
  text-decoration: none;
}
</style>
