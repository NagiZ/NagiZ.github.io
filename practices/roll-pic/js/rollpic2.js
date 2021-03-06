window.onload = init;
function init(){
	var width = window.innerWidth>1000? 1000 : window.innerWidth;
	var pics = document.getElementsByClassName('rollpic');
	var len = pics.length;
	var ban = document.getElementById('container');
	var sub_st = creSubImg(pics[0].src, pics[0].className, 'first'),
			sub_lt = creSubImg(pics[len-1].src, pics[len-1].className, 'last');
	ban.appendChild(sub_st);
	ban.insertBefore(sub_lt, pics[0]);
	$(ban).children().each(function(i, ele) {
		ele.ondragstart = ()=>{
			return false;
		}
	});
	resize(ban, width);
	window.onresize = function(){
		width = window.innerWidth>1000? 1000 : window.innerWidth;
		resize(ban, width);
	}
	var curIndex = 1;
	var timer = null;
	function loop(){
		timer = setTimeout(function(){
			curIndex = roll(ban, curIndex, 'left', width);
			loop();
		}, 3000);
	}
	loop();
	$(ban).mousedown(function(e) {
		clearTimeout(timer);
		var initx = e.clientX,
			cl = ban.offsetLeft
		$(ban).mousemove(function(e) {
			var disx = e.clientX - initx;
			$(ban).css('left', cl + disx );
		});
		$(ban).mouseup(function(e) {
			$(this).off('mousemove');
			$(this).off('mouseup');
			var ex = e.clientX - initx;
			$(ban).css('left', cl + ex );
			var dir = ex > 0 ? 'right' : 'left',
					rt = Math.abs(ex)>(pics[0].offsetWidth/2) ? true : false;
					console.log(rt);
			if(dir == 'right'){
				if (rt) {
					curIndex = roll(ban, curIndex, 'right', width);
				}else{
					curIndex = roll(ban, curIndex - 1, 'left', width);
				}
			}else{
				if (rt) {
					curIndex = roll(ban, curIndex, 'left', width);
				}else{
					curIndex = roll(ban, curIndex + 1, 'right', width);
				}
			}
			loop();
		});
	});
}


function creSubImg(src, classname, id){
	var img = document.createElement('img');
	img.src = src;
	img.className = classname;
	img.id = id;
	return img;
}

function resize(ele, width){
	for (var i = 0; i < ele.children.length; i++) {
		ele.children[i].style.width = width + 'px';
	}
}

function roll(ele, index, direction, width){
	i = direction == 'left' ? ++index : --index;
	var len = ele.children.length;		
	if (index == len-1) {
		index = 1;
	}else if (index == 0) {
		index = len-2;
	}
	$(ele).animate({left: -(i*width) + 'px'}, function(){//animate 的callback会马上执行，但是在animate之后的代码貌似，会在下一个animation之后在执行？
		if (ele.offsetLeft == -(len-1)*width) {
			ele.style.left = -1000 + 'px';
		}else if (ele.offsetLeft == 0) {
			ele.style.left = -(len-2)*width + 'px';
		}
	});
	return index;
}