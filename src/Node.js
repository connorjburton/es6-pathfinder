class Node {
	constructor(vals, passable, end)
	{
		this.passable = passable;
		this.x = vals.x; // horizontal value
		this.y = vals.y; // vertical value
		this.h = (end instanceof Node && passable) ? Math.abs(vals.x - end.x) + Math.abs(vals.y - end.y) : 0; // heuristic value
		this.g = (typeof vals.g !== 'undefined') ? vals.g : 1; // movement cost value
		this.target = (end instanceof Node && (end.x === vals.x && end.y === vals.y)); // is the target node
		this.parentNode = null; // node parent
	}
	
	clean()
	{
		if(this.g) this.g = 1;
		this.parentNode = null;
		
		return this;
	}
	
	get f()
	{
		return this.g + this.h;
	}
	
	set parent(node)
	{
		if(node) this.g += node.g; // increase movement cost when we assign a parent
		this.parentNode = node;
	}
}

module.exports = Node;