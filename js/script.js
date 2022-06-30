// Student Name:   Jose Ramos
// Student ID:     01930952
// Assignment:     Homework 5
// Class:          GUI I
// Date:           Wednesday 29/06/2022
// File:           script.js

// ScrabbleTiles object example from professor Heines
var ScrabbleTiles = [] ;

ScrabbleTiles["A"] = { "value" : 1,  "original-distribution" : 9,  "number-remaining" : 9  } ;
ScrabbleTiles["B"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["C"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["D"] = { "value" : 2,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["E"] = { "value" : 1,  "original-distribution" : 12, "number-remaining" : 12 } ;
ScrabbleTiles["F"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["G"] = { "value" : 2,  "original-distribution" : 3,  "number-remaining" : 3  } ;
ScrabbleTiles["H"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["I"] = { "value" : 1,  "original-distribution" : 9,  "number-remaining" : 9  } ;
ScrabbleTiles["J"] = { "value" : 8,  "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["K"] = { "value" : 5,  "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["L"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["M"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["N"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  } ;
ScrabbleTiles["O"] = { "value" : 1,  "original-distribution" : 8,  "number-remaining" : 8  } ;
ScrabbleTiles["P"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["Q"] = { "value" : 10, "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["R"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  } ;
ScrabbleTiles["S"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["T"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  } ;
ScrabbleTiles["U"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["V"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["W"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["X"] = { "value" : 8,  "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["Y"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["Z"] = { "value" : 10, "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["_"] = { "value" : 0,  "original-distribution" : 2,  "number-remaining" : 2  } ;

var tilesReminding = 100;

var word = "";

var tilesOnRack = [];
var tilesOnBoard = [];

var gameScore = 0;
var currentScore = 0;
var hasDoubleWordScore = false;

var currentParent;
var nextSpotOnTheBoard = 1;

// Creating tiles to store the letter of each
var tile1, tile2, tile3, tile4, tile5, tile6, tile7;

// Function to get a random int
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
};

// Function to get a random tile letter 
function getRandomTileLetter() {
    if (tilesReminding > 0){
        var keys = Object.keys(ScrabbleTiles);
        var tile = {"number-remaining": 0};
        var letter;
        
        while (tile["number-remaining"] < 1){
            letter = Array.from(keys)[getRandomInt(keys.length)];
            tile = ScrabbleTiles[letter];
        }
        
        // Updating tiles rack list
        tilesOnRack.push(letter);

        // Subtracting one from the total
        ScrabbleTiles[letter]["number-remaining"] -= 1;
        tilesReminding -= 1;
        return letter;
    }
};

// This function will get an image for all the tiles that are on the rack
function getTilesImage(){
    var tile_letter;
    $(".tile").each(function( i) {
        tile_letter = getRandomTileLetter();
        $(this).attr("value", tile_letter);
        $(this).attr("index", i);
        if(tile_letter == '_'){
            tile_letter = 'Blank';
        }
        $(this).css('background-image','url(graphics_data/Scrabble_Tiles/Scrabble_Tile_' + tile_letter + '.jpg)');
    });
}

// This function will create draggable functionality to all tiles
function createDraggable() {
    $(".draggable").draggable({
        revert: 'invalid',
        start: function(){
            currentParent = $(this).parent().attr('id');
        }
    });
}

// This function will create the next spot on the board as droppable
function nextDroppable(){
    $('#board-tile-'+ nextSpotOnTheBoard).droppable({
        accept:'.draggable',
        drop: function(event,ui){
            if (currentParent != $(this).attr('id')){
              $(ui.draggable).appendTo($(this)).css({"left":"", "top":"", "right":""});
            }
            letter = $(ui.draggable).attr("value"); 
            word += letter;
            $("p.current-word-value").text(word);
            tilesOnBoard.push(letter);
            updateCurrentScore();
            nextSpotOnTheBoard++;
            nextDroppable();

            validateWord();
            $(ui.draggable).classList.remove("draggable");
        }
    });
};

// This function will validate the word before being submitted
function validateWord() {
    if(tilesOnBoard.length > 1) {
        $("p.letters-validation").text("Yes");
        $(".letters-validation").css({"color":"green"});
        $("#submit-btn").prop("disabled",false).css({"background-color":"green"});
    }
}

// This function will submit the word and get the game score
function submitWord() {
    if(hasDoubleWordScore){
        gameScore += currentScore * 2;
    }
    else {
        gameScore += currentScore;
    }
    $("#game-score").text(gameScore);
    newTurn();
}

// This function will update the value of the current value
function updateCurrentScore() {
    specialTile = $("#board-tile-" + nextSpotOnTheBoard).attr("value");
    
    // If it is double letter score or double word score
    if(specialTile) {
        if(specialTile == "double-word-score"){
            hasDoubleWordScore = true;
            currentScore += ScrabbleTiles[tilesOnBoard[nextSpotOnTheBoard - 1]]["value"];
        }
        else { // double-letter-score
            currentScore += ScrabbleTiles[tilesOnBoard[nextSpotOnTheBoard - 1]]["value"] * 2;
        }
    }
    else{
        currentScore += ScrabbleTiles[tilesOnBoard[nextSpotOnTheBoard - 1]]["value"];
    }
    if(hasDoubleWordScore){
        $("#current-score").text(currentScore * 2);
    }
    else {
        $("#current-score").text(currentScore);
    }
}

// This function clean the board and restack the rack to prepare for next turn
function newTurn() {
    word = "";
    tilesReminding = 100;
    nextSpotOnTheBoard = 1;
    tilesOnBoard = [];
    tilesOnRack = [];
    currentScore = 0;
    hasDoubleWordScore = false;
    
    $("#current-score").text(currentScore);
    $(".current-word-value").text("");
    $("p.letters-validation").text("No");
    $(".letters-validation").css({"color":"red"});
    $("#submit-btn").prop("disabled",true).css({"background-color":"grey"});
    
    cleanBoard();
    restackRack();
    createDraggable();
    getTilesImage();
    nextDroppable();
}

// This function clean the board
function cleanBoard() {
    $(".tile-spot").html("");
}

// This function restack the rack
function restackRack() {
    $("#tile-rack").html(
        '<div id="tiles-in-rack">\
            <div id="tile-1" class="tile draggable"></div>\
            <div id="tile-2" class="tile draggable"></div>\
            <div id="tile-3" class="tile draggable"></div>\
            <div id="tile-4" class="tile draggable"></div>\
            <div id="tile-5" class="tile draggable"></div>\
            <div id="tile-6" class="tile draggable"></div>\
            <div id="tile-7" class="tile draggable"></div>\
        </div>'
    );
}

// This function reset the whole game
function resetGame() {
    gameScore = 0;
    $("#game-score").text(gameScore);
    newTurn();
}

// jQuery function to run when document is ready
$(function() {
	createDraggable();
    getTilesImage();
    nextDroppable();
});
