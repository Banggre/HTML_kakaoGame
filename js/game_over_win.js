var endWinBGM;

//단순 game over 이미지를 출력해주며, 클릭시 다시 초기화면으로 진입한다.
var Game_Over_Win = {

    preload : function() {
        //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; game.scale.pageAlignHorizontally = true; game.scale.pageAlignVertically = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; game.scale.pageAlignHorizontally = true; game.scale.pageAlignVertically = true;

        // Load the needed image for this game screen.
        game.load.image('gameOverWin', './assets/images/gameOverWin.png');
        game.load.audio('endWinBGM', './assets/musics/endBGM.mp3');

    },

    create : function() {
        //game의 BGM 음소거
        gameBGM.mute = true;

        // 배경음을 추가한다.
        endWinBGM = game.add.audio('endWinBGM', 0.5, true);
        endWinBGM.play();

        // Create button to start game like in Menu.
        gameOverMapBtn = this.add.button(0, 0, 'gameOverWin', this.startGame, this);
        gameOverMapBtn.width = 1624;
        gameOverMapBtn.height = 750;
        // Add text with information about the score from last game.
    },

    startGame: function () {

        // Change the state back to Game.
        gameInfo.endGame('끝');

    }
};
