const MazeSolver = require('../src/MazeSolver');
const Wayfinder = require('../src/Wayfinder');
const Node = require('../src/Node');

describe('Wayfinder', function() {
    let solver;

    beforeEach(function() {
        solver = new MazeSolver('test-data.jasmine.txt', [0, 0]);
    });

    it('Gets neighboring nodes correctly', function(done) {
        solver.parseData(function() {
            let start = new Node({x: 2, y: 2, g: 0}, true, this.target);

            let wayfinder = new Wayfinder(this.matrix, this.totalPassableNodes);
            let nodes = wayfinder.getNeighboringNodes(start);

            let parent = new Node({x: 2, y: 2, g: 0}, true, this.target);

            let node1 = new Node({x: 1, y: 2}, true, this.target);
            node1.parentNode = parent;
            expect(nodes[0]).toEqual(node1);

            let node2 = new Node({x: 3, y: 2}, true, this.target);
            node2.parentNode = parent;
            expect(nodes[1]).toEqual(node2);

            let node3 = new Node({x: 2, y: 1}, true, this.target);
            node3.parentNode = parent;
            expect(nodes[2]).toEqual(node3);

            done();
        });
    });

    it('Gets correct path', function(done) {
        solver.parseData(function() {
            let start = new Node({x: 2, y: 2, g: 0}, true, this.target);

            let wayfinder = new Wayfinder(this.matrix, this.totalPassableNodes);
            let path = wayfinder.run(start);

            expect(path).toEqual([
                [2, 2],
                [1, 2],
                [0, 2],
                [0, 1],
                [0, 0]
            ]);
            
            done();
        });
    });
});