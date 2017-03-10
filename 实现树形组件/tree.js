
/**
 * @params {element} element tree组件挂载的DOM节点
 * @params {array} data 需要挂载在ODM节点上的数据 
 */
function Tree(element, data) {
	this.element = element;
	this.data = data;
	this.init();
}

/**
 * 各种初始化操作
 */
Tree.prototype.init = function() {
	var _this = this;
	this.createTree(this.element, this.data);
	try {
		this.element.onclick = function(event) { _this.changeChildShow(event); }
	}
	catch(err) {
		console.log(err);
	}
}

/**
 * 初始化DOM树
 * @params {element} parent 该子节点应该被添加到的父节点
 * @params {data} array 装载到该节点的数据
 */
Tree.prototype.createTree = function(parent, data) {
	for(var i in data) {
		var name = document.createElement('div');
		if(data[i]['children']) {
			name.className = 'tree-item has-child';
			name.innerHTML = '<span class="hand-icon open"></span>' + data[i]['name'];
			this.createTree(name, data[i]['children'])
		}
		else {
			name.className = 'tree-item no-child';
			name.innerHTML = data[i]['name'];
		}
		parent.appendChild(name);
	}
}

/**
 * 点击父亲组件，hide/show子节点(根元素事件代理)
 * @Params {event} event 点击元素监听到的事件
 */
Tree.prototype.changeChildShow = function(event) {
	var target = event.target || event.srcElement;
	if(target.classList.contains('has-child')) {
		var treeList = target.getElementsByClassName('tree-item');
		if(target.firstElementChild.classList.contains('open')) {
			target.firstElementChild.classList.remove('open');
			target.firstElementChild.classList.add('close');
			for(var i in treeList) {
				try {
					treeList[i].style.display = 'none';
				}
				catch(err) {}	
			}	
		}
		else {
			target.firstElementChild.classList.remove('close');
			target.firstElementChild.classList.add('open');
			for(var i in treeList) {
				try {
					treeList[i].style.display = 'block';
				}
				catch(err) {}
			}			
		}
	}
}