import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions'

let AddTodo = ({ dispatch }) => {
  let input

  return (
    <div>
      Your Team...
    </div>
  )
}
AddTodo = connect()(AddTodo)

export default AddTodo

// fantasyData.getPlayers( function (data) {
    
//     let players = data;
    
//     const playersByPosition = {
//         1 : players.filter(function(p) {return p.position === 1}).sort(function(a,b){return b.points - a.points}),
//         2 : players.filter(function(p) {return p.position === 2}).sort(function(a,b){return b.points - a.points}),
//         3 : players.filter(function(p) {return p.position === 3}).sort(function(a,b){return b.points - a.points}),
//         4 : players.filter(function(p) {return p.position === 4}).sort(function(a,b){return b.points - a.points})
//     };

//     const budget = {
//         1: 100,
//         2: 310,
//         3: 350,
//         4: 240
//     };

//     let fantasy = {};
//         fantasy.picked = {};

//     for (let i = 1; i <= 4; i += 1) {
//         fantasy.picked[(i - 1)] = optimiser(budget[i], playersByPosition[i], i);
//     }

//     console.log(fantasy.picked);

//     let cost = 0, forms = 0, team = [];

//     for (let key in fantasy.picked) {
//         for (let i = 0; i < fantasy.picked[key].length; i += 1){
//             cost += fantasy.picked[key][i].cost;
//             forms += fantasy.picked[key][i].points;
//             team.push(fantasy.picked[key][i]);
//         }
//     }

//     team.sort(function(a,b){return b.position - a.position});

//     let xi = team,
//         weekpts = 0,
//         teamCost = 0;
//     console.log('In form: ');

//     for (let i = 0; i < xi.length; i += 1){
//         weekpts += xi[i].points;
//         teamCost += xi[i].cost;
//         console.log(`${xi[i].position} ${xi[i].name} @ ${xi[i].cost}`);
//     }

//     console.log(`cost: ${teamCost} /// projected points: ${weekpts}`);
// });