var bets = [];

function bet(time, exchange, outcome, income) {
	this.timestamp = time;
	this.exchange = exchange;
	this.outcome = outcome;
	this.income = income;	
}
bet.prototype.getTime = function() {
	return this.timestamp;
}
bet.prototype.getExchange = function() {
	return this.exchange;
}
bet.prototype.getOutcome = function() {
	return this.outcome;
}
bet.prototype.getIncome = function() {
	return this.income;
}
bet.prototype.getData = function() {
	var data;
	data["time"] = this.timestamp;
	data["exchange"] = this.exchange;
	data["outcome"] = this.outcome;
	data["income"] = this.income;
	return data;
}

function roundOnPlaces(value, places) {
    var multiplier = Math.pow(10, places);
    return (Math.round(value * multiplier) / multiplier);
}

function key_exists(key, search) {
    if (!search || (search.constructor !== Array && search.constructor !== Object)) {
        return false;
    }
    for (var i = 0; i < search.length; i++) {
        if (search[i] === key) {
            return true;
        }
    }
    return key in search;
}

vypisVsazky = function() {
	if (bets.length == 0) {
		console.log("nejsou nacteny zadna data");
		return false;
	}

	rounded_bets = [];

	var number;

	for(var i = 0; i < bets.length; i++) {
		number = roundOnPlaces(bets[i].getExchange(), 1);
		rounded_bets[i] = number;
	}

	var used_bets = rounded_bets.slice()
	  .sort(function(a,b){
	    return a - b;
	  })
	  .reduce(function(a,b){
	    if (a.slice(-1) != b) a.push(b);
	    return a;
	  },[]);

	var used_bets_map = {};
	for (var i = 0; i < used_bets.length; i++) {
		used_bets_map[used_bets[i].toString()] = [1, 0, 0];
	}

	for(var i = 0; i < rounded_bets.length; i++) {
		used_bets_map[rounded_bets[i].toString()] = [parseInt(used_bets_map[rounded_bets[i].toString()]) + 1, 0, 0];
	}

	for( var i = 0; i < bets.length; i++) {
		number = roundOnPlaces(bets[i].getExchange(), 1);
		used_bets_map[number] = [used_bets_map[number][0], used_bets_map[number][1] + bets[i].getOutcome(), used_bets_map[number][2] + bets[i].getIncome()];
	}

	console.log("Kurz\tcetnost\tvsazeno\tvyhrano");
	for (var i = 0; i < used_bets.length; i++) {
		var log_string = used_bets[i].toString() + "\t\t";
		log_string += used_bets_map[used_bets[i].toString()][0] + "\t\t";
		log_string += roundOnPlaces(used_bets_map[used_bets[i].toString()][1], 2);
		log_string += (roundOnPlaces(used_bets_map[used_bets[i].toString()][1], 2).toString().length > 3) ? "\t" : "\t\t";
		log_string += used_bets_map[used_bets[i].toString()][2];

		console.log(log_string);
	}

	return true;
}

nactiData = function() {

	var date, exchange, outcome, income;

	var bets_content_rows = document.getElementById('betsContent').getElementsByTagName('tr');
	if (bets_content_rows.className != "multiple") {
		for (var i = 0; i < bets_content_rows.length; i++) {
			var one_bet = bets_content_rows.item(i).childNodes;
			for (var j = 0; j < one_bet.length; j++) {
				if (one_bet.item(j).nodeName.toUpperCase() == "TD") {
					switch(j) {
						case 1:
							date = one_bet.item(j).innerText.replace(/\n/g, " ");
							break;
						case 4:
							exchange = parseInt(one_bet.item(j).innerText);
							break;
						case 6:
							outcome = parseInt(one_bet.item(j).innerText);
							break;
						case 10:
							income = parseInt(one_bet.item(j).innerText);
							break;
						default: break;
					}
				}
			}

			bets[bets.length] = new bet(date, exchange, outcome, income);
		}
	}

	return true;
}
