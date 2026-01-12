// PSEUDOCODE

// IIFE Function gameboard (module pattern)
    // Pass in: n/a
    // Create a single instance of an object to represent the gameboard, whose properties are:
        // ✓ the grid itself, a 2D array with 3 rows and 3 columns
        // ✓ a function that reads (gets) the value of the specific space passed to it (parameters are the row and col indices)
        // ✓ a function that modifies (sets) the value of the space passed to it with a given value (parameters are the row and col indicies and the given value)
    // Pass out: gameboard object
// Endfunction

const gameBoard = (function() {
    const grid = [
        [[], [], []],
        [[], [], []], 
        [[], [], []]
    ];
    const getGridSpaceVal = (rowIndex, colIndex) => grid[rowIndex][colIndex];
    const setGridSpaceVal = (rowIndex, colIndex, gridSpaceVal) => grid[rowIndex][colIndex] = gridSpaceVal;

    return { grid, getGridSpaceVal, setGridSpaceVal };
})()

// Factory Function create player
    // Pass in: name
    // Create an object to represent a player, whose properties are:
        // a name
        // a representing value (0 or a 1)
        // a function that accesses the gameboard object, more specifically any grid space, using indices for its row and col, and modifies its value with the player obj's representing value
    // Pass out: player obj
// Endfunction

function createPlayer(selectedName, selectedMark) {
    const playerName = selectedName;
    const playerMark = selectedMark;

    const setPlayerMark = (rowIndex, colIndex) => gameBoard.setGridSpaceVal(rowIndex, colIndex, playerMark);

    return { playerName, playerMark, setPlayerMark };
}

// console.log(createPlayer("John", 0));
// console.log(gameBoard);

// IIFE Function game logic controller (module pattern)
    // Pass in: n/a
    // ✓ Store the player instances (accessible via closure)
    // Create an object that keeps track of the game flow and logic, whose properties are:
        // ✓ a function to handle turn changes aka designate which player is currently active and which is not
        // ✓ a function to record when a player makes a move (i.e. when a player obj instance calls a method to change a grid space)
        // ✓ a function to determine winning conditions (likely returns a boolean value)
        // ✓ a function to determine tying conditions i.e. gameboard spaces are full but no winning conditions are true
        // ✓ a function to end a game round
        // ✓ a function to begin a new game round (should set the gameboard spaces back to empty rows and cols, delete the player objs?)
    // Pass out: n/a
// Endfunction

const gameLogicController = (function() {
    const beginNewGameRound = () => {
        for (let i = 0; i < gameBoard.grid.length; i++) {    
            gameBoard.grid[i] = [[], [], []];
        }

        const playerOne = (selectedName, selectedMark) => createPlayer(selectedName, selectedMark);
        const playerTwo = (selectedName, selectedMark) => createPlayer(selectedName, selectedMark);
        const players = [playerOne, playerTwo];
        const startingPlayer = players[Math.floor(Math.random() * 2 + 0)];
        
        return { playerOne, playerTwo, players, startingPlayer };
    };

    const getActivePlayer = () => beginNewGameRound.startingPlayer === beginNewGameRound.playerOne ? beginNewGameRound.playerTwo : beginNewGameRound.playerOne;

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

    return { };
})()

 // *** WE ARE HERE!!! ***

// console.log(gameLogicController.checkForAGameWin("vertical"));
// console.log(gameLogicController.checkForAGameWin("horizontal"));
// console.log(gameLogicController.checkForAGameWin("vertical"));
// console.log(gameLogicController.checkForAGameTie());
