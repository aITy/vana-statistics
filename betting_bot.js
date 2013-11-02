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

getRatioStr = function(outcome, income) {
	if (income == 0) {
		return "-100%";
	}

	var sign, divident, divisor, result, result_str, str;
	if (outcome - income > 0) {
		sign = "-";
		divident = outcome;
		divisor = income;
	}
	else if (outcome - income == 0) {
		sign = "";
		divident = divisor = 1;
	}
	else {
		sign = "+";
		divident = income;
		divisor = outcome;
	}

	result = (divident - divisor)/divisor * 100;
	result_str = sign + roundOnPlaces(result, 1).toString();

	str = "";
	for(var i = 0; i < 5 - result_str.length - 1; i++) {
		str += " ";
	}
	return str + result_str + "%";
}

function roundOnPlaces(value, places) {
    var multiplier = Math.pow(10, places);
    return (Math.round(value * multiplier) / multiplier);
}

vypisVsazky = function() {
	if (bets.length == 0) {
		console.log("nejsou nacteny zadna data");
		return false;
	}

	rounded_bets = [];

	var number;
	var summary = [0, 0, 0, 0];

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

	console.log("Kurz\tCetnost\tVsazeno\tVyhrano\tZisk");
	for (var i = 0; i < used_bets.length; i++) {
		var log_string = used_bets[i].toString() + "\t\t";
		log_string += used_bets_map[used_bets[i].toString()][0] + "\t\t";
		log_string += roundOnPlaces(used_bets_map[used_bets[i].toString()][1], 2);
		log_string += (roundOnPlaces(used_bets_map[used_bets[i].toString()][1], 2).toString().length > 3) ? "\t" : "\t\t";
		log_string += roundOnPlaces(used_bets_map[used_bets[i].toString()][2], 2);
		log_string += (roundOnPlaces(used_bets_map[used_bets[i].toString()][2], 2).toString().length > 3) ? "\t" : "\t\t";
		log_string += getRatioStr(roundOnPlaces(used_bets_map[used_bets[i].toString()][1], 2), roundOnPlaces(used_bets_map[used_bets[i].toString()][2], 2));

		summary = [summary[0] + used_bets[i],
					summary[1] + used_bets_map[used_bets[i]],
					summary[2] + roundOnPlaces(used_bets_map[used_bets[i].toString()][1], 2),
					summary[3] +  roundOnPlaces(used_bets_map[used_bets[i].toString()][2], 2) ];

		console.log(log_string);
	}
	var summary_str = "Celkem:\n" + summary[0].toString() + "\t" + summary[1].toString() + "\t" + summary[2].toString() + "\t" + summary[3].toString() + "\t";
	summary_str += getRatioStr(summary[2], summary[3]);

	console.log(summary_str);

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
							exchange = parseFloat(one_bet.item(j).innerText);
							break;
						case 6:
							outcome = parseFloat(one_bet.item(j).innerText);
							break;
						case 10:
							income = parseFloat(one_bet.item(j).innerText);
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

vycistiData = function() {
	bets.length = 0;
}
