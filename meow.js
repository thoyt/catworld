var PIXI = require('pixi.js');   
var _ = require('underscore');
var howler = require('howler');

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

var filters = [blurFilter, sepiaFilter];

var grayFilter = new PIXI.GrayFilter();

var invertFilter = new PIXI.InvertFilter();

var catContainer = new PIXI.DisplayObjectContainer();

var graphics = new PIXI.Graphics();

// draw a circle
graphics.lineStyle(1);
graphics.beginFill(0xFFFFFF, 0.5);
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
    cat.interactive = true;
    cat.click = function() {
        this.tint = 0xff0000;
    }

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

    myLargeFont = {
        font: "40px Megrim",
        fill: "white",
        align: "left"
    };
    myLargeCenteredFont = {
        font: "40px Megrim",
        fill: "white",
        align: "center"
    };
    myFont = {
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
    
    welcome_text4 = new PIXI.Text("You get cat points for doing it well, \nand negative cat points\nfor collateral damage.\n\nReady?", myFont);
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
        count += 1;
    } else if (count <= 2 * L){
        count += 1;
    } else if (count <= 3 * L){
        welcome_text1.alpha = (3 * L - count) / L;
        welcome_text2.alpha = (3 * L - count) / L;
        welcome_text3.alpha = (3 * L - count) / L;
        welcome_text4.alpha = (3 * L - count) / L;
        count += 1
    } else if (count == 3 * L + 1) {
        stage.removeChild(welcome_text1);
        stage.removeChild(welcome_text2);
        stage.removeChild(welcome_text3);
        stage.removeChild(welcome_text4);
        count += 1;
        init_game();
    } else {
        return;
    }
    renderer.render(stage);
}

function init_game() {

    game_over = false;

    score_text = new PIXI.Text("Score: 000000", myFont);
    score_text.position.x = 20;
    score_text.position.y = 20;
    score_text.alpha = 0.0;
    stage.addChild(score_text);

    time_text = new PIXI.Text("Time: ", myFont);
    time_text.position.x = 20;
    time_text.position.y = 60;
    time_text.alpha = 0.0;
    stage.addChild(time_text);

    time_graphics = new PIXI.Graphics();
    time_graphics.lineStyle(1, 0x555555);
    time_graphics.drawRoundedRect(80, 65, 100, 20, 5);
    stage.addChild(time_graphics);

    time_left = new PIXI.Graphics();
    time_left.lineStyle(0);
    time_left.beginFill(0xFFFFFF, 0.7);
    time_left.drawRoundedRect(81, 66, 98, 18, 5); 
    time_left.endFill();
    stage.addChild(time_left);

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

    for (var i = 0; i < 8; i++){
        addCat(walkTextures, Math.random() < 0.5 ? -100: width + 100, Math.random() * height, catContainer);
        addCat(runTextures, Math.random() < 0.5 ? -100: width + 100, Math.random() * height, catContainer);
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
    yarn.total_score = 0;
    yarn.max_points = 750;
    yarn.points = yarn.max_points;
    yarn.mousedown = function(data){
        if (!this.clicked_recently){
            this.clicked_recently = true;
            this.click_ticks = 100;
            this.total_score += this.points;
            score_text.setText("Points: " + format_points(this.total_score));
            this.points = yarn.max_points;
            this.total_clicks += 1;
        }
    };
    stage.addChild(yarn);

    renderer.render(stage);

    requestAnimationFrame( animate );

    ct = 0;

    return;
}

function format_points( pts ){
    var nZeros = 6 - String(pts).length
    var rv = "";

    for (var i = 0; i < nZeros; i++){
        rv += "0"
    }
    rv += String(pts);
    return rv;
}

function animate() {

    requestAnimationFrame( animate );

    if (!game_over){
    
        if (yarn.points < 0) {
            game_over = true;
            stage.filters = [ invertFilter ];
            if (yarn.total_score < 1000) {
              var assessment = "horrifying";
            } else if (yarn.total_score < 3000){
              var assessment = "not great, tbh";
            } else if (yarn.total_score < 5000){
              var assessment = "passable. ok you did fine!";
            } else if (yarn.total_score < 7000){
              var assessment = "good. no, really I mean it.";
            } else if (yarn.total_score < 9000){
              var assessment = "excellent. meow.";
            } else if (yarn.total_score < 11000){
              var assessment = "whoa how did you even.";
            } else {
              var assessment = ":-0";
            }
            game_over_text = new PIXI.Text("Game over :(.\nYou got " + yarn.total_score + " points,\nwhich is " 
                    + assessment + ".\nPlay again?", myLargeCenteredFont);
            game_over_text.position.x = width / 4;
            game_over_text.position.y = height / 4;
            game_over_text.interactive = true;
            game_over_text.click = function(){
                game_over = false;
                score_text.setText("Points: " + format_points(0));
                stage.filters = undefined;
                for (var i = 0; i < catContainer.children.length; i++) {
                  var cat = catContainer.children[i];
                  cat.play();
                }
                stage.removeChild(game_over_text);
                yarn.scale.x = yarn.scale.y = 0.5;
                yarn.angle = Math.PI * Math.random();
                yarn.position.x = Math.random() * width;
                yarn.position.y = Math.random() * height;
                yarn.speed = 4; 
                yarn.total_clicks = 0;
                yarn.total_score = 0;
                yarn.points = yarn.max_points;
            };
            stage.addChild(game_over_text);
            
            // stop the cats
            for (var i = 0; i < catContainer.children.length; i++) {
              var cat = catContainer.children[i];
              cat.stop();
            }
    
        } else {
            time_left.clear();
            time_left.beginFill(0xFFFFFF, 0.7);
            var time_bar_width = 98.0 * yarn.points / yarn.max_points;
            time_left.drawRoundedRect(81, 66, time_bar_width, 18, 5); 
        }
    
        ct += 0.1;
    
        if (score_text.alpha < 1.0) {
            score_text.alpha = Math.min(ct / 10.0, 1.0);
            time_text.alpha = Math.min(ct / 10.0, 1.0);
        } 
    
        var n_removed = 0;
        for (var i = 0; i < catContainer.children.length; i++) {
          var cat = catContainer.children[i];
          cat.position.x += cat.speed;
          if (cat.position.x < -200 || cat.position.x > width + 200) {
              catContainer.removeChild(cat);
              n_removed += 1;
          }
        }
        for (var i = 0; i < n_removed; i++){
            if (Math.random() < 0.5){
                addCat(walkTextures, Math.random() < 0.5 ? -100: width + 100, Math.random() * height, catContainer);
            } else {
                addCat(runTextures, Math.random() < 0.5 ? -100: width + 100, Math.random() * height, catContainer);
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
        } else {
            yarn.points -= 1;
        }
    
        if (yarn.click_ticks < 0 & yarn.clicked_recently) { 
            yarn.clicked_recently = false;
            pixelFilter.size.x = pixelFilter.size.y = 1;
            yarn.angle = Math.PI * Math.random();
            yarn.speed = 4 + yarn.total_clicks / 8;
            yarn.scale.x = yarn.scale.y = 0.5 - 0.015 * yarn.total_clicks;
            yarn.position.x = Math.random() * width;
            yarn.position.y = Math.random() * height;
        }
    
        yarn.position.x += yarn.speed * Math.cos(yarn.angle);
        yarn.position.y += yarn.speed * Math.sin(yarn.angle);
    
        grayFilter.gray = Math.sin(ct);
    
    }
    renderer.render(stage);
}
