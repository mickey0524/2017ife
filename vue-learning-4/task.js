
/**
 * @params {object} obj 传递进来的参数对象
 */
function Vue(obj) {
	var element = document.getElementById(obj.el.slice(1));
	var pattern = /\{\{[\w|\.| ]+\}\}/g;
	var data = obj.data;

	var html = element.innerHTML;
	var result = html.match(pattern);
	if(result != null) {
		var leftIndex = 0;
		var rightIndex = 0;
		for(var j = 0; j < result.length; j++) {
			leftIndex = html.indexOf('{', rightIndex);
			rightIndex = html.indexOf('}', rightIndex + 2);
			var text = html.slice(leftIndex + 2, rightIndex);
			var changeText = getData(data, text.split('.'));
			html = html.slice(0, leftIndex) + changeText + html.slice(rightIndex + 2);
		}
		element.innerHTML = html;
	}

}

/**
 * @params {object} data 参数中的数据对象
 * @arr {array} arr html对Vue中data的引用
 */
function getData(data, arr) {
	var result = data;
	for(var i in arr) {
		result = result[arr[i].trim()];
	}
	console.log(result);
	return result;
}

var app = new Vue({
  el: '#app',
  data: {
    user: {
      name: 'youngwind',
      age: 25
    }
  }
});