<template>
    <div class='qfWrapper'>
        <div class="QFGames">
            <h2>{{this.matchup.teamOne}} v {{this.matchup.teamTwo}}</h2>
            <div class="QFGame" v-for="game in this.games" :key="game.id">
                <div class='matchup'>
                    <div class='title'>
                        <div v-if="game.leg == 1">
                            <h2>First Round</h2>
                        </div>
                        <div v-if="game.leg == 2">
                            <h2>Second Round</h2>
                        </div>
                    </div>
                    <div class='round'>
                        <div class='first'>
                            <h3>{{game.home}} - {{game.homeScore}}</h3>
                            <h3>{{game.away}} - {{game.awayScore}}</h3>
                        </div>
                        <div class='editButton'>
                            <button type="button" class="auto" @click="editScore(game.leg)">Edit Score</button>
                        </div>
                        <div class='scoreEditor' v-if="getEditScore && game.leg == getEditScoreLeg">
                            <form> <fieldset>
                                <legend>Score Editor</legend>
                                <input placeholder="Home Score" v-model="homeScore">
                                <input placeholder="Away Team" v-model="awayScore">
                                <br><br>
                                <button type="button" class="auto" @click="submitEditScore(game)">Submit Score</button>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!getMatchupStatus" class='message'>
                <p>First Leg to be played on {{this.matchup.date}}</p>
            </div>
            <div v-else>
                <p v-if="homeTeamWon">{{this.matchup.teamOne}} wins and goes through to the Semi-finals!</p>
                <p v-else>{{this.matchup.teamTwo}} wins and goes through to the Semi-finals!</p>
            </div>
            <div class="buttons">
                <button type="button" class="auto" @click="edit()">Edit Game</button>
                <button type="button" class="auto" @click="deleteGame()">Delete Matchup</button>
            </div>
            <div v-if="getEdit !== false">
                <form> <fieldset>
                    <legend>Game Editor</legend>
                    <input placeholder="Home Team" v-model="home">
                    <input placeholder="Away Team" v-model="away">
                    <input placeholder="Date" v-model="date">
                    <br><br>
                    <button type="button" class="auto" @click="submitEdit()">Submit Edit</button>
                    </fieldset>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "QFGameList",
    props: {
        games: Array,
        matchup: Object,
    },
    data: function() {
        return {
            editGame: false,
            editGameScore: false,
            editGameScoreLeg: "",
            home: "",
            away: "",
            date: "",
            homeScore: "",
            awayScore: "",
        }
    },
    methods: {
        edit() {
            this.editGame = !this.editGame;
            this.home = this.games[0].home;
            this.away = this.games[0].away;
            this.date = this.games[0].date;
        },
        editScore(leg) {
            this.editGameScore = !this.editGameScore;
            this.editGameScoreLeg = leg;
        },
        async submitEdit() {
            let matchup = {
                home: this.home,
                away: this.away,
                date: this.date,
                matchupID: this.games[0].matchup,
            };
            this.$emit('editMatchup', matchup);
            this.editGame = false;
        },
        async deleteGame() {
            this.$emit('deleteMatchup', this.games[0].matchup);
            this.editGame = false;
        },
        async submitEditScore(game) {
            game.homeScore = this.homeScore;
            game.awayScore = this.awayScore;
            this.$emit('editGameScore', game);
            this.editGameScore = false;
            this.homeScore = "";
            this.awayScore = "";
        },
    },
    computed: {
        getEdit() {
            return this.editGame;
        },
        getEditScore() {
            return this.editGameScore;
        },
        getEditScoreLeg() {
            return this.editGameScoreLeg;
        },
        getMatchupStatus() {
            var complete = true;
            for (var i = 0; i < this.games.length; i++) {
                if (this.games[i].homeScore == "-" || this.games[i].awayScore =="-") {
                    complete = false;
                }
            }
            return complete;
        },
        homeTeamWon() {
            var homeTeamScore = 0;
            var awayTeamScore = 0;
            for (var i = 0; i < this.games.length; i++) {
                if (this.games[i].leg == 1) {
                    homeTeamScore += parseInt(this.games[i].homeScore);
                    awayTeamScore += parseInt(this.games[i].awayScore);
                } else {
                    homeTeamScore += parseInt(this.games[i].awayScore);
                    awayTeamScore += parseInt(this.games[i].homeScore);
                }
            }
            if (homeTeamScore > awayTeamScore) {
                return true;
            } else if (homeTeamScore == awayTeamScore) {
                var homeAwayGoals = 0;
                var awayAwayGoals = 0;
                for (i = 0; i < this.games.length; i++) {
                    if (this.games[i].leg == 1) {
                        awayAwayGoals += parseInt(this.games[i].awayScore);
                    } else {
                        homeAwayGoals += parseInt(this.games[i].awayScore);
                    }
                }
                if (homeAwayGoals > awayAwayGoals) {
                    return true;
                } else if (homeAwayGoals == awayAwayGoals) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
}
</script>

<style>
@media only screen and (min-width: 961px) {
    .qfWrapper {
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        width: 100%;
        height: auto;
        flex: 1;
    }

    .QFGames {
        width: 85%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        border: solid white 1px;
        padding: 10px;
    }

    .QFGame {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
    }

    .matchup {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        width: 100%;
        flex: 1;
        margin: 10px;
    }

    .title {
        width: 75%;
        border: solid 1px white;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .round {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-flow: column;
        width: 100%;
    }

    .first {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        flex-flow: column;
        width: 50%;
    }

    .editButton,
    .scoreEditor {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-top: 10px;
    }

    .buttons button {
        margin: 0 10px 0 10px;
    }
}

@media only screen and (min-width: 427px) and (max-width: 960px) { 
    .qfWrapper {
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        width: 100%;
        height: auto;
        flex: 1;
    }

    .QFGames {
        width: 85%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        border: solid white 1px;
        padding: 10px;
    }

    .QFGame {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
    }

    .matchup {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        width: 100%;
        flex: 1;
        padding: 5px;
        margin: 10px;
    }

    .title {
        width: 75%;
        border: solid 1px white;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .title h2 {
        font-size: 1.5em;
    }

    .round {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-flow: column;
        width: 100%;
    }

    .first {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        flex-flow: column;
        width: 50%;
    }

    .editButton,
    .scoreEditor {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-top: 10px;
    }

    .first h3 {
        font-size: 1em;
    }

    .buttons button {
        margin: 0 10px 0 10px;
    }
 }

 @media only screen and (max-width: 426px) {
     .qfWrapper {
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        width: 100%;
        height: auto;
        flex: 1;
    }

    .QFGames {
        width: 85%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        border: solid white 1px;
        padding: 10px;
    }

    .QFGame {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
    }

    .matchup {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        width: 100%;
        flex: 1;
        padding: 5px;
        margin: 10px;
    }

    .title {
        width: 75%;
        border: solid 1px white;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .title h2 {
        font-size: 1.5em;
    }

    .round {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-flow: column;
        width: 100%;
    }

    .first {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        flex-flow: column;
        width: 75%;
    }

    .editButton,
    .scoreEditor {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-top: 10px;
    }

    .first h3 {
        font-size: 1em;
    }

    .buttons button {
        margin: 0 10px 0 10px;
    }
 }
</style>