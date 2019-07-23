"use strict";
var WIDTH = 1024;
var HEIGHT = 360;

var timeDataForAudio;

var SMOOTHING = 0.8;
var FFT_SIZE = 2048;
var audioContext=new AudioContext();
var sound=undefined;

$(function(){
  $("#play").on("click", function(){  
    sound=audioFileLoader("sounds/china.m4a");
    sound.play(); 
  });
});

function audioFileLoader(fileDirectory){
  var soundObj={};
  var playSound=undefined;
  var getSound=new XMLHttpRequest();
  soundObj.fileDirectory=fileDirectory;
  getSound.open("GET",soundObj.fileDirectory,true);
  getSound.responseType="arraybuffer";
  
  getSound.onload=function(){
      audioContext.decodeAudioData(getSound.response,function(buffer){
          soundObj.soundToPlay=buffer;
          playSound=audioContext.createBufferSource();
          playSound.buffer=soundObj.soundToPlay;
          playSound.connect(audioContext.destination);
      });
  };

  getSound.send();

  

  soundObj.drawWave=function(arrayObj){
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    ctx.fillStyle='rgb(200,200,200)';
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    ctx.strokeStyle = 'rgb(0,0,0)'
    ctx.beginPath();
    const slideWidth=WIDTH*1.0;

    for(var i=0;i<arrayObj.length;i++){
      var value =arrayObj[i];
      var percent=value/256;
      var height=HEIGHT*percent;
      var offset=HEIGHT-height-1;
      var barWidth=WIDTH/arrayObj.length;
      
      ctx.fillStyle="white";
      ctx.fillRect(i*barWidth, offset, 1, 2);
    }

  }

  soundObj.play=function(time){
    var isEnd=false;
    timeDataForAudio=new Uint8Array();
    var tid=setInterval(function(){
      if(soundObj.soundToPlay){
        playSound.loop=false;
                
        var analyser=audioContext.createAnalyser();
        playSound.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.minDecibels=-140;
        analyser.maxDecibels=0;
        
        var timeData=new Uint8Array(analyser.frequencyBinCount);
        
        function drawAnalyserData(){
          if(!isEnd){
            analyser.getByteTimeDomainData(timeData);
            soundObj.drawWave(timeData);
            timeDataForAudio=concatTypedArrays(timeDataForAudio,timeData);
            requestAnimationFrame(drawAnalyserData);
          }
        }

        playSound.onended=function(){
          isEnd=true;
          console.log(timeDataForAudio.length);
          soundObj.drawWave(timeDataForAudio);
        };

        playSound.start(audioContext.currentTime);
        
        drawAnalyserData();

        clearInterval(tid);
      } 
    },50);
  };

 
  soundObj.stop=function(time){
      playSound.stop(audioContext.currentTime + time||audioContext.currentTime);
  };

  return soundObj;
}

function concatTypedArrays(a, b) { // a, b TypedArray of same type
  var c = new (a.constructor)(a.length + b.length);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
}