const gameBoard = (function() {
    const grid = [
        [["X"], ["O"], ["O"]],
        [["O"], ["X"], ["X"]], 
        [["O"], [], ["O"]]
    ];
    const getGridSpaceVal = (rowIndex, colIndex) => grid[rowIndex][colIndex];
    const setGridSpaceVal = (rowIndex, colIndex, gridSpaceVal) => grid[rowIndex][colIndex] = gridSpaceVal;

    return { grid, getGridSpaceVal, setGridSpaceVal };
})()

function createPlayer(selectedName, selectedMark) {
    const playerName = selectedName;
    const playerMark = selectedMark;

    const setPlayerMark = (rowIndex, colIndex) => gameBoard.setGridSpaceVal(rowIndex, colIndex, playerMark);

    return { playerName, playerMark, setPlayerMark };
}

const gameLogicController = (function() {
    const beginNewGameRound = () => {
        for (let i = 0; i < gameBoard.grid.length; i++) {    
            gameBoard.grid[i] = [[], [], []];
        }
    };

    const createNewPlayers = () => {
        const playerOne = createPlayer(selectedName, selectedMark);
        const playerTwo = createPlayer(selectedName, selectedMark);

        const players = [playerOne, playerTwo];
        const startingPlayer = players[Math.floor(Math.random() * 2 + 0)];

        return { playerOne, playerTwo, players, startingPlayer };
    }

    const getActivePlayer = () => createNewPlayers.startingPlayer === createNewPlayers.playerOne ? createNewPlayers.playerTwo : createNewPlayers.playerOne;

    const makeActivePlayerMove = () => {
        const currentPlayer = getActivePlayer();
        currentPlayer.setPlayerMark();
    };

    // call w/ horizontal parameter first, then w/ vertical if a winner hasn't been found
    const checkForAGameWin = (loopDirection) => {
        let consecutiveMarks = [];
        let isThereAGameWin = false;

        // straight win check
        for (let outerLoopIndex = 0; outerLoopIndex < gameBoard.grid.length; outerLoopIndex++) {    
            for (let innerLoopIndex = 0; innerLoopIndex < gameBoard.grid[outerLoopIndex].length; innerLoopIndex++) {
                if (loopDirection === "horizontal") {
                    consecutiveMarks.push(...gameBoard.getGridSpaceVal(outerLoopIndex, innerLoopIndex));
                } else if (loopDirection === "vertical") {
                    consecutiveMarks.push(...gameBoard.getGridSpaceVal(innerLoopIndex, outerLoopIndex));
                }
            }

            if (consecutiveMarks.every((mark) => mark === getActivePlayer().playerMark)) {
            // if (consecutiveMarks.every((mark) => mark === 1)) {
                isThereAGameWin = true;
                console.log(`Player ${getActivePlayer()} has won!`);
                // console.log("A winner!");
                return isThereAGameWin;
            } else {
                consecutiveMarks = [];
                continue;
            }

            // console.log(consecutiveMarks);
        };

        // diagonal win check
        if (isThereAGameWin === false) {
            consecutiveMarks.push(...gameBoard.getGridSpaceVal(0, 0));
            consecutiveMarks.push(...gameBoard.getGridSpaceVal(1, 1));
            consecutiveMarks.push(...gameBoard.getGridSpaceVal(2, 2));

            if (consecutiveMarks.every((mark) => mark === getActivePlayer().playerMark)) {
            // if (consecutiveMarks.every((mark) => mark === 1)) {
                isThereAGameWin = true;
                console.log(`Player ${getActivePlayer()} has won!`);
                return isThereAGameWin;
                // console.log("A winner!");
                // return isThereAGameWin;
            } else {
                consecutiveMarks = [];
                consecutiveMarks.push(...gameBoard.getGridSpaceVal(0, 2));
                consecutiveMarks.push(...gameBoard.getGridSpaceVal(1, 1));
                consecutiveMarks.push(...gameBoard.getGridSpaceVal(2, 0));

                if (consecutiveMarks.every((mark) => mark === getActivePlayer().playerMark)) {
                // if (consecutiveMarks.every((mark) => mark === 1)) {
                    isThereAGameWin = true;
                    console.log(`Player ${getActivePlayer()} has won!`);
                    return isThereAGameWin;
                    // console.log("A winner!");
                    // return isThereAGameWin;
                } else {
                    return isThereAGameWin;
                }
            }
        }
    };

    const checkForAGameTie = () => {
        let isThereAGameTie = false;
        const currentGridValues = [];

        for (let outerLoopIndex = 0; outerLoopIndex < gameBoard.grid.length; outerLoopIndex++) {    
            for (let innerLoopIndex = 0; innerLoopIndex < gameBoard.grid[outerLoopIndex].length; innerLoopIndex++) {
                currentGridValues.push(...gameBoard.getGridSpaceVal(outerLoopIndex, innerLoopIndex));
            }
        }

        if (currentGridValues.length === 9 && checkForAGameWin("horizontal") === false && checkForAGameWin("vertical") === false) {
            console.log("It's a tie! Neither player wins!");
            isThereAGameTie = true;
            return isThereAGameTie;
        } else {
            return isThereAGameTie;
        }
    };

    const endGameRound = () => {
        return `Tic-tac-tover! ${getActivePlayer()} wins the round!`;
    };

    return { 
        beginNewGameRound,
        createNewPlayers,
        getActivePlayer,
        makeActivePlayerMove,
        checkForAGameWin,
        checkForAGameTie,
        endGameRound,
    };
})()


// pseudocode!!
// write the functions in the gameDisplayController IIFE that allow players to add marks to a specific gameboard grid space by interacting with the right DOM element
    // NOTE: might need to update some of our function bodies and variable placement in the gameLogicController, since we're taking dynamic input

// we'll need to create a function inside gameDisplayController, in which we:
    // access and store the respective DOM elements (get their values using a form with the default behaviour prevented + prevent submission and prompt the user to pick a different value if the two mark inputs are the same...do while loop, maybe)
    // call the createPlayer function to make players (include it in the callback function for the play button's event listener to pass it the info of the form, below the beginNewGameRound function call)
    // disable the button and grey it out, as well as the player creation form inputs
    // test if setting the active player works (do it manually for now)
// then we:
    // set an event listener on the gameBoardGridArea to use event bubbling so a listener is set on all its children (aka the gameboard spaces)
    // we pass it a callback function, in which we:
        // get the row and column attributes of the target from the event (ought to be a click)
        // check if the target's textContent is already occupied; if so then simply return, else set the target's textContent to the active player's mark, update the gameboard grid space, and check for a win and tie
        // if a tie or win is found, then end the game round and enable the play button + form inputs again, allowing the process to repeat upon a click

const gameDisplayController = (function() {
    const gameBoardGridArea = document.querySelector("#gameboard-grid-area");

    const createAndRenderGameBoard = () => {
        for (let outerLoopIndex = 0; outerLoopIndex < gameBoard.grid.length; outerLoopIndex++) {    
            for (let innerLoopIndex = 0; innerLoopIndex < gameBoard.grid[outerLoopIndex].length; innerLoopIndex++) {
                const gridSpaceSquare = document.createElement("div");

                gridSpaceSquare.setAttribute("row", outerLoopIndex);
                gridSpaceSquare.setAttribute("column", innerLoopIndex);

                gridSpaceSquare.textContent = gameBoard.grid[outerLoopIndex][innerLoopIndex].length === 0 ? "" : gameBoard.grid[outerLoopIndex][innerLoopIndex];
                gameBoardGridArea.append(gridSpaceSquare);

                // this is just to see the divs, delete later
                // gridSpaceSquare.style.backgroundColor = "blue";
                // gridSpaceSquare.style.height = "100px";
                // gridSpaceSquare.style.width = "100px";
            }
        }
    }

    // *** WE ARE HERE!!! ***

    return { createAndRenderGameBoard }
})()

// gameDisplayController.createAndRenderGameBoard();

// Testing/Debugging Process: play a game round!

// Begin a new game round
// Create players

// Determine active player
// Make a mark on the gameboard grid
// Repeat above process until a win or tie is reached