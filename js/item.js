var basic = {
    name : 'basic',
    ofs : 0,
    imgGet : function(){
      game.load.image('basic', './assets/images/basic.png');
    },
    skill : function(){
      //기본무기의 능력을 구현

    },
  };

var big = {
    name : 'big',
    ofs : 40,
    imgGet : function(){
      game.load.image('big', './assets/images/big.png');
      game.load.image('bigBtn', './assets/images/bigBtn.png');
    },
    playerSkill : function(){
      //수류탄의 능력을 구현
          playItem = itemObj[1];
          playerBullet.kill();
          playerBullet = game.add.sprite(1500, 450, 'basic');
          playerBullet.anchor.setTo(0.5, 0.5);
          playerBullet.scale.setTo(0.6,0.6);
          playerBullet.visible = false;  //공격안하면 무기 안보여지게함.
    },
    enemySkill : function(){
          enemyItem = itemObj[1];
          enemyBullet.kill();
          enemyBullet = game.add.sprite(124, 450, 'basic');
          enemyBullet.anchor.setTo(0.5, 0.5);
          enemyBullet.scale.setTo(0.6,0.6);
          enemyBullet.visible = false;  //공격안하면 무기 안보여지게함.
    },
  };

var missile = {
    name : 'missile',
    ofs : 20,
    imgGet : function(){
      game.load.image('missile', './assets/images/missile.png');
      game.load.image('missileBtn', './assets/images/missileBtn.png');
      game.load.image('playerMissile', './assets/images/playerMissile.png');
      game.load.image('enemyMissile', './assets/images/enemyMissile.png');
    },

    playerSkill : function(){
      //유도탄의 능력을 구현
          playItem = itemObj[2];
          playerBullet.kill();
          playerBullet = game.add.sprite(1500, 50, 'playerMissile');
          playerBullet.anchor.setTo(0.5, 0.5);
          playerBullet.scale.setTo(0.3,0.3);
          //상대방 위치로 따라이동
          myPlayer.setCurrentTurn(false);
          game.physics.arcade.moveToObject(playerBullet, player1, 700);
          playing.gauge=-1; //테스트용
    },
    enemySkill : function(){
          enemyItem = itemObj[2];
          enemyBullet.kill();
          enemyBullet = game.add.sprite(124, 50, 'enemyMissile');
          enemyBullet.anchor.setTo(0.5, 0.5);
          enemyBullet.scale.setTo(0.3,0.3);
          //상대방 위치로 따라이동
          game.physics.arcade.moveToObject(enemyBullet, player2, 700);
    },
  };

var shield = {
    name : 'shield',
    imgGet : function(){
      game.load.image('shield', './assets/images/shield.png');
      game.load.image('shieldBtn', './assets/images/shieldBtn.png');
      game.load.image('shieldBrick', './assets/images/shieldBrick.png');
    },
    //플레이어
    playerSkill : function(){
      //방어벽의 능력을 구현
          playerShield.visible = true;
          game.physics.enable(playerShield, Phaser.Physics.ARCADE);
    },
    enemySkill : function(){
          enemyShield.visible = true;
          game.physics.enable(enemyShield, Phaser.Physics.ARCADE);
    },
  };

var portion = {
    name : 'portion',
    imgGet : function(){
      game.load.image('portion', './assets/images/portion.png');
      game.load.image('portionBtn', './assets/images/portionBtn.png');
    },

    playerSkill : function(){
          addHp=100;
          playerHpBar.width = playerHpBar.width+(addHp/player.hp)*hpLength;
          if(playerHpBar.width>450)
            playerHpBar.width = 450;
    },

    enemySkill : function(){
          addHp=100;
          enemyHpBar.width = enemyHpBar.width+(addHp/opponent.hp)*hpLength;
          if(enemyHpBar.width>450)

            enemyHpBar.width = 450;

    },
  };

var oneMore = {
    name : 'oneMore',
    ofs : 0,
    imgGet : function(){
      game.load.image('oneMore', './assets/images/oneMore.png');
      game.load.image('oneMoreBtn', './assets/images/oneMoreBtn.png');
    },

    playerSkill : function(){
      //'한번 더 던지기'의 능력을 구현
      //아직 미완, 일단 이미지삽입만 해놓은상태
      playItem = itemObj[5];
      this.ofs = player.ofs;
      pDoubleBullet.visible = true;
      game.physics.enable(pDoubleBullet, Phaser.Physics.ARCADE);
    },
    enemySkill : function(){
      enemyItem = itemObj[5];
      this.ofs = opponent.ofs;
      eDoubleBullet.visible = true;
      game.physics.enable(eDoubleBullet, Phaser.Physics.ARCADE);
    }
  };

  var conSkill = {
      name : 'conSkill',
      ofs : 80,
      imgGet : function(){
        game.load.image('playerConSkill', './assets/images/playerConSkill.png');
        game.load.image('enemyConSkill', './assets/images/enemyConSkill.png');
      },
    };
