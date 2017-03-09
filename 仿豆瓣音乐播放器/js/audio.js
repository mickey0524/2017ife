
/**
 * 封装好的音乐播放器类
 * @params {arr[object]} data 播放器的数据
 * @params {element} element 播放器挂载的DOM元素
 */
function Audio(data, element) {
	this.data = data;
	this.element = element;
	this.playIndex = 0;
	this.init();
}

/**
 * 初始化audio
 */
Audio.prototype.init = function() {
	this.loadDOM();
	this.changeSong(0);
	var _this = this;
	this.element.find('.fa-heart, .fa-heart-o').click(function() { _this.singleLoop(_this) });
	this.element.find('.fa-trash-o').click(function() { _this.deleteSong(_this) });
	this.element.find('.fa-step-forward').click(function() {_this.nextSong(_this) });
	this.element.find('.fa-play, .fa-pause').click(function() { _this.playAndPause(_this) });
	setInterval(function() {
		_this.autoNextSong();
	}, 1000);
}

/** 
 * 装载DOM
 */
Audio.prototype.loadDOM = function() {
	this.element.get(0).innerHTML = 
		'<div class="audio-control">' + 
			'<h2 id="music-name">此生不过，与你相逢</h2>' + 
			'<h4 id="music-author">上古</h4>' +
			'<audio controls="controls" src="">您的浏览器不支持audio</audio>' + 
			'<div class="audio-bottom-control">' + 
				'<i class="fa fa-heart-o" aria-hidden="true"></i>' + 
				'<i class="fa fa-heart" aria-hidden="true"></i>' +
				'<i class="fa fa-trash-o" aria-hidden="true"></i>' +
				'<i class="fa fa-pause" aria-hidden="true"></i>' +
				'<i class="fa fa-play" aria-hidden="true"></i>' +
				'<i class="fa fa-step-forward" aria-hidden="true"></i>' +
			'</div>' +
		'</div>' + 
		'<div class="audio-avatar">' +
			'<img src="" width="200px" height="200px">' +
		'</div>';	
}

/**
 * 换歌
 * @params {number} index 歌曲的索引
 */
Audio.prototype.changeSong = function(index) {
	this.resetIcon();
	this.element.find('#music-name').text(this.data[index].title);
	this.element.find('#music-author').text(this.data[index].author);
	this.element.find('audio').attr('src', this.data[index].songAddress);
	this.element.find('img').attr('src', this.data[index].photoAddress);
	this.element.find('audio')[0].play();	
}

/**
 * 单曲循环
 */
Audio.prototype.singleLoop = function(_this) {	if(_this.element.find('audio').attr('loop')) {
		_this.element.find('.fa-heart-o').css('display', 'inline');
		_this.element.find('.fa-heart').css('display', 'none');
		_this.element.find('audio').removeAttr('loop');
	}
	else {
		_this.element.find('.fa-heart').css('display', 'inline');
		_this.element.find('.fa-heart-o').css('display', 'none');
		_this.element.find('audio').attr('loop', 'loop');		
	}
}

/**
 * 删除歌曲
 */
Audio.prototype.deleteSong = function(_this) {
	if(_this.data.length != 1) {
		_this.element.find('audio')[0].pause();
		_this.data.splice(_this.playIndex, 1);
		_this.playIndex = _this.playIndex % _this.data.length;
		_this.changeSong(_this.playIndex);
	}
}

/**
 * 下一首歌
 */
Audio.prototype.nextSong = function(_this) {
	_this.element.find('audio')[0].pause();
	_this.playIndex = (_this.playIndex + 1) % _this.data.length;
	_this.changeSong(_this.playIndex);
}

/**
 * 暂停或者播放
 */
Audio.prototype.playAndPause = function(_this) {
	if(_this.element.find('audio').prop('paused')) {
		_this.element.find('.fa-pause').css('display', 'inline');
		_this.element.find('.fa-play').css('display', 'none');
		_this.element.find('audio')[0].play();
	}
	else {
		_this.element.find('.fa-pause').css('display', 'none');
		_this.element.find('.fa-play').css('display', 'inline');
		_this.element.find('audio')[0].pause();		
	}
}

/**
 * 自动循环
 */
Audio.prototype.autoNextSong = function() {
	if(this.element.find('audio').prop('ended') && this.element.find('.fa-heart-o').css('display') == 'inline') {
		this.nextSong(this);
	}
}

/**
 * 换歌的时候自动复位
 */
Audio.prototype.resetIcon = function() {
	this.element.find('.fa-heart-o').css('display', 'inline');
	this.element.find('.fa-heart').css('display', 'none');
	this.element.find('.fa-pause').css('display', 'inline');
	this.element.find('.fa-play').css('display', 'none');
}