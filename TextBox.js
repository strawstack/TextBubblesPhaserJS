TextBox = function (x, y, anchor, width, numberOfLines, t, borderRadius, textColor, backgroundColor) {

  // Set variables for Rounded Rect
  //
  var padding = 10;
  var w = width;
  var h = (21 * numberOfLines + 10) + padding*2;

  var _x = x;
  var _y = anchor != "bottom" ? y : y - h;  // y is either top-left(default) or bottom-left

  // Draw Rounded Rect
  //
  var bmd = game.add.bitmapData(w, h);
  bmd.addToWorld(_x, _y);
  bmd.ctx.fillStyle = backgroundColor;
  bmd.ctx.beginPath();
  bmd.ctx.moveTo(borderRadius, 0);
  bmd.ctx.lineTo(w - borderRadius, 0);
  bmd.ctx.arc(w - borderRadius, borderRadius, borderRadius, -Math.PI/2, 0);
  bmd.ctx.lineTo(w, h - borderRadius);
  bmd.ctx.arc(w - borderRadius, h - borderRadius, borderRadius, 0, Math.PI/2);
  bmd.ctx.lineTo(borderRadius, h);
  bmd.ctx.arc(borderRadius, h - borderRadius, borderRadius, Math.PI/2, Math.PI);
  bmd.ctx.lineTo(0, borderRadius);
  bmd.ctx.arc(borderRadius, borderRadius, borderRadius, Math.PI, 3/2 * Math.PI);
  bmd.ctx.fill();

  // Draw Text
  //
  var _h = anchor != "bottom" ? y + padding : y - h + padding;
  var text = game.add.text(x + padding, _h, "",  { font: "21px Arial", fill: textColor});
    text.lineSpacing = -10;
    text.wordWrap = true;
    text.wordWrapWidth = w - padding*2;

  // cut text into lines and merge into blocks in prep for rendering
  //
  var cutText = chop(t);
  var mergeText = merge(cutText);

  // METHOD - asks textbox to display next n lines of text
  //
  this.showNext = function(){
    var speed = 5;
    if(mergeText != undefined){
        if(mergeText.length == 1 ){
          animate(mergeText.shift(), "", -1, speed);
          mergeText = undefined;
          // TODO - show end marker

        }else{
          animate(mergeText.shift(), "", -1, speed);
          // TODO - show coninue marker

        }

    }else{
      console.log("text ended");
      // delete text box, notify called that text is ended

    }
  };
  this.showNext();  // intal call made by this


  // PRIVATE - renders passed in text via an animation
  //
  function animate(t, str, index, delay){  // t = text, str = "", index = -1, delay = ms
    if(index == -1){
      text.setText("");
      index += 1;
      setTimeout(function(){ animate(t, str, index, delay); }, delay );

    }else if( index < t.length ){
      str += t[index];
      text.setText(str);
      index += 1;
      setTimeout(function(){ animate(t, str, index, delay); }, delay );

    }
  }

  // PRIVATE - chops original text into lines
  //
  function chop(t){
    var arr = t.split(" ");
    var str = "";
    var out = [];
    var lastIndex = 0;
    for(var i=0; i<arr.length; i++){
      str += arr[i] + " ";
      var temp = game.add.text(0, 0, str,  { font: "21px Arial", fill: "#000"});
      temp.visible = false;

      if(temp.width > text.wordWrapWidth){
        out.push( arr.slice(lastIndex, i).join(" ") + " " );
        lastIndex = i;
        str = arr[lastIndex] + " ";

      }else if( i == arr.length - 1 ){  // last word reached
        out.push( arr.slice(lastIndex, i+1).join(" ") );

      }
    }
    return out;
  }

  function merge(arr){
    var out = [];
    var blocks = Math.floor( arr.length / numberOfLines );
    for(var i=0; i<blocks;i ++){
      var temp = "";
      for(var j=0; j<numberOfLines; j++){
        temp += arr.shift();
      }
      out.push( temp );
    }
    out.push( arr.join("") );
    return out;

  }
};

TextBox.prototype = Object.create(Phaser.Sprite.prototype);  // or Phaser.Text.prototype
TextBox.prototype.constructor = TextBox;

/* Called auto if text or sprite is created as 'this' in constructor */
TextBox.prototype.update = function() {
    //console.log("called");
};
