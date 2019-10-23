var Client = {
    socket : io(),
    Game : function(roomId) {this.roomId = roomId;}, // this -> Game
    Player : function(name, type) { this.name = name; this.type = type; this.currentTurn = true; }
};

var P1 = 'X', P2 = 'O';
var myPlayer, game, gameInfo;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// jQuery@3.3.1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(function(){
    $('#go').on('click', function(){
        var name = $('#go').val();
        //console.log(name);

        /*
         *나중에 닉네임 입력이 구현되었을 때 사용할 부분.
           if(!name){
               alert('Please enter your name.');
               return;
           }
         */

        var goClick = new Audio('./assets/musics/click.mp3');
        goClick.volume = 1;
        goClick.play();

        Client.socket.emit('gameMatch', {name: name});

        // 'Client.socket.on('newGame', ~)'에 있으면 버그가 생겨서 위치 수정
        $('.container').hide();
        $('.tutorialBoard').hide();
        $('.gameBoard').show();
        $('#matching').show();
    });
});

$(function(){
    $('#tutorial').on('click', function(){
        var name = $('#tutorial').val();
        //console.log(name);

        var tutorialClick = new Audio('./assets/musics/click.mp3');
        tutorialClick.volume = 1;
        tutorialClick.play();

        var tutorialBGM = new Audio('./assets/musics/easygoing.mp3');
        tutorialBGM.volume = 0.5;
        tutorialBGM.play();

        // 'Client.socket.on('newGame', ~)'에 있으면 버그가 생겨서 위치 수정
        //$('.menu').hide();
        $('.container').hide();
        $('.tutorialBoard').show();
        //$('.realTutorial').show();

        var slideIndex = 0;

        tutorialSlide();

        function tutorialSlide() {
            var i;
            var x = document.getElementsByClassName("mySlides");

            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }

            slideIndex++;

            //none : 보이지 않음, block : 블록 박스, inline : 인라인 박스, inline-block : block과 inline의 중간 형태
            //block -> <div>, <p> 태그 등이 이에 해당됩니다.
            //         가로 길이가 기본적으로 100%이며, block인 태그를 이어서 사용하면 줄바꿈 되어 보입니다.
            //         width, height 속성을 지정 할 수 있으며, 레이아웃 배치시 주로 쓰입니다.
            x[slideIndex-1].style.display = "block";

            if (slideIndex <= 21 && slideIndex >= 15) {
                setTimeout(tutorialSlide, 1000);
                return;
            }

            if (slideIndex == x.length) {
                setTimeout(tutorialEnd, 6000);
                return;
            }
            setTimeout(tutorialSlide, 2500);
        }

        function tutorialEnd() {
            location.reload();
        }
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Client.socket.on
// (Client.socket이 서버에 반응하는 부분)
// socket.io@2.0.4
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////
// (1) player1의 방 개설
/////////////////////////////////

Client.socket.on('newGame', function(data){ // data - {name: data.name(ex:김성재), room: 'room-' + rooms}
    //console.log(data.name);
    //console.log(data.room);

    //Create game for player 1
    gameInfo = new Client.Game(data.room);
    //console.log(gameInfo); -> Game
});

/////////////////////////////////
// (2) player2의 방 합류
/////////////////////////////////

Client.socket.on('player1', function(data){ // data - {name: data.name, room: 'room-' + checkRoom }
    var message = 'Hello, [player1]. 현재 접속 방: * ' + data.room + ' *';
    myPlayer = new Client.Player(data.name, P1);
    //console.log(myPlayer);

    gameInfo.displayBoard(message);
    myPlayer.setCurrentTurn(true);
});

Client.socket.on('player2', function(data){ // data - {name: data.name, room: 'room-' + checkRoom }
    var message = 'Hello, [player2]. 현재 접속 방: * ' + data.room + ' *';
    myPlayer = new Client.Player(data.name, P2);
    //console.log(myPlayer);

    //Create game for player 2
    gameInfo = new Client.Game(data.room);
    gameInfo.displayBoard(message);
    myPlayer.setCurrentTurn(false);
});

/////////////////////////////////
// (3) ERR
/////////////////////////////////

Client.socket.on('roomFull', function(data){
    alert('방이 가득 찼습니다!');
    $(function(){
        $('.gameBoard').hide();
        $('.tutorialBoard').show();
        $('.container').show();

    });
});

/*
 * 사용안함.
      Client.socket.on('matchingErr', function(data){
          alert("방 매칭에 오류가 발생했습니다! 다시 Go!");
          location.reload();
      });
*/

Client.socket.on('enemyLogout', function(data){
    alert("상대방이 겁먹어 도망갔습니다! 다시 Go!");
    location.reload();
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Client.socket.on('opponentInfo',function(data){
    if(data.characterPick.name == 'con'){
      opponent = charObj[11];
      opponentItem = data.enemyItemPick;
    }else{
      opponent = data.characterPick;
      opponentItem = data.enemyItemPick;
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Client.socket.on('firstItemUsed', function(data){
    itemObj[(itemName.indexOf(opponentItem[0]))].enemySkill();

});

Client.socket.on('secondItemUsed', function(data){
    itemObj[(itemName.indexOf(opponentItem[1]))].enemySkill();

});

Client.socket.on('thirdItemUsed', function(data){
    itemObj[(itemName.indexOf(opponentItem[2]))].enemySkill();

});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Client.socket.on('wind', function(data){
    if(myPlayer.getCurrentTurn()==true){
      windSet = data.wind;
    }else{
      windSet = 4 - data.wind;
    }
    windTime = true;
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Client.socket.on('enemySkill', function(data){
    charObj[(charImg.indexOf(opponent.name))].enemySkill();
});

Client.socket.on('myTurn', function(data){
    startTick = true;
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Game Object
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// DOM에서 menu class를 hide, gameboard class를 show.
Client.Game.prototype.displayBoard = function(message){
    var bellStart = new Audio('./assets/musics/doorbell.wav');
    bellStart.volume = 1;
    bellStart.play();
    $(function(){
        $('#userHello').html(message);
        $('#userHello').hide();
        $('#turn').remove();
        $('#matching').remove();
    });
    this.createGameBoard();
}

Client.Game.prototype.createGameBoard = function(){
    game = new Phaser.Game(1624, 750, Phaser.CANVAS, 'kakaoGame');

    //  게임 인스턴스를 초기화 한 후, 상태를 추가한다.
    //game.state.add('Menu', Menu);
    game.state.add('Select', Select);
    game.state.add('Game', Game);
    game.state.add('Game_Over_Win', Game_Over_Win);
    game.state.add('Game_Over_Lose', Game_Over_Lose);

    game.state.start('Select');
}

Client.Game.prototype.endGame = function(message){
    alert(message);
    location.reload(); //-> 새로고침
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Player Object
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Client.Player.prototype.getPlayerName = function() {
    return myPlayer.name;
}

 Client.Player.prototype.getCurrentTurn = function(){
   return myPlayer.currentTurn;
 }

 Client.Player.prototype.setCurrentTurn = function(turn){
   myPlayer.currentTurn = turn;
   /*
    *정상 작동하는지 체크 확인용
       if(turn){ //현재 나의 turn이 true면
         $(function(){
             $('#turn').text('Your turn.');
         });
       }
       else{
         $(function(){
             $('#turn').text('Waiting for Opponent');
         });
       }
    */
 }
