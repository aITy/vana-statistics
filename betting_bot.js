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

nejhorsiKurz = function() {
	if (bets.length == 0) {
		console.log("nejsou nacteny zadna data");
		return;
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

	for (var i = 0; i < used_bets.length; i++) {
		console.log( used_bets[i].toString() + "\t" + used_bets_map[used_bets[i].toString()][0]);
	}

	for( var i = 0; i < bets.length; i++) {
		number = roundOnPlaces(bets[i].getExchange(), 1);
		used_bets_map[number] = [used_bets_map[number][0], used_bets_map[number][1] + bets[i].getOutcome(), used_bets_map[number][2] + bets[i].getIncome()];
	}

	console.log("Kurz\tcetnost\tvsazeno\tvyhrano");
	for (var i = 0; i < used_bets.length; i++) {
		console.log( used_bets[i].toString() + "\t\t" + used_bets_map[used_bets[i].toString()][0] + "\t\t" + roundOnPlaces(used_bets_map[used_bets[i].toString()][1], 2) + (used_bets_map[used_bets[i].toString()][1].toString().length > 3)?"\t":"\t\t" + used_bets_map[used_bets[i].toString()][2]);
	}

	return true;
}

nactiData = function() {

	bets[0] = new bet("1.11.2003 15:52:30", 1.15, 0.5, 0);
	bets[1] = new bet("1.11.2003 15:53:30", 1.20, 1, 1.2);
	bets[2] = new bet("1.11.2003 15:54:30", 1.26, 1, 1.2);
	bets[3] = new bet("1.11.2003 15:55:30", 1.50, 0.05, 0);
	bets[4] = new bet("1.11.2003 15:56:30", 1.23, 0.1, 0.6);
	bets[5] = new bet("1.11.2003 15:57:30", 1.17, 0.5, 2);
	bets[6] = new bet("1.11.2003 15:58:30", 1.45, 0.8, 4);
	bets[7] = new bet("1.11.2003 15:59:30", 2.10, 1.5, 0);
	bets[8] = new bet("1.11.2003 16:00:30", 2.15, 1.55, 3);
	bets[9] = new bet("1.11.2003 16:01:30", 2.05, 2.5, 0);

	console.log(bets);
	return true;
}
