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
        // a function to determine winning conditions (likely returns a boolean value)
        // a function to determine tying conditions i.e. gameboard spaces are full but no winning conditions are true
        // a function to designate a player as a winner (need to examine gameboard obj's rows and cols, probably with a loop, and check for which player the 3 straight values belong to)
        // a function to end a game round
        // a function to begin a new game round (should set the gameboard spaces back to empty rows and cols, delete the player objs?)
    // Pass out: n/a
// Endfunction

const gameLogicController = (function() {
    const playerOne = (selectedName, selectedMark) => createPlayer(selectedName, selectedMark);
    const playerTwo = (selectedName, selectedMark) => createPlayer(selectedName, selectedMark);

    const setActivePlayer = (firstPlayer, secondPlayer) => {
        const players = [firstPlayer, secondPlayer];
        const randomIndex = Math.floor(Math.random() * 2 + 0);
        const startingPlayer = players[randomIndex];
        const activePlayer = startingPlayer === firstPlayer ? secondPlayer : firstPlayer;
        
        return activePlayer;
    };

    const makeActivePlayerMove = () => {
        const currentPlayer = setActivePlayer(playerOne, playerTwo);
        currentPlayer.setPlayerMark();
    };

    // *** WE ARE HERE!!! ***
    // loop through the gameboard grid and check the values of each space
    // store the loop in a function that takes two parameters, rows and cols, which can then be assigned as the values for the outer and inner loop
    // this way the loops don't have to be fully written out twice; just call the function
        // loop over rows (outer) and cols (inner), then cols (outer) and rows inner
        // for each outer loop, add the inner loop's mark values to an array and check if a win (every val is the same) is found
        // if so, exit, else keep going
    const checkWinningConditions = () => {
        let consecutiveMarks = [];

        const loopOverGameBoardGrid = (loopDirection) => {
            for (let outerLoopIndex = 0; outerLoopIndex < gameBoard.grid.length; outerLoopIndex++) {    
                for (let innerLoopIndex = 0; innerLoopIndex < gameBoard.grid[outerLoopIndex].length; innerLoopIndex++) {
                    if (loopDirection === "horizontal") {
                        consecutiveMarks.push(gameBoard.getGridSpaceVal(outerLoopIndex, innerLoopIndex));
                    } else if (loopDirection === "vertical") {
                        consecutiveMarks.push(gameBoard.getGridSpaceVal(innerLoopIndex, outerLoopIndex));
                    }
                }
                if (consecutiveMarks.every((mark) => mark === setActivePlayer(playerOne, playerTwo))) {
                    return `Player ${setActivePlayer(playerOne, playerTwo)} has won!`;
                } else {
                    consecutiveMarks = [];
                }
            };
        }

        return { loopOverGameBoardGrid };
    };

    // if an active player's mark appears in a subsequent row or diagonal, then designate the player as a winner (call this inside checkWinningConditions())
    const declareGameWinner = () => {};

    // return { checkWinningConditions };
})()

// console.log(gameLogicController.checkWinningConditions());