var PIXI = require('pixi.js');   
var _ = require('underscore');
var howler = require('howler');
var fonts = require('google-fonts');

WebFontConfig = {
  google: {
    families: [ 'Megrim', 'Lemon' ],
  },
  active: function() {
    loader.load();
  }
};
(function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();


// click a cat, lose a point and it gets all wobbly
// click the ball of yarn, get a point
// text welcomes you
// different balls of yarn, bouncing around
// sound with chuck (howler.js?)
// tween.js

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer();
renderer.view.style.position = "absolute"
renderer.view.style.width = window.innerWidth + "px";
renderer.view.style.height = window.innerHeight + "px";
renderer.view.style.display = "block";
renderer.view.style['margin-left'] = "-8px";
renderer.view.style['margin-top'] = "-8px";

document.body.appendChild(renderer.view);

// create an array of assets to load
var assetsToLoader = [ "sprite_sheet.json"];

// create a new loader
loader = new PIXI.AssetLoader(assetsToLoader);

// use callback
loader.onComplete = init;


var width = window.innerWidth;
var height = window.innerHeight;

var walkFrames = [];
for (var i = 1; i <= 12; i++){
  walkFrames.push("walk" + i);
}
var sitFrames = [];
for (var i = 1; i <= 6; i++){
  sitFrames.push("sit" + i);
}
var runFrames = [];
for (var i = 1; i <= 25; i++){
  runFrames.push("run" + i);
}

var count = 0;
    
// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xFFFFFF, true);

var blurFilter = new PIXI.BlurFilter();

var sepiaFilter = new PIXI.SepiaFilter();

var pixelFilter = new PIXI.PixelateFilter();
pixelFilter.size = new PIXI.Point(1, 1);

var rgbSplitterFilter = new PIXI.RGBSplitFilter();

var filters = [blurFilter, sepiaFilter, rgbSplitterFilter];

var grayFilter = new PIXI.GrayFilter();

var invertFilter = new PIXI.InvertFilter();

var catContainer = new PIXI.DisplayObjectContainer();

var graphics = new PIXI.Graphics();

// draw a circle
graphics.lineStyle(1);
graphics.beginFill(0xFFFF0B, 0.5);
graphics.drawCircle(470, 200, 100);
graphics.endFill();

// make the circle mask follow the mouse position;
stage.mousemove = function(mouseData) {
    // this line will get the mouse coords relative to the sprites..
    var localCoordsPosition = mouseData.getLocalPosition(graphics);

    // this line will get the mouse coords relative to the sprites parent..
    var parentCoordsPosition = mouseData.getLocalPosition(graphics.parent);

    graphics.position.x = parentCoordsPosition.x - 470;
    graphics.position.y = parentCoordsPosition.y - 200;
};

stage.addChild(graphics);

function addCat(textures, xpos, ypos, container){
    var cat = new PIXI.MovieClip(textures);
    cat.position.x = xpos;
    cat.position.y = ypos;
    cat.anchor.x = cat.anchor.y = 0.5;
    cat.speed = -1 - 4 * Math.random();
    cat.scale.x = cat.scale.y = 0.1 + Math.random() / 1.5;
    cat.animationSpeed = 0.1 -cat.speed / 10;
    cat.mask = graphics;

    if (cat.position.x < width / 2) {
        cat.speed *= -1;
        cat.scale.x *= -1;
    } 

    var fs = _.filter(filters, function(f){
       return (Math.random() < 0.2);
    });
    if (fs.length > 0) cat.filters = fs;

    cat.gotoAndPlay(Math.random() * 27);
    container.addChild(cat);
}

function init() {

    sky = new PIXI.Sprite.fromImage('img/sky.jpg');
    sky.width = width;
    sky.height = height;
    stage.addChild(sky);

    grass = new PIXI.Sprite.fromImage('img/grass.jpg');
    grass.width = width;
    grass.height = height;
    grass.tint = 0xCCCCCC
    grass.mask = graphics;
    stage.addChild(grass);

    var myLargeFont = {
        font: "40px Megrim",
        fill: "white",
        align: "left"
    };
    var myFont = {
        font: "25px Megrim",
        fill: "white",
        align: "left"
    };

    welcome_text1 = new PIXI.Text("Welcome to Cat World.", myLargeFont);
    welcome_text1.position.x = 20;
    welcome_text1.position.y = 20;
    welcome_text1.alpha = 0;
    stage.addChild( welcome_text1 );
    
    welcome_text2 = new PIXI.Text("You are a cat.", myFont);
    welcome_text2.position.x = 20;
    welcome_text2.position.y = 100;
    welcome_text2.alpha = 0;
    stage.addChild( welcome_text2 );
    
    welcome_text3 = new PIXI.Text("Bat at (click) the ball of yarn \nwithout scratching other cats.", myFont);
    welcome_text3.position.x = 20;
    welcome_text3.position.y = 170;
    welcome_text3.alpha = 0;
    stage.addChild( welcome_text3 );
    
    welcome_text4 = new PIXI.Text("You get cat points for doing it well, \nand negative cat points\nfor collateral damage.\n\nClick to begin.", myFont);
    welcome_text4.position.x = 20;
    welcome_text4.position.y = 280;
    welcome_text4.alpha = 0;
    stage.addChild( welcome_text4 );
    
    renderer.render(stage);

    requestAnimationFrame( welcomeText1 );
}   

function welcomeText1() {
    var L = 100;
    if (count <= L) {
        requestAnimationFrame( welcomeText1 );
        welcome_text1.alpha = count / L;
        count += 1
        renderer.render(stage);
    } else {
        count = 0;
        requestAnimationFrame( welcomeText2 );
    }
}
function welcomeText2() {
    var L = 100;
    if (count <= L) {
        requestAnimationFrame( welcomeText2 );
        welcome_text2.alpha = count / L;
        count += 1
        renderer.render(stage);
    } else {
        count = 0;
        requestAnimationFrame( welcomeText3 );
    }
}
function welcomeText3() {
    var L = 100;
    if (count <= L) {
        requestAnimationFrame( welcomeText3 );
        welcome_text3.alpha = count / L;
        count += 1
        renderer.render(stage);
    } else {
        count = 0;
        requestAnimationFrame( welcomeText4 );
    }
}
function welcomeText4() {
    var L = 100;
    requestAnimationFrame( welcomeText4 );
    if (count <= L) {
        welcome_text4.alpha = count / L;
        count += 1
    } else if (count <= 2 * L){
        welcome_text1.alpha = (2 * L - count) / L;
        welcome_text2.alpha = (2 * L - count) / L;
        welcome_text3.alpha = (2 * L - count) / L;
        welcome_text4.alpha = (2 * L - count) / L;
        count += 1
    } else if (count == 2 * L + 1) {
        stage.removeChild(welcome_text1);
        stage.removeChild(welcome_text2);
        stage.removeChild(welcome_text3);
        stage.removeChild(welcome_text4);
        count += 1
        init_game();
    } else {
        return;
    }
    renderer.render(stage);
}

function init_game() {

    walkTextures =  [];
    for (var i = 0; i < walkFrames.length; i++) {
        var texture = PIXI.Texture.fromFrame(walkFrames[i]);
        walkTextures.push(texture);
    }; 
    
    runTextures = [];
    for (var i = 12; i < runFrames.length; i++){
        var texture = PIXI.Texture.fromFrame(runFrames[i]);
        runTextures.push(texture);
    }

    for (var i = 0; i < 10; i++){
        addCat(walkTextures, Math.random() * width, Math.random() * height, catContainer);
        addCat(runTextures, Math.random() * width, Math.random() * height, catContainer);
    }
    
    stage.addChild(catContainer);

    yarn = new PIXI.Sprite.fromImage('img/yarn.png');
    yarn.scale.x = yarn.scale.y = 0.5;
    yarn.angle = Math.PI * Math.random();
    yarn.position.x = Math.random() * width;
    yarn.position.y = Math.random() * height;
    yarn.filters = [grayFilter, pixelFilter];
    yarn.speed = 4; 
    yarn.mask = graphics;
    yarn.interactive = true;
    yarn.total_clicks = 0;
    yarn.click = function(data){
        if (!this.clicked_recently){
            this.clicked_recently = true;
            this.click_ticks = 100;
            this.total_clicks += 1;
        }
    };
    stage.addChild(yarn);

    // add another cat every 2 seconds
    setInterval(function() { 
        var textures = (Math.random() < 0.5 ? walkTextures : runTextures)
        addCat(textures, (Math.random() < 0.5 ? -100 : width + 100), Math.random() * height, catContainer);
    }, 2000);

    renderer.render(stage);

    // start animating text
    requestAnimationFrame( animate );
}

function animate() {

    requestAnimationFrame( animate );

    count += 0.1;

    for (var i = 0; i < catContainer.children.length; i++) {
      var cat = catContainer.children[i];
      cat.position.x += cat.speed;
      if (cat.position.x < -200 || cat.position.x > width + 200) {
          stage.removeChild(cat)
      }
    }

    if (yarn.position.x < 0){ 
        yarn.position.x = 0;
        yarn.angle = Math.PI - yarn.angle;
    } else if (yarn.position.y < 0) {
        yarn.position.y = 0;
        yarn.angle = 2 * Math.PI - yarn.angle;
    } else if (yarn.position.x > 670) {
        yarn.position.x = 670;
        yarn.angle = Math.PI - yarn.angle;
    } else if (yarn.position.y > 400){
        yarn.position.y = 400;
        yarn.angle = -yarn.angle;
    }

    if (yarn.clicked_recently) {
        pixelFilter.size.x = pixelFilter.size.y = 10 - yarn.click_ticks / 10;
        yarn.click_ticks -= 1;
        yarn.speed -= 4 / 100.; 
    }
    if (yarn.click_ticks < 0 & yarn.clicked_recently) { 
        yarn.clicked_recently = false;
        pixelFilter.size.x = pixelFilter.size.y = 1;
        yarn.angle = Math.PI * Math.random();
        yarn.speed = 4 + yarn.total_clicks / 10;
        yarn.scale.x = yarn.scale.y = 0.5 - 0.02 * yarn.total_clicks;
        yarn.position.x = Math.random() * width;
        yarn.position.y = Math.random() * height;
    }

    yarn.position.x += yarn.speed * Math.cos(yarn.angle);
    yarn.position.y += yarn.speed * Math.sin(yarn.angle);

    grayFilter.gray = Math.sin(count);

    // render the stage   
    renderer.render(stage);

}
