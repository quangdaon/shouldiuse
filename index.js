const ciu = require('caniuse-api');
//const args = require('yargs')
//	.usage('Usage: $0 [keyword]')
//	.alias('v', 'version')
//	.describe('v', 'Show version number')
//	.alias('h', 'help')
//	.example('$0 border-radius', 'Determines if you can use border-radius.')
//	.epilog('Created by Quangdao Nguyen')
//	.argv;

const inquirer = require('inquirer');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const appData = require('./package.json');

//if (args.v) {
//	return appData.version;
//}

//let keyword = args._[0];
//if (!keyword) {
//	return console.error('No keyword provided.');
//}

//const searchResults = ciu.find(keyword);

function testQuery(q) {
	return new Promise(function (resolve) {
		resolve(ciu.find(q || ''));
	});
}

inquirer.prompt([{
	type: 'autocomplete',
	name: 'feature',
	message: 'Select a feature',
	source: function (answersSoFar, input) {
		return testQuery(input);
	}
}]).then(function (answers) {
	doThing(answers);
}).catch(function (err) {
	console.log(err);
});

//if (searchResults instanceof Array) {
//} else {
//	doThing(searchResults);
//}

function doThing(feature) {
	console.log(feature);
}
