const chouMa = "res/atlas/3avatar.jpg"
const sixPoker = "res/atlas/6-1.jpg"
const pokerBg = "res/atlas/poker_bg.png"
const peopleNum = 6
const pw = 250>>2
const ph = 374>>2
let msg = null
let tempScan = null
const Zhajinhua = {
    picNum:0,
    myPlayer:null,
    myPlayerPokerUrl:[],
    players:[],
    Draw:{},
    service:{},
    Event:{},
    roomInfo:{},
    socket:null,
    tool:{},
    doing:{},
    chip_ac:[],
    positions:{},
    socketAddress:{},
    pokerImg:new Map(),
    picList:[chouMa,sixPoker,pokerBg]
}

Zhajinhua.service.getSocketAdress = function(){
    const hr = new HttpRequest();
    hr.once(Event.PROGRESS, this, Zhajinhua.socketAddress.onHttpRequestProgress);
    hr.once(Event.COMPLETE, this, Zhajinhua.socketAddress.onHttpRequestComplete);
    hr.once(Event.ERROR, this, Zhajinhua.socketAddress.onHttpRequestErrorError);
    hr.send(Adress+'/get-socketAddress', null, 'get', 'json');
    Zhajinhua.socketAddress.hr = hr
}
Zhajinhua.socketAddress.onHttpRequestError = function(e)
{
    console.log(e);
}

Zhajinhua.socketAddress.onHttpRequestProgress = function(e)
{
    console.log(e);
}

Zhajinhua.socketAddress.onHttpRequestComplete = function(e)
{   
    const rus = Zhajinhua.socketAddress.hr.data
    if(rus.status){
        Zhajinhua.network(rus.data)
    }
    console.log(rus)
    // logger.text += "收到数据：" + hr.data;
}
Zhajinhua.network = function(url){
    const Event  = Laya.Event;
	const Byte   = Laya.Byte;
    const socket = io.connect(url);
    // socket.on('connect', function () {
    //     socket.send('hi');

    //     socket.on('message', function (msg) {
    //     // my msg
    //     });
    // });
    Zhajinhua.socket = socket
    Zhajinhua.socket.emit(Zhajinhua.roomInfo.roomNo, msg);
    socket.on(Zhajinhua.roomInfo.roomNo, function(msg){
        console.log(msg)
        Laya.stage.destroyChildren()
        Zhajinhua.tool.forPlayer(msg)
        const ps = Zhajinhua.players
        let p = null
        for(let i in ps){
            if(ps[i].user.id == msg.backObj.playerId){
                p= ps[i];
            }
        }
        if(msg.backObj.acType === 'ON_COME'){
            Zhajinhua.view(msg)
        }
        if(msg.backObj.acType === 'ON_READY'){
            Zhajinhua.view(msg)
        }
        if(msg.backObj.acType === 'SHOW_VALUE'){
            Zhajinhua.view(msg)
            Zhajinhua.Draw.showValue(p)
        }
        if(msg.backObj.acType === 'ON_RAISE'){
            Zhajinhua.view(msg)
            Zhajinhua.Draw.touzhu(p)
        }
        if(msg.backObj.acType === 'ON_START'){
            Zhajinhua.view(msg)
            Zhajinhua.Draw.fapai()
        }
        if(msg.backObj.acType === 'GAME_PASS'){
           Zhajinhua.Draw.onPass(msg)
            Zhajinhua.view(msg)
        }
        if(msg.backObj.acType === 'GAME_PK'){
            Zhajinhua.Draw.pkAc(msg)
            Zhajinhua.view(msg)
        }
        if(msg.backObj.acType === 'GAME_OVER'){
            Zhajinhua.tool.setDongPlers([])
            Zhajinhua.view(msg)
            Zhajinhua.Draw.over(msg)
        }
    })
    
}
Zhajinhua.reset = function(){
    Zhajinhua.positions.pokerPositions = []
    Zhajinhua.positions.chipPositions = []
    Zhajinhua.positions.showPokerPositions = []
    console.log(Zhajinhua.positions)
}
Zhajinhua.init = function(){
    Zhajinhua.positions.id = User.id
    Zhajinhua.reset()
    Laya.stage.destroyChildren()
    msg = { 
        acType: 'ON_COME',
        roomId: Zhajinhua.roomInfo.roomNo,
        playerId:User.id,
        playerRoom:Zhajinhua.positions,
        raiseMoney:1
    }
    Laya.stage.bgColor = "#ffffff";
    // const positions = getPositions(peopleNum)
    // for(let i=0;i<peopleNum;i++){
    //     let per = new Player()
    //     per.position = positions[i]
    //     this.players.push(per);
    // }
    Zhajinhua.tool.initImg()
    const pokerImg = this.pokerImg
    const picList = this.picList
    const pokerList = [...pokerImg.values()]
    Laya.loader.load(pokerList,Laya.Handler.create(this,Zhajinhua.graphicsImg));
    Laya.loader.load(picList,Laya.Handler.create(this,Zhajinhua.graphicsImg));
}
Zhajinhua.graphicsImg = function(){
    this.picNum ++
    if(2 == this.picNum){
        Zhajinhua.service.getSocketAdress()
    }
    // Zhajinhua.view()
}
Zhajinhua.view = function(msg,p){
    console.log('it is finish!')
    this.Draw.name()
    this.Draw.setStatus()
    this.Draw.setToolBar(msg)
    this.Draw.setPoker()
    this.Draw.setChip()
    this.Draw.setShowPoker(msg)
    this.Draw.setAchievement()
}
Zhajinhua.Event.createClick1 = function(){
    // tempScan = Laya.stage._childs.concat([])
    // Laya.stage.destroyChildren()
    // Laya.stage.addChild(tempScan[0]);
    // Laya.stage.addChild(tempScan[1]);
    msg.acType = 'ON_START'
    Zhajinhua.socket.emit(Zhajinhua.roomInfo.roomNo, msg);
   
}
Zhajinhua.Event.createClick2 = function(){
    // const  players = Zhajinhua.playersiuSA4R3EEQ
    // this.showValue(players[0])
    msg.acType = 'SHOW_VALUE'
    Zhajinhua.socket.emit(Zhajinhua.roomInfo.roomNo, msg);
    //     console.log('ai2')
        // this.Draw.setPoker()
}
Zhajinhua.Event.createClick3 = function(){
    msg.acType = 'ON_RAISE'
    Zhajinhua.socket.emit(Zhajinhua.roomInfo.roomNo, msg);
    // const  players = Zhajinhua.players
    // this.touzhu(players[1])
    //     console.log('ai3')
        // this.Draw.setPoker()
}
Zhajinhua.Event.createClick4 = function(){
    var d = dialog({
        content: '点击你要pk的玩家头像，选择与他pk！'
    });
    d.show();
    setTimeout(function(){
        d.close().remove();
    },1000)
    // const  players = Zhajinhua.players
    // this.touzhu(players[1])
    //     console.log('ai3')
        // this.Draw.setPoker()
}
Zhajinhua.Event.createClick5 = function(){
    msg.acType = 'ON_READY'
    Zhajinhua.socket.emit(Zhajinhua.roomInfo.roomNo, msg);
    // const  players = Zhajinhua.players
    // this.touzhu(players[1])
    //     console.log('ai3')
        // this.Draw.setPoker()
}
Zhajinhua.Event.pass = function(){
    msg.acType = 'GAME_PASS'
    Zhajinhua.socket.emit(Zhajinhua.roomInfo.roomNo, msg);
    // const  players = Zhajinhua.players
    // this.touzhu(players[1])
    //     console.log('ai3')
        // this.Draw.setPoker()
}
Zhajinhua.Event.pk = function(a){
    msg.onePlayerId = User.id
    msg.twoPlayerId = a.target.id
    console.log(a.target.id)
    msg.acType = 'GAME_PK'
    Zhajinhua.socket.emit(Zhajinhua.roomInfo.roomNo, msg);
    // const  players = Zhajinhua.players
    // this.touzhu(players[1])
    //     console.log('ai3')
        // this.Draw.setPoker()
}
// Zhajinhua.Draw.header = ()=>{
//     console.log(user)
//     const STROKE_WIDTH = 1;
//     const label = new Laya.Label();
//     label.font = "Microsoft YaHei";
//     label.text = 退出房间;
//     label.id = user.id
//     label.fontSize = 30;
//     label.color = "#0008ff";
//     label.stroke = STROKE_WIDTH;
//     label.strokeColor = "#0008ff";
//     label.on(Laya.Event.CLICK, this,Zhajinhua.Event.pk);
//     Laya.stage.addChild(label);
// }
Zhajinhua.Draw.showValueGraphicsImg = function(){
    const player = Zhajinhua.myPlayer
    const my = player.pokers_ac
    console.log(my);
    const x = player.position[0] - 150;
    Zhajinhua.positions.showPokerPositions = []
    for(let i in my){
        my[i].graphics.clear();
        const texture = Laya.loader.getRes(Zhajinhua.myPlayerPokerUrl[i]);
        my[i].graphics.drawTexture(texture);
        my[i].scale(.5,.5);
        my[i].size(texture.width, texture.height);
        Laya.Tween.to(my[i],{x:x + 150*i,rotation:180},300,Laya.Ease.backOut,null,i*100);
        Zhajinhua.positions.showPokerPositions.push({x:x + 150*i,y:my[i].y})
    } 
    const tempArray = []
    for(let  i in Zhajinhua.positions.pokerPositions){
        if(Zhajinhua.positions.pokerPositions[i].playerId !=player.id){
            tempArray.push(Zhajinhua.positions.pokerPositions[i])
        }
    }
    Zhajinhua.positions.pokerPositions = tempArray
}
Zhajinhua.Draw.showValue = function(player){
    if(player.id ==User.id){
        Zhajinhua.myPlayerPokerUrl = []
        Zhajinhua.myPlayer = player
        const values = player.pokerValue
        for(let v in values){
            let img = Zhajinhua.pokerImg.get(values[v])
            Zhajinhua.myPlayerPokerUrl.push(img)
        }
        Zhajinhua.Draw.showValueGraphicsImg()
    }else{
        const x = player.position[0] - 150;
        const pok = player.pokers_ac
        Laya.Tween.to(pok[0],{x:x+50,rotation:180},300,Laya.Ease.backOut,null,100);
        Laya.Tween.to(pok[1],{x:x+100 ,rotation:180},300,Laya.Ease.backOut,null,200);
        Laya.Tween.to(pok[2],{x:x+150,rotation:180},300,Laya.Ease.backOut,null,300);
        let cont = 0
        for(let  i in Zhajinhua.positions.pokerPositions){
            if(Zhajinhua.positions.pokerPositions[i].playerId ==player.id){
                if(cont==0){
                    Zhajinhua.positions.pokerPositions[i].x=x+50
                    Zhajinhua.positions.pokerPositions[i].r=180
                }
                if(cont==1){
                    Zhajinhua.positions.pokerPositions[i].x=x+100
                    Zhajinhua.positions.pokerPositions[i].r=180
                }
                if(cont==2){
                    Zhajinhua.positions.pokerPositions[i].x=x+150
                    Zhajinhua.positions.pokerPositions[i].r=180
                }
                cont++
            }
        }
    }
}
Zhajinhua.Draw.over = function(msg){
    const plers = Zhajinhua.players
    const playIng = msg.roomPlayers.winObj
    let passPlayer = null;
    for(let  i in plers){
        if(plers[i].id ==playIng.id){
            passPlayer = plers[i]
        }
    }
    const chips = Zhajinhua.chip_ac
    for(let i in chips){
        const r = randomNumBoth(0,360)
         Laya.Tween.to(chips[i],
            {scaleX:0,scaleY:0,x:passPlayer.position[0],y:passPlayer.position[1],pivotY:50,pivotX:50,rotation:r}
            ,1000,Laya.Ease.backOut,null,i*100);
    }
    // Zhajinhua.reset()
    const d = dialog({
        content: `玩家${playIng.user.name}获胜！`
    });
    let showPanel = ''
    for(let u in plers){
        // showPanel+=`<div style="display: inline-block;">
        // <div style="width: 25%;float: right"><img width="80%" height="100" src="${Zhajinhua.pokerImg.get(plers[u].pokerValue[0])}" alt=""></div>
        // <div style="width: 25%;float: right"><img width="80%" height="100" src="${Zhajinhua.pokerImg.get(plers[u].pokerValue[1])}" alt=""></div>
        // <div style="width: 25%;float: right"><img width="80%" height="100" src="${Zhajinhua.pokerImg.get(plers[u].pokerValue[2])}" alt=""></div>
        // <div style="width: 25%;float: right">
        //     <img width="60%" height="80" src="${plers[u].user.avatarUrl}" alt="">
        // </div>
        // </div>`
        showPanel+=`<tr>
            <td align="left"><img width="80" height="80" src="${plers[u].user.avatarUrl}" alt=""></td>
            <td align="left"><img width="80%" height="100" src="${Zhajinhua.pokerImg.get(plers[u].pokerValue[0])}" alt=""></td>
            <td align="right"><img width="80%" height="100" src="${Zhajinhua.pokerImg.get(plers[u].pokerValue[1])}" alt=""></td>
            <td align="right"><img width="80%" height="100" src="${Zhajinhua.pokerImg.get(plers[u].pokerValue[2])}" alt=""></td>
        </tr>`
    }
    let endInfo = `<table width="100%" border="1">${showPanel}</table>`
    new Promise(function(resolve, reject){
        setTimeout(function(){
            d.show();
            resolve();
        }, 1000);
    }).then((resolve, reject)=>{
        setTimeout(function(){
            Zhajinhua.reset()
            d.close().remove();
        },1000)
    }).then(()=>{
        const bat = dialog({
        title: '查看牌',
        content: `<div>${endInfo}</div>`,
        onclose: function () {
           msg.roomPlayers.numTotal==msg.roomPlayers.num&&Zhajinhua.Draw.gameOver(plers)
        },
        });
        bat.showModal();
    })
    // window.setTimeout(function(){
    //     d.show();
    //     window.setTimeout(function(){
    //         Zhajinhua.reset()
    //         d.close().remove();
    //     },1000)
    // },1000)
}
Zhajinhua.Draw.gameOver = function(player){
    let trs = ''
    for(let p in player){
        trs+=`<tr>
            <td>${player[p].user.name}</td>
            <td>${player[p].raiseTotalMoney}</td>
        </tr>`
    }
    let table = `<table border="1">
                    <tr>
                        <th>玩家</th>
                        <th>分数</th>
                    </tr>
                    ${trs}
                </table>`
    const bat = dialog({
        title: '查看牌',
        content: `<div>${table}</div>`,
        onclose: function () {
            Choise.init()
        },
        });
    bat.showModal();
}
Zhajinhua.Draw.name = function(player){
    const  players = Zhajinhua.players
    function createLabel(user){
        console.log(user)
        const STROKE_WIDTH = 1;
        const label = new Laya.Label();
        label.font = "Microsoft YaHei";
        label.text = user.name;
        label.id = user.id
        label.fontSize = 30;
        label.color = "#0008ff";
        label.stroke = STROKE_WIDTH;
        label.strokeColor = "#0008ff";
        label.on(Laya.Event.CLICK, this,Zhajinhua.Event.pk);
        Laya.stage.addChild(label);
        return label
    }
    for(let v in players){
        console.log(players[v])
        players[v].status_ac = createLabel(players[v].user,"#0008ff", "#0008ff").pos(players[v].position[0] - pw+140,players[v].position[1] - 150);
    }     
}
Zhajinhua.Draw.onPass = function(msg){
    const playIngs = msg.roomPlayers.playIngs
    const passId = msg.backObj.playerId
    Zhajinhua.tool.setDongPlers(playIngs)
    const plers = Zhajinhua.players
    let passPlayer = null;
    for(let  i in plers){
        if(plers[i].id ==passId){
            passPlayer = plers[i]
        }
    }
    const d = dialog({
        content: `玩家<h1>${passPlayer.user.name}<h1>pass`
    });
    d.showModal();
    setTimeout(function(){
        d.close().remove();
    },2000)
}
Zhajinhua.Draw.pkAc = function(msg){
    const playIngs = msg.roomPlayers.playIngs
    const passId = msg.roomPlayers.pkObj.pasObj.user.id
    Zhajinhua.tool.setDongPlers(playIngs)
    const name1 = msg.roomPlayers.pkObj.pasObj.user.name
    const name2 = msg.roomPlayers.pkObj.winObj.user.name
    const d = dialog({
        content: `玩家<h1>${name1}<h1>pk玩家${name2}`
    });
    d.showModal();
    setTimeout(function(){
        d.close().remove();
    },2000)
    const g = dialog({
        content: `玩家<h1>${name2}获胜！！}`
    });
    setTimeout(function(){
        g.showModal();
    },2000)
    setTimeout(function(){
       g.close().remove();
    },6000)
}
Zhajinhua.Draw.setShowPoker = function(msg){
    const pos = Zhajinhua.positions.showPokerPositions
    const playIngs = msg.roomPlayers.playIngs
    let temp = null
    for(let f in playIngs){
        if(playIngs[f].id==User.id){
            temp = playIngs[f]
        }
    }
    if(temp&&temp.isShow){
        for(let i in pos){
            const acSprite = new Laya.Sprite();
            acSprite.x = wh - pw/2
            acSprite.y = vh - ph/2
            //获取图片资源
            const texture = Laya.loader.getRes(Zhajinhua.myPlayerPokerUrl[i]);
            //绘制纹理
            acSprite.graphics.drawTexture(texture);                        
            //设置纹理宽高
            acSprite.scale(.5,.5)
            acSprite.size(texture.width, texture.height);
            acSprite.pivotY = ph*2
            acSprite.pivotX = pw*2
            acSprite.pos( pos[i].x,pos[i].y);
            acSprite.rotation = 180
            // acSprite.on(Laya.Event.CLICK, this,onSpriteClick);
            Laya.stage.addChild(acSprite);
        }
    }
}
Zhajinhua.Draw.setPoker = function(){
    const pos = Zhajinhua.positions.pokerPositions
    for(let i in pos){
        const acSprite = new Laya.Sprite();
        acSprite.x = wh - pw/2
        acSprite.y = vh - ph/2
        //获取图片资源
        const texture = Laya.loader.getRes(pokerBg);
        //绘制纹理
        acSprite.graphics.drawTexture(texture);                        
        //设置纹理宽高
        acSprite.scale(.5,.5)
        acSprite.size(texture.width, texture.height);
        acSprite.pivotY = ph*2
        acSprite.pivotX = pw*2
        acSprite.pos( pos[i].x,pos[i].y);
        acSprite.rotation = pos[i].r
        // acSprite.on(Laya.Event.CLICK, this,onSpriteClick);
        Laya.stage.addChild(acSprite);
        acplays.push(acSprite);
        for(let o in Zhajinhua.players){
            if(pos[i].playerId==Zhajinhua.players[o].id){
                Zhajinhua.players[o].pokers_ac.push(acSprite)
            }
        }
    }
}
Zhajinhua.Draw.setChip = function(){
    const pos = Zhajinhua.positions.chipPositions
    Zhajinhua.chip_ac = []
    for(let i in pos){
        const pff = new Laya.Sprite();
        var fdf = Laya.loader.getRes(chouMa);
        pff.graphics.drawTexture(fdf);    
        pff.scale(.5,.5)
        pff.size(fdf.width, fdf.height); 
        pff.pos( pos[i].x,pos[i].y);
        Zhajinhua.chip_ac.push(pff)
        Laya.stage.addChild(pff);
    }
}
Zhajinhua.Draw.setToolBar = function(msg){
    const { status, fangzhu, doingObj } = msg.roomPlayers
    const acType = msg.acType
    const isFnagzu = User.id === fangzhu.id
    const flag = User.id === doingObj.id
    const textColorAble = "#333"
    const textColordisAble = '#c6efd6'
    const ps = Zhajinhua.players
    let temp = null
    for(let i in ps){
        if(ps[i].user.id == User.id){
            temp= ps[i];
        }
    }
    const btn1 = new Laya.Button();
    btn1.label="发牌"
    btn1.width = 100
    btn1.height = 50
    btn1.labelStroke = 1
    btn1.labelStrokeColor = textColorAble
    btn1.labelSize = 50
    btn1.pos(50, h - 100 );
    btn1.on(Laya.Event.CLICK, this,Zhajinhua.Event.createClick1);
    const btn11 = new Laya.Button();
    btn11.label="发牌"
    btn11.width = 100
    btn11.height = 50
    btn11.labelStroke = 1
    btn11.labelStrokeColor = textColordisAble
    btn11.labelSize = 50
    btn11.pos(50, h - 100 );
    if(isFnagzu&&!status){
         Laya.stage.addChild(btn1);
    }else{
        Laya.stage.addChild(btn11);
    }
    const btn2 = new Laya.Button();
    btn2.label="看牌"
    btn2.width = 100
    btn2.height = 50
    btn2.labelStroke = 1
    btn2.labelStrokeColor = textColorAble
    btn2.labelSize = 50
    btn2.pos(200, h - 100 );
    btn2.on(Laya.Event.CLICK, this,Zhajinhua.Event.createClick2);
    const btn22 = new Laya.Button();
    btn22.label="看牌"
    btn22.width = 100
    btn22.height = 50
    btn22.labelStroke = 1
    btn22.labelStrokeColor = textColordisAble
    btn22.labelSize = 50
    btn22.pos(200, h - 100 );
    if(temp.isEnable){
        Laya.stage.addChild(btn2);
    }else{
        Laya.stage.addChild(btn22);
    }
    const btn3 = new Laya.Button();
    btn3.label="投注"
    btn3.width = 100
    btn3.height = 50
    btn3.labelStroke = 1
    btn3.labelStrokeColor = textColorAble
    btn3.labelSize = 50
    btn3.pos(350, h - 100 );
    btn3.on(Laya.Event.CLICK, this,Zhajinhua.Event.createClick3);
    const btn33 = new Laya.Button();
    btn33.label="投注"
    btn33.width = 100
    btn33.height = 50
    btn33.labelStroke = 1
    btn33.labelStrokeColor = textColordisAble
    btn33.labelSize = 50
    btn33.pos(350, h - 100 );
    const btn4 = new Laya.Button();
    btn4.label="PK" 
    btn4.width = 100
    btn4.height = 50
    btn4.labelStroke = 1
    btn4.labelStrokeColor = textColorAble
    btn4.labelSize = 50
    btn4.pos(500, h - 100 );
    btn4.on(Laya.Event.CLICK, this,Zhajinhua.Event.createClick4);
    const btn44 = new Laya.Button();
    btn44.label="PK" 
    btn44.width = 100
    btn44.height = 50
    btn44.labelStroke = 1
    btn44.labelStrokeColor = textColordisAble
    btn44.labelSize = 50
    btn44.pos(500, h - 100 );
    if(flag){
        Laya.stage.addChild(btn4);
        Laya.stage.addChild(btn3);
    }else{
        Laya.stage.addChild(btn33);
        Laya.stage.addChild(btn44);
    }
    const bPASS = new Laya.Button();
    bPASS.label="PASS" 
    bPASS.width = 100
    bPASS.height = 50
    bPASS.labelStroke = 1
    bPASS.labelStrokeColor = textColorAble
    bPASS.labelSize = 50
    bPASS.pos(650, h - 100 );
    bPASS.on(Laya.Event.CLICK, this,Zhajinhua.Event.pass);
    const bPASSss = new Laya.Button();
    bPASSss.label="PASS" 
    bPASSss.width = 100
    bPASSss.height = 50
    bPASSss.labelStroke = 1
    bPASSss.labelStrokeColor = textColordisAble
    bPASSss.labelSize = 50
    bPASSss.pos(650, h - 100 );
    if(temp.isEnable){
        Laya.stage.addChild(bPASS);
    }else{
        Laya.stage.addChild(bPASSss);
    }
    const btn5 = new Laya.Button();
    btn5.label="准备"
    btn5.width = 100
    btn5.height = 50
    btn5.labelStroke = 1
    btn5.labelStrokeColor = textColorAble
    btn5.labelSize = 50
    btn5.pos(w-150, h - 100 );
    btn5.on(Laya.Event.CLICK, this,Zhajinhua.Event.createClick5);
    const btn55 = new Laya.Button();
    btn55.label="准备"
    btn55.width = 100
    btn55.height = 50
    btn55.labelStroke = 1
    btn55.labelStrokeColor = textColordisAble
    btn55.labelSize = 50
    btn55.pos(w-150, h - 100 );
    if(!status){
        Laya.stage.addChild(btn5);
    }else{
        Laya.stage.addChild(btn55);
    }
}
Zhajinhua.Draw.setStatus = function(){
    const  players = Zhajinhua.players
    function createLabel(status){
        const STROKE_WIDTH =2;
        const label = new Laya.Label();
        label.font = "Microsoft YaHei";
        label.text = statusType[status];
        label.fontSize = 50;
        label.color = '#000000';
        label.stroke = STROKE_WIDTH;
        label.strokeColor = '#000000';
        Laya.stage.addChild(label);
        return label
    }
    function createLabelc(isEnable){
        const STROKE_WIDTH =2;
        const label = new Laya.Label();
        label.font = "Microsoft YaHei";
        label.text = "。";
        label.fontSize = 100;
        label.color = isEnable?"#10ff00":"#c3c3c3";
        label.stroke = isEnable?"#10ff00":"#c3c3c3";
        label.strokeColor = isEnable?"#10ff00":"#c3c3c3";
        Laya.stage.addChild(label);
        return label
    }
    for(let v in players){
        if(players[v].id == Zhajinhua.doing.id){
            createLabelc(players[v].isEnable).pos(players[v].position[0] - pw-50,players[v].position[1] - 230);
        }
        players[v].status_ac = createLabel(players[v].state).pos(players[v].position[0] - pw,players[v].position[1] - 170);
    }
}
Zhajinhua.Draw.setAchievement = function(){
    const  players = Zhajinhua.players
    function createLabel(raiseTotalMoney){
        const STROKE_WIDTH =2;
        const label = new Laya.Label();
        label.font = "Microsoft YaHei";
        label.text = raiseTotalMoney+"";
        label.fontSize = 50;
        label.color = '#000000';
        label.stroke = STROKE_WIDTH;
        label.strokeColor = '#000000';
        Laya.stage.addChild(label);
        return label
    }
    for(let v in players){
        createLabel(players[v].raiseTotalMoney).pos(players[v].position[0] - pw,players[v].position[1]-230);
    }
}
Zhajinhua.Draw.touzhu = function(ps){
    const obj = {x:ps.position[0],y:ps.position[1]}
    const pff = new Laya.Sprite();
    pff.x = obj.x
    pff.y = obj.y
    var fdf = Laya.loader.getRes(chouMa);
    pff.graphics.drawTexture(fdf);    
    pff.scale(.5,.5)
    pff.size(fdf.width, fdf.height); 
    pff.pos( obj.x,obj.y);
    Laya.stage.addChild(pff);
    const ex = wh - pw/2+randomNumBoth(-30,30)
    const ey = vh - ph/2+randomNumBoth(-30,30)
    Zhajinhua.positions.chipPositions.push({x:ex,y:ey})
    Laya.Tween.to(pff,
            {x:ex,y:ey}
            ,1000,Laya.Ease.backOut,null,10);
}
Zhajinhua.Draw.fapai = function(){
    const  ps = Zhajinhua.players
    const acplays = []
    for(let q=0;q<3;q++){
        for(let i in ps){
            const acSprite = new Laya.Sprite();
            ps[i].pokers_ac.push(acSprite)
            acSprite.x = wh - pw/2
            acSprite.y = vh - ph/2
            //获取图片资源
            const texture = Laya.loader.getRes(pokerBg);
            //绘制纹理
            acSprite.graphics.drawTexture(texture);                        
            //设置纹理宽高
            acSprite.scale(.5,.5)
            acSprite.size(texture.width, texture.height); 
            acSprite.pos( wh - pw/2,vh - ph/2);
            // acSprite.on(Laya.Event.CLICK, this,onSpriteClick);
            Laya.stage.addChild(acSprite);
            acplays.push(acSprite);
        }
    }
    for(let i in acplays){
        console.log(i)
        console.log(players[i%3])
        const my = ps[i%ps.length].position[1]
        const playerId = ps[i%ps.length].id
        const mx = ps[i%ps.length].position[0]
        const r = randomNumBoth(0,360)
        Zhajinhua.positions.pokerPositions.push({playerId:playerId,x:mx,y:my,r:r})
        console.log(mx)
        Laya.Tween.to(acplays[i],
            {y:my,x:mx,pivotY:ph*2,pivotX:pw*2,rotation:r}
            ,400,Laya.Ease.backOut,null,i*100);
    }
}
Zhajinhua.tool.initImg = function(){
    let index = 1
    for(let i=1;i<14;i++){
        for(let f=1;f<5;f++){
            Zhajinhua.pokerImg.set(index,`res/atlas/value/${f}/${i}.jpg`)
            index++
        }
    }
}
Zhajinhua.tool.setDongPlers = function(doingPlers){
    console.log(doingPlers)
    const pokers = Zhajinhua.positions.pokerPositions
    const tempArray = []
    for(let i =0;i<pokers.length;i++){
        for(let p in doingPlers){
            if(doingPlers[p].id == pokers[i].playerId){
                tempArray.push(pokers[i])
            }
        }
    }
    let tempFlag = true
    for(let p in doingPlers){
        if(doingPlers[p].id == User.id){
            tempFlag=false
        }
    }
    tempFlag&&(Zhajinhua.positions.showPokerPositions =[])
    Zhajinhua.positions.pokerPositions = tempArray
}
Zhajinhua.tool.forPlayer = function(msg){
    Zhajinhua.doing = msg.roomPlayers.doingObj
    // if(Object.keys(msg.roomPlayers.fontAcObject).length !=0){
    //     const acObject = msg.roomPlayers.fontAcObject.get(User.id)
    //     Zhajinhua.positions.pokerPositions = acObject.pokerPositions
    //     Zhajinhua.positions.chipPositions = acObject.chipPositions
    // }
    const p = msg.roomPlayers.players
    for(let m in p){
        if(p[m].id === User.id){
            Zhajinhua.players =  p.slice(m,p.length).concat(p.slice(0,m))
        }
    }
    for(let i=0;i<Zhajinhua.players.length;i++){
        const positions = getPositions(peopleNum - 1)
        Zhajinhua.players[i].position = positions[i]
        
    }
    this.players = Zhajinhua.players
}