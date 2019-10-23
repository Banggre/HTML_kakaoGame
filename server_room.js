var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);

var io = require('socket.io')/*.listen*/(server); // '.listen' 없어도 됨

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//네임스페이스(기본 값은 '/(루트)') 내 채널이 room
//room에 입장: join, room에서 떠나기: leave(서버에서 처리 해줘야  )
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var rooms = 0;

var lobby = new Array;
var lobbyNum = 0;

var ready = new Array;
var wind = new Array;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//In Node.js, __dirname is always the directory in which the currently executing script resides (see this).
//So if you typed __dirname into /d1/d2/myscript.js, the value would be /d1/d2.
//By contrast, . gives you the directory from which you ran the node command in your terminal window (i.e. your working directory).
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//(1) 미들웨어 설정(mount) - app.use([path], function(req, res, *next*)...).
//(2) 정적 파일 요청 미들웨어(jpg, css, js ...) - express.static(root, [options])
//    express.static('images') - images 폴더에 있다는 뜻
//    app.use('/css', express.static('files')) > ~/css/images.jpg - files 폴더에서 images.jpg를 찾는다
app.use('/assets/css', express.static(__dirname + '/assets/css'));
app.use('/assets/images', express.static(__dirname + '/assets/images'));
app.use('/assets/js', express.static(__dirname + '/assets/js'));
app.use('/assets/tutorial', express.static(__dirname + '/assets/tutorial'));
app.use('/assets/musics', express.static(__dirname + '/assets/musics'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

//메소드별 라우팅 - app.get([path], callback) : path 요청 경로, callback 요청 담당 미들웨어
//'/'(루트)에 대한 get 요청이 오면 callback function 처리 한다.
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index_room.html');
});

server.listen(process.env.PORT || 8081, function(){
    console.log('Listening on '+ server.address().port);
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//socket.io - 시작
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

io.on('connection', function(socket) {
    console.log('새로운 유저가 웹사이트에 접속했습니다!');

    var roomInfo; // diconnect시 상대편에게 알리기 위한 변수
    var checkRoom;
    var room;

    function makeRoom(data) {
        //1번부터 순서대로 check하면서 대기중인 방을 찾는중
        for(checkRoom = 1 ; checkRoom <= rooms ; checkRoom++) {
            //console.log(io.nsps['/'].adapter.rooms['room-' + checkRoom]); // data.room의 현재 상황을 받아옴
            room = io.nsps['/']/*네임스페이스*/.adapter.rooms['room-' + checkRoom];
            //console.log(room);
            if(!room) { //방이 개설되어 있지 않으면,
                //console.log('검색 결과 개설되어 있지 않은 방: ', checkRoom);
                socket.join('room-' + checkRoom);
                roomInfo = 'room-' + checkRoom;
                console.log(roomInfo, ': is made!');

                socket.emit('newGame', {name: data.name, room: 'room-' + checkRoom});
                //console.log(io.nsps['/']/*네임스페이스*/.adapter.rooms);

                lobby[lobbyNum] = 'room-' + checkRoom;
                lobbyNum++; // 대기중인 방의 수 증가
                //console.log(lobby, '1');
                //console.log(lobbyNum, '1');
                return;
            }
        }

        if(rooms >= 10) { // 현재 설정된 방 개설 최대 개수 : '3'
            socket.emit('roomFull', {});
            return;
        }

        //console.log(rooms);
        //console.log(checkRoom);
        if(checkRoom > rooms) {
            socket.join('room-' + ++rooms);
            //console.log(rooms, '(rooms)');
            //console.log('room-' + rooms);
            roomInfo = 'room-' + rooms;
            console.log(roomInfo, ': is made!');

            socket.emit('newGame', {name: data.name, room: 'room-' + rooms} );
            //console.log(io.nsps['/']/*네임스페이스*/.adapter.rooms);

            lobby[lobbyNum] = 'room-' + checkRoom;
            lobbyNum++; // 대기중인 방의 수 증가
            //console.log(lobby, '2');
            //console.log(lobbyNum, '2');
        }
    }

    function joinRoom(data) {
        var lobbyNumForCheck = lobbyNum--;
        //1번부터 순서대로 check하면서 대기중인 방을 찾는중
        for(checkRoom = 1 ; checkRoom <= lobbyNumForCheck ; checkRoom++) {
            //console.log(io.nsps['/'].adapter.rooms['room-' + checkRoom]); // data.room의 현재 상황을 받아옴
            room = io.nsps['/']/*네임스페이스*/.adapter.rooms[lobby[checkRoom - 1]];
            //console.log(room);
            if(room && room.length == 1) {
                //console.log(checkRoom);
                break;
            }
        }

        //console.log(io.nsps);
        //onsole.log(room);
        //console.log(checkRoom);
        if(room && room.length == 1) {
            socket.join(lobby[checkRoom - 1]);
            roomInfo = lobby[checkRoom - 1]; // roomInfo에다가 join한 방 기록
            console.log(roomInfo, ': join!');

            ready[lobby[checkRoom - 1]] = 0;

            // 'socket.broadcast.to' broadcasts to all sockets in the given room, except to the socket on which it was called
            socket.broadcast.to(lobby[checkRoom - 1]).emit('player1', {name: data.name, room: lobby[checkRoom - 1] });

            // join을 신청한 socket한테 내보냄
            socket.emit('player2', {name: data.name, room: lobby[checkRoom - 1] }); //내가 처음에 가지고 들어온 정보를 다시 가지고 나감
            lobby.shift();

            return;
        }

        makeRoom(data);
    }

    /////////////////////////////////
    // (1) player의 방 개설 & 합류
    /////////////////////////////////

    socket.on('gameMatch', function(data){
        //최초로 생성되는 방은 room-1이 됨
        //console.log('room-' + ++rooms);
        var room;
        var checkRoom;

        //console.log(lobbyNum);
        if(lobbyNum > 0) {
            joinRoom(data);
        } else {
            makeRoom(data);
        }

    });

    /////////////////////////////////
    // (2) player의 방 탈주
    /////////////////////////////////

    socket.on('disconnect', function(data){
        room = io.nsps['/']/*네임스페이스*/.adapter.rooms[roomInfo];
        //console.log(room);
        if(room && room.length == 1) {
            socket.broadcast.to(roomInfo).emit('enemyLogout',data);
        } else {
            console.log(roomInfo, ' :is destroyed!');
        }
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    socket.on('selectInfo', function(data){
        ready[data.roomId]++;
        //console.log(ready);
        socket.broadcast.to(data.roomId).emit('opponentInfo', data);
        if(ready[data.roomId]==2){
            io.sockets.in(data.roomId).emit('finishSelect', data);
            ready[data.roomId] = 0;
        }
    });

    socket.on('playReadyComplete', function(data){
        ready[data]++;
        //console.log(ready);
        if(ready[data]==2){
            //console.log('test');
            io.sockets.in(data).emit('okPlayStart', data);
            ready[data] = 0;
        }
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    socket.on('useFirstItem', function(data){
        socket.broadcast.to(data.roomId).emit('firstItemUsed', data);
    });

    socket.on('useSecondItem', function(data){
        socket.broadcast.to(data.roomId).emit('secondItemUsed', data);
    });

    socket.on('useThirdItem', function(data){
        socket.broadcast.to(data.roomId).emit('thirdItemUsed', data);
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    socket.on('IAttack', function(data){
        socket.broadcast.to(data.roomId).emit('ItAttack', data);
    });

    socket.on('ReadyAttack', function(data){
        //console.log("attack");
        socket.broadcast.to(data.roomId).emit('AttackSoon',data);
    });

    socket.on('doubleAttack', function(data){
        socket.broadcast.to(data.roomId).emit('pDoubleAttack', data);
    });

    socket.on('playerSkill', function(data){
        socket.broadcast.to(data.roomId).emit('enemySkill', data);
    });

    socket.on('yourTurn', function(data){
        socket.broadcast.to(data.roomId).emit('myTurn',data);
    });

    socket.on('finishAttack', function(data){
      ready[data.roomId]++;
      if(ready[data.roomId]==2){
          data.wind = Math.floor(Math.random()*5);
          io.sockets.in(data.roomId).emit('wind', data);
          ready[data.roomId] = 0;
      }
    });

});
