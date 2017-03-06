
var navWidth = document.documentElement.clientWidth;    //浏览器当前的宽度
var navHeight = document.documentElement.clientHeight;    //浏览器当前的高度
var menuWidth = 300;
var menu = document.getElementById('menu');
var menuHeight = menu.clientHeight;

/**
 * 跨浏览器的阻止默认事件发生方法
 */
function preventDefault(event) {
	if(event.preventDefault) {
		event.preventDefault();
	}
	else {
		event.returnValue = false;
	}
}

/**
 * 在页面上显示菜单
 * @params {event} event 事件元素
 */
function showMenu(event) {
	var mouseX = event.pageX;
	var mouseY = event.pageY;
 	var left = ((navWidth - mouseX >= menuWidth) ? mouseX : (mouseX - menuWidth)) + 'px';
	var top = ((navHeight - mouseY >= menuHeight) ? mouseY : (mouseY - menuHeight)) + 'px';
	menu.style.cssText += ";left: " + left + ";top: " + top + ";visibility:visible";
}


window.onload = function() {

	document.getElementsByTagName('html')[0].oncontextmenu = function(event) {
		event = event || window.event;
		showMenu(event);
		preventDefault(event);
	}

	document.getElementsByTagName('html')[0].onclick = function(event) {
		if(menu.style.visibility == 'visible') {
			event = event || window.event;
			var mouseX = event.pageX;
			var mouseY = event.pageY;
			if(mouseX < menu.style.left.replace('px', '') || mouseX > Number(menu.style.left.replace('px', '')) + menuWidth) {
				menu.style.visibility = 'hidden';
			}
			else if(mouseY < menu.style.top.replace('px', '') || mouseY > Number(menu.style.top.replace('px', '')) + menuHeight) {
				menu.style.visibility = 'hidden';
			}
		}
	}
}


