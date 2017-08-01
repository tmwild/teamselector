import React from 'react';

const fantasyData = require('../fantasyData');
const optimiser = require('../optimise');

class Team extends React.Component {

    constructor() {
        super();

        this.state = {
            'budget1': 100,
            'budget2': 300,
            'budget3': 360,
            'budget4': 240,
            'min1': 95,
            'min2': 225,
            'min3': 225,
            'min4': 135,
            'max1': 130,
            'max2': 375,
            'max3': 650,
            'max4': 400
        };

        this.getPlayersByPosition();
    }


    componentDidMount () {
        /* choose team from default settings */
        this.pickTeam();
    };


    setBudgets = () => {
        let budget = this.getBudgets();

        for (var key in budget) {
            if (budget[key] < this.state['min'+key]) {
                budget[key] = this.state['min'+key];
                console.log('budget too low - auto adjusted');
            }
            if (budget[key] > this.state['max'+key]) {
                budget[key] = this.state['max'+key];
                console.log('budget too high - auto adjusted');
            }
        }

        this.setState({
            budget1: this.pos1.value,
            budget2: this.pos2.value,
            budget3: this.pos3.value,
            budget4: this.pos4.value,
        });
    };


    getBudgets = () => {
        return {
            1: this.pos1.value,
            2: this.pos2.value,
            3: this.pos3.value,
            4: this.pos4.value,
        };
    };


    pickTeam = () => {

        let budget = this.getBudgets();

        let posPlayersStr = '',
            posPlayers,
            playersTotal = 0;

        for (let position = 1; position <= 4; position += 1) {

            if (this.playersByPosition[position][0] === 0) {
                this.playersByPosition[position].shift();
            }

            posPlayers = optimiser(budget[position], this.playersByPosition[position], position);

            posPlayers.forEach(player => {
                posPlayersStr += player.name + ' ';
                playersTotal += player.points;
            });

            posPlayersStr += ' // ';

            this.setState({
                'positionPlayers': posPlayersStr,
                'totalPoints': playersTotal
            });
            
        }

        this.setState({
            budget1: budget[1],
            budget2: budget[2],
            budget3: budget[3],
            budget4: budget[4],
        });
    };


    getPlayersByPosition = () => {

        fantasyData.getPlayers( (data) => {
            
            let players = data;
            
            this.playersByPosition = {
                    1 : players.filter(function(p) {return p.position === 1}).sort(function(a,b){return b.points - a.points}),
                    2 : players.filter(function(p) {return p.position === 2}).sort(function(a,b){return b.points - a.points}),
                    3 : players.filter(function(p) {return p.position === 3}).sort(function(a,b){return b.points - a.points}),
                    4 : players.filter(function(p) {return p.position === 4}).sort(function(a,b){return b.points - a.points})
            };

        });
    };


    render() {
        return (
            <div>
                <p>Your team..... {this.state.positionPlayers}</p>

                <label>GK budget <input type="number" min="95" max="140" value={this.state.budget1} ref={(input) => { this.pos1 = input; }} onChange={this.setBudgets} onBlur={this.pickTeam} /></label>
                <label>DF budget <input type="number" min="225" max="400" value={this.state.budget2} ref={(input) => { this.pos2 = input; }} onChange={this.setBudgets} onBlur={this.pickTeam} /></label>
                <label>MF budget <input type="number" min="225" max="700" value={this.state.budget3} ref={(input) => { this.pos3 = input; }} onChange={this.setBudgets} onBlur={this.pickTeam} /></label>
                <label>FW budget <input type="number" min="135" max="420" value={this.state.budget4} ref={(input) => { this.pos4 = input; }} onChange={this.setBudgets} onBlur={this.pickTeam} /></label>

                <h4>Total: {this.state.totalPoints}</h4>
            </div>
        )
    }
}


export default Team;