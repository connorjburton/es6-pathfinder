const MazeSolver = require('../src/MazeSolver');
const Wayfinder = require('../src/Wayfinder');
const Node = require('../src/Node');

describe('MazeSolver', function() {
    let solver;

    beforeEach(function() {
        solver = new MazeSolver('test-data.jasmine.txt', [0, 0]);
    });

    it('Parses the data correctly', function(done) {
    	solver.parseData(function() {
            //ensure starting nodes are as they should be
			expect(this.starting[0]).toEqual(new Node({x: 6, y: 0, g: 0}, true, this.target));
            expect(this.starting[1]).toEqual(new Node({x: 0, y: 4, g: 0}, true, this.target));
            expect(this.starting[2]).toEqual(new Node({x: 6, y: 4, g: 0}, true, this.target));

            //ensure parsed data (rows & columns) is correct length based on meta data
            expect(this.matrix[0].length).toEqual(this.meta[0]);
            expect(this.matrix.length).toEqual(this.meta[1]);

    		done();
    	});
    });

    it('Formats results correctly', function(done) {
        solver.parseData(function() {
            let start = new Node({x: 6, y: 0, g: 0}, true, this.target);

            let wayfinder = new Wayfinder(this.matrix, this.totalPassableNodes);
            let results = wayfinder.run(start);

            expect(this.formatResult(results)).toEqual('2D4L2U2L');

            done();
        });        
    });
});
