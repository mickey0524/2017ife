
/**
 * 返回DOM中id为id的元素
 * @params {string} id DOM元素的id
 * @return {element} id为id的DOM元素
 */
var $ = function(id) {
	return document.getElementById(id);
}

/**
 * 跨浏览器的事件处理程序
 * @params {element} element 需要监听事件的元素
 * @params {string} event 事件类型(click)
 * @params {function} listener 事件监听处理函数
 */
function addEvent(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener, false);
    }
    else if (element.attachEvent) {
        element.attachEvent("on" + event, listener);
    }
    else {
        element["on" + event] = listener;
    }
}

var textArea = $('textarea');
var lineNum = $('line-num');
var relativeHtml = $('relative-html');

/**
 * 给markdown编辑器添加行号
 * @params {number} num 计算所得的行数
 */
function addLineFlag(num) {
	var nowLineNum = lineNum.getElementsByTagName('p');
	var nowLineNumLength = nowLineNum.length;
	//console.log(num + ' ' + nowLineNumLength);
	if(nowLineNumLength > num) {
		for(var i = 0; i < nowLineNumLength - num; i++) {
			lineNum.removeChild(nowLineNum[nowLineNumLength - i - 1]);
		}
	}
	else if(nowLineNumLength < num) {
		var fragment = document.createDocumentFragment();
		for(var i = 0; i < num - nowLineNumLength; i++) {
			var element = document.createElement('p');
			element.innerHTML = nowLineNumLength + i + 1;
			fragment.appendChild(element);
		}
		lineNum.appendChild(fragment);
	}
}

/**
 * 将##这类转为html中的标题
 * @params {string} value textarea框中的元素
 * @return {string} 处理完标题的元素
 */
function dealTitle(value) {
	var pattern = /(^|\n)#{1,6}(.+)\n/g;
	var result = pattern.exec(value);
	if(result == null) {
		return dealTable(value);
	}
	while(result) {	
		var changeLineFlag = 0;
		if(result[0].charAt(0) == '\n') {
			result[0] = result[0].slice(1);
			changeLineFlag += 1;
		}
		for(var hNum = 0; result[0].charAt(hNum) == '#'; hNum++);
		var titleText = '<h' + hNum + '>' + result[2] + '</h' + hNum + '>';
		value = value.slice(0, result.index) + titleText + value.slice(result.index + result[2].length + hNum + changeLineFlag);
		result = pattern.exec(value);
		if(result === null) {
			return dealTable(value);
		}
	}	
}

/**
 * 处理列表
 * @params {string} value title处理完毕的元素
 */
function dealTable (value) {
	var pattern = /[*|+|-]\s*(.+)\n/g;
	var result = pattern.exec(value);
	if(result == null) {
		return dealOrderlyTable(value);
	}
	var liList = [result[1]];
	var beginIndex = result.index;
	var nextIndex = result.index + result[0].length;
	while(result = pattern.exec(value)) {
		if(nextIndex == result.index) {
			liList.push(result[1]);
			nextIndex = result.index + result[0].length;
		}
		else {
			var ulText = '<ul>';
			for(var i in liList) {
				ulText += ('<li>' + liList[i] + '</li>');
			}
			ulText += '</ul>';
			value = value.slice(0, beginIndex) + ulText + value.slice(nextIndex);
			beginIndex = result.index + (ulText.length - nextIndex + beginIndex);        
			liList = [];
			nextIndex = beginIndex;                    //这是最关键的地方，因为value修改后长度变长了，首先需要添加变长的长度，其次下一次搜索的位置要提前定义好，这里调试了2个小时
		}
	}
	if(liList.length != 0) {
		var ulText = '<ul>';
		for(var i in liList) {
			ulText += '<li>' + liList[i] + '</li>';
		}
		ulText += '</ul>';
		value = value.slice(0, beginIndex) + ulText + value.slice(nextIndex);
	}
	return dealOrderlyTable(value);
}

/**
 * 处理textarea中的有序列表
 * @params {string} value textarea中的元素
 */
function dealOrderlyTable(value) {
	var pattern = /\d+\.\s*(.+)\n/g;
	var result = pattern.exec(value);
	if(result == null) {
		return dealReference(value);
	}
	var liList = [result[1]];
	var beginIndex = result.index;
	var nextIndex = result.index + result[0].length;
	while(result = pattern.exec(value)) {
		if(nextIndex == result.index) {
			liList.push(result[1]);
			nextIndex = result.index + result[0].length;
		}
		else {
			var olText = '<ol>';
			for(var i in liList) {
				olText += ('<li>' + liList[i] + '</li>');
			}
			olText += '</ol>';
			value = value.slice(0, beginIndex) + olText + value.slice(nextIndex);
			beginIndex = result.index + (olText.length - nextIndex + beginIndex);
			liList = [];
			nextIndex = beginIndex;
		}
	}
	if(liList.length != 0) {
		var olText = '<ol>';
		for(var i in liList) {
			olText += '<li>' + liList[i] + '</li>';
		}
		olText += '</ol>';
		value = value.slice(0, beginIndex) + olText + value.slice(nextIndex);
	}
	return dealReference(value);
}

/**
 * 处理textarea中的单引用
 * @params {string} value textarea中的元素
 */
function dealReference(value) {
	var pattern = /`((\w|[\u4E00-\u9FA5\uf900-\ufa2d])+)`/g;
	var result;
	while(result = pattern.exec(value)) {
		var spanText = "<span class='single-reference'>" + result[1] + '</span>';
		value = value.slice(0, result.index) + spanText + value.slice(result.index + result[0].length);
	}
	return dealMoreThanReference(value);
}

/**
 * 处理 > 引用
 * @params {string} value 前一个处理快传递的数据
 */
function dealMoreThanReference(value) {
	var pattern = /<(\w+)\n/g;
	var result;
	while(result = pattern.exec(value)) {
		var divText = "<div class='more-than-reference'>" + result[1] + "</div>";
		value = value.slice(0, result.index) + divText + value.slice(result.index + result[0].length);
	}
	return dealLink(value);
}

/**
 * 处理链接
 * @params {string} value 前一个处理块传递的数据
 */
function dealLink(value) {
	var pattern = /\[(.+?)\]\((.+?)\)/g;	
	var result;
	while(result = pattern.exec(value)) {
		console.log(value);
		var aText = result[1];
		var aAttr = result[2];
		var a = '<a href="' + aAttr + '">' + aText + '</a>';
		value = value.slice(0, result.index) + a + value.slice(result.index + result[0].length);
	}
	return dealBlockReference(value);
}

/**
 * 处理代码块
 * @params {string} value 前一个处理块传递的数据
 */
function dealBlockReference(value) {
	var pattern = /```javascript((.|\n)+)```/g;
	var result;
	while(result = pattern.exec(value)) {
		var divText = "<div class='block-reference'>" + result[1] + '</div>';
		value = value.slice(0, result.index) + divText + value.slice(result.index + result[0].length);
	}
	return value;
}

/**
 * 将textarea中的东西实时转换为html格式
 * @params {string} value textarea中的数值
 */

function changeTextToMarkDown(value) {
	var value = dealTitle(value);
	relativeHtml.innerHTML = value;
}

window.onload = function() {
	addEvent(textArea, 'keyup', function() {
		var value = textArea.value;
		var line = value.match(/\n/g)
		if(line !== null) {
			addLineFlag(line.length + 1);
		}
		else {
			addLineFlag(1);
		}
		changeTextToMarkDown(value);
	});
} 