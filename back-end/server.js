const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [
    'secretValue'
  ],
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

const users = require("./users.js");
const User = users.model;
app.use("/api/users", users.routes);
const validUser = users.valid;

const groupSchema = new mongoose.Schema({
    group: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
});
  
const Group = mongoose.model('Group', groupSchema);

const teamSchema = new mongoose.Schema({
  name: String,
  location: String,
  league: String,
  wonBefore: Boolean,
  titlesWon: String,
  mostRecentWin: String,
  topScorer: String,
  eliminated: Boolean,
  group: {
      type: mongoose.Schema.ObjectId,
      ref: 'Group'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

const Team = mongoose.model('Team', teamSchema);

const matchupSchema = new mongoose.Schema({
    message: String,
    teamOne: String,
    teamTwo: String,
    date: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
});

const Matchup = mongoose.model('Matchup', matchupSchema);

const gameSchema = new mongoose.Schema({
    date: String,
    home: String,
    away: String,
    homeScore: String,
    awayScore: String,
    leg: Number,
    matchup: {
      type: mongoose.Schema.ObjectId,
      ref: 'Matchup'
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
});

const Game = mongoose.model('Game', gameSchema);

// connect to the database
mongoose.connect('mongodb://localhost:27017/clmk2', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// Create a new group for a user
app.post('/api/group', validUser, async (req, res) => {
  const group = new Group({
      group: req.body.name,
      user: req.user,
  });
  try {
    await group.save();
    res.send(group);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// deleting a group, and all teams in that group
app.delete('/api/group/:groupID', validUser, async (req, res) => {
  try {
    await Team.deleteMany({
      group: req.params.groupID,
      user: req.user,
    });
    await Group.deleteOne({
      _id: req.params.groupID,
      user: req.user
    });
    res.sendStatus(200);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// adding a team to a specific group
app.post('/api/:groupID/team', validUser, async (req, res) => {
    let group = await Group.findOne({_id: req.params.groupID});
    const team = new Team({
        name: req.body.name,
        location: req.body.location,
        league: req.body.league,
        titlesWon: req.body.titlesWon,
        wonBefore: req.body.wonBefore,
        mostRecentWin: req.body.mostRecentWin,
        topScorer: req.body.topScorer,
        eliminated: req.body.eliminated,
        group: group,
        user: req.user,
    });
    try {
      await team.save();
      res.send(team);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
});

//getting the groups for the user
app.get('/api/groups', validUser, async (req, res) => {
  try {
    let items = await Group.find({
      user: req.user,
    });
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// getting all teams for a user
app.get('/api/teams', validUser, async (req, res) => {
    try {
      let items = await Team.find({
        user: req.user,
      });
      res.send(items);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
});

// editing a team
app.put('/api/:groupID/:teamID', validUser, async (req, res) => {
  try {
    let team = await Team.findOne({_id: req.params.teamID, user: req.user});
    let group = await Group.findOne({_id: req.params.groupID, user: req.user});
    team.name = req.body.name;
    team.location = req.body.location;
    team.league = req.body.league;
    team.titlesWon = req.body.titlesWon;
    team.wonBefore = req.body.wonBefore;
    team.mostRecentWin = req.body.mostRecentWin;
    team.topScorer = req.body.topScorer;
    team.eliminated = req.body.eliminated;
    team.group = group;
    await team.save();
    res.send(team);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  } 
});

// deleting a team
app.delete('/api/:teamID', validUser, async (req, res) => {
  try {
    await Team.deleteOne({
      _id: req.params.teamID,
      user: req.user,
    });
    res.sendStatus(200);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// creating a matchup
app.post('/api/matchup', validUser, async (req, res) => {
  try {
    let matchup = new Matchup({
      message: 'First leg to be played on ' + req.body.date,
      teamOne: req.body.home,
      teamTwo: req.body.away,
      date: req.body.date,
      user: req.user,
    });
    await matchup.save();
    matchup = await Matchup.findOne({teamOne: req.body.home, teamTwo: req.body.away});
    let game1 = new Game({
      date: req.body.date,
      home: req.body.home,
      away: req.body.away,
      homeScore: "-",
      awayScore: "-",
      leg: 1,
      matchup: matchup,
      user: req.user,
    });
    let game2 = new Game({
      date: req.body.date,
      home: req.body.away,
      away: req.body.home,
      homeScore: "-",
      awayScore: "-",
      leg: 2,
      matchup: matchup,
      user: req.user,
    });
    await game1.save();
    await game2.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// getting all games
app.get('/api/games', validUser, async (req, res) => {
  try {
    let games = await Game.find({user: req.user});
    res.send(games);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// getting all matchups
app.get('/api/matchups', validUser, async (req, res) => {
  try {
    let games = await Matchup.find({user: req.user});
    res.send(games);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//editing a matchup
app.put('/api/:matchupID', validUser, async (req, res) => {
  try {
    let matchup = await Matchup.findOne({_id: req.params.matchupID, user: req.user});
    matchup.teamOne = req.body.home;
    matchup.teamTwo = req.body.away;
    matchup.date = req.body.date;
    await matchup.save();
    let games = await Game.find({matchup: matchup, user: req.user});
    let game1 = games[0];
    game1.date = req.body.date;
    game1.home = req.body.home;
    game1.away = req.body.away;
    await game1.save();
    let game2 = games[1];
    game2.date = req.body.date;
    game2.home = req.body.away;
    game2.away = req.body.home;
    await game2.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  } 
});

app.put('/api/game/score/:gameID', validUser, async (req, res) => {
  try {
    let matchup = await Matchup.findOne({_id: req.body.game.matchup, user: req.user});
    let game = await Game.findOne({
      user: req.user,
      matchup: matchup,
      _id: req.params.gameID,
      home: req.body.game.home,
      away: req.body.game.away,
      leg: req.body.game.leg,
    });
    game.homeScore = req.body.game.homeScore;
    game.awayScore = req.body.game.awayScore;
    await game.save();
    res.sendStatus(200);
  } catch (error) { 
    console.log(error);
    res.sendStatus(500);
  }
})

// deleting a matchup and both games
app.delete('/api/matchups/:matchupID', validUser, async (req, res) => {
  try {
    await Game.deleteMany({
      matchup: req.params.matchupID,
      user: req.user,
    });
    await Matchup.deleteOne({
      _id: req.params.matchupID,
      user: req.user,
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3003, () => console.log('Server listening on port 3003!'));
