//게임을 플레이 할 수 있게 해주는 파일
//게임이 끝나게 되면 GAME_OVER상태로 넘어간다.
var player1;  //상대플레이어
var player2;  //My플레이어
var map;
var playerBullet;  //플레이어 무기
var enemyBullet; //적의 무기
//var shield;  //방패아이템 사용을 위한 변수
//var beat;  //제이지스킬중 '드랍더비트'를 위한 변수
var crushOn = false;  //네오 스킬중 '직접때리기'를 위한 변수
//var totalPlayerGauge;
var totalEnemyGauge; //적의 게이지바를 위한 변수
var wind = [-400, -200, 0, 200, 400];  //바람 총 5가지 배열
var windPoint = [1624*38/80, 1624*39/80, 1624*40/80, 1624*41/80, 1624*42/80];
var windNum;  //바람인덱스 가리키기 위한 변수
var windSet;

var lionSkillSet = false;
var tubeSkillSet = false;
var frodoSkillSet = false;
var frodoSkillSet2 = false;
var neoSkillSet = false;
var startTick = false;

var checkOneTime = true;
var windTime = false;
var gotOkPlayStart = false;

var choice = {
    roomId: 'no room(default)',
    characterPick: 'frodo',
    enemyItemPick: [],
    doubleGauge: 0,
    wind : 0
}; // 내가 고른 것을 객체로 저장

var playing = {
    roomId: 'no room(default)',
    gauge: 0,
};

////////////////////////////////////
//// 오디오
////////////////////////////////////
var gameBGM;
var throwSound;

var Game = {
    preload : function() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; game.scale.pageAlignHorizontally = true; game.scale.pageAlignVertically = true;
        game.load.image('background','./assets/images/background.png');
        game.load.image('timePlate','./assets/images/timePlate.png');

        game.load.image('playerHpBar','./assets/images/playerHpBar.png');
        game.load.image('playerHpBarPlate','./assets/images/playerHpBarPlate.png');
        game.load.image('playerHeart','./assets/images/playerHeart.png');

        game.load.image('enemyHpBar','./assets/images/enemyHpBar.png');
        game.load.image('enemyHpBarPlate','./assets/images/enemyHpBarPlate.png');
        game.load.image('enemyHeart','./assets/images/enemyHeart.png');

        game.load.image('windPointer','./assets/images/windPointer.png');
        game.load.image('windPlate','./assets/images/windPlate.png');

        game.load.image('playerGauge','./assets/images/playerGauge.png');
        game.load.image('enemyGauge','./assets/images/enemyGauge.png');
        game.load.image('gaugePlate','./assets/images/gaugePlate.png');
        game.load.image('gaugePlate2','./assets/images/gaugePlate2.png');


        game.load.image('playerSkillBtn','./assets/images/playerSkillBtn.png');
        game.load.image('enemySkillBtn','./assets/images/enemySkillBtn.png');

        game.load.audio('gameBGM', './assets/musics/goodTimes.mp3');
        game.load.audio('throw', './assets/musics/throw.mp3');
    },

    create : function() {
       game.stage.backgroundColor = '#FBCCBA';//배경색

       selectBGM.mute = true;
       gameBGM = game.add.audio('gameBGM', 0.5, true);
       gameBGM.play();

       throwSound = game.add.audio('throw', 1, false);

       game.physics.startSystem(Phaser.Physics.ARCADE);

       map = game.add.sprite(0, 0, 'background');
       map.width = 1624;
       map.height = 750;

       timePlate = game.add.sprite(812, 100, 'timePlate');
       timePlate.scale.setTo(0.5,0.5);
       timePlate.anchor.setTo(0.5, 0.5);

       playerBeat = game.add.sprite(200, 50, 'beat');
       playerBeat.visible =false;
       game.physics.enable(playerBeat, Phaser.Physics.ARCADE);

       enemyBeat = game.add.sprite(1424, 50, 'beat');
       enemyBeat.visible =false;
       game.physics.enable(enemyBeat, Phaser.Physics.ARCADE);

       playerShield = game.add.sprite(1300, 700, 'shieldBrick');
       playerShield.anchor.setTo(0.5, 1);
       playerShield.scale.setTo(0.2,0.2);
       playerShield.visible = false;

       enemyShield = game.add.sprite(324, 700, 'shieldBrick');
       enemyShield.anchor.setTo(0.5, 1);
       enemyShield.scale.setTo(0.2,0.2);
       enemyShield.visible = false;

       pDoubleBullet = game.add.sprite(1500, 500, 'basic');
       pDoubleBullet.anchor.setTo(0.5, 0.5);
       pDoubleBullet.scale.setTo(0.3,0.3);
       pDoubleBullet.visible =false;

       eDoubleBullet = game.add.sprite(124, 500, 'basic');
       eDoubleBullet.anchor.setTo(0.5, 0.5);
       eDoubleBullet.scale.setTo(0.3,0.3);
       eDoubleBullet.visible =false;


       //총 타이머 시간
       this.timeInSeconds = 15;
       //텍스트필드 설정
       this.timeText = game.add.text(812, 105, "로딩중", { fontSize: 50, font: "bold 20px sans-serif", align: "center"});
       //텍스트색설정
       this.timeText.fill = "#ffffff";
       //텍스트 가운데 설정
       this.timeText.anchor.set(0.5, 0.5);
       //1초마다 줄어드는 루프타이머

       // 플레이어 만들기
       player1 = game.add.sprite(200, 700, opponent.name);  //현재 그냥 라이언으로 설정
       game.physics.enable(player1, Phaser.Physics.ARCADE);
       player1.scale.setTo(0.25,0.25);
       player1.anchor.setTo(0.5, 1);
       player1.frame = 2;
       player1.animations.add("damagedAniForPlayer", [1, 2], 1, true);

       player2 = game.add.sprite(1424, 700, player.name);  //select에서 player = charObj[num]에서 객체를 받은거. 거기서 character.js보면 name따와서 삽입.
       game.physics.enable(player2, Phaser.Physics.ARCADE);
       player2.scale.setTo(0.25,0.25);
       player2.anchor.setTo(0.5, 1);
       player2.frame = 2;
       player2.animations.add("damagedAniForEnemy", [3, 2], 1, true);

       //플레이어 무기 만들기
       playerBullet = game.add.sprite(1500, 450, playItem.name);
       game.physics.arcade.enable(playerBullet, Phaser.Physics.ARCADE);
       playerBullet.anchor.setTo(0.5, 0.5);
       playerBullet.scale.setTo(0.3,0.3);
       playerBullet.visible = false;  //공격안하면 무기 안보여지게함.

       //적의 무기 만들기
       enemyBullet = game.add.sprite(124, 450, playItem.name);
       game.physics.enable(enemyBullet, Phaser.Physics.ARCADE);
       enemyBullet.anchor.setTo(0.5, 0.5);
       enemyBullet.scale.setTo(0.3,0.3);
       enemyBullet.visible = false;  //공격안하면 무기 안보여지게함.

       //플레이어스킬버튼 및 아이템 버튼 만들기
       playerSkillBtn = this.add.button(950, 175, 'playerSkillBtn', this.charSkill, this);
       playerSkillBtn.scale.setTo(0.15, 0.15);


       switch(playItemSet.length) {
         case 0:  //아이템 선택 안할시
            break;

         case 1:  //아이템 1개만 선택할시
            playerItemBtn = [this.add.button(1050, 175, playItemSet[0].name, this.firstItem, this)];
            playerItemBtn[0].scale.setTo(0.15, 0.15);
            break;

         case 2:  //아이템 2개만 선택할시
            playerItemBtn = [this.add.button(1050, 175, playItemSet[0].name, this.firstItem, this),
                       this.add.button(1150, 175, playItemSet[1].name, this.secondItem, this)];
            playerItemBtn[0].scale.setTo(0.15, 0.15);
            playerItemBtn[1].scale.setTo(0.15, 0.15);
            break;

         default:  //그외 먼저 선택한 3개로만 플레이된다.
            playerItemBtn = [this.add.button(1050, 175, playItemSet[0].name, this.firstItem, this),
                       this.add.button(1150, 175, playItemSet[1].name, this.secondItem, this),
                       this.add.button(1250, 175, playItemSet[2].name, this.thirdItem, this)];
            playerItemBtn[0].scale.setTo(0.15, 0.15);
            playerItemBtn[1].scale.setTo(0.15, 0.15);
            playerItemBtn[2].scale.setTo(0.15, 0.15);
       }


       playerHit = false;  //맞았을때 true로 바뀌게 하기 위한 스위치변수.
       enemyHit = false;

       //플레이어게이지바 셋팅
       gaugePlate = game.add.sprite(1350, 350, 'gaugePlate');
       gaugePlate.anchor.setTo(0, 0.5);
       gaugePlate.width=250;  //초기길이값 0
       gaugePlate.height=40
       gaugePlate.visible=false;

       playerGauge = game.add.sprite(1350, 350, 'playerGauge');
       playerGauge.anchor.setTo(0, 0.5);
       playerGauge.width=0;  //초기길이값 0
       playerGauge.height=40

       gaugePlate2 = game.add.sprite(1350, 350, 'gaugePlate2');
       gaugePlate2.anchor.setTo(0, 0.5);
       gaugePlate2.width=250;  //초기길이값 0
       gaugePlate2.height=40
       gaugePlate2.visible=false;

       //적의게이지바 셋팅
       enemyGauge = game.add.sprite(274, 350, 'enemyGauge');
       enemyGauge.anchor.setTo(1, 0.5);
       enemyGauge.width=0;  //초기길이값 0
       enemyGauge.height=40;

       //플레이어의 hp바 셋팅
       hpLength = 450;  //기본길이 200 hp가 200이란 소리 아님 케릭터마다 hp바 다름. 바의 길이가 200임.
       playerHpBarPlate = game.add.sprite(1524, 100, 'playerHpBarPlate');
       playerHpBarPlate.anchor.setTo(1, 0.5);
       playerHpBarPlate.scale.setTo(0.45, 0.45);
       playerHpBar = game.add.sprite(1424, 100, 'playerHpBar');
       playerHpBar.anchor.setTo(1, 0.5)
       playerHpBar.scale.setTo(0.45, 0.45);
       playerHpBar.width=hpLength;  //hp바 기본길이 200
       playerHeart = game.add.sprite(1524, 100, 'playerHeart');
       playerHeart.anchor.setTo(1, 0.5)
       playerHeart.scale.setTo(0.45, 0.45);

       //적의 hp바 셋팅
       enemyHpBarPlate = game.add.sprite(100, 100, 'enemyHpBarPlate');
       enemyHpBarPlate.anchor.setTo(0, 0.5);
       enemyHpBarPlate.scale.setTo(0.45, 0.45);
       enemyHpBar = game.add.sprite(200, 100, 'enemyHpBar');
       enemyHpBar.anchor.setTo(0, 0.5)
       enemyHpBar.scale.setTo(0.45, 0.45);
       enemyHpBar.width=hpLength;  //hp바 기본길이 200
       enemyHeart = game.add.sprite(100, 100, 'enemyHeart');
       enemyHeart.anchor.setTo(0, 0.5)
       enemyHeart.scale.setTo(0.45, 0.45);

       //바람의 중심을 나타내는 화살표 (바람바의 중심에 있어 어느방향인지 판단가능)
       windPlate = game.add.sprite(812, 225, 'windPlate');
       windPlate.anchor.setTo(0.5, 0.5);
       windPlate.scale.setTo(0.5, 0.5);

       //바람방향을 위한 바 셋팅
       windPointer = game.add.sprite(windPoint[windSet], 225, 'windPointer');
       windPointer.anchor.setTo(0.5, 0.5)
       windPointer.scale.setTo(0.5, 0.5);

       dark = game.add.sprite(812, 225, 'dark');
       dark.anchor.setTo(0.5,0.5);
       dark.visible = false;

       /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       //socket.io - 시작
       /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

       //적의 공격
       Client.socket.on('ItAttack', function(data){
           //enemyGauge.width=data.gauge/10;  //게이지바 길이
           game.debug.text("enemyGauge: " + data.gauge, game.world.centerX, game.world.centerY);  //확인을 위해 삽입한거. 없앨계획임. 게이지 얼마인지 확인.
           if(data.gauge>0){  //game.input.activePointer.duration가 기본값이 -1이기 때문에 -1로 셋팅
           //즉, 눌렀다 떼면 쌓였던 게이지로 총이 날아감.
               //console.log('eP : '+data.gauge);
               //console.log('ew : '+windSet);
               //console.log('ewp : '+wind[windSet]);
               enemyBullet.body.velocity.y = -data.gauge;
               enemyBullet.body.velocity.x = (wind[windSet]+data.gauge);
               enemyBullet.body.gravity.y = (-wind[windSet]+data.gauge*2);
               data.gauge=0;  //날아가고 나면 게이지 초기화.
           }
           //player1.frame = 2; //기본케릭 이미지는 던질꺼 아니면 변화없이 2번 프레임 (기본이미지)유지.

       });

       Client.socket.on('pDoubleAttack', function(data){
           if(eDoubleBullet.visible == true){  //game.input.activePointer.duration가 기본값이 -1이기 때문에 -1로 셋팅
               eDoubleBullet.body.velocity.y = -data.doubleGauge;
               eDoubleBullet.body.velocity.x = (wind[windSet]/2+data.doubleGauge);
               eDoubleBullet.body.gravity.y = (-wind[windSet]/2+data.doubleGauge*2);
           }
       });

       //적의 공격
       Client.socket.on('AttackSoon', function(data){
           player1.frame = 0;  //케릭터가 던지는 프레임으로 바뀜
           enemyBullet.visible = true;  //무기가 보여짐
           //windPointer.kill();
       });

       /////////////////////////////
       // player들 로딩을 wait
       /////////////////////////////

       Client.socket.emit('playReadyComplete', gameInfo.roomId);
       //console.log(gameInfo.roomId);

       Client.socket.on('okPlayStart', function(data){
            gotOkPlayStart = true;
            Game.timeText.text = '';
            Game.timeText.fontSize = 64;
            Game.timeText.y = 100;
            if(myPlayer.getCurrentTurn()==true ){
                timer = game.time.events.loop(Phaser.Timer.SECOND, Game.tick, Game);
                //console.log(timer);
            }
       });

       /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    },

    update: function() {
      if(gotOkPlayStart == true) {
          game.world.enableBody = true;  //게임모든객체들 물리시스템 적용
          game.world.bringToTop(dark);

          if(windTime == true){
            windPointer = game.add.sprite(windPoint[windSet], 225, 'windPointer');
            windPointer.anchor.setTo(0.5, 0.5)
            windPointer.scale.setTo(0.5, 0.5);
            windTime = false;
          }

          if(startTick == true){
              this.timeInSeconds = 15;
              this.timeText.text = '15';
              myPlayer.setCurrentTurn(true);
              checkOneTime = true;
              timer = game.time.events.loop(Phaser.Timer.SECOND, this.tick, this);
              startTick = false;
          }

          if(myPlayer.getCurrentTurn()==true && game.input.activePointer.isDown && (game.input.activePointer.x > game.world.centerX && game.input.activePointer.y > game.world.centerY)) {

              if(checkOneTime == true) {
                  Client.socket.emit('ReadyAttack', choice);
                  checkOneTime = false;
              }

              player2.frame = 4;  //케릭터가 던지는 프레임으로 바뀜
              playerBullet.visible = true;  //무기가 보여짐

              playing.gauge = game.input.activePointer.duration;  //choice.gauge에 얼마나 클릭했는지 수치가 쌓임
              choice.doubleGauge = game.input.activePointer.duration;

              gaugePlate.visible=true;
              gaugePlate2.visible=true;  //던질때 사용한 게이지바 삭제
              playerGauge.width=playing.gauge/10;  //게이지바 길이
              if(playerGauge.width>250){
                playerGauge.width = 250;
                playing.gauge = 2500;  //choice.gauge에 얼마나 클릭했는지 수치가 쌓임
                choice.doubleGauge = 2500;
              }
              game.debug.text("playerGauge: " + playing.gauge, game.world.centerX, game.world.centerY);  //확인을 위해 삽입한거. 없앨계획임. 게이지 얼마인지 확인.
          } else {
              if(myPlayer.getCurrentTurn()==true && playing.gauge > 0){ //즉, 눌렀다 떼면 쌓였던 게이지로 총이 날아감.

                  myPlayer.setCurrentTurn(false);
                  Client.socket.emit('IAttack', playing);
                      //console.log('mP : '+playing.gauge);
                      //console.log('mw : '+windSet);
                      //console.log('mwp : '+wind[windSet]);

                  throwSound.play();

                  playerBullet.body.velocity.y = -playing.gauge;
                  playerBullet.body.velocity.x = (wind[windSet]-playing.gauge);
                  playerBullet.body.gravity.y =  (wind[windSet]+playing.gauge*2);
                  playing.gauge=0;  //날아가고 나면 게이지 초기화.

                  if(pDoubleBullet.visible == true){
                    Client.socket.emit('doubleAttack', choice);
                    pDoubleBullet.body.velocity.y = -choice.doubleGauge;
                    pDoubleBullet.body.velocity.x = wind[windSet]/2-choice.doubleGauge;
                    pDoubleBullet.body.gravity.y = wind[windSet]/2 +choice.doubleGauge*2;
                  }
              }
              //player2.frame = 2; //기본케릭 이미지는 던질꺼 아니면 변화없이 2번 프레임 (기본이미지)유지.
          }

          //오버랩 구현(충돌시 데미지나 효과 관련)
          game.physics.arcade.overlap(player2, enemyBullet, this.enemyTakeScore, null, this);//적의 공격이 먹혔을때
          game.physics.arcade.overlap(player1, playerBullet, this.playerTakeScore, null, this);  //플레이어의 공격이 먹혔을때
          game.physics.arcade.overlap(player1, playerBeat, this.pDropTheBeat, null, this);  //제이지 드랍더비트 관련
          game.physics.arcade.overlap(player2, enemyBeat, this.eDropTheBeat, null, this);  //제이지 드랍더비트 관련
          game.physics.arcade.overlap(player1, player2, this.crush, null, this);  //네오 직접때리기 관련
          game.physics.arcade.overlap(enemyShield, playerBullet, this.enemyDefense, null, this);  //방어막아이템 관련
          game.physics.arcade.overlap(playerShield, enemyBullet, this.playerDefense, null, this);  //방어막아이템 관련
          game.physics.arcade.overlap(player1, pDoubleBullet, this.playerTakeScore, null, this);
          game.physics.arcade.overlap(player2, eDoubleBullet, this.enemyTakeScore, null, this);

          /*player*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

          //던졌는데 안맞고 벗어났을 경우(플레이어)
          if (playerBullet.body.y >= 750 || playerBullet.body.y <=-200){  //화면벗어나면 이전꺼 없애고 새로 셋팅
            playerBullet.kill();  //던져진 무기삭제
            playerGauge.kill();
            gaugePlate.visible=false;
            gaugePlate2.visible=false;  //던질때 사용한 게이지바 삭제
            this.timeInSeconds = 0;
            windPointer.kill();

            playerGauge = game.add.sprite(1350, 350, 'playerGauge');
            playerGauge.anchor.setTo(0, 0.5);
            playerGauge.width=0;  //초기길이값 0
            playerGauge.height=40

            playItem = itemObj[0];
            playerBullet = game.add.sprite(1500, 450, playItem.name);
            playerBullet.anchor.setTo(0.5, 0.5);
            playerBullet.scale.setTo(0.3,0.3);
            playerBullet.visible = false;  //던질꺼 아니므로 안보임

            //새로운 바람 셋팅
            player2.frame = 2;
            myPlayer.setCurrentTurn(false);
            this.timeText.text = ''
            game.time.events.remove(timer);
            if(lionSkillSet == true){
              myPlayer.setCurrentTurn(true);
              startTick = true;
              checkOneTime = true;
              lionSkillSet = false;
            }
            if(tubeSkillSet == true){
              player = charObj[5];
              player2.kill();
              player2 = game.add.sprite(1424, 700, player.name);  //select에서 player = charObj[num]에서 객체를 받은거. 거기서 character.js보면 name따와서 삽입.
              player2.scale.setTo(0.25,0.25);
              player2.anchor.setTo(0.5, 1);
              player2.animations.add("damagedAniForEnemy", [3, 2], 1, true);
              player2.frame = 2;
              tubeSkillSet = false;
            }
            if(frodoSkillSet2 == true){
              opponent = charObj[0];
              player1.kill();
              player1 = game.add.sprite(200, 700, opponent.name);  //select에서 player = charObj[num]에서 객체를 받은거. 거기서 character.js보면 name따와서 삽입.
              player1.scale.setTo(0.25,0.25);
              player1.anchor.setTo(0.5, 1);
              player1.animations.add("damagedAniForPlayer", [1, 2], 1, true);
              player1.frame = 2;
              frodoSkillSet2 = false;
            }
            if(frodoSkillSet == true){
              frodoSkillSet2 = true
              frodoSkillSet = false;
            }
            Client.socket.emit('finishAttack',choice);
          }

          /*enemy*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

          //던졌는데 안맞고 벗어났을 경우(적)
          if (enemyBullet.body.y >= 750  || enemyBullet.body.y <=-200){  //화면벗어나면 이전꺼 없애고 새로 셋팅
            enemyBullet.kill();  //던져진 무기삭제
            enemyGauge.kill();  //던질때 사용한 게이지바 삭제
            windPointer.kill();

            enemyGauge = game.add.sprite(274, 350, 'enemyGauge');
            enemyGauge.anchor.setTo(1, 0.5);
            enemyGauge.width=0;  //초기길이값 0
            enemyGauge.height=40;

            enemyItem = itemObj[0];
            enemyBullet = game.add.sprite(124, 450, enemyItem.name);
            enemyBullet.anchor.setTo(0.5, 0.5);
            enemyBullet.scale.setTo(0.3,0.3);
            enemyBullet.visible = false;  //던질꺼 아니므로 안보임

            //새로운 바람 셋팅
            player1.frame = 2;
            myPlayer.setCurrentTurn(true);
            checkOneTime = true;
            timer = game.time.events.loop(Phaser.Timer.SECOND, this.tick, this);
            if(lionSkillSet == true){
              myPlayer.setCurrentTurn(false);
              this.timeText.text = ''
              game.time.events.remove(timer);
              lionSkillSet = false;
            }
            if(tubeSkillSet == true){
              opponent = charObj[5];
              player1.kill();
              player1 = game.add.sprite(200, 700, opponent.name);  //select에서 player = charObj[num]에서 객체를 받은거. 거기서 character.js보면 name따와서 삽입.
              player1.scale.setTo(0.25,0.25);
              player1.anchor.setTo(0.5, 1);
              player1.frame = 2;
              player1.animations.add("damagedAniForPlayer", [1, 2], 1, true);
              tubeSkillSet = false;
            }
            if(frodoSkillSet2 == true){
              player = charObj[0];
              player2.kill();
              player2 = game.add.sprite(1424, 700, player.name);  //select에서 player = charObj[num]에서 객체를 받은거. 거기서 character.js보면 name따와서 삽입.
              player2.scale.setTo(0.25,0.25);
              player2.anchor.setTo(0.5, 1);
              player2.frame = 2;
              player2.animations.add("damagedAniForEnemy", [3, 2], 1, true);
              frodoSkillSet2 = false;
            }
            if(frodoSkillSet == true){
              frodoSkillSet2 = true
              frodoSkillSet = false;
            }
            Client.socket.emit('finishAttack',choice);
            this.timeInSeconds = 15;
          }

          /*player*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

          //던졌는데 맞았을 경우 (playerTakeScore함수와 같이 작동함, 하나로 합치기 힘든건 오버랩될때는 함수로 실행되야하는데 이거는 업데이트에서 구현되야되서 playerHit변수를 이용해서 구현한것.)
          if (playerHit == true){  //맞아도 이전꺼 없애고 새로 셋팅
            playItem = itemObj[0];
            playerBullet = game.add.sprite(1500, 450, playItem.name);
            playerBullet.anchor.setTo(0.5, 0.5);
            playerBullet.scale.setTo(0.3,0.3);
            playerBullet.visible = false;
            windPointer.kill();

            playerHit = false; //다시 false로 초기셋팅

            playerGauge.kill();
            gaugePlate.visible=false;
            gaugePlate2.visible=false;
            playerGauge = game.add.sprite(1350, 350, 'playerGauge');
            playerGauge.anchor.setTo(0, 0.5);
            playerGauge.width=0;  //초기길이값 0
            playerGauge.height=40

            player1.animations.play('damagedAniForPlayer');  //맞았을때의 애니메이션 시작 (맞는이미지)
            game.time.events.add (Phaser.Timer.SECOND * 1, this.stopPlayerAni, this); //1초후 stopPlayerAni라는 함수를 실행시켜 애니메이션을 멈춘다.
            player2.frame = 2;

            myPlayer.setCurrentTurn(false);
            this.timeText.text = ''
            game.time.events.remove(timer);
            if(lionSkillSet == true){
              myPlayer.setCurrentTurn(true);
              startTick = true;
              checkOneTime = true;
              lionSkillSet = false;
            }
            if(tubeSkillSet == true){
              player = charObj[5];
              player2.kill();
              player2 = game.add.sprite(1424, 700, player.name);  //select에서 player = charObj[num]에서 객체를 받은거. 거기서 character.js보면 name따와서 삽입.
              player2.scale.setTo(0.25,0.25);
              player2.anchor.setTo(0.5, 1);
              player2.frame = 2;
              player2.animations.add("damagedAniForEnemy", [3, 2], 1, true);
              tubeSkillSet = false;
            }
            if(frodoSkillSet2 == true){
              opponent = charObj[0];
              player1.kill();
              player1 = game.add.sprite(200, 700, opponent.name);  //select에서 player = charObj[num]에서 객체를 받은거. 거기서 character.js보면 name따와서 삽입.
              player1.scale.setTo(0.25,0.25);
              player1.anchor.setTo(0.5, 1);
              player1.frame = 2;
              player1.animations.add("damagedAniForPlayer", [1, 2], 1, true);
              frodoSkillSet2 = false;
            }
            if(frodoSkillSet == true){
              frodoSkillSet2 = true
              frodoSkillSet = false;
            }
            Client.socket.emit('finishAttack',choice);
          }

          /*enemy*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

          //던졌는데 맞았을 경우 (enemyTakeScore함수와 같이 작동함, 하나로 합치기 힘든건 오버랩될때는 함수로 실행되야하는데 이거는 업데이트에서 구현되야되서 playerHit변수를 이용해서 구현한것.)
          if (enemyHit == true){  //맞아도 이전꺼 없애고 새로 셋팅
            enemyItem = itemObj[0];
            enemyBullet = game.add.sprite(124, 450, playItem.name);
            enemyBullet.anchor.setTo(0.5, 0.5);
            enemyBullet.scale.setTo(0.3,0.3);
            enemyBullet.visible = false;
            windPointer.kill();

            enemyHit = false; //다시 false로 초기셋팅

            enemyGauge.kill();
            enemyGauge = game.add.sprite(274, 350, 'enemyGauge');
            enemyGauge.anchor.setTo(1, 0.5);
            enemyGauge.width=0;  //초기길이값 0
            enemyGauge.height=40;

            player1.frame = 2;
            myPlayer.setCurrentTurn(true);
            checkOneTime = true;
            timer = game.time.events.loop(Phaser.Timer.SECOND, this.tick, this);
            if(lionSkillSet == true){
              myPlayer.setCurrentTurn(false);
              this.timeText.text = ''
              game.time.events.remove(timer);
              lionSkillSet = false;
            }
            if(tubeSkillSet == true){
              opponent = charObj[5];
              player1.kill();
              player1 = game.add.sprite(200, 700, opponent.name);  //select에서 player = charObj[num]에서 객체를 받은거. 거기서 character.js보면 name따와서 삽입.
              player1.scale.setTo(0.25,0.25);
              player1.anchor.setTo(0.5, 1);
              player1.frame = 2;
              player1.animations.add("damagedAniForPlayer", [1, 2], 1, true);
              tubeSkillSet = false;
            }
            if(frodoSkillSet2 == true){
              player = charObj[0];
              player2.kill();
              player2 = game.add.sprite(1424, 700, player.name);  //select에서 player = charObj[num]에서 객체를 받은거. 거기서 character.js보면 name따와서 삽입.
              player2.scale.setTo(0.25,0.25);
              player2.anchor.setTo(0.5, 1);
              player2.frame = 2;
              player2.animations.add("damagedAniForEnemy", [3, 2], 1, true);
              frodoSkillSet2 = false;
            }
            if(frodoSkillSet == true){
              frodoSkillSet2 = true
              frodoSkillSet = false;
            }
            Client.socket.emit('finishAttack',choice);
            this.timeInSeconds = 15;
          }

          //네오 스킬을 위한 셋팅
          if (crushOn == true) {
            if(neoSkillSet == true){
              player2 = game.add.sprite(1424, 700, player.name);  //select에서 player = charObj[num]에서 객체를 받은거. 거기서 character.js보면 name따와서 삽입.
              player2.scale.setTo(0.25,0.25);
              player2.anchor.setTo(0.5, 1);
              player2.frame = 2;
              game.world.bringToTop(playerBullet);  //무기 이미지가 플레이어 이미지보다 생성된순서 상관없이 무조건 앞에
              crushOn = false;
              neoSkillSet = false;
            }else{
              player1 = game.add.sprite(200, 700, opponent.name);  //select에서 player = charObj[num]에서 객체를 받은거. 거기서 character.js보면 name따와서 삽입.
              player1.scale.setTo(0.25,0.25);
              player1.anchor.setTo(0.5, 1);
              player1.frame = 2;
              game.world.bringToTop(enemyBullet);  //무기 이미지가 플레이어 이미지보다 생성된순서 상관없이 무조건 앞에
              crushOn = false;
            }
          }
      }
  },

    //타이머 함수
    tick: function() {
          //console.log(this.timeInSeconds);
          //타이머 string
          var timeString = this.addZeros(this.timeInSeconds--);
          //텍스트필드에 타이머 넣기
          this.timeText.text = timeString;
          //타이머 종료
          if(this.timeInSeconds == -1){
              this.timeText.text = '';
              //console.log(timer);
              game.time.events.remove(timer);
              checkOneTime = false;
              myPlayer.setCurrentTurn(false);
              Client.socket.emit('yourTurn', choice);
          }
      },

    //이것도 타이머 관련함수 (10초 이하면 0붙여서 출력)
    addZeros: function(num) {
      if (num < 10) {
          num = "0" + num;
      }
      return num;
    },

    //플레이어 득점을 위한 함수
    playerTakeScore: function() {
     playerBullet.kill();
     if(pDoubleBullet.visible == true)
      pDoubleBullet.kill();
     playerHit = true;

      //맞으면 hp바 따니깐 길이 재조정
      enemyHpBar.width-=((player.ofs-opponent.dfs+playItem.ofs)/opponent.hp)*hpLength;  //길이감소공식. 라이언의 체력이 플레이어의 공격력만큼 피가 딸음
      player1.animations.play('damagedAniForPlayer');  //맞았을때의 애니메이션 시작 (맞는이미지)
      game.time.events.add (Phaser.Timer.SECOND * 1, this.stopPlayerAni, this); //1초후 stopEnemyAni라는 함수를 실행시켜 애니메이션을 멈춘다.

     //hp바가 0이 되면 죽는다.
     if(enemyHpBar.width <= 0){
       enemyHpBar.kill();
       this.timeText.text="Game Over_Win";
       //this.gameBGM.mute = true;
       game.state.start('Game_Over_Win');
     }
    },

    //적의 득점을 위한 함수
    enemyTakeScore: function() {
     enemyBullet.kill();
     if(eDoubleBullet.visible == true)
      eDoubleBullet.kill();
     enemyHit = true;

     //맞으면 hp바 따니깐 길이 재조정
     playerHpBar.width-=((opponent.ofs-player.dfs +enemyItem.ofs)/player.hp)*hpLength;  //길이감소공식. 라이언의 체력이 플레이어의 공격력만큼 피가 딸음
     player2.animations.play('damagedAniForEnemy');  //맞았을때의 애니메이션 시작 (맞는이미지)
     game.time.events.add (Phaser.Timer.SECOND * 1, this.stopEnemyAni, this); //1초후 stopEnemyAni라는 함수를 실행시켜 애니메이션을 멈춘다.

     //hp바가 0이 되면 죽는다.
     if(playerHpBar.width <= 0){
         playerHpBar.kill();
         this.timeText.text="Game Over_Lose";
         //this.gameBGM.mute = true;
         game.state.start('Game_Over_Lose');
     }
    },

    //첫번째 아이템사용하면 해당아이템 능력발현
    firstItem: function() {
        if(myPlayer.getCurrentTurn()==true){
          playerItemBtn[0].pendingDestroy = true;  //사용한 아이템 버튼 사라짐.
          playItemSet[0].playerSkill();  //아이템 효과
          Client.socket.emit('useFirstItem', choice);
          //playItem = itemObj[0];  //현재무기가 사용한 아이템으로 대체됨.
        }
    },

    secondItem: function() {
      if(myPlayer.getCurrentTurn()==true){
        playerItemBtn[1].pendingDestroy = true;
        playItemSet[1].playerSkill();
        Client.socket.emit('useSecondItem', choice);
        //playItem = itemObj[0];
      }
    },

    thirdItem: function() {
      if(myPlayer.getCurrentTurn()==true){
        playerItemBtn[2].pendingDestroy = true;
        playItemSet[2].playerSkill();
        Client.socket.emit('useThirdItem', choice);
        //playItem = itemObj[0];
      }
    },

    //케릭터 스킬 발현
    charSkill: function() {
      if(myPlayer.getCurrentTurn()==true){
        playerSkillBtn.pendingDestroy = true;  //사용한 케릭터 스킬버튼 사라짐.
        player.playerSkill();
        Client.socket.emit('playerSkill', choice);
      }
    },

    //방어막 아이템사용을 위한 함수 (방어막이랑 충돌하면 새로 셋팅)
    playerDefense: function() {
      playerShield.kill();
      enemyBullet.kill();
      enemyBullet = game.add.sprite(124, 450, playItem.name);
      enemyBullet.anchor.setTo(0.5, 0.5);
      enemyBullet.scale.setTo(0.3,0.3);
      enemyBullet.visible = false;

      enemyGauge.kill();
      enemyGauge = game.add.sprite(274, 350, 'enemyGauge');
      enemyGauge.anchor.setTo(1, 0.5);
      enemyGauge.width=0;  //초기길이값 0
      enemyGauge.height=40;

      windPointer.kill();
      player1.frame = 2;

      Client.socket.emit('finishAttack',choice);
      this.timeInSeconds = 15;
      myPlayer.setCurrentTurn(true);
      checkOneTime = true;
      timer = game.time.events.loop(Phaser.Timer.SECOND, this.tick, this);
    },

    enemyDefense: function() {
      enemyShield.kill();
      playerBullet.kill();
      playerBullet = game.add.sprite(1500, 450, playItem.name);
      playerBullet.anchor.setTo(0.5, 0.5);
      playerBullet.scale.setTo(0.3,0.3);
      playerBullet.visible = false;

      playerGauge.kill();
      playerGauge = game.add.sprite(1350, 350, 'playerGauge');
      playerGauge.anchor.setTo(0, 0.5);
      playerGauge.width=0;  //초기길이값 0
      playerGauge.height=40

      windPointer.kill();
      player2.frame = 2;
      myPlayer.setCurrentTurn(false);
      this.timeText.text = ''
      game.time.events.remove(timer);
      this.timeInSeconds = 15;

      Client.socket.emit('finishAttack',choice);
    },

    //제이지 드랍더비트 스킬관련
    pDropTheBeat: function() {
     playerBeat.kill();
     enemyHpBar.width-=((player.ofs-opponent.dfs)/opponent.hp)*hpLength;
     if(enemyHpBar.width <= 0){
       enemyHpBar.kill();
       this.timeText.text="Game Over_Win";
       //this.gameBGM.mute = true;
       game.state.start('Game_Over_Win');
     }
    },

    eDropTheBeat: function() {
     enemyBeat.kill();
     playerHpBar.width-=((opponent.ofs-player.dfs)/player.hp)*hpLength;
     if(playerHpBar.width <= 0){
       playerHpBar.kill();
       this.timeText.text="Game Over_Lose";
       //this.gameBGM.mute = true;
       game.state.start('Game_Over_Lose');
     }
    },

    //네오 직접때리기 스킬관련
    crush: function() {
      if(neoSkillSet==true){
        player2.kill();
        crushOn = true;
        enemyHpBar.width-=((player.ofs-opponent.dfs)/opponent.hp)*hpLength;

        if(enemyHpBar.width <= 0){
          enemyHpBar.kill();
          this.timeText.text="Game Over_Win";
          //this.gameBGM.mute = true;
          game.state.start('Game_Over_Win');
        }
      }else{
        player1.kill();
        crushOn = true;
        playerHpBar.width-=((opponent.ofs-player.dfs)/player.hp)*hpLength;

        if(playerHpBar.width <= 0){
          playerHpBar.kill();
          this.timeText.text="Game Over_Lose";
          //this.gameBGM.mute = true;
          game.state.start('Game_Over_Lose');
        }
      }

    },

    //플레이어가 공격했을때 적의 애니메이션 멈추는 함수
    stopPlayerAni: function() {
      player1.animations.stop();    // player에게 적용중인 애니메이션을 멈춘다.
      player1.frame = 2; //player의 기본이미지로 돌아옴.
    },

    //적이 공격했을때 플레이어의 애니메이션 멈추는 함수
    stopEnemyAni: function() {
      player2.animations.stop();    // player에게 적용중인 애니메이션을 멈춘다.
      player2.frame = 2; //player의 기본이미지로 돌아옴.        myPlayer.setCurrentTurn(true);

    }
};
