// Input Elements
const amountEl = document.getElementsByName('amount');
const contributionEl = document.getElementsByName('contribution');
const durationEl = document.getElementsByName('duration');
const interestEl = document.getElementsByName('interest');

// Result Elements
const startingVal = document.querySelectorAll('.starting-val');
const contributionVal = document.querySelectorAll('.contribution-val');
const durationVal = document.querySelectorAll('.duration-val');
const finalVal = document.querySelectorAll('.final-val');

// Format Value
const formatValue = (value) => parseFloat(Math.round(value * 100) / 100).toFixed(2);

// Display Results
const displayResults = (amount, duration, totalContribution, totalReturn, finalBalance) => {
	startingVal[0].innerHTML = '$' + amount;
	contributionVal[0].innerHTML = '$' + totalContribution;
	durationVal[0].innerHTML = duration;
	finalVal[0].innerHTML = '$' + finalBalance;
}

var pieCanvas = document.getElementById('piechart').getContext('2d');
var pieChart = new Chart(pieCanvas, {
	// The type of chart we want to create
	type: 'doughnut',

	// The data for our dataset
	data : {
		datasets: [{
			data: [10, 20, 30],
			backgroundColor: ['#3B728D','#85C5C9','#68AAB7']
		}],

		// These labels appear in the legend and in the tooltips when hovering different arcs
		labels: [
		'Initial Investments',
		'Total Interest',
		'Contributions'
		]
	},

	// Configuration options go here
	options: {
		elements: {
			center: {
				text: 'Desktop',
				color: '#333333', //Default black
				fontStyle: 'Montserrat', //Default Arial
				fontSize: '',
				sidePadding: 30 //Default 20 (as a percentage)
			}
		},
		legend: {
			position: 'bottom',
			labels: {
				fontColor: "#333333",
				boxWidth: 20,
				padding: 20
			}
		}
	}
});
Chart.pluginService.register({
	beforeDraw: function (chart) {
		if (chart.config.options.elements.center) {
		//Get ctx from string
		var ctx = chart.chart.ctx;

		//Get options from the center object in options
		var centerConfig = chart.config.options.elements.center;
		var fontStyle = centerConfig.fontStyle || 'Arial';
		var txt = centerConfig.text;
		var color = centerConfig.color || '#000';
		var sidePadding = centerConfig.sidePadding || 20;
		var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
		//Start with a base font of 30px
		ctx.font = "30px " + fontStyle;

		//Get the width of the string and also the width of the element minus 10 to give it 5px side padding
		var stringWidth = ctx.measureText(txt).width;
		var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

		// Find out how much the font can grow in width.
		var widthRatio = elementWidth / stringWidth;
		var newFontSize = Math.floor(30 * widthRatio);
		var elementHeight = (chart.innerRadius * 2);

		// Pick a new font size so it will not be larger than the height of label.
		var fontSizeToUse = Math.min(newFontSize, elementHeight);

		//Set font settings to draw it correctly.
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
		var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
		ctx.font = fontSizeToUse+"px " + fontStyle;
		ctx.fillStyle = color;

		//Draw text in center
		ctx.fillText(txt, centerX, centerY);
	}
}
});

const updatePieChart = (amount, totalReturn, totalContribution, finalBalance) => {
	pieChart.data.datasets[0].data = [+amount, +totalContribution, +totalReturn];
	pieChart.options.elements.center.text = '$' + finalBalance;
	pieChart.update();
}
// Calculate
const calculate = () => {
	let amount = amountEl[0].value;
	let contribution = contributionEl[0].value;
	let duration = durationEl[0].value;
	let interest = interestEl[0].value;
	let rate = interest/100;
	let finalBalance;
	let totalContribution;
	let totalReturn;

	// const
	finalBalance = amount * Math.pow(1 + rate, duration) + contribution * ( (Math.pow(1 + rate, duration) - 1) / rate );
	totalContribution = contribution * duration;
	totalReturn = finalBalance - amount - totalContribution;

	displayResults(amount, duration, formatValue(totalContribution), formatValue(totalReturn), formatValue(finalBalance));
	updatePieChart(formatValue(amount), formatValue(totalContribution), formatValue(totalReturn), formatValue(finalBalance));
}

calculate();
