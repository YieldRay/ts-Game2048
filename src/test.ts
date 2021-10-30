import { Game2048 } from "./Game2048.js";
let test = new Game2048();
const example = [
    [4, 4, 2, 2],
    [2, 2, 2, 0],
    [2, 0, 4, 0],
    [2, 8, 0, 2],
];
const blank = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];
test.importChessBoard(example).fillRandom().show();
