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

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
};

function getRandomTile() {
    if (tilesReminding > 0){
        var keys = Object.keys(ScrabbleTiles);
        var tile = {"number-remaining": 0};
        var letter;
        
        while (tile["number-remaining"] < 1){
            letter = Array.from(keys)[getRandomInt(keys.length)];
            tile = ScrabbleTiles[letter];
            // console.log(letter);
        }
        
        // Updating tiles rack list
        tilesOnRack.push(letter);

        // Subtracting one from the total
        ScrabbleTiles[letter]["number-remaining"] -= 1;
        tilesReminding -= 1;
        return letter;
    }
};

// console.log(Object.keys(ScrabbleTiles)[2]);
// console.log(getRandomTile());

function getTilesImage(){
    var tile_letter;
    $(".tile").each(function( i) {
        tile_letter = getRandomTile();
        $(this).attr("value", tile_letter);
        $(this).attr("index", i);
        if(tile_letter == '_'){
            tile_letter = 'Blank';
        }
        $(this).css('background-image','url(graphics_data/Scrabble_Tiles/Scrabble_Tile_' + tile_letter + '.jpg)');
    });
}

$(function() {
	createDraggable();
    getTilesImage();
    nextDroppable();
    console.log(tilesOnRack)
});

function createDraggable() {
    $(".draggable").draggable({
        revert: 'invalid',
        start: function(){
            currentParent = $(this).parent().attr('id');
        }
    });
}

function nextDroppable(){
    $('#board-tile-'+ nextSpotOnTheBoard).droppable({
        accept:'.draggable',
        drop: function(event,ui){
            if (currentParent != $(this).attr('id')){
            //   $(ui.draggable).appendTo($(this)).removeAttr('style');
              $(ui.draggable).appendTo($(this)).css({"left":"", "top":"", "right":""});
            }
            // $(ui.draggable).draggable( "option", "disabled", true );
            // $(this).droppable("disable");
            letter = $(ui.draggable).attr("value"); 
            word += letter;
            $("p.current-word-value").text(word);
            tilesOnBoard.push(letter);
            updateCurrentScore();
            nextSpotOnTheBoard++;
            nextDroppable();
            
            // Testing
            console.log(word);
            console.log(tilesOnBoard);

            validateWord();
            $(ui.draggable).classList.remove("draggable");
        }
    });
};

function validateWord() {
    if(tilesOnBoard.length > 1) {
        $("p.letters-validation").text("Yes");
        $(".letters-validation").css({"color":"green"});
    }
    console.log("Validating...");
}

function submitWord() {
    console.log("Submitting word...");
    if(hasDoubleWordScore){
        gameScore += currentScore * 2;
    }
    else {
        gameScore += currentScore;
    }
    $("#game-score").text(gameScore);
    newTurn();
}

function updateCurrentScore() {
    specialTile = $("#board-tile-" + nextSpotOnTheBoard).attr("value");
    if(specialTile) {
        console.log("Special tile");
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
    
    cleanBoard();
    restackRack();
    createDraggable();
    getTilesImage();
    nextDroppable();
}

function cleanBoard() {
    $(".tile-spot").html("");
}

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

function resetGame() {
    gameScore = 0;
    $("#game-score").text(gameScore);
    newTurn();
}

function readTextFile(file = "file:///words.txt")
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}

fetch('words.txt')
  .then(response => response.text())
  .then(text => console.log(text))

// console.log(readTextFile());
