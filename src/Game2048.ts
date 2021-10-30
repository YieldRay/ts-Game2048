interface mergeObject {
    array: number[];
    score: number;
}
class Game2048 {
    private chessboard: number[][];
    private score: number = 0;
    // chessboard[row][col]
    private row: number;
    private col: number;

    constructor(row = 4, col = 4) {
        this.chessboard = [];
        this.chessboard.length = row;
        this.row = row;
        this.col = col;
        if (row < 3 || col < 3) throw new Error("At least give 3 row and col");
        for (let i = 0; i < row; i++) {
            this.chessboard[i] = (new Array(col) as number[]).fill(0);
        }
    }

    resetChessboard(): Game2048 {
        for (let i = 0; i < this.row; i++) {
            this.chessboard[i] = (new Array(this.col) as number[]).fill(0);
        }
        return this;
    }

    importChessBoard(arr: number[][]): Game2048 {
        if (arr.length != this.row) throw new Error("Row does not match");
        arr.forEach((col) => {
            if (col.length != this.col) throw new Error("Row does not match");
            col.forEach((e) => {
                if (!Game2048.isTowPower(e))
                    throw new Error("Imported chessboard has error");
            });
        });

        this.chessboard = arr;
        return this;
    }

    fillRandom(): Game2048 {
        Game2048.fillRand(this.chessboard, true); // this func has a return value, indicating whether chessboard is able to be filled
        return this;
    }

    /**
     * @description check the source array
     * @param arr Source Array
     * @returns boolean, wether the array is regular (number[x][y])
     */
    static chessboardCheck(arr: number[][]): boolean {
        const len = arr[0].length;
        let is = true;
        arr.forEach((e) => (e.length !== len ? (is = false) : ""));
        return is;
    }

    static random2or4(): 2 | 4 {
        return Math.random() < 0.25 ? 4 : 2;
    }

    /**
     * @description randomly fill 2|4 in source array
     * @param arr Source Array
     * @param isSkipCheck Whether skip additional check for source array
     * @returns boolean, whether there is a blank(zero) to fill
     */
    static fillRand(arr: number[][], isSkipCheck: boolean = false): boolean {
        if (!isSkipCheck && !this.chessboardCheck(arr))
            throw new Error("Inputed array is not assignable to a chessboard");
        let zeroAmount = 0;
        arr.forEach((r) => r.forEach((c) => (c == 0 ? zeroAmount++ : "")));
        if (zeroAmount == 0) return false;
        const rand: number = Number((Math.random() * zeroAmount).toFixed(0));
        let next = 0;
        arr.forEach((r) => {
            for (let i = 0; i < r.length; i++) {
                if (r[i] !== 0) continue;
                // r[i] is zero
                if (++next == rand) {
                    r[i] = Game2048.random2or4();
                    return;
                }
            }
        });
        return true;
    }

    /**
     *
     * @param n
     * @returns whether n is pow(2, anyInt)
     */
    static isTowPower(n: number): boolean {
        let x: number;
        try {
            x = Number(BigInt(Math.log2(n)));
        } catch {
            return false;
        }
        return true;
    }

    /**
     *
     * @param arr right merge the array
     * @returns {array: the modified array, score: the score got from this proccess}
     */
    static rightMerge(arr: number[]): mergeObject {
        let score = 0;
        let initialLength = arr.length;
        let line = copy(arr.filter((e) => e !== 0));
        for (let x = line.length - 1; x >= 1 && line[x] > 0; x--) {
            if (line[x] && line[x] == line[x - 1]) {
                line[x] *= 2;
                score += line[x];
                line[x - 1] = 0;
                x--; //skip next unnecessary check
            }
        }
        line = line.filter((e) => e !== 0);
        return {
            array: new Array(initialLength - line.length)
                .fill(0)
                .concat(...line),
            score,
        };
    }

    /**
     *
     * @param arr left merge the array
     * @returns {array: the modified array, score: the score got from this proccess}
     */
    static leftMerge(arr: number[]): mergeObject {
        let score = 0;
        let initialLength = arr.length;
        let line = copy(arr.filter((e) => e !== 0));
        for (let x = 0; x < line.length && line[x] > 0; x++) {
            if (line[x] && line[x] == line[x + 1]) {
                line[x] *= 2;
                score += line[x];
                line[x + 1] = 0;
                x++; //skip next unnecessary check
            }
        }
        line = line.filter((e) => e !== 0);
        return {
            array: line.concat(
                ...new Array(initialLength - line.length).fill(0)
            ),
            score,
        };
    }

    rightShift(): Game2048 {
        // KEEP IN MIND THAT THIS STEP DOES NOT INCLUDE NUMBER GENERATE!!!
        for (let i = 0; i < this.row; i++) {
            const { array, score } = Game2048.rightMerge(this.chessboard[i]);
            this.chessboard[i] = array;
            this.score += score;
        }
        return this;
    }

    leftShift(): Game2048 {
        // KEEP IN MIND THAT THIS STEP DOES NOT INCLUDE NUMBER GENERATE!!!
        for (let i = 0; i < this.row; i++) {
            const { array, score } = Game2048.leftMerge(this.chessboard[i]);
            this.chessboard[i] = array;
            this.score += score;
        }
        return this;
    }

    upShift(): Game2048 {
        for (let i = 0; i < this.col; i++) {
            let column: number[] = new Array(this.row).fill(0);
            for (let j = 0; j < this.row; j++) {
                column[j] = this.chessboard[j][i];
            }
            const { array, score } = Game2048.leftMerge(column);
            column = array;
            this.score += score;
            for (let j = 0; j < this.row; j++) {
                this.chessboard[j][i] = column[j];
            }
        }
        return this;
    }

    downShift(): Game2048 {
        for (let i = 0; i < this.col; i++) {
            let column: number[] = new Array(this.row).fill(0);
            for (let j = 0; j < this.row; j++) {
                column[j] = this.chessboard[j][i];
            }
            const { score, array } = Game2048.rightMerge(column);
            column = array;
            this.score += score;
            for (let j = 0; j < this.row; j++) {
                this.chessboard[j][i] = column[j];
            }
        }
        return this;
    }

    getCopy(): number[][] {
        return copy(this.chessboard);
    }

    getScore(): number {
        return this.score;
    }

    show(): void {
        let out = "";
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                out += (" ".repeat(5) + this.chessboard[i][j].toString()).slice(
                    -5
                );
            }
            out += "\n\n";
        }
        console.log(out);
    }

    // util func

    protected loopTimes(n: number): number {
        return Math.floor(Math.sqrt(n));
    }

    /**
     * @description swap two elements of the chessboard by position
     * @param pos1 [x, y] chessboard[x][y]
     * @param pos2 [x, y] chessboard[x][y]
     */
    protected swap(pos1: [number, number], pos2: [number, number]): void {
        [this.chessboard[pos1[0]][pos1[1]], this.chessboard[pos2[0]][pos2[1]]] =
            [
                this.chessboard[pos2[0]][pos2[1]],
                this.chessboard[pos1[0]][pos1[1]],
            ];
    }
}

// global util func
function copy<T>(s: T): T {
    return JSON.parse(JSON.stringify(s));
}

function arrayRemove(arr: any[], index: number): any[] {
    arr.splice(index, 1);
    return arr;
}

// end of declare
export { Game2048 };
