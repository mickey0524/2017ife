
/**
 * @params {obj} data 传入的对象
 */
function Observer (data) {
    this.data = data;
    this.subObserver = {};
    this.event = new Event();
    this.makeObserver(data);
}

/**
 * @params {String} key 对象的key
 * @params {string/number/obj} value 对象对应key的值
 */
Observer.prototype.setterAndGetter = function(key, value) {
	var _this = this;
    Object.defineProperty(this.data, key, {
      get: function(){
          console.log('你访问了' + key);
          return value;
    	},
    	set: function(newVal){
      		console.log('你设置了' + key);
      		console.log('新的' + key + '=' + newVal);
      		_this.event.emit(key, value, newVal);
      		value = newVal;
      		if(typeof newVal == 'object') {
      			this.subObserver[key] = new Observer(value);
      		}
    	}
  	});
}

/**
 * @params {object} obj 对象
 */
Observer.prototype.makeObserver = function(obj) {
  for(var key in obj) {
      if(typeof obj[key] === 'object'){
        this.subObserver[key] = new Observer(obj[key]);
      }
    this.setterAndGetter(key, obj[key]);
  }
}

/**
 * @params {property} attr 需要监听改变的数据
 * @params {function} callback 处理数据改变的回调函数
 */
Observer.prototype.$watch = function(attr, callback) {
	this.event.on(attr, callback);
  if(typeof this.data[attr] === 'object') {
    // for(var i in this.data[attr]) {
    //   this.subObserver[attr].event.on(i, callback);
    // }
    deepbind(this.subObserver[attr], callback);
  }
}

/**
 * @params {property} observer 当前层次的observer
 * @params {function} callback 处理数据改变的回调函数
 */
var deepbind = function(observer, callback) {
  for(var i in observer.data) {
    if(typeof observer.data[i] === 'object') {
      deepbind(observer.subObserver[i], callback);
    }
    observer.event.on(i, callback);
  }
}

/**
 * 自定义事件处理程序
 */
function Event() {
	this.event = {};
}

/**
 * @params {property} attr 需要监听改变的数据
 * @params {function} callback 处理数据改变的回调函数 
 */
Event.prototype.on = function(attr, callback) {
	if(this.event[attr]) {
		this.event[attr].push(callback);
	}
	else {
		this.event[attr] = [callback];
	}
}

/**
 * @params {property} attr 需要监听改变的数据
 * @params {string/int/object} 对象属性原先的值
 * @params {string/int/object} 对象属性改变后的值
 */
Event.prototype.emit = function(attr, oldVal, newVal) {
	this.event[attr] && this.event[attr].forEach(function(item) {
		item(oldVal, newVal);
	});
}

