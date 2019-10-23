var player;  //케릭터 선택시 플레이어로 배정하기 위한 변수
var playItem;  //게임플레이에서 아이템 선택시 아이템을 사용하기 위한 변수
var enemyItem;
var playItemSet = new Array; //선택화면에서 고른 아이템을 장착시키기 위한 배열
var itemObj = [basic, big, missile, portion, shield, oneMore, conSkill];
var itemName = ['basic', 'big', 'missile', 'portion', 'shield', 'oneMore', 'conSkill'];  //아이템 객체배열
var num=0; //선택버튼을 위한 변수(일종의 회전목마를 위해 삽입한거라 보면됨)
var check; //랜덤선택을 위해 임의로 삽입한 변수
var charImg = ['frodo', 'muzi', 'jayG', 'apeach', 'neo', 'tube', 'random', 'ryan', 'con', 'angryTube', 'playerFrodoShield', 'econ', 'eAngryTube']; //캐릭터 이미지를 불러올때 이름으로 불러오기 위해 삽입한 단순 스트링배열
var charObj = [frodo, muzi, jayG, apeach, neo, tube, random, ryan, con, angryTube, playerFrodoShield, econ, eAngryTube]; //캐릭터 객체 배열
var showStat = ['statsFrodo', 'statsMuzi', 'statsJayG', 'statsApeach', 'statsNeo', 'statsTube', 'statsRandom']; //캐릭터 능력치를 불러올때 이름으로 불러오기 위해 삽입
var bigOn=false;
var missileOn=false;
var portionOn=false;
var shieldOn=false;
var oneMoreOn=false;

////////////////////////////////////
//// 오디오
////////////////////////////////////
var selectBGM;
var clickSound;


var Select = {
    preload : function() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; game.scale.pageAlignHorizontally = true; game.scale.pageAlignVertically = true;
        // game 객체에서 menu 이미지를 로드한다.
        //케릭터 이미지 로드
        frodo.imgGet();
        ryan.imgGet();
        muzi.imgGet();
        jayG.imgGet();
        apeach.imgGet();
        con.imgGet();
        econ.imgGet();
        neo.imgGet();
        tube.imgGet();
        angryTube.imgGet();
        random.imgGet();
        playerFrodoShield.imgGet();
        eAngryTube.imgGet();

        //선택창 바탕 및 버튼 이미지 로드
        game.load.image('pre', './assets/images/pre.png');
        game.load.image('next', './assets/images/next.png');
        game.load.image('start', './assets/images/start.png');
        game.load.image('selectPlate', './assets/images/selectPlate.png');
        game.load.image('charPlate', './assets/images/charPlate.png');
        game.load.image('itemPlate', './assets/images/itemPlate.png');
        game.load.image('title', './assets/images/title.png');

        //아이템 이미지 로드
        big.imgGet();
        missile.imgGet();
        basic.imgGet();
        portion.imgGet();
        shield.imgGet();
        oneMore.imgGet();
        conSkill.imgGet();

        //error이미지
        game.load.image('error', './assets/images/error.png');
        game.load.image('wait', './assets/images/wait.png');

        game.load.audio('selectBGM', './assets/musics/goldenAlley.mp3');
        game.load.audio('clickSound', './assets/musics/click.mp3');

    },

    create: function () {
        clickSound = game.add.audio('clickSound', 1, false);

        // 배경음을 추가한다.
        selectBGM = game.add.audio('selectBGM', 0.5, true);
        selectBGM.play();

        // 이미지를 표시한다.

        //선택창 바탕 작업
        game.stage.backgroundColor = '#FBCCBA';
        selectMap = game.add.sprite(0, 0, 'selectPlate'); //선택창 전체바탕이미지
        selectMap.width = 1624;
        selectMap.height = 750;

        title = game.add.sprite(250, 0, 'title');
        title.anchor.setTo(0.5, 0);
        title.scale.setTo(0.4,0.4);

        charPlate = game.add.sprite(800, 10, 'charPlate');
        charPlate.anchor.setTo(0.5, 0);
        charPlate.scale.setTo(0.45,0.45);

        itemPlate = game.add.sprite(1300, 10, 'itemPlate');
        itemPlate.anchor.setTo(0.5, 0);
        itemPlate.scale.setTo(0.5,0.45);

        pre = this.add.button(620, 300, 'pre', this.preShow, this); //앞으로가기 버튼
        pre.anchor.set(0.5, 0.5);
        pre.scale.setTo(0.4,0.4);

        next = this.add.button(980, 300, 'next', this.nextShow, this);  //뒤로가기버튼
        next.anchor.set(0.5, 0.5);
        next.scale.setTo(0.4,0.4);

        character = game.add.sprite(800, 100, charImg[num]); //num이용해서 케릭터 이미지 바꿀수있음
        character.frame = 2;  //이미지가 스프라이트로 되어있어 기본이미지를 프레임 인덱스2 즉 스프라이트에서 가운데 이미지를 기본으로 사용.
        character.anchor.set(0.5, 0);
        character.scale.setTo(0.25,0.25);

        statsPlate = game.add.sprite(800, 550, showStat[num]);
        statsPlate.anchor.set(0.5, 0.5);
        statsPlate.scale.setTo(0.4,0.4);

        start = this.add.button(1300, 620, 'start', this.start, this);  //게임시작버튼
        start.anchor.set(0.5, 0.5);
        start.scale.setTo(0.5,0.45);


        //플레이어 및 아이템 작업
        check = num;
        player = charObj[check];  //num이 현재 0이므로 케릭터 객체를 charObj[0]인 프로도를 플레이어로, 아래 코드에서 pre next에 따라 num 변하게 만듬.
        playItem = itemObj[0]; //기본무기셋팅
        enemyItem = itemObj[0];

        //아이템 버튼 삽입
        big = this.add.button(1140, 200, 'bigBtn', this.bigBtn, this);
        big.scale.setTo(0.25,0.25);
        missile = this.add.button(1380, 200, 'missileBtn', this.missileBtn, this);
        missile.scale.setTo(0.25,0.25);
        portion = this.add.button(1260, 200, 'portionBtn', this.portionBtn, this);
        portion.scale.setTo(0.25,0.25);
        shield = this.add.button(1200, 350, 'shieldBtn', this.shieldBtn, this);
        shield.scale.setTo(0.25,0.25);
        oneMore = this.add.button(1320, 350, 'oneMoreBtn', this.oneMoreBtn, this);
        oneMore.scale.setTo(0.25,0.25);

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //socket.io - 시작
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        Client.socket.on('finishSelect', function(data){
            if(myPlayer.getCurrentTurn()==true){
              windSet = data.wind;
            }else{
              windSet = 4 - data.wind;
            }
            game.state.start('Game');
        });
    },

    update: function() {
        if(playItemSet.length>3){
          errorMsg = game.add.sprite(812, 325, 'error');
          errorMsg.anchor.setTo(0.5, 0.5);
          playItemSet = [];
          game.time.events.add (Phaser.Timer.SECOND * 1, this.error, this);
        }
    },

    preShow: function () {
        clickSound.play();
        character.kill(); //앞으로가기 버튼 눌르면 현재보이는 케릭터를 삭제
        statsPlate.kill();
        num--;  //앞으로갔으니 숫자가 줄어든다.
        if(num<0)  //단, 숫자가 0이하일경우, 즉 배열의 제일 왼쪽을 넘어서면
          num=6;  //케릭터 객체애서 랜덤과, 히든 케릭터전에 해당하는 즉, 기본케릭터의 제일 마지막에 해당되는 인덱스를 반환해서 회전목마처럼구현
          character = game.add.sprite(800, 100, charImg[num]); //num이용해서 케릭터 이미지 바꿀수있음
          character.frame = 2;  //이미지가 스프라이트로 되어있어 기본이미지를 프레임 인덱스2 즉 스프라이트에서 가운데 이미지를 기본으로 사용.
          character.anchor.set(0.5, 0);
          character.scale.setTo(0.25,0.25);

          statsPlate = game.add.sprite(800, 550, showStat[num]);
          statsPlate.anchor.set(0.5, 0.5);
          statsPlate.scale.setTo(0.4,0.4);
        check = num;  //현재의 num을 저장. check의 경우 랜덤일 경우 숫자 왔다갔다하기 위해 따로 저장
        if(check==6){
          check=game.rnd.integerInRange(0, 8); //랜덤을 택할경우, 케릭터객체에서 0번부터 8번까지 중의 번호를 할당. 하지만 랜덤도 포함되어있음.
          if(check==6)  //check로 랜덤숫자를 받았는데 만약 랜덤으로 받은 숫자가 또 랜덤으로 받았을경우,
            check=game.rnd.integerInRange(0, 5);  //기본케릭터에 해당되는 숫자들로 다시 랜덤 돌린다.
            //정리하자면, 랜덤돌렸는데 내부적작동과정에서 또 랜덤나오면 기본케릭터중에서 랜덤으로 설정한다는 소리.
        }
        player = charObj[check];  //해당 플레이어로 게임플레이어를 설정.
    },

    //넥스트는 pre와 동일
    nextShow: function () {
        clickSound.play();
        character.kill();
        statsPlate.kill();
        num++;
        if(num>6)
          num=0;
          character = game.add.sprite(800, 100, charImg[num]); //num이용해서 케릭터 이미지 바꿀수있음
          character.frame = 2;  //이미지가 스프라이트로 되어있어 기본이미지를 프레임 인덱스2 즉 스프라이트에서 가운데 이미지를 기본으로 사용.
          character.anchor.set(0.5, 0);
          character.scale.setTo(0.25,0.25);

          statsPlate = game.add.sprite(800, 550, showStat[num]);
          statsPlate.anchor.set(0.5, 0.5);
          statsPlate.scale.setTo(0.4,0.4);

        check = num;
        if(check==6){
          check=game.rnd.integerInRange(0, 8);
          if(check==6)
            check=game.rnd.integerInRange(0, 5);
        }
        player = charObj[check];
    },

    //장착
    bigBtn: function(){
        clickSound.play();
        big.pendingDestroy = true;
        playItemSet.push(itemObj[1]);  //push는 배열에 순차적으로 인자를 삽입한다라는 것. 따라서 선택한 아이템이 차례로 들어감.
        bigSet = this.add.button(1140, 200, 'bigBtn', this.bigSetBtn, this); //선택한 아이템이 장착사각형안에 들어감. 추후 체크로 변경할것
        bigSet.scale.setTo(0.25,0.25);
        bigSet.alpha = 0.5;
        bigOn = true;
        choice.bigBtnPick = true;
    },

    missileBtn: function(){
        clickSound.play();
        missile.pendingDestroy = true;
        playItemSet.push(itemObj[2]);
        missileSet = this.add.button(1380, 200, 'missileBtn', this.missileSetBtn, this);
        missileSet.scale.setTo(0.25,0.25);
        missileSet.alpha = 0.5;
        missileOn = true;
        choice.missileBtnPick = true;
    },

    portionBtn: function(){
        clickSound.play();
        portion.pendingDestroy = true;
        playItemSet.push(itemObj[3]);
        portionSet = this.add.button(1260, 200, 'portionBtn', this.portionSetBtn, this);
        portionSet.scale.setTo(0.25,0.25);
        portionSet.alpha = 0.5;
        portionOn = true;
        choice.portionBtnPick = true;
    },

    shieldBtn: function(){
        clickSound.play();
        shield.pendingDestroy = true;
        playItemSet.push(itemObj[4]);
        shieldSet = this.add.button(1200, 350, 'shieldBtn', this.shieldSetBtn, this);
        shieldSet.scale.setTo(0.25,0.25);
        shieldSet.alpha = 0.5;
        shieldOn = true;
        choice.shieldBtnPick = true;
    },

    oneMoreBtn: function(){
        clickSound.play();
        oneMore.pendingDestroy = true;
        playItemSet.push(itemObj[5]);
        oneMoreSet = this.add.button(1320, 350, 'oneMoreBtn', this.oneMoreSetBtn, this);
        oneMoreSet.scale.setTo(0.25,0.25);
        oneMoreSet.alpha = 0.5;
        oneMoreOn = true;
        choice.oneMoreBtnPick = true;
    },

    //장착해제 (현재 오류 - 아이콘이 사라지는데 장착해제가 구현이 안되어있음...;; 수정할게요)
    bigSetBtn: function(){
        clickSound.play();
        bigSet.pendingDestroy = true;  //장착상자안에 장착된 아이템을 누르면 버튼이 사라짐
        big = this.add.button(1140, 200, 'bigBtn', this.bigBtn, this);
        big.scale.setTo(0.25,0.25);
        bigOn = false;
        playItemSet.splice(playItemSet.indexOf(itemObj[1]),1);
    },

    missileSetBtn: function(){
        clickSound.play();
        missileSet.pendingDestroy = true;
        missile = this.add.button(1380, 200, 'missileBtn', this.missileBtn, this);
        missile.scale.setTo(0.25,0.25);
        missileOn = false;
        playItemSet.splice(playItemSet.indexOf(itemObj[2]),1);
    },

    portionSetBtn: function(){
        clickSound.play();
        portionSet.pendingDestroy = true;
        portion = this.add.button(1260, 200, 'portionBtn', this.portionBtn, this);
        portion.scale.setTo(0.25,0.25);
        portionOn = false;
        playItemSet.splice(playItemSet.indexOf(itemObj[3]),1);
    },

    shieldSetBtn: function(){
        clickSound.play();
        shieldSet.pendingDestroy = true;
        shield = this.add.button(1200, 350, 'shieldBtn', this.shieldBtn, this);
        shield.scale.setTo(0.25,0.25);
        shieldOn = false;
        playItemSet.splice(playItemSet.indexOf(itemObj[4]),1);
    },

    oneMoreSetBtn: function(){
        clickSound.play();
        oneMoreSet.pendingDestroy = true;
        oneMore = this.add.button(1320, 350, 'oneMoreBtn', this.oneMoreBtn, this);
        oneMore.scale.setTo(0.25,0.25);
        oneMoreOn = false;
        playItemSet.splice(playItemSet.indexOf(itemObj[5]),1);
    },

    error:function(){
        clickSound.play();
        errorMsg.kill();
        if(bigOn==true)
          this.bigSetBtn();
        if(missileOn==true)
          this.missileSetBtn();
        if(portionOn==true)
          this.portionSetBtn();
        if(shieldOn==true)
          this.shieldSetBtn();
        if(oneMoreOn==true)
          this.oneMoreSetBtn();
    },

    start: function() {
        start.pendingDestroy = true;
        clickSound.play();
        choice.roomId = gameInfo.roomId;
        playing.roomId = gameInfo.roomId;
        choice.characterPick = player;
        switch(playItemSet.length){
          case 0:
          break;

          case 1:
            choice.enemyItemPick.push(playItemSet[0].name);
          break;

          case 2:
            choice.enemyItemPick.push(playItemSet[0].name);
            choice.enemyItemPick.push(playItemSet[1].name);
          break;

          default :
            choice.enemyItemPick.push(playItemSet[0].name);
            choice.enemyItemPick.push(playItemSet[1].name);
            choice.enemyItemPick.push(playItemSet[2].name);
        }

        Client.socket.emit('selectInfo', choice);
        waitMsg = game.add.sprite(812, 325, 'wait');
        waitMsg.anchor.setTo(0.5, 0.5);
    }

};
