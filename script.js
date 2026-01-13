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

// *** WE ARE HERE!!! ***


// Testing/Debugging Process: play a game round!

// Begin a new game round
// Create players

// Determine active player
// Make a mark on the gameboard grid
// Repeat above process until a win or tie is reached