<template>
    <div class="loginWrapper">
        <h1>Welcome to the Champions League</h1>
        <form class='register'>
            <fieldset>
                <legend>Register to create your tournament</legend>
                <input placeholder="First Name" v-model="firstName">
                <input placeholder="Last Name" v-model="lastName">
            </fieldset>
            <fieldset>
                <input placeholder="Username" v-model="username">
                <input type="password" placeholder="Password" v-model="password">
            </fieldset>
            <fieldset>
                <button type="submit" class="auto" id='registerButton' @click.prevent="register">Register</button>
            </fieldset>
        </form>
        <p v-if="error" class="error">{{error}}</p>
        <form class="login">
            <fieldset>
                <legend>Login</legend>
                <input placeholder="Username" v-model="usernameLogin">
                <input type="password" placeholder="Password" v-model="passwordLogin">
            </fieldset>
            <fieldset>
                <button type="submit" class="auto" id='loginButton' @click.prevent="login">Login</button>
            </fieldset>
        </form>
        <p v-if="errorLogin" class="error">{{errorLogin}}</p>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: "Login",
    data() {
        return {
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            usernameLogin: '',
            passwordLogin: '',
            error: '',
            errorLogin: '',
        }
    },
    methods: {
        async register() {
            this.error = '';
            this.errorLogin = '';
            if (!this.firstName || !this.lastName || !this.username || !this.password)
                return;
            try {
                let response = await axios.post('/api/users', {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    username: this.username,
                    password: this.password,
                });
                this.$root.$data.user = response.data.user;
            } catch(error) {    
                this.error = error.response.data.message;
                this.$root.$data.user = null;
            }
        },
        async login() {
            this.error = "";
            this.errorLogin = "";
            if (!this.usernameLogin || !this.passwordLogin)
                return;
            try {
                let response = await axios.post('/api/users/login', {
                    username: this.usernameLogin,
                    password: this.passwordLogin,
                });
                this.$root.$data.user = response.data.user;
            } catch (error) {
                this.errorLogin = "Error: " + error.response.data.message;
                this.$root.$data.user = null;
            }
        },
    }
}

</script>

<style scoped>
.loginWrapper {
    color: white;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
}

.loginWrapper h1 {
    margin-top: 15px;
}

.register {
    color: white;
    margin: 15px 0 15px 0;
    display: flex;
    flex-flow: column;
    justify-content: space-evenly;
    align-items: center;
}

#registerButton,
#loginButton {
    margin-top: 15px;
    background-color: transparent;
    font-size: 1.2em;
}


.login {
    color: white;
    margin: 15px 0 15px 0;
    display: flex;
    flex-flow: column;
}
</style>