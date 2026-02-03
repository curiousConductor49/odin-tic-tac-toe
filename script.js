const gameBoard = (function() {
    // create and return an obj with a 2D array and methods to interact with the grid
    const grid = [
        [[], [], []],
        [[], [], []], 
        [[], [], []]
    ];
    const getGridSpaceVal = (rowIndex, colIndex) => grid[rowIndex][colIndex];
    const setGridSpaceVal = (rowIndex, colIndex, gridSpaceVal) => grid[rowIndex][colIndex] = [gridSpaceVal];

    return { grid, getGridSpaceVal, setGridSpaceVal };
})()

const gameLogicController = (function() {
    // begins a new game round
    const clearGameState = (playerOneName, playerTwoName, formBtn) => {
        // clears the game board grid by resetting it to an empty 2D array
        for (let i = 0; i < gameBoard.grid.length; i++) {    
            gameBoard.grid[i] = [[], [], []];
        }
        // reset player form inputs
        playerOneName.value = "";
        playerTwoName.value = "";
        // enable player creation form submission
        formBtn.removeAttribute("disabled");
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
        } else {
            const nonStartingPlayer = startingPlayer === firstPlayer ? secondPlayer : firstPlayer;
            return currentTurnNum % 2 === 0 ? nonStartingPlayer : startingPlayer;
        }        
    };
    // adds the mark of the active player to the game board grid
    const setActivePlayerMark = (firstPlayer, secondPlayer, startingPlayer, rowIndex, colIndex) => {
        const currentPlayer = getActivePlayer(firstPlayer, secondPlayer, startingPlayer);
       
        currentPlayer.setPlayerMark(rowIndex, colIndex, currentPlayer.playerMark);
    };
    // checks for a game win in four directions: horizontal win, vertical win, and two diagonals
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
                return isThereAGameWin;
            } else {
                consecutiveMarks = [];
                continue;
            }
        };

        // diagonal win check
        if (isThereAGameWin === false) {
            // uppermost left space to lowermost right space
            consecutiveMarks.push((gameBoard.getGridSpaceVal(0, 0).length === 0 ? null : gameBoard.getGridSpaceVal(0, 0)[0]));
            consecutiveMarks.push((gameBoard.getGridSpaceVal(1, 1).length === 0 ? null : gameBoard.getGridSpaceVal(1, 1)[0]));
            consecutiveMarks.push((gameBoard.getGridSpaceVal(2, 2).length === 0 ? null : gameBoard.getGridSpaceVal(2, 2)[0]));

            if (consecutiveMarks.every((mark) => mark === activePlayer.playerMark)) {
                isThereAGameWin = true;
                return isThereAGameWin;
            } else {
                // uppermost right space to bottommost left space
                consecutiveMarks = [];
                consecutiveMarks.push((gameBoard.getGridSpaceVal(0, 2).length === 0 ? null : gameBoard.getGridSpaceVal(0, 2)[0]));
                consecutiveMarks.push((gameBoard.getGridSpaceVal(1, 1).length === 0 ? null : gameBoard.getGridSpaceVal(1, 1)[0]));
                consecutiveMarks.push((gameBoard.getGridSpaceVal(2, 0).length === 0 ? null : gameBoard.getGridSpaceVal(2, 0)[0]));

                if (consecutiveMarks.every((mark) => mark === activePlayer.playerMark)) {
                    isThereAGameWin = true;
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
            isThereAGameTie = true;
            return isThereAGameTie;
        } else {
            return isThereAGameTie;
        }
    };

    return {
        clearGameState,
        createNewPlayer,
        setStartingPlayer,
        getActivePlayer,
        setActivePlayerMark,
        checkForAGameWin,
        checkForAGameTie,
    };
})()

const gameDisplayController = (function() {
    // game board DOM elements
    const gameBoardDisplay = document.querySelector("#game-board-display");
    const gameBoardSpaces = [...document.querySelectorAll(".game-board-space")];
    const displayMessage = document.querySelector("#display-message");
    
    // player creation form DOM elements
    const playerCreationForm = document.querySelector("#player-creation-form");
    const playerOneNameInput = document.querySelector("#player-one-name");
    const playerTwoNameInput = document.querySelector("#player-two-name");
    const playerCreationSubmitBtn = document.querySelector("#submit-btn");

    // variables to store player objects
    let playerOne;
    let playerTwo;
    let startingPlayer;
    
    // renders game board based on 2D array state
    const renderGameBoard = () => {
        for (let outerLoopIndex = 0; outerLoopIndex < gameBoard.grid.length; outerLoopIndex++) {    
            for (let innerLoopIndex = 0; innerLoopIndex < gameBoard.grid[outerLoopIndex].length; innerLoopIndex++) {
                const currentGameBoardSpace = gameBoardSpaces.find((boardSpace) => parseInt(boardSpace.dataset.row) === outerLoopIndex && parseInt(boardSpace.dataset.col) === innerLoopIndex);
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
        // determine player whose turn is upcoming
        const playerToBeAnnounced = gameLogicController.getActivePlayer(playerOne, playerTwo, startingPlayer) === playerOne ? playerTwo : playerOne;
        // determine the active player
        const activePlayer = gameLogicController.getActivePlayer(playerOne, playerTwo, startingPlayer);

        if (gameBoard.grid[event.target.dataset.row][event.target.dataset.col].length !== 0) {
            displayMessage.textContent = "Sorry, that space is taken!";
        } else {
            // update the display message
            displayMessage.textContent = `Player ${playerToBeAnnounced.playerName}'s turn`;

            // update the 2D array grid with the active player's mark and set it as the textContent of the click target
            event.target.textContent = gameLogicController.setActivePlayerMark(playerOne, playerTwo, startingPlayer, event.target.dataset.row, event.target.dataset.col);

            // use the state of the 2D array grid to render the game board
            renderGameBoard();
            
            // check for a win or a tie
            if (gameLogicController.checkForAGameWin("horizontal", activePlayer) || gameLogicController.checkForAGameWin("vertical", activePlayer)) {
                // announce a win (horizontal or vertical) and clear game state
                displayMessage.textContent = `Tic-tac-tover! ${activePlayer.playerName} wins the round!`;
                // clear game state
                gameLogicController.clearGameState(playerOneNameInput, playerTwoNameInput, playerCreationSubmitBtn);
            } else if (gameLogicController.checkForAGameWin("horizontal", activePlayer) === false && gameLogicController.checkForAGameWin("vertical", activePlayer) === false && gameLogicController.checkForAGameTie()) {
                // announce a tie and clear game state
                displayMessage.textContent = "It's a tie! Neither player wins!";
                // clear game state
                gameLogicController.clearGameState(playerOneNameInput, playerTwoNameInput, playerCreationSubmitBtn);
            }
        }
    }

    playerCreationForm.addEventListener("submit", (event) => {
        // prevent default form submission and players from further interacting with form
        event.preventDefault();
        playerCreationSubmitBtn.setAttribute("disabled", "");
        renderGameBoard();

        // assign player objects
        playerOne = createPlayersFromForm()["playerOne"];
        playerTwo = createPlayersFromForm()["playerTwo"];
        startingPlayer = gameLogicController.setStartingPlayer(playerOne, playerTwo);
        // convey starting player's turn
        displayMessage.textContent = `Player ${startingPlayer.playerName}'s turn`;

        gameBoardDisplay.addEventListener("click", playAGame);    
    });
})()

// FINAL CHECKLIST
// CURRENT OBJECTIVE --> ensure variable and function names are sound + look for ways to refactor or reorganize
// Style w/ CSS
// Update README