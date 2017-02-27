const Node = require('../src/Node');

describe('Node', function() {
    let end = new Node({x: 0, y: 0}, true); 

    it('Sets nodes heuristic value correctly', function() {
        let node = new Node({x: 4, y: 10}, true, end);

        expect(node.h).toEqual(14);
    });

    it('Can get nodes f values correctly', function() {
        let node = new Node({x: 4, y: 10}, true, end);

        expect(node.f).toEqual(15);
    });

    it('Can set nodes parent correctly', function() {
        let node1 = new Node({x: 4, y: 10}, true, end);
        let node2 = new Node({x: 4, y: 10}, true, end);

        node2.parent = node1;

        expect(node2.g).toEqual(2);
        expect(node2.parentNode).toEqual(node1);
    });

    it('Can clean a node correctly', function() {
        let node1 = new Node({x: 4, y: 10, g: 100}, true, end);
        let node2 = new Node({x: 4, y: 10}, true, end);

        node2.parent = node1;
        node2.clean();
        
        expect(node2.parentNode).toBe(null);
        expect(node2.g).toEqual(1);
    });
});