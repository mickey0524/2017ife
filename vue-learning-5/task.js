
/**
 * @params {object} obj 传递进来的参数对象
 */
function Vue(obj) {
	this.obj = obj;
	this.element = document.getElementById(this.obj.el.slice(1));
	this.memoryObj = {};                 //为了记忆住渲染的位置，下次数据改变的时候就能凭这个来更改数据
	this.init();
}

/**
 * 完成首次的数据渲染 
 */
Vue.prototype.init = function() {
	var pattern = /\{\{[\w|\.| ]+\}\}/g;
	var data = this.obj.data;
	var html = this.element.innerHTML;
	var result = html.match(pattern);

	if(result != null) {
		var leftIndex = 0;
		var rightIndex = 0;
		for(var j = 0; j < result.length; j++) {
			leftIndex = html.indexOf('{', rightIndex);
			rightIndex = html.indexOf('}', rightIndex + 2);
			var text = html.slice(leftIndex + 2, rightIndex).trim();
			var changeText = getData(data, text.split('.'));
			html = html.slice(0, leftIndex) + changeText + html.slice(rightIndex + 2);
			if(this.memoryObj[changeText]) {
				this.memoryObj.push(leftIndex);
			}
			else {
				this.memoryObj[changeText] = [leftIndex];
			}
		}
		this.element.innerHTML = html;
	}

	this.dataBind();
}

/**
 * 调用Observer对象监听数据的更改
 */
Vue.prototype.dataBind = function() {
	var _this = this;
	this.observer = new Observer(this.obj.data);
	this.observer.$watch('user', function(oldVal, newVal) {
		var length = String(oldVal).length;
		var html = _this.element.innerHTML;
		for(var i in _this.memoryObj[oldVal]) {
			html = html.slice(0, _this.memoryObj[oldVal][i]) + newVal + html.slice(_this.memoryObj[oldVal][i] + length);
		}
		_this.element.innerHTML = html;
		_this.memoryObj[newVal] = _this.memoryObj[oldVal];
		delete _this.memoryObj[oldVal];
	});
}

/**
 * @params {object} data 参数中的数据对象
 * @arr {array} arr html对Vue中data的引用
 */
function getData(data, arr) {
	var result = data;
	for(var i in arr) {
		result = result[arr[i]];
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
    },
    school: 'bupt',
    major: 'computer'
  }
});