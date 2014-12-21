var template = require('../Factory').template;

require('fs').readdirSync(__dirname).forEach(function(file){
	if(file=='index.js'){return;}
	var name = file.replace(/\.js/,'');
	template(name,require('./'+file));
});