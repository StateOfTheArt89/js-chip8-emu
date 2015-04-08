var cpu;

function initCpu(){
  cpu = new Chip8CPU();
}

function loadFile(){
  initCpu();
  var input = document.getElementById('fileinput');
  alert($("#fileinput").val());

  var file = input.files[0];
  var fr = new FileReader();
  fr.onload = loadGame;
  fr.readAsBinaryString(file);

  function loadGame(){
    for (var n = 0; n < fr.result.length; n++){
      cpu.getMem().writeMem(0x200+n, fr.result.charCodeAt(n));
    }

    setInterval(function(){for(var i = 0; i < 1000;i++){cpu.executeNext();}},16);
    setInterval(function(){drawCanvas();},40);
  }
}

function drawCanvas(){
  var c=document.getElementById("canvas");
  var ctx=c.getContext("2d");
  var bswitch = false;
  for (var x=0; x<64;x++){
   for (var y=0; y<32;y++){
     if (cpu.getScreen().readPixel(x,y)==1){
       ctx.fillStyle="#000000";
     } else {
       ctx.fillStyle="#DDDDDD";
     }
      ctx.fillRect(x*5,y*5,4,4);
   }
 }
}

$(document).keydown(function(e){
  cpu.getKeyboard().keyDown(e.keyCode % 0x10);
  console.log("Key down " + e.keyCode)
});

$(document).keyup(function(e){
  cpu.getKeyboard().keyUp(e.keyCode % 0x10);
  console.log("Key up " + e.keyCode)
});
