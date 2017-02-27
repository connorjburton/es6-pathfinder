const fs = require('fs');
const path = require('path');
const Node = require('./Node');
const Wayfinder = require('./Wayfinder');

class MazeSolver {
	constructor(source, target)
	{
		console.time('Time Taken');
		
		this.root = path.resolve(__dirname, '..'); // path to root directory that contains data
		this.source = source;
		this.target = new Node({x: target[0], y: target[1]}, true);
		this.starting = null;
		this.matrix = null;
	}
	
	parseData(cb)
	{
		if(typeof this.source !== 'string') console.error(new Error('this.source is not a string in MazeSolver.parseData'));

		fs.readFile(path.join(this.root, this.source), 'utf8', (err, data) => { //read file
			if(err) console.error(new Error(err));

			data = data.split('\n').filter((val) => val); //split on new line & remove any falsey values (e.g empty string at end of file)
			this.meta = data.shift().split(' ').map((val) => parseInt(val, 10)); // remove first line from data, split, parse as ints then map to `meta`
			data = data.map((row, y) => row.split('').map((val, x) => { //split each row into their own arrays and map them to nodes
				return new Node({x: x, y: y}, (val === '1'), this.target);
			}));

			//do a quick check to make sure data matches up with what the meta says
			if(this.meta[0] !== data[0].length || this.meta[1] !== data.length) console.error(new Error('data does not match meta in MazeSolver.parseData'));

			//get the starting points, set movement cost to 0
			let xNum = data[0].length - 1;
			let yNum = data.length - 1;

			let topRight = data[0][xNum];
			topRight.g = 0;
			let bottomLeft = data[yNum][0];
			bottomLeft.g = 0;
			let bottomRight = data[yNum][xNum];
			bottomRight.g = 0;

			//assign starting points
			this.starting = [topRight, bottomLeft, bottomRight];

			//set the matrix
			this.matrix = data;

			cb.apply(this); // set the cb scope to the class (useful if calling this method directly, e.g tests)
		});
	}
	
	solve()
	{
		this.parseData(() => {
			// kick off wayfinder once we have parsed file data
			let alpha = ['A', 'B', 'C'];
			let str = 'A* Algorithm \n';

			this.starting.forEach((start, key) => {
				let wayfinder = new Wayfinder(this.matrix);
				let result = wayfinder.run(start);
				
				str += 'from ' + alpha[key] + ': ';
				str += (result) ? this.formatResult(result) : 'Wayfinding failed.';
				if(key !== this.starting.length-1) str += '\n';
			});

			console.log(str);
			console.timeEnd('Time Taken');
		});
	}
	
	formatResult(path)
	{
		let chars = [];
		path.forEach((value, key) => {
			if(typeof path[key+1] === 'undefined') return;
			let next = path[key+1];
			
			if(value[0] !== next[0]) {
				chars.push((next[0] > value[0]) ? 'D' : 'U');
			} else if(value[1] !== next[1]) {
				chars.push((next[1] > value[1]) ? 'R' : 'L');
			}
		});
		
		return this.shorthandChars(chars);
	}
	
	shorthandChars(chars)
	{
		let str = '';
		let counter = 1;
		chars.forEach((char, key) => {
			let next = (typeof chars[key+1] !== 'undefined') ? chars[key+1] : null;

			if(next === char) {
				counter++;
			} else {
				str += counter + char;
				counter = 1;
			}
		});

		return str;
	}
}

module.exports = MazeSolver;