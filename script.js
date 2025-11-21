// PSEUDOCODE

// IIFE Function gameboard (module pattern)
    // Pass in: n/a
    // Create a single instance of an object to represent the gameboard, whose properties are:
        // ✓ the grid itself, a 2D array with 3 rows and 3 columns
        // a function that reads (gets) the values of the entire gameboard (likely use a nested loop over the rows and cols)
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
        // ✓ a function to record when a player makes a move (i.e. when a player obj instance calls a method to change a grid space), where the player made it (get the gameboard obj space indices from the move), and which player made the move (get player obj instance's name and value)
        // a function to handle turn changes aka designate which player is currently active and which is not
        // a function to determine winning conditions (likely returns a boolean value)
        // a function to determine tying conditions i.e. gameboard spaces are full but no winning conditions are true
        // a function to designate a player as a winner (need to examine gameboard obj's rows and cols, probably with a loop, and check for which player the 3 straight values belong to)
        // a function to end a game round
        // a function to begin a new game round (should set the gameboard spaces back to empty rows and cols, delete the player objs?)
    // Pass out: n/a
// Endfunction

const gameLogicController = (function() {
    const playerOne = createPlayer();
    const playerTwo = createPlayer();

    // need to figure out how to designate the current player whose turn it is to make a move, we can then pass this returned value to makeCurrentPlayerMove

    const makeCurrentPlayerMove = (currentPlayer) => currentPlayer.setPlayerMark();

})()