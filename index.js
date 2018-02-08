const ciu = require('caniuse-api');

const inquirer = require('inquirer');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

async function ciuSearch(q) {
	return ciu.find(q || '');
}

async function start() {
	const query = await inquirer.prompt([{
		type: 'autocomplete',
		name: 'selected',
		message: 'Select a feature',
		source: function (answersSoFar, input) {
			return ciuSearch(input);
		}
	}]);

	const feature = query.selected;
	let isSupported = false;
	let browserList = ['> 1%', 'last 2 versions'];

	function testSupport(string) {
		if (string) browserList.push('not ' + string);
		isSupported = ciu.isSupported(feature, browserList);
		return isSupported;
	}

	if (!testSupport()) {
		const ieSupport = await inquirer.prompt([
			{
				type: 'list',
				name: 'isNeeded',
				message: 'Do you need to support Internet Explorer?',
				choices: ['Yes', 'No'],
				when() {
					return !isSupported;
				},
				filter(choice) {
					return choice === 'Yes';
				}
			},
			{
				type: 'list',
				name: 'minimum',
				message: 'You poor soul! What is the minimum version you need to support?',
				choices: ['9', '10', '11'],
				when(answers) {
					return answers.isNeeded;
				},
				filter(choice) {
					return '< ' + choice;
				}
			}
		]);

		if (ieSupport.isNeeded) {
			testSupport(ieSupport.minimum);
		} else {
			testSupport('ie <= 11');
		}

	}

	ciu.setBrowserScope(browserList);
	if (isSupported) {
		return `${feature} is safe to use!`;
	} else {
		return ciu.getSupport(feature);//`${feature} is not well supported enough for your requirements...`;
	}

}

start().then(console.log).catch(function (e) {
	console.log(e);
});