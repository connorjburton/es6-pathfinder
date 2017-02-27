class Wayfinder {
	constructor(matrix)
	{
		/**
		I wanted originally to be able to clone the matrix and pass in a clean version,
		however as the matrix contains Node's and those nodes are the same no matter how many
		times you clone `matrix` I am cleaning them manually here

		I guess you could clone every node in a cloned matrix? Needs investigating
		**/

		let passable = 0;
		matrix = matrix.map((row) => row.map((node) => {
			if(node.passable) passable++;
			return node.clean();
		}));

		this.open = [];
		this.closed = [];
		this.matrix = matrix;
		this.totalPassableNodes = passable;
	}

	run(current)
	{
		while(this.totalPassableNodes !== this.closed.length) {
			this.closed.push(current);

			let neighbors = this.getNeighboringNodes(current);
			let target = this.hasTarget(neighbors);
			if(target) return this.getPath(target); // we have the target so return the path

			if(neighbors.length) { // we only need to re-sort if open list has changed
				// add neighbors to open list and sort them by f value (g+h)
				this.open = this.open.concat(neighbors).sort((a, b) => {
					return (a.f < b.f) ? -1 : 1;
				});
			}

			// set the current node to the neighbor with the lowest f value
			current = this.open.shift();
		}

		return false; // we ran out of nodes so return false
	}

	getNeighboringNodes(node)
	{
		let arr = [];
		let x = node.x;
		let y = node.y;
		let neighbors = [
			{
				coords: [y, x - 1],
				comparison: () => { return (x > 0); }
			},
			{
				coords: [y, x + 1],
				comparison: () => { return (x < this.matrix[0].length - 1); }
			},
			{
				coords: [y - 1, x],
				comparison: () => { return (y > 0); }
			},
			{
				coords: [y + 1, x],
				comparison: () => { return (y < this.matrix.length - 1); }
			}
		];

		//loop over each possible neighbor
		neighbors.forEach((neighbor) => {
			if(!neighbor.comparison()) return; //check if there can be a node there
			let neighborNode = this.matrix[neighbor.coords[0]][neighbor.coords[1]]; // get the neighbor
			
			if(neighborNode.passable && !this.inClosedList(neighborNode)) { // check it's passable and not in closed list
				neighborNode.parent = node;
				arr.push(neighborNode);
			}
		});

		return arr;
	}

	hasTarget(nodes)
	{
		//check to see if we have the target yet
		let target = nodes.find((value) => {
			return value.target;
		});

		return (typeof target !== 'undefined') ? target : false
	}

	inClosedList(node)
	{
		return this.closed.find((closedNode) => {
			return node.x === closedNode.x && node.y === closedNode.y;
		});
	}
	
	getPath(node)
	{
		let path = [];
		while(node.parentNode) {
			path.push([node.y, node.x]);
			node = node.parentNode;
		}
		path.push([node.y, node.x]); //first node doesn't have a parent so doesn't fall into above while loop

		return path.reverse(); //reverse the path to get entry - exit order
	}
}

module.exports = Wayfinder;