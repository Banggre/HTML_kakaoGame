var frodo = {
    name : 'frodo',
    hp : 450,
    ofs : 70,
    dfs : 10,

    imgGet : function(){
      game.load.spritesheet("frodo", "./assets/images/frodo-sp.png", 800, 1200);
      game.load.image("statsFrodo", "./assets/images/statsFrodo.png");
    },
    playerSkill : function(){
      frodoSkillSet = true;
      player = charObj[10];
      player2.kill();
      player2 = game.add.sprite(1424, 700, 'playerFrodoShield');  //select에서 player = charObj[num]에서 객체를 받은거. 거기서 character.js보면 name따와서 삽입.
      player2.scale.setTo(0.25,0.25);
      player2.anchor.setTo(0.5, 1);
    },
    enemySkill : function(){
      frodoSkillSet = true;
      opponent = charObj[10];
      player1.kill();
      player1 = game.add.sprite(200, 700, "enemyFrodoShield");  //select에서 player = charObj[num]에서 객체를 받은거. 거기서 character.js보면 name따와서 삽입.
      player1.scale.setTo(0.25,0.25);
      player1.anchor.setTo(0.5, 1);
    },
};

var playerFrodoShield = {
    name : 'playerFrodoShield',
    hp : 450,
    ofs: 70,
    dfs: 60,

    imgGet : function(){
      game.load.image("playerFrodoShield", "./assets/images/playerFrodoShield.png", 800, 1200);
      game.load.image("enemyFrodoShield", "./assets/images/enemyFrodoShield.png", 800, 1200);
    },
};

var ryan = {
    name : 'ryan',
    hp : 450,
    ofs : 75,
    dfs : 20,

    imgGet : function(){
      game.load.spritesheet("ryan", "./assets/images/ryan-sp.png", 800, 1200);
      game.load.image('pRyanSkill', './assets/images/pRyanSkill.png');
      game.load.image('eRyanSkill', './assets/images/eRyanSkill.png');
    },
    playerSkill : function(){
      //라이언의 스킬을 구현
      //상대방 한턴 쉬기
      player2.kill();
      player2 = game.add.sprite(1424, 700, 'pRyanSkill');
      player2.scale.setTo(0.25,0.25);
      player2.anchor.setTo(0.5, 1);
      game.time.events.add (Phaser.Timer.SECOND * 1, this.pStopSkillImg, this);

    },
    enemySkill : function(){
      //라이언의 스킬을 구현
      //상대방 한턴 쉬기
      player1.kill();
      player1 = game.add.sprite(200, 700, 'eRyanSkill');
      player1.scale.setTo(0.25,0.25);
      player1.anchor.setTo(0.5, 1);
      game.time.events.add (Phaser.Timer.SECOND * 1, this.eStopSkillImg, this);
    },
    pStopSkillImg : function(){
      lionSkillSet = true;
      player2.kill();
      player2 = game.add.sprite(1424, 700, player.name);
      player2.animations.add("damagedAniForEnemy", [3, 2], 1, true);
      player2.scale.setTo(0.25,0.25);
      player2.anchor.setTo(0.5, 1);
      player2.frame = 2;
    },
    eStopSkillImg : function(){
      lionSkillSet = true;
      player1.kill();
      player1 = game.add.sprite(200, 700, opponent.name);
      player1.animations.add("damagedAniForPlayer", [1, 2], 1, true);
      player1.scale.setTo(0.25,0.25);
      player1.anchor.setTo(0.5, 1);
      player1.frame = 2;
    },
};

var con = {
    name : 'con',
    hp : 400,
    ofs : 85,
    dfs : 20,

    imgGet : function(){
      game.load.spritesheet("con", "./assets/images/con-sp.png", 346, 434);
    },
    playerSkill : function(){
        playItem = itemObj[6];
        playerBullet.kill();
        playerBullet = game.add.sprite(1500, 450, 'playerConSkill');
        playerBullet.anchor.setTo(0.5, 0.5);
        playerBullet.scale.setTo(0.6,0.6);
        playerBullet.visible = false;  //공격안하면 무기 안보여지게함.
      //콘의 스킬을 구현
      //무지 데려오기 한번더구현과 비슷

    },
    enemySkill : function(){
        enemyItem = itemObj[6];
        enemyBullet.kill();
        enemyBullet = game.add.sprite(124, 450, 'enemyConSkill');
        enemyBullet.anchor.setTo(0.5, 0.5);
        enemyBullet.scale.setTo(0.6,0.6);
        enemyBullet.visible = false;  //공격안하면 무기 안보여지게함.
      //콘의 스킬을 구현
      //무지 데려오기 한번더구현과 비슷

    },
  };

  var econ = {
      name : 'econ',
      hp : 400,
      ofs : 85,
      dfs : 20,

      imgGet : function(){
        game.load.spritesheet("econ", "./assets/images/econ-sp.png", 346, 434);
      },
      playerSkill : function(){
          playItem = itemObj[6];
          playerBullet.kill();
          playerBullet = game.add.sprite(1500, 450, 'playerConSkill');
          playerBullet.anchor.setTo(0.5, 0.5);
          playerBullet.scale.setTo(0.6,0.6);
          playerBullet.visible = false;  //공격안하면 무기 안보여지게함.
        //콘의 스킬을 구현
        //무지 데려오기 한번더구현과 비슷

      },
      enemySkill : function(){
          enemyItem = itemObj[6];
          enemyBullet.kill();
          enemyBullet = game.add.sprite(124, 450, 'enemyConSkill');
          enemyBullet.anchor.setTo(0.5, 0.5);
          enemyBullet.scale.setTo(0.6,0.6);
          enemyBullet.visible = false;  //공격안하면 무기 안보여지게함.
        //콘의 스킬을 구현
        //무지 데려오기 한번더구현과 비슷

      },
    };

var apeach = {
    name : 'apeach',
    hp : 400,
    ofs : 70,
    dfs : 15,

    imgGet : function(){
      game.load.spritesheet("apeach", "./assets/images/apeach-sp.png", 800, 1200);
      game.load.image("statsApeach", "./assets/images/statsApeach.png");
    },
    playerSkill : function(){
      //아피치의 스킬을 구현
      //this.hp+=30; //체력회복
      addHp = 30;
      playerHpBar.width = playerHpBar.width+(addHp/player.hp)*hpLength;
      if(playerHpBar.width>450)
        playerHpBar.width = 450;

    },
    enemySkill : function(){
      //아피치의 스킬을 구현
      //this.hp+=30; //체력회복
      addHp = 30;
      enemyHpBar.width = enemyHpBar.width+(addHp/opponent.hp)*hpLength;
      if(enemyHpBar.width>450)
        enemyHpBar.width = 450;


    },
};

var tube = {
    name : 'tube',
    hp : 350,
    ofs : 75,
    dfs : 15,

    imgGet : function(){
      game.load.spritesheet("tube", "./assets/images/tube-sp.png", 800, 1200);
      game.load.image("statsTube", "./assets/images/statsTube.png");
    },
    playerSkill : function(){
      //튜브의 스킬을 구현(엥그리튜브로 바뀜)
      tubeSkillSet = true;
      player = charObj[9];
      player2.kill();
      player2 = game.add.sprite(1424, 700, player.name);  //select에서 player = charObj[num]에서 객체를 받은거. 거기서 character.js보면 name따와서 삽입.
      player2.scale.setTo(0.25,0.25);
      player2.anchor.setTo(0.5, 1);
      player2.frame = 2;
    },
    enemySkill : function(){
      //튜브의 스킬을 구현(엥그리튜브로 바뀜)
      tubeSkillSet = true;
      opponent = charObj[12];
      player1.kill();
      player1 = game.add.sprite(200, 700, opponent.name);  //select에서 player = charObj[num]에서 객체를 받은거. 거기서 character.js보면 name따와서 삽입.
      player1.scale.setTo(0.25,0.25);
      player1.anchor.setTo(0.5, 1);
      player1.frame = 2;
    },
};

var angryTube = {
    name : 'angryTube',
    hp : 350,
    ofs : 120,
    dfs : 15,

    imgGet : function(){
      game.load.spritesheet("angryTube", "./assets/images/angryTube-sp.png", 800, 1200);
    },
};

var eAngryTube = {
    name : 'eAngryTube',
    hp : 350,
    ofs : 120,
    dfs : 15,

    imgGet : function(){
      game.load.spritesheet("eAngryTube", "./assets/images/eAngryTube-sp.png", 800, 1200);
    },
};

var playerBeat;
var enemyBeat;

var jayG = {
    name : 'jayG',
    hp : 350,
    ofs : 70,
    dfs : 20,

    imgGet : function(){
      game.load.spritesheet("jayG", "./assets/images/jayG-sp.png", 1000, 1418);
      game.load.image("statsJayG", "./assets/images/statsJayG.png");
      game.load.image('beat', './assets/images/beat.png');
    },
    playerSkill : function(){
      //제이지의 스킬을 구현
      playerBeat.visible = true;
      playerBeat.body.gravity.y = 1000;
      //game.physics.arcade.overlap(player1, beat, Game.dropTheBeat(), null, Game);  //제이지 드랍더비트 관련
    },
    enemySkill : function(){
      //제이지의 스킬을 구현
      enemyBeat.visible = true;
      enemyBeat.body.gravity.y = 1000;
      //game.physics.arcade.overlap(player1, beat, Game.dropTheBeat(), null, Game);  //제이지 드랍더비트 관련
    },
};

var muzi = {
    name : 'muzi',
    hp : 400,
    ofs : 75,
    dfs : 10,

    imgGet : function(){
      game.load.spritesheet("muzi", "./assets/images/muzi-sp.png", 800, 1200);
      game.load.image("statsMuzi", "./assets/images/statsMuzi.png");
      game.load.image('dark', './assets/images/dark.png');
    },
    playerSkill : function(){
      //무지의 스킬을 구현
      //상대방 화면 가리기
      /*
      dark = game.add.sprite(376, 325, 'dark');
      dark.anchor.setTo(0.5,0.5);
      game.time.events.add (Phaser.Timer.SECOND * 15, this.stopDark, this);
      */
    },
    enemySkill : function(){
      //무지의 스킬을 구현
      //상대방 화면 가리기
      dark.visible = true;
      game.time.events.add (Phaser.Timer.SECOND * 10, this.stopDark, this);
    },

    stopDark : function(){
      dark.kill();
    },
};

var neo = {
      name : 'neo',
      hp : 350,
      ofs : 85,
      dfs : 10,

      imgGet : function(){
        game.load.spritesheet("neo", "./assets/images/neo-sp.png", 800, 1200);
        game.load.image("statsNeo", "./assets/images/statsNeo.png");
        game.load.spritesheet("playerNeoSkill", "./assets/images/playerNeoSkill.png", 800, 1200);
        game.load.spritesheet("enemyNeoSkill", "./assets/images/enemyNeoSkill.png", 800, 1200);
      },

      playerSkill : function(){
        //네오의 스킬을 구현
        //직접때리기
        neoSkillSet = true;
        player2.kill();
        player2 = game.add.sprite(1424, 700, 'playerNeoSkill');  //select에서 player = charObj[num]에서 객체를 받은거. 거기서 character.js보면 name따와서 삽입.
        player2.scale.setTo(0.25,0.25);
        player2.anchor.setTo(0.5, 1);
        player2.frame = 2;
        player2.animations.add("playerSkill", [0, 3], 10, true);
        player2.animations.play('playerSkill');
        player2.body.velocity.x = -500;
      },
      enemySkill : function(){
        //네오의 스킬을 구현
        //직접때리기
        player1.kill();
        player1 = game.add.sprite(200, 700, 'enemyNeoSkill');  //select에서 player = charObj[num]에서 객체를 받은거. 거기서 character.js보면 name따와서 삽입.
        player1.scale.setTo(0.25,0.25);
        player1.anchor.setTo(0.5, 1);
        player1.frame = 2;
        player1.animations.add("enemySkill", [0, 3], 10, true);
        player1.animations.play('enemySkill');
        player1.body.velocity.x = +500;
      },
};

var random = {
        name : 'random',

        imgGet : function(){
        game.load.spritesheet("random", "./assets/images/random-sp.png", 800, 1200);
        game.load.image("statsRandom", "./assets/images/statsRandom.png");
        },
};
