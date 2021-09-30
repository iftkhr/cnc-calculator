const data = {
	millimeter: {
		diameter: {
			3: {
				hardwood: { low: 0.08, high: 0.13 },
				softwood: { low: 0.1, high: 0.15 },
				'particle-wood': { low: 0.1, high: 0.18 },
				'soft-plastic': { low: 0.08, high: 0.15 },
				'hard-plastic': { low: 0.05, high: 0.1 },
			},
			6: {
				hardwood: { low: 0.23, high: 0.28 },
				softwood: { low: 0.28, high: 0.33 },
				'particle-wood': { low: 0.33, high: 0.41 },
				'soft-plastic': { low: 0.18, high: 0.26 },
				'hard-plastic': { low: 0.15, high: 0.23 },
			},
			10: {
				hardwood: { low: 0.41, high: 0.46 },
				softwood: { low: 0.43, high: 0.51 },
				'particle-wood': { low: 0.51, high: 0.59 },
				'soft-plastic': { low: 0.26, high: 0.31 },
				'hard-plastic': { low: 0.2, high: 0.26 },
			},
			13: {
				hardwood: { low: 0.48, high: 0.54 },
				softwood: { low: 0.54, high: 0.59 },
				'particle-wood': { low: 0.64, high: 0.69 },
				'soft-plastic': { low: 0.31, high: 0.41 },
				'hard-plastic': { low: 0.26, high: 0.31 },
			},
		},
	},

	inches: {
		diameter: {
			'1/8': {
				hardwood: { low: 0.003, high: 0.005 },
				softwood: { low: 0.004, high: 0.006 },
				'particle-wood': { low: 0.004, high: 0.007 },
				'soft-plastic': { low: 0.003, high: 0.006 },
				'hard-plastic': { low: 0.002, high: 0.004 },
			},
			'1/4': {
				hardwood: { low: 0.009, high: 0.011 },
				softwood: { low: 0.011, high: 0.013 },
				'particle-wood': { low: 0.013, high: 0.016 },
				'soft-plastic': { low: 0.007, high: 0.01 },
				'hard-plastic': { low: 0.006, high: 0.009 },
			},
			'3/8': {
				hardwood: { low: 0.015, high: 0.018 },
				softwood: { low: 0.018, high: 0.02 },
				'particle-wood': { low: 0.02, high: 0.023 },
				'soft-plastic': { low: 0.01, high: 0.012 },
				'hard-plastic': { low: 0.008, high: 0.01 },
			},
			'1/2': {
				hardwood: { low: 0.019, high: 0.021 },
				softwood: { low: 0.021, high: 0.023 },
				'particle-wood': { low: 0.025, high: 0.027 },
				'soft-plastic': { low: 0.012, high: 0.016 },
				'hard-plastic': { low: 0.01, high: 0.012 },
			},
		},
	},
};

window.onload = sliderValues();
window.onload = gaugeNeedle();
window.onload = calculate();

function sliderValues() {
	document.getElementById('feedrate-value').innerHTML =
		document.getElementById('feedrate-range').value;
	document.getElementById('rpm-value').innerHTML =
		document.getElementById('rpm-range').value;
	document.getElementById('flutes-value').innerHTML =
		document.getElementById('flutes-range').value;
}

function gaugeNeedle() {
	var needle = document.createElement('div');
	needle.setAttribute('id', 'needle');
	document.getElementById('meter').appendChild(needle);
}

function calculate() {
	var material = document.getElementById('material').value;
	var inputs = document.getElementsByTagName('input');

	for (let i = 0; i < inputs.length; i++) {
		if (inputs[i].type === 'radio' && inputs[i].checked) {
			if (inputs[i].name === 'dia-mm') {
				var mmDia = inputs[i].id;
			} else {
				var inDia = inputs[i].id;
			}
		}
	}

	var feedRate = document.getElementById('feedrate-range').value;
	var rpm = document.getElementById('rpm-range').value;
	var flutes = document.getElementById('flutes-range').value;

	var chipLoad = feedRate / (rpm * flutes);

	document.getElementById('result').innerHTML = chipLoad.toFixed(3);

	if (document.getElementById('unit').value === 'in') {
		document.getElementById('diameter-in').classList.remove('hide');
		document.getElementById('diameter-mm').classList.add('hide');

		var inLow = data.inches.diameter[inDia][material].low;
		var inHigh = data.inches.diameter[inDia][material].high;

		var inDiff = inHigh - inLow;
		var inDiv = inDiff / 100;
		var inArray = [];

		inArray[0] = inLow;
		inArray[99] = inHigh;

		for (let i = 1; i < 99; i++) {
			inArray[i] = inArray[i - 1] + inDiv;
		}

		var closest = inArray.reduce(function (prev, curr) {
			return Math.abs(curr - chipLoad) < Math.abs(prev - chipLoad)
				? curr
				: prev;
		});

		var needlePosition = inArray.indexOf(closest);

		document.getElementById('low').innerHTML = inLow;
		document.getElementById('high').innerHTML = inHigh;
	} else {
		document.getElementById('diameter-in').classList.add('hide');
		document.getElementById('diameter-mm').classList.remove('hide');

		var mmLow = data.millimeter.diameter[mmDia][material].low;
		var mmHigh = data.millimeter.diameter[mmDia][material].high;

		var mmDiff = mmHigh - mmLow;
		var mmDiv = mmDiff / 100;
		var mmArray = [];

		mmArray[0] = mmLow;
		mmArray[99] = mmHigh;

		for (let i = 1; i < 99; i++) {
			mmArray[i] = mmArray[i - 1] + mmDiv;
		}

		var closest = mmArray.reduce(function (prev, curr) {
			return Math.abs(curr - chipLoad) < Math.abs(prev - chipLoad)
				? curr
				: prev;
		});

		var needlePosition = mmArray.indexOf(closest);

		document.getElementById('low').innerHTML = mmLow;
		document.getElementById('high').innerHTML = mmHigh;
	}
	document.getElementById('needle').style.gridColumn = needlePosition + 1;
}
