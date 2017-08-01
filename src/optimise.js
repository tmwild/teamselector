class Optimiser {

	constructor (budget, dataSet, position) {
		this.maxPlayers = [0, 2, 5, 5, 3];
		this.budget = budget;
		this.dataSet = dataSet;
		this.position = position;
	}


	createMatrix = () => {

		let playerIndex,
			costIndex,
			dataLen = this.dataSet.length;

		this.matrix = new Array(dataLen + 1);

		// Setup matrix array y-axis
		for (playerIndex = 0; playerIndex <= dataLen; playerIndex += 1) {
			this.matrix[playerIndex] = new Array(this.budget + 1);
		}

		this.dataSet.unshift(0);

		// Setup this.matrix array x-axis
		for (playerIndex = 0; playerIndex <= dataLen; playerIndex += 1) {

			if (this.matrix[playerIndex] === 0) {
				break;
			}

			for (costIndex = 0; costIndex <= this.budget; costIndex += 1) {

				// Fill top row and first column with zeros
				if (playerIndex === 0 || costIndex === 0) {
					try {
						this.matrix[playerIndex][costIndex] = 0;
					} catch (e) {
						debugger;
					}

				// if currently looped player costs less than currently looped budget, see if they add value
				} else if (this.dataSet[playerIndex].cost <= costIndex) {
					this.doesPlayerAddValue(playerIndex, costIndex);

				// Else, currently looped player costs more than current budget index: this.matrix is the same as before
				} else {
					this.matrix[playerIndex][costIndex] = !this.matrix[playerIndex - 1][costIndex] ? 0 : this.matrix[playerIndex - 1][costIndex];
				}
			}
		}

		/* return the cell from the this.matrix where the last player to be looped met with the maximum budget - this is always the most valuable player set */
		return this.matrix[dataLen][this.budget];
	}



	doesPlayerAddValue = (playerIndex, costIndex) => {

		var currentPlayer = this.dataSet[playerIndex],
			prevIndexMax = this.matrix[playerIndex - 1][costIndex];

		this.newMax = currentPlayer.points;
		this.newPs = [currentPlayer];
		this.oldMax = 0;
		this.oldPs = [];

		if (!prevIndexMax) {
			prevIndexMax = 0;
		}

		/* find old max */
		if (prevIndexMax !== 0) {
			/* player(s) found for this cost previously */
			for (let j = 0; j < prevIndexMax.length; j += 1) {
				this.oldMax += prevIndexMax[j].points;
				this.oldPs.push(prevIndexMax[j]);
			}
		}

		/* find new max */
		var additionalPlayers = this.matrix[playerIndex][costIndex - this.dataSet[playerIndex].cost];
								// e.g. this.matrix[300][350 - 105]
								// e.g. this.matrix[Coutinho][midfieldBudget - CoutinhoCost]
								// e.g. could be [4 players costing 245 total]

		if (additionalPlayers !== 0) {

			/* sort additionPlayers by points ASC and filter out current player */
			additionalPlayers.sort(function (a, b) { return (a.points > b.points) ? 1 : ((b.points > a.points) ? -1 : 0); });
			additionalPlayers = additionalPlayers.filter(function (p) { return p.name !== currentPlayer.name });

			this.comparePlayerToPreviousBest(currentPlayer, additionalPlayers);
		}

		// Update the matrices
		if (this.newMax > this.oldMax) {
			this.matrix[playerIndex][costIndex] = this.newPs;

		} else {
			this.matrix[playerIndex][costIndex] = this.oldPs;
		}
	}


	comparePlayerToPreviousBest = (currentPlayer, additionalPlayers) => {

		var replaced = false;

		for (let j = 0; j < additionalPlayers.length; j += 1) {

			/* if this cost index has fewer players than position capacity, add new player */
			if ((additionalPlayers.length) < this.maxPlayers[this.position]) {
				this.newMax += additionalPlayers[j].points;
				this.newPs.push(additionalPlayers[j]);
			}

			/* if this cost index has max num of players for this position, sub out the weakest who is also >= cost */
			if ((additionalPlayers.length) === this.maxPlayers[this.position]) {
				/* 
					if we've already subbed an additionalPlayer out for currentPlayer OR
					if additionalPlayer adds more value than currentPlayer,
					add them to the newPs array and max
				*/
				if (replaced || (!replaced && currentPlayer.points < additionalPlayers[j].points)) {
					this.newMax += additionalPlayers[j].points;
					this.newPs.push(additionalPlayers[j]);
				}

				/* if currentPlayer adds more value than additionalPlayer */
				if (!replaced && (currentPlayer.cost <= additionalPlayers[j].cost && currentPlayer.points >= additionalPlayers[j].points)) {
					/* don't count this additionalPlayer in the newMax - he's been replaced */
					replaced = true;
				}

				/* if currentPlayer couldn't oust any of additionalPlayers, make newPs the original list */
				if (!replaced && j === (additionalPlayers.length - 1)) {
					this.newMax -= currentPlayer.points;
					this.newPs = this.newPs.filter(function (p) { return p.name !== currentPlayer.name });
				}
			}
		}
	}
}


function optimisePosition (budget, dataSet, position) {
	let optimiser = new Optimiser(budget, dataSet, position);
	let players = optimiser.createMatrix();
	return players;
}

module.exports = optimisePosition;