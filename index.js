const MazeSolver = require('./src/MazeSolver');

let solver = new MazeSolver('test-data.txt', [0, 0]);
solver.solve();