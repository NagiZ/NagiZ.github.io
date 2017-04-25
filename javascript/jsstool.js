//绘制文本函数
function drawText(str, x, y, ctx, gradient){
	if (gradient==undefined) {
		gradient = 'white';
	}else{
	    gradient.addColorStop(0,'#FFD700');
	    gradient.addColorStop(0.5, '#EE7AE9');
	    gradient.addColorStop(1, '#FF0000');
	}
	ctx.beginPath();
	ctx.fillStyle = gradient;
	ctx.fillText(str, x, y);
	ctx.strokeText(str, x, y);
	ctx.closePath();
}

//文本换行
function subStr(str, fontSize, ctx, stage){
	var length = ctx.measureText(str).width;
	if (length>=stage.width) {
		var subString = '';
		var subArr = [];
		for (var i = 0; i < str.length; i++) {
			subString = subString + str.charAt(i);
			if (ctx.measureText(subString).width>=(stage.width - 4*fontSize)) {
				subArr.push(subString);
				subString = '';
			}
		}
		subArr.push(subString);
		return subArr;
	}
}

//绘制模式选择界面--由按下“开始游戏”触发
function pageSkip(ctx, startX, startY, X, Y, alpha, fillColor){
	if (alpha == undefined) {
		alpha = 1;
	}
	ctx.save();
	ctx.beginPath();
	ctx.globalAlpha = alpha;
	ctx.clearRect(startX, startY, X, Y);
	if (fillColor) {
		ctx.fillStyle = 'black';
		ctx.fillRect(startX, startY, X, Y);
	}
	ctx.restore();
}

//交换颜色
function exchangeColor(ball1, ball2){
	var color = ball1.color, fade = ball1.isFade, alpha = ball1.alpha, image = ball1.image;
	ball1.color = ball2.color;
	ball2.color = color;

	ball1.isFade = ball2.isFade;
	ball2.isFade = fade;

	ball1.alpha = ball2.alpha;
	ball2.alpha = alpha;

	ball1.image = ball2.image;
	ball2.image = image;
}

//随机排序函数，返回 -1 或 1
function randomSorting(){
	return Math.random()>0.5 ? -1:1;
}


//可以考虑加入让二者的isFade都为0
function skidding(ball){
	var x = ball.indexX, y= ball.indexY;
	if (x>0&&x<7&&y<6) {
		if (ball.alpha==1&&ball.color!='black'&&ball.isFade==0) {
			if (ballAll[x-1][y+1].color == 'black'&&ballAll[x+1][y+1].color!='black') {
				exchangeColor(ball, ballAll[x-1][y+1]);
				reDraw(mainContext, ball);
				reDraw(mainContext, ballAll[x-1][y+1]);
				return true;
			}
			if(ballAll[x-1][y+1].color != 'black'&&ballAll[x+1][y+1].color=='black'){
				exchangeColor(ball, ballAll[x+1][y+1]);
				reDraw(mainContext, ball);
				reDraw(mainContext, ballAll[x+1][y+1]);
				return true;
			}else if(ballAll[x-1][y+1].color == 'black'&&ballAll[x+1][y+1].color=='black'){
				var lor = Math.random()*10;
				if (lor<5) {
					exchangeColor(ball, ballAll[x-1][y+1]);
					reDraw(mainContext, ball);
					reDraw(mainContext, ballAll[x-1][y+1]);
					return true;
				}else{
					exchangeColor(ball, ballAll[x+1][y+1]);
					reDraw(mainContext, ball);
					reDraw(mainContext, ballAll[x+1][y+1]);
					return true;
				}
			}
		}
	}
	if (x==7&&y<6) {
		if (ball.alpha==1&&ball.color!='black'&&ball.isFade==0) {
			if (ballAll[x-1][y+1].color == 'black') {
				exchangeColor(ball, ballAll[x-1][y+1]);
				reDraw(mainContext, ball);
				reDraw(mainContext, ballAll[x-1][y+1]);
				//console.log('whit');
				return true;
			}
		}
	}
	if (x==0&&y<6) {
		if (ball.alpha==1&&ball.color!='black'&&ball.isFade==0){
			if(ballAll[x+1][y+1].color=='black'){
				exchangeColor(ball, ballAll[x+1][y+1]);
				reDraw(mainContext, ball);
				reDraw(mainContext, ballAll[x+1][y+1]);
				return true;
			}
		}
	}
	if (x>0&&x<=7&&y<=6) {
		if (ball.alpha==1&&ball.color!='black'&&ball.isFade==0) {
			if (ballAll[x-1][y].color=='black') {
				exchangeColor(ball, ballAll[x-1][y]);
				reDraw(mainContext, ball);
				reDraw(mainContext, ballAll[x-1][y]);
				return true;
			}
		}
	}
}//应该由下往上检测，当发现某个球的上、左、右都是空，则该球往最近的球靠拢；



//秒数
function transTime(t){
	if (t<10) {
		return '0'+t;
	}else if (t>=10&&t<=60) {
		return t;
	}
}

//计时
function timeCount(){
	var t = transTime(tCount);
	document.getElementById('playTime').innerHTML ='Time: '+t+' s';
	if(mode==mode2){
		if(tCount==61){
			document.getElementById('playTime').innerHTML ='Time: '+(tCount-1)+' s';
			//endTimeCount();
			gameOver();
		}else{
			tCount = tCount + 1;
			time = setTimeout("timeCount()", 1000);
		}
	}else if(mode==mode1){
		if (score >= 3000) {
			gameOver();
		}else{
			tCount = tCount + 1;
			time = setTimeout("timeCount()", 1000);
		}
	}
}

//停止计时
function endTimeCount(){
	clearTimeout(time);
	/*document.getElementById('playTime').value = null;
	document.getElementById('playTime').style.display = 'none';
	document.getElementById('score').*/
}

//暂停
var pauseGame = document.getElementById('pauseGame');
var exit = document.getElementById('exit');
if (screen.availWidth>600) {
	pauseGame.addEventListener('click', playPause, false);
	exit.addEventListener('click', playEnd, false);
}else{
	pauseGame.addEventListener('touchend', playPause, false);
	pauseGame.addEventListener('touchend', pauseTouchEnd, false);
	exit.addEventListener('touchend', playEnd, false);
	exit.addEventListener('touchend', exitTouchEnd, false);
	document.addEventListener('touchmove', function(e){
		e = event||window.event;
		e.preventDefault();
	},false);
}


function pauseTouchEnd(){
	pauseGame.style.backgroundColor = "#FFD700";
	pauseGame.style.boxShadow = "0px 9px 0px rgba(255,180,0,1)";
}

function exitTouchEnd(){
	exit.style.backgroundColor = "#FF0000";
	exit.style.boxShadow = "0px 9px 0px rgba(225,0,00,1)";
}

function playPause(){
	timeFlag = ~timeFlag;
	isPause = ~isPause;
	loopPause = ~loopPause;

	var bgMusic = document.getElementById("bgMusic");
	//var curTime = bgMusic.currentTime;

	if (timeFlag) {
		currentState = 3;
		endTimeCount();
		pageSkip(bg, 0, 0, 500, 440, 0.5, 1);
		bground.style.zIndex = 30;
		bg.font = 'bolder 40px YouYuan';
		drawText(conGame, 170, 180, bg);
		drawText(endGame, 170, 270, bg);
		if (screen.availWidth>600){
			exit.removeEventListener('click', playEnd, false);
		}else{
			exit.removeEventListener('touchend', playEnd, false);
		}
		//暂停音乐
		bgMusic.pause();


	}else{
		if (tCount<=60) {
			loop();
			bground.style.zIndex = 0;
			pageSkip(bg, 0, 0, 500, 440);
			timeCount();
			if (screen.availWidth>600){
				exit.addEventListener('click', playEnd, false);
			}else{
				exit.addEventListener('touchend', playEnd, false);
			}

			//继续音乐
			//bgMusic.currentTime = curTime;
			bgMusic.play();

			if(!dropBall()){
				ballAll[0][0].checkEliBall();
			}
		}
	}
};


//
 function playEnd(){
	if(confirm('确定结束游戏？')){
		gameOver();
	//window.close();
	}
}

//结束游戏
function gameOver(){
	isEnd = true;
	if (screen.availWidth>600){
		pauseGame.removeEventListener('click', playPause, false);
	}else{
		pauseGame.removeEventListener('touchend', playPause, false);
	}
	endTimeCount();
	if (!isPause&&!ballAll[0][0].checkEliBall()) {
		//停止背景音，播放结束音乐
		var bgMusic = document.getElementById("bgMusic");
		var endMusic = document.getElementById("endMusic");
		bgMusic.pause();
		/*bgMusic.src = "";
		bgMusic.loop = false;
		bgMusic.autoplay = false;*/

		/*endMusic.src = "./music/endmusic.wav";
		endMusic.autoplay = true;*/
		endMusic.play();

		//dropBall();
		isPause = true;
		loopPause = true;
		currentState = 4;//结束游戏
		var endGameGradient = bg.createLinearGradient(100, 130, 420, 440);
		bg.font = "bolder 50px YouYuan";
		pageSkip(fireCtx, 0, 0, 500, 440);
		pageSkip(bg, 0, 0, 500, 440, 0.5, 1);
		drawText(gover, 150, 190, bg, endGameGradient) ;
		bg.font = "bolder 30px YouYuan";
		if(mode==mode2){
			var str_score = "Your Score: "+ score;
			drawText(str_score, 140, 250, bg, endGameGradient);
			bground.style.zIndex = 30;
			alert('Gameover!'+ 'Your Score: '+ score);
		}else if(mode==mode1){
			var str_time = "Time Spent: "+ tCount;
			drawText(str_time, 140, 250, bg, endGameGradient);
			bground.style.zIndex = 30;
			alert('GameOver!' + 'Your Time Spent: ' + transTime(tCount-1)+'s');
		}
		ballAll = [];
	}
	if (isEnd) {
		if (screen.availWidth>600) {
			document.getElementById('exit').onclick = function(){
				window.location.reload(true);
			}
		}else{
			document.getElementById('exit').ontouchend = function(){
				window.location.reload(true);
			}
		}
	}
}

//死局检测
function ifEli(){
	var canEli = false;
	//console.log(canEli);
	var eliCount;
	for (var i = 0; i < ballAll.length; i++) {
		eliCount = 0;
		var color;
		var k = 0;
		var startBall = 0;
		if (ballAll[i][6].color!='black') {
			for(k=0; k<ballAll[i].length;k++){
				if (ballAll[i][k].alpha<=0||ballAll[i][k].color == 'black') {
					startBall++;
				}
			}
			color = ballAll[i][startBall].color;
		}else{
			color = null;
		}
		//console.log(startBall+'row');
		//color = ballAll[i][startBall].color;

		for (var j = startBall; j < ballAll[i].length; j++) {
			var thisBall = ballAll[i][j];
			if (thisBall.color!='black') {
			//颜色相同，长度加1
				if (thisBall.color == color) {
					eliCount++;
					//到底部，直接检测
					if (j == ballAll[i].length-1&&thisBall.ceBall(i, j+1, eliCount, 'y')) {
						canEli = true;
						//score += gscor(eliCount);
						//Te();
					}
				}else{
					//能消除
					if(thisBall.ceBall(i, j , eliCount, 'y')){
						canEli = true;
						//score += gscor(eliCount);
						//Te();
					}
					//重置起始颜色和长度
					color = thisBall.color;
					eliCount = 1;
				}
			}
		}
	}
	for (var j = 0; j < ballAll[0].length; j++) {
		eliCount = 0;
		var color;
		/*var k = 0;
		var startBall = 0;
		for(k=0; k<ballAll.length;k++){
			if (ballAll[k][j].alpha<=0||ballAll[k][j].color == 'black') {
				startBall++;
			}
		}*/
		color = ballAll[0][j].color;

		for(var i = 0; i<ballAll.length; i++){
			if (ballAll[i][j].color!='black'||ballAll[i][j].alpha==1) {
				var thisball = ballAll[i][j];
				if (thisball.color == color) {
					eliCount++;
					if(i==ballAll.length-1&&thisball.ceBall(i+1, j , eliCount, 'x')){
						canEli = true;
						//score += gscor(eliCount);
						//Te();
					}
				}else{
					if (thisball.ceBall(i, j, eliCount, 'x')) {
						canEli = true;
						//score += gscor(eliCount);
						//Te();
					}
					color = thisball.color;
					eliCount = 1;
				}
			}else{
				if (ballAll[i][j].ceBall(i,j,eliCount,'x')) {
					canEli = true;
					//score +=gscor(eliCount);
				}
				color = null;
				eliCount = 0;
			}
		}
	}
	return canEli;
}

function anyEliBall(ball){
	var x = ball.indexX, y = ball.indexY;
	var color = ball.color;
	if (x<7) {
		exchangeColor(ball, ballAll[x+1][y]);
		if(ifEli()){
			exchangeColor(ball, ballAll[x+1][y]);
			return true;
		}else{
			exchangeColor(ball, ballAll[x+1][y]);
		}
	}
	if(y<6){
		exchangeColor(ball, ballAll[x][y+1]);
		if (ifEli()) {
			exchangeColor(ball, ballAll[x][y+1]);
			return true;
		}else{
			exchangeColor(ball, ballAll[x][y+1]);
		}
	}
	return false;
}

function needRearrange(){
	var abEli = 0;
	for (var x = 0; x < ballAll.length; x++) {
		for (var y = 0; y < ballAll[x].length; y++) {
			if (anyEliBall(ballAll[x][y])&&(!isEnd)) {
					abEli++;
			}
		}
	}
	if (abEli==0) {
		return true;
	}else{
		return false;
	}
}

function rearrange(){
	var arr = [];
	var need = needRearrange();
	if (need) {
		for (var i = 0; i < ballAll.length; i++) {
			for (var j = 0; i < ballAll[i].length; j++) {
				arr[i][j] = ballAll[i][j].color;
			}
		}
		arr.sort(randomSorting);
		for (var ii = 0; ii < ballAll.length; i++) {
			for (var jj = 0; jj < ballAll[ii].length; jj++) {
				ballAll[ii][jj].color = arr[ii][jj];
			}
		}
		rearrange();
	}
}