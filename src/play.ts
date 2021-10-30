import { Game2048 } from "./Game2048.js";
const clear = () =>
    process.stdout.write(
        process.platform === "win32" ? "\x1Bc" : "\x1B[2J\x1B[3J\x1B[H"
    );

const gameString = {
    logo({
        l1 = "",
        l2 = "",
        l3 = "",
        l4 = "",
        l5 = "",
        l6 = "",
    } = {}): string {
        return `
    ██████╗  ██████╗ ██╗  ██╗ █████╗ ${l1}
    ╚════██╗██╔═████╗██║  ██║██╔══██╗${l2}
     █████╔╝██║██╔██║███████║╚█████╔╝${l3}
    ██╔═══╝ ████╔╝██║╚════██║██╔══██╗${l4}
    ███████╗╚██████╔╝     ██║╚█████╔╝${l5}
    ╚══════╝ ╚═════╝      ╚═╝ ╚════╝ ${l6}
    `;
    },
    help(add = ""): string {
        return ` [w]up  [s]down  [a]left  [d]down  [r]reset  [q]quit  ${add}\n`;
    },
};

process.stdout.write(gameString.logo({ l3: "    in command line" }));
console.log("\x1b[35m%s\x1b[0m", "       Enter [e] To Start.");
const state = {
    isStarted: false,
    game: new Game2048(),
    quit(msg: string = "") {
        console.log("\x1b[33m%s\x1b[0m", msg); //yellow
        process.exit();
    },
};
process.stdin.on("data", (data) => {
    let input = data.toString().replace(/\r\n|\r|\n/g, "");
    if (input !== "e" && !state.isStarted) return;
    switch (input) {
        case "e":
            if (state.isStarted) {
                clear();
                process.stdout.write(
                    gameString.logo({
                        l3: "Your Score:",
                        l4: `${state.game.getScore()}`,
                    }) +
                        "\n" +
                        gameString.help() +
                        "\n"
                );
                state.game.show();
                console.log(
                    "\x1b[40m \x1b[31m %s \x1b[0m",
                    "[2048] The game is running, do you mean reset?  Press [r] to reset"
                );
                return;
            }
            state.isStarted = true;
            state.game = new Game2048().resetChessboard();
            break;
        case "w":
            state.game.upShift();
            break;
        case "a":
            state.game.leftShift();
            break;
        case "s":
            state.game.downShift();
            break;
        case "d":
            state.game.rightShift();
            break;
        case "r":
            state.game.resetChessboard();
            break;
        case "q":
            state.quit(`[2048] Your score: ${state.game.getScore()}`);
            break;
        default:
            clear();
            process.stdout.write(
                gameString.logo() + "\n" + gameString.help() + "\n"
            );
            state.game.show();
            console.log(
                "\x1b[40m \x1b[31m %s \x1b[0m",
                "[2048] Undefined command"
            );
            return;
    }
    clear();
    clear();
    process.stdout.write(
        gameString.logo({
            l3: "    Your Score:",
            l4: (" ".repeat(16) + `${state.game.getScore()}`).slice(-12),
        }) +
            "\n" +
            gameString.help() +
            "\n"
    );
    state.game.fillRandom().show();
});
