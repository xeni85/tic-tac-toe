'use strict';
// create player
function Player(name, symbol) {
    return {
        name,
        symbol
    };
}

// display controller
const displayController = (() => {
    const spaces = document.querySelector("#display").querySelectorAll("div");

    const startGame = (player1, player2) => {
        console.log("Game starting!");
        document.querySelector(
            "header"
        ).textContent = `${player1.name} (${player1.symbol}) vs. ${player2.name} (${player2.symbol})`;
        document.querySelector("#start-btn").classList.add("hide");
        document.querySelector("header").style.marginLeft = "0";
    };

    const updateDisplay = (board) => {
        spaces.forEach((element, i) => {
            element.textContent = board[i];
            element.classList.remove("hover");
        });
    };

    const hoverOver = (element, space, player) => {
        if (element.textContent === "") {
            element.classList.add("hover");
            element.textContent = player.symbol;
        }
    };

    const unhoverOver = (element, space) => {
        if (element.classList.contains("hover")) {
            element.classList.remove("hover");
            element.textContent = "";
        }
    };

    const winDisplay = (winner) => {
        const text = document.querySelector("#result");
        if (winner !== false) {
            text.textContent = `${winner.name} won!`;
        } else {
            text.textContent = `Draw!`;
        }
    };

    return {
        spaces,
        startGame,
        updateDisplay,
        winDisplay,
        hoverOver,
        unhoverOver,
    };
})();

// game logic
const game = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = false; //The current player playing

    let player1 = false;
    let player2 = false;

    const startBtn = document.querySelector("#start-btn");

    const startGame = () => {
        let p1Name = document.querySelector("#p1-input").value;
        let p2Name = document.querySelector("#p2-input").value;
        if (p1Name === "") {
            p1Name = document.querySelector("#p1-input").placeholder;
        }
        if (p2Name === "") {
            p2Name = document.querySelector("#p2-input").placeholder;
        }
        player1 = Player(p1Name, "X");
        player2 = Player(p2Name, "O");
        currentPlayer = player1;
        displayController.startGame(player1, player2);
    };

    const checkWinner = () => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        // If any of the conditions are true, stop the game and announce the winner
        if (
            winConditions.some((array) => {
                let winCheck = [];
                array.forEach((box) => {
                    if (board[box] !== "") {
                        winCheck.push(board[box]);
                    }
                });
                if (winCheck.length == 3) {
                    if (
                        winCheck.every((square) => {
                            return square == "X";
                        })
                    ) {
                        displayController.winDisplay(player1);
                        return true;
                    } else if (
                        winCheck.every((square) => {
                            return square == "O";
                        })
                    ) {
                        displayController.winDisplay(player2);
                        return true;
                    } else {
                        return false;
                    }
                }
            })
        ) {
            return true;
            // If the board has 9 marks without a winner, it's a tie
        } else if (
            board.filter((square) => {
                return square !== "";
            }).length == 9
        ) {
            displayController.winDisplay();
            return true;
        } else return false;
    };

    const playerHover = (element, space) => {
        if (currentPlayer !== false && player1 !== false && player2 !== false) {
            displayController.hoverOver(element, space, currentPlayer);
        }
    };
    const playerUnhover = (element, space) => {
        if (currentPlayer !== false && player1 !== false && player2 !== false) {
            displayController.unhoverOver(element, space, currentPlayer);
        }
    };

    const playerSelection = (space) => {
        if (
            currentPlayer !== false &&
            player1 !== false &&
            player2 !== false &&
            board[space] === ""
        ) {
            board[space] = currentPlayer.symbol;
            displayController.updateDisplay(board);
            const winner = checkWinner();
            if (winner == true) {
                player1 = false;
            }
            console.log("Next player's turn!");
            currentPlayer === player1 ?
                (currentPlayer = player2) :
                (currentPlayer = player1);
        }
    };

    displayController.spaces.forEach((element, i) => {
        element.addEventListener("click", playerSelection.bind(null, i));
        element.addEventListener(
            "mouseover",
            playerHover.bind(null, element, i, board, currentPlayer)
        );
        element.addEventListener(
            "mouseout",
            playerUnhover.bind(null, element, i, board)
        );
    });

    startBtn.addEventListener("click", startGame);

    return {
        board,
    };
})();