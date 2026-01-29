const gameBoard = (function() {
    // create and return an obj with a 2D array and methods to interact with the grid
    const grid = [
        [[], [], []],
        [[], ["X"], []], 
        [[], [], []]
    ];
    const getGridSpaceVal = (rowIndex, colIndex) => grid[rowIndex][colIndex];
    const setGridSpaceVal = (rowIndex, colIndex, gridSpaceVal) => grid[rowIndex][colIndex] = [gridSpaceVal];

    return { grid, getGridSpaceVal, setGridSpaceVal };
})()

const gameLogicController = (function() {
    // clears the game board grid by resetting it to an empty 2D array
    const clearGameBoardGrid = () => {
        for (let i = 0; i < gameBoard.grid.length; i++) {    
            gameBoard.grid[i] = [[], [], []];
        }
    };
    // creates a new player obj with a name, mark, and method to add a mark to the game board grid
    const createNewPlayer = (selectedName, selectedMark) => {
        const playerName = selectedName;
        const playerMark = selectedMark;

        const setPlayerMark = (rowIndex, colIndex, playerMark) => gameBoard.setGridSpaceVal(rowIndex, colIndex, playerMark);

        return { playerName, playerMark, setPlayerMark };
    }
    // randomly picks the starting player
    const setStartingPlayer = (firstPlayer, secondPlayer) => {
        const players = [firstPlayer, secondPlayer];
        const randomIndex = Math.floor(Math.random() * 2);
        const startingPlayer = players[randomIndex];
        // should convey at start of game who's the starting player, and during turns, whose turn it is
        return startingPlayer;
    }
    // determines the active player by checking whose turn it is via the starting player and the turn number (even or odd) thereafter
    const getActivePlayer = (firstPlayer, secondPlayer, startingPlayer) => {
        let currentTurnNum = 1;

        for (let outerLoopIndex = 0; outerLoopIndex < gameBoard.grid.length; outerLoopIndex++) {    
            for (let innerLoopIndex = 0; innerLoopIndex < gameBoard.grid[outerLoopIndex].length; innerLoopIndex++) {
                if (gameBoard.grid[outerLoopIndex][innerLoopIndex].length !== 0) {
                    currentTurnNum += 1;
                } else {
                    continue;
                }
            }
        }

        if (currentTurnNum === 1) {
            return startingPlayer;
            // console.log(startingPlayer);
        } else {
            const nonStartingPlayer = startingPlayer === firstPlayer ? secondPlayer : firstPlayer;
            return currentTurnNum % 2 === 0 ? nonStartingPlayer : startingPlayer;
            // currentTurnNum % 2 === 0 ? console.log(nonStartingPlayer) : console.log(startingPlayer);
        }        
    };
    // adds the mark of the active player to the game board grid
    const setActivePlayerMark = (firstPlayer, secondPlayer, startingPlayer, rowIndex, colIndex) => {
        const currentPlayer = getActivePlayer(firstPlayer, secondPlayer, startingPlayer);
        if (gameBoard.grid[rowIndex][colIndex].length > 0) {
            console.log("Sorry, space is taken!");
            // have a paragraph whose textContent is populated with a message informing the players the space is already taken
        } else {
            currentPlayer.setPlayerMark(rowIndex, colIndex, currentPlayer.playerMark);
        }
    };
    // checks for a game win in four directions: horizontal win, vertical win, and two diagonals
    // call w/ horizontal parameter first, then w/ vertical if a winner hasn't been found
    const checkForAGameWin = (loopDirection, activePlayer) => {
        let consecutiveMarks = [];
        let isThereAGameWin = false;

        // straight win check
        for (let outerLoopIndex = 0; outerLoopIndex < gameBoard.grid.length; outerLoopIndex++) {    
            for (let innerLoopIndex = 0; innerLoopIndex < gameBoard.grid[outerLoopIndex].length; innerLoopIndex++) {
                if (loopDirection === "horizontal") {
                    consecutiveMarks.push((gameBoard.getGridSpaceVal(outerLoopIndex, innerLoopIndex).length === 0 ? null : gameBoard.getGridSpaceVal(outerLoopIndex, innerLoopIndex)[0]));
                } else if (loopDirection === "vertical") {
                    consecutiveMarks.push((gameBoard.getGridSpaceVal(innerLoopIndex, outerLoopIndex).length === 0 ? null : gameBoard.getGridSpaceVal(innerLoopIndex, outerLoopIndex)[0]));
                }
            }

            if (consecutiveMarks.every((mark) => mark === activePlayer.playerMark)) {
                isThereAGameWin = true;
                console.log(`Player ${activePlayer.playerName} has won!`);
                return isThereAGameWin;
            } else {
                consecutiveMarks = [];
                continue;
            }
        };

        // diagonal win check
        if (isThereAGameWin === false) {
            // uppermost left to lowermost right
            consecutiveMarks.push((gameBoard.getGridSpaceVal(0, 0).length === 0 ? null : gameBoard.getGridSpaceVal(0, 0)[0]));
            consecutiveMarks.push((gameBoard.getGridSpaceVal(1, 1).length === 0 ? null : gameBoard.getGridSpaceVal(1, 1)[0]));
            consecutiveMarks.push((gameBoard.getGridSpaceVal(2, 2).length === 0 ? null : gameBoard.getGridSpaceVal(2, 2)[0]));

            if (consecutiveMarks.every((mark) => mark === activePlayer.playerMark)) {
                isThereAGameWin = true;
                console.log(`Player ${activePlayer.playerName} has won!`);
                return isThereAGameWin;
            } else {
                // uppermost right to bottommost left
                consecutiveMarks = [];
                consecutiveMarks.push((gameBoard.getGridSpaceVal(0, 2).length === 0 ? null : gameBoard.getGridSpaceVal(0, 2)[0]));
                consecutiveMarks.push((gameBoard.getGridSpaceVal(1, 1).length === 0 ? null : gameBoard.getGridSpaceVal(1, 1)[0]));
                consecutiveMarks.push((gameBoard.getGridSpaceVal(2, 0).length === 0 ? null : gameBoard.getGridSpaceVal(2, 0)[0]));

                if (consecutiveMarks.every((mark) => mark === activePlayer.playerMark)) {
                    isThereAGameWin = true;
                    console.log(`Player ${activePlayer.playerName} has won!`);
                    // console.log(consecutiveMarks);
                    return isThereAGameWin;
                } else {
                    return isThereAGameWin;
                }
            }
        }
    };
    // checks for a game tie (i.e. filled game board w/o a win)
    const checkForAGameTie = () => {
        let isThereAGameTie = false;
        const currentGridValues = [];

        for (let outerLoopIndex = 0; outerLoopIndex < gameBoard.grid.length; outerLoopIndex++) {    
            for (let innerLoopIndex = 0; innerLoopIndex < gameBoard.grid[outerLoopIndex].length; innerLoopIndex++) {
                currentGridValues.push(...gameBoard.getGridSpaceVal(outerLoopIndex, innerLoopIndex));
            }
        }

        if (currentGridValues.length === 9) {
            console.log("It's a tie! Neither player wins!");
            isThereAGameTie = true;
            return isThereAGameTie;
        } else {
            return isThereAGameTie;
        }
    };
    // declares the winning player
    const announceGameWinner = (activePlayer) => `Tic-tac-tover! ${activePlayer} wins the round!`;

    return { 
        clearGameBoardGrid,
        createNewPlayer,
        setStartingPlayer,
        getActivePlayer,
        setActivePlayerMark,
        checkForAGameWin,
        checkForAGameTie,
        announceGameWinner,
    };
})()

const gameDisplayController = (function() {
    // game board DOM elements
    const gameBoardDisplay = document.querySelector("#game-board-display");
    const gameBoardSpaces = [...document.querySelectorAll(".game-board-space")];

    // console.log(gameBoardSpaces);
    
    // player form controls
    const playerOneNameInput = document.querySelector("#player-one-name");
    // const playerOneMarkInput = document.querySelector("#player-one-mark");
    const playerTwoNameInput = document.querySelector("#player-two-name");
    // const playerTwoMarkInput = document.querySelector("#player-two-mark");
    const playerCreationSubmitBtn = document.querySelector("#submit-btn");
    // variables to store player objects
    let playerOne;
    let playerTwo;
    let startingPlayer;
    let isThereAGameOver;
    
    // renders game board based on 2D array state
    const renderGameBoard = () => {
        for (let outerLoopIndex = 0; outerLoopIndex < gameBoard.grid.length; outerLoopIndex++) {    
            for (let innerLoopIndex = 0; innerLoopIndex < gameBoard.grid[outerLoopIndex].length; innerLoopIndex++) {
                const currentGameBoardSpace = gameBoardSpaces.find((space) => parseInt(space.dataset.row) === outerLoopIndex && parseInt(space.dataset.col) === innerLoopIndex);
                // console.log(currentGameBoardSpace);
                currentGameBoardSpace.textContent = gameBoard.grid[outerLoopIndex][innerLoopIndex][0];
            }
        }
    }    
    
    const createPlayersFromForm = () => {
        const playerOne = gameLogicController.createNewPlayer(playerOneNameInput.value, "X");
        const playerTwo = gameLogicController.createNewPlayer(playerTwoNameInput.value, "O");

        return { playerOne, playerTwo };
    }

    const playAGame = (event) => {
        // determine the active player
        const activePlayer = gameLogicController.getActivePlayer(playerOne, playerTwo, startingPlayer);
        // update the 2D array grid with the active player's mark and set it as the textContent of the click target
        event.target.textContent = gameLogicController.setActivePlayerMark(playerOne, playerTwo, startingPlayer, event.target.dataset.row, event.target.dataset.col);
        // use the state of the 2D array grid to render the game board
        renderGameBoard();
        console.log(gameBoard.grid);
        // check for a win or a tie
        isThereAGameOver = gameLogicController.checkForAGameWin("horizontal", activePlayer);
        if (isThereAGameOver) {
            // announce a win (horizontal)
            gameLogicController.announceGameWinner(activePlayer);
        } else {
            isThereAGameOver = gameLogicController.checkForAGameWin("vertical", activePlayer);
            if (isThereAGameOver) {
                // announce a win (vertical)
                gameLogicController.announceGameWinner(activePlayer);
            } else {
                // check for and announce a tie (no other possibility)
                isThereAGameOver = gameLogicController.checkForAGameTie();
            }
        }
    }

    playerCreationSubmitBtn.addEventListener("click", (event) => {
        event.preventDefault();
        gameLogicController.clearGameBoardGrid();
        playerOne = createPlayersFromForm()["playerOne"];
        playerTwo = createPlayersFromForm()["playerTwo"];
        startingPlayer = gameLogicController.setStartingPlayer(playerOne, playerTwo);
        console.log(playerOne, playerTwo, startingPlayer);
    });

    gameBoardDisplay.addEventListener("click", (event) => playAGame(event))
})()

// 5.0 CHECKLIST
// Allow players to re/start a game via a button <-- CURRENT OBJECTIVE
// Convey necessary info (whose turn it is, who won)