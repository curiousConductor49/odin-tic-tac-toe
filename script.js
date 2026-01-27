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

        const setPlayerMark = (rowIndex, colIndex) => gameBoard.setGridSpaceVal(rowIndex, colIndex, playerMark);

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
        if (gameBoard.grid[rowIndex][colIndex].length !== 0) {
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
                // console.log(`Player ${activePlayer.playerName} has won!`);
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
                // console.log(`Player ${activePlayer.playerName} has won!`);
                return isThereAGameWin;
            } else {
                // uppermost right to bottommost left
                consecutiveMarks = [];
                consecutiveMarks.push((gameBoard.getGridSpaceVal(0, 2).length === 0 ? null : gameBoard.getGridSpaceVal(0, 2)[0]));
                consecutiveMarks.push((gameBoard.getGridSpaceVal(1, 1).length === 0 ? null : gameBoard.getGridSpaceVal(1, 1)[0]));
                consecutiveMarks.push((gameBoard.getGridSpaceVal(2, 0).length === 0 ? null : gameBoard.getGridSpaceVal(2, 0)[0]));

                if (consecutiveMarks.every((mark) => mark === activePlayer.playerMark)) {
                    isThereAGameWin = true;
                    // console.log(`Player ${activePlayer.playerName} has won!`);
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

    // TESTING ZONE (DELETE LATER)
    // const playerOne = createNewPlayer("john", "X");
    // const playerTwo = createNewPlayer("jane", "O");
    // const heWhoStarts = playerOne;
    
    // const activePlayer = getActivePlayer(playerOne, playerTwo, heWhoStarts);
    // // console.log(heWhoStarts);
    // // console.log(activePlayer);

    // // turn 1
    // setActivePlayerMark(playerOne, playerTwo, activePlayer, 0, 0);
    // console.log(gameBoard.grid);

    // // turn 2
    // setActivePlayerMark(playerOne, playerTwo, activePlayer, 2, 0);
    // console.log(gameBoard.grid);

    // // turn 3
    // setActivePlayerMark(playerOne, playerTwo, activePlayer, 1, 0);
    // console.log(gameBoard.grid);

    // // turn 4
    // setActivePlayerMark(playerOne, playerTwo, activePlayer, 0, 1);
    // console.log(gameBoard.grid);

    // // turn 5
    // setActivePlayerMark(playerOne, playerTwo, activePlayer, 2,1);
    // console.log(gameBoard.grid);

    // // turn 6
    // setActivePlayerMark(playerOne, playerTwo, activePlayer, 1,2);
    // console.log(gameBoard.grid);

    // // turn 7
    // setActivePlayerMark(playerOne, playerTwo, activePlayer, 0,2);
    // console.log(gameBoard.grid);

    // // turn 8
    // setActivePlayerMark(playerOne, playerTwo, activePlayer, 1,1);
    // console.log(gameBoard.grid);

    // // turn 9
    // setActivePlayerMark(playerOne, playerTwo, activePlayer, 2,2);
    // console.log(gameBoard.grid);

    // if (checkForAGameWin("horizontal", activePlayer) === false) {
    //     checkForAGameWin("vertical", activePlayer);
    // }
    // if (checkForAGameWin("horizontal", activePlayer) === false && checkForAGameWin("vertical", activePlayer) === false) {
    //     checkForAGameTie();
    // }


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
    const playerOneNameInput = document.querySelector("#player-one-name");
    const playerOneMarkInput = document.querySelector("#player-one-mark");
    const playerTwoNameInput = document.querySelector("#player-two-name");
    const playerTwoMarkInput = document.querySelector("#player-two-mark");
    const markInputReminder = document.querySelector("#mark-input-reminder");
    const playerCreationSubmitBtn = document.querySelector("#submit-btn");
    const gameBoardGridArea = document.querySelector("#gameboard-grid-area");

    // consider reworking this slightly so there's the initial rendering, then a separate function to rerender the latest state of the gameboard i.e. loop over the DOM children of the gameboard grid area, find the corresponding gameboard 2D array's value using the data-attributes of the DOM child element, and set its textContent to the value. We can call this every time a player clicks a grid space.
    const createAndRenderGameBoard = () => {
        for (let outerLoopIndex = 0; outerLoopIndex < gameBoard.grid.length; outerLoopIndex++) {    
            for (let innerLoopIndex = 0; innerLoopIndex < gameBoard.grid[outerLoopIndex].length; innerLoopIndex++) {
                const gridSpaceSquare = document.createElement("button");

                gridSpaceSquare.setAttribute("data-row", outerLoopIndex);
                gridSpaceSquare.setAttribute("data-column", innerLoopIndex);

                gridSpaceSquare.textContent = gameBoard.grid[outerLoopIndex][innerLoopIndex].length === 0 ? "" : gameBoard.grid[outerLoopIndex][innerLoopIndex];
                gameBoardGridArea.append(gridSpaceSquare);

                // this is just to see the divs, delete later
                // gridSpaceSquare.style.backgroundColor = "blue";
                // gridSpaceSquare.style.height = "100px";
                // gridSpaceSquare.style.width = "100px";
            }
        }
    }
    
    const playerCreationFormHandler = () => {
        if (playerOneMarkInput.value === playerTwoMarkInput.value) {
            markInputReminder.textContent = "Players must have different marks!";
        } else {
            markInputReminder.textContent = "";
            playerCreationSubmitBtn.setAttribute("disabled", "");
            gameLogicController.beginNewGameRound();

            const playerOne = gameLogicController.createNewPlayer(playerOneNameInput.value, playerOneMarkInput.value);
            const playerTwo = gameLogicController.createNewPlayer(playerTwoNameInput.value, playerTwoMarkInput.value);

            return { playerOne, playerTwo };
        }
    } 

    // *** WE ARE HERE!!! ***
    playerCreationSubmitBtn.addEventListener("click", (event) => {
        event.preventDefault();
        // const beginner = gameLogicController.setStartingPlayer(playerCreationFormHandler()["playerOne"], playerCreationFormHandler()["playerTwo"]);
        // const active = gameLogicController.getActivePlayer(playerCreationFormHandler()["playerOne"], playerCreationFormHandler()["playerTwo"]);
        // console.log(beginner);
        // console.log(active);
    });
})()

// pseudocode!!
// write the functions in the gameDisplayController IIFE that allow players to add marks to a specific gameboard grid space by interacting with the right DOM element

// CURRENT OBJECTIVE --> connect the gameboard grid array to its DOM representation.
// start by split-reworking the function to render its contents (should be a function to build out the grid, then a separate one to be called per game turn to "refresh" the screen)

// ** TO-DO, TO-DO, TO-DO-DO-DO-DO-DOOOOO... ***
// set an event listener on the gameBoardGridArea to use event bubbling so a listener is set on all its children (aka the gameboard spaces)
// we pass it a callback function, in which we:
    // get the row and column attributes of the target from the event (ought to be a click)
    // check if the target's textContent is already occupied
        // if so then simply return
        // else, set the target's textContent to the active player's mark (see above note about rerendering), update the corresponding 2D array position in the gameboard grid array with the active player's mark, and check for a win and tie
    // if a tie or win is found, then end the game round and enable the play button + form inputs again, allowing the process to repeat upon a click