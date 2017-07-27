const fs = require('fs');
let fantasy = {};

function knapsack (capacity, items, thisPosition) {

	var idxItem = 0,
		idxWeight = 0,
		numItems = items.length,
		weightMatrix,
		positionCap = [2, 5, 5, 3];

	if (fantasy.weightMatrix && fantasy.weightMatrix[thisPosition]) {

		fantasy.weightMatrix[thisPosition] = false;
		//weightMatrix.push(0);
	}
	
		weightMatrix = new Array(numItems + 1);
		items.unshift(0);
	


	// Setup matrices
	if (!fantasy.weightMatrix || (fantasy.weightMatrix && !fantasy.weightMatrix[thisPosition])) {
		for (idxItem = 0; idxItem <= numItems; idxItem++) {
			weightMatrix[idxItem] = new Array(capacity + 1);
		}
	}


	// Build weightMatrix from [0][0] -> [numItems-1][capacity-1]
	for (idxItem = 0; idxItem <= numItems; idxItem++) {

		if (weightMatrix[idxItem] === 0) {
			break;
		}

		for (idxWeight = 0; idxWeight <= capacity; idxWeight++) {

			// Fill top row and left column with zeros

			if (!items[idxItem]) {
			//console.log(items, 'idx = ' + idxItem, 'item...', items[idxItem]);
			}

			if (idxItem === 0 || idxWeight === 0) {
				try {
					weightMatrix[idxItem][idxWeight] = 0;
				} catch (e) {
					debugger;
				}
			}

			// If item will fit, decide if there's greater value in keeping it,
			// or leaving it
			else if (items[idxItem].cost <= idxWeight) {

				//if(idxWeight === 120){debugger;}

				var currentPlayer = items[idxItem],
					newMax = currentPlayer.points,
					newPs = [currentPlayer],
					prevIndexMax = weightMatrix[idxItem - 1][idxWeight],
					oldMax = 0,
					oldPs = [];

				if (!prevIndexMax) {
					prevIndexMax = 0;
				}

				/* find old max */
				if (prevIndexMax !== 0) {
					/* player/s found for this cost previously */
					//debugger;
					for (var j = 0; j < prevIndexMax.length; j += 1) {
						oldMax += prevIndexMax[j].points;
						oldPs.push(prevIndexMax[j]);
					}
				}

				/* find new max */
				var additionalPlayers = weightMatrix[idxItem][idxWeight - items[idxItem].cost];

				if (additionalPlayers !== 0) {

					var replaced = false;

					additionalPlayers.sort(function (a, b) { return (a.points > b.points) ? 1 : ((b.points > a.points) ? -1 : 0); });
					additionalPlayers = additionalPlayers.filter(function (p) { return p.name !== currentPlayer.name });

					for (var j = 0; j < additionalPlayers.length; j += 1) {

						/* don't add the same player twice */

						if (additionalPlayers[j].name !== currentPlayer.name) {

							/* if this cost index has fewer players than position capacity, add new player */
							if ((additionalPlayers.length) < positionCap[thisPosition - 1]) {
								newMax += additionalPlayers[j].points;
								newPs.push(additionalPlayers[j]);
							}

							/* if this cost index has max num of player for this position, sub out the weakest who is also >= cost */
							if ((additionalPlayers.length) === positionCap[thisPosition - 1]) {

								if (replaced || (!replaced && currentPlayer.points < additionalPlayers[j].points)) {
									newMax += additionalPlayers[j].points;
									newPs.push(additionalPlayers[j]);
								}

								if (!replaced &&
									(currentPlayer.cost <= additionalPlayers[j].cost && currentPlayer.points >= additionalPlayers[j].points)) {
									/* don't count this guy */
									replaced = true;
								}

								if (!replaced && j === (additionalPlayers.length - 1)) {
									newMax -= currentPlayer.points;
									newPs = newPs.filter(function (p) { return p.name !== currentPlayer.name });
								}
							}

						} else {
							break;
						}
					}
				}

				// Update the matrices
				if (newMax > oldMax) {

					weightMatrix[idxItem][idxWeight] = newPs;

				} else {

					weightMatrix[idxItem][idxWeight] = oldPs;
				}

				// Else, item can't fit; value and weight are the same as before
			} else {
				weightMatrix[idxItem][idxWeight] = !weightMatrix[idxItem - 1][idxWeight] ? 0 : weightMatrix[idxItem - 1][idxWeight];
			}
		}
	}

	fantasy.picked = fantasy.picked || {};
	fantasy.weightMatrix = fantasy.weightMatrix || {};
	
	fantasy.weightMatrix[thisPosition] = weightMatrix;

	return weightMatrix[numItems][capacity];
}

module.exports = knapsack;