// Assets requirements
let windowWidth = 1920;
let windowHeight = 1080;

let dartComboCount = 5;
let numbersOnScreenCount = 5;

let gameState = {

    reset: function() {
        this.yourHealth = 100;
        this.opponentHealth = 100;
    }
}

let app = new PIXI.Application(windowWidth, windowHeight, { backgroundColor: 0xFFFFFF });
let gameSprites = PIXI.BaseTexture.fromImage("media/game.png");
let assetsRequested = 0;
let assetsLoaded = 0;

// Assets
let zeroButton = getZeroButton();
let inviteCode = 0;
let numberScroller = new NumberScroller(numbersOnScreenCount);

let background = PIXI.Sprite.from(new PIXI.Texture(gameSprites, new PIXI.Rectangle(s_bg.x, s_bg.y, s_bg.width, s_bg.height)));
let healthBorderLeft = PIXI.Sprite.from(new PIXI.Texture(gameSprites, new PIXI.Rectangle(s_healthborder.x, s_healthborder.y, s_healthborder.width, s_healthborder.height)));
let healthBorderRight = PIXI.Sprite.from(new PIXI.Texture(gameSprites, new PIXI.Rectangle(s_healthborder.x, s_healthborder.y, s_healthborder.width, s_healthborder.height)));
let healthBarLeft = PIXI.Sprite.from(new PIXI.Texture(gameSprites, new PIXI.Rectangle(s_healthbar.x, s_healthbar.y, s_healthbar.width, s_healthbar.height)));
let healthBarRight = PIXI.Sprite.from(new PIXI.Texture(gameSprites, new PIXI.Rectangle(s_healthbar.x, s_healthbar.y, s_healthbar.width, s_healthbar.height)));

let computerLeft = PIXI.Sprite.from(new PIXI.Texture(gameSprites, new PIXI.Rectangle(s_cpu1_main.x, s_cpu1_main.y, s_cpu1_main.width, s_cpu1_main.height)));
let computerRight = PIXI.Sprite.from(new PIXI.Texture(gameSprites, new PIXI.Rectangle(s_cpu2_main.x, s_cpu2_main.y, s_cpu2_main.width, s_cpu2_main.height)));

let getNerfDart = function() { return PIXI.Sprite.from(new PIXI.Texture(gameSprites, new PIXI.Rectangle(s_nerf_dart.x, s_nerf_dart.y, s_nerf_dart.width, s_nerf_dart.height))); };
let dartsLeft = [];
let dartsRight = [];
for (let i = 0; i < dartComboCount; i++) {
    dartsLeft.push(getNerfDart());
    dartsRight.push(getNerfDart());
}

let gameConnection = null;

function assetHasLoaded() { 
    assetsLoaded++;

    console.log(`Load progress: ${assetsLoaded}/${assetsRequested} (${(assetsLoaded/assetsRequested) * 100}%)`);
    if (assetsLoaded == assetsRequested) {
        init();
    }
}

function preload() {

    let font = new Font();
    font.onload = assetHasLoaded;
    font.onerror = function(e) { console.error(e);};
    font.fontFamily = "xkcd-script";
    assetsRequested++;

    // add load assets here
    
    font.src = 'media/xkcd-script.ttf'; // Start loading
}

function init() {
    window.onresize();

    gameConnection = new GameClient("ws://localhost:1345");

    // On Lobby Join
    let hasReceivedInviteCode = gameConnection.addTalkBox(1, function (msg) { 
        console.log(`Received invite code ${msg}, confirming receiving it`);
        inviteCode = msg;
        hasReceivedInviteCode(msg);
    })

    // On Game Join
    //let hasJoined = gameConnection.addTalkBox(2, function (game) { 
        console.log(`Received a game join! Playing against ${game.opponent} with seed ${game.seed}`);
     
        background.x = 0;
        background.y = windowHeight - s_bg.height;
        app.stage.addChild(background);

        healthBorderLeft.x = 20;
        healthBorderLeft.y = 20;
        app.stage.addChild(healthBorderLeft);

        healthBorderRight.x = windowWidth - s_healthborder.width - 20;
        healthBorderRight.y = 20;
        app.stage.addChild(healthBorderRight);

        healthBarLeft.x = 80;
        healthBarLeft.y = healthBorderLeft.y + s_healthborder.height / 2 - s_healthbar.height / 2;
        app.stage.addChild(healthBarLeft);

        healthBarRight.x = windowWidth - 80;
        healthBarRight.y = healthBorderRight.y + s_healthborder.height / 2 - s_healthbar.height / 2;
        healthBarRight.scale.x = -1;        
        app.stage.addChild(healthBarRight);
        
        for (let i = 0; i < dartComboCount; i++) {
            dartsLeft[i].x = (i + 0.5) * (10 + s_nerf_dart.width);
            dartsLeft[i].y = 100;
            dartsLeft[i].alpha = 0.5;
            app.stage.addChild(dartsLeft[i]);

            dartsRight[i].x = windowWidth - ((dartComboCount - i) + 0.5) * (10 + s_nerf_dart.width);
            dartsRight[i].y = 100;
            dartsRight[i].alpha = 0.5;
            app.stage.addChild(dartsRight[i]);
        }

        computerLeft.x = 20;
        computerLeft.y = 320;
        app.stage.addChild(computerLeft);
        
        computerRight.x = windowWidth - s_cpu2_main.width - 20;
        computerRight.y = 320;
        app.stage.addChild(computerRight);

        document.getElementById("game").appendChild(app.view);

    //    hasJoined(game.opponent);
    //});
}

if (document.addEventListener)
    document.addEventListener("DOMContentLoaded", preload, false);
else if (document.attachEvent)
    document.attachEvent("onreadystatechange", preload);
else window.onload = preload;

window.onresize = function (event) {

    let oldAspect = windowWidth / windowHeight;

    let w = window.innerWidth * 0.8;
    let h = w / oldAspect;
    app.view.style.width = w + "px";
    app.view.style.height = h + "px";
};