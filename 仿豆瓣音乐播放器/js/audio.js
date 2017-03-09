
/**
 * 封装好的音乐播放器类
 * @params {arr[object]} data 播放器的数据
 * @params {element} element 播放器挂载的DOM元素
 */
function Audio(data, element) {
	this.data = data;
	this.element = element;
	this.volume = 100;
	this.playIndex = 0;
	this.init();
}

/**
 * 初始化audio
 */
Audio.prototype.init = function() {
	this.changeSong(0);
	var _this = this;
	this.element.find('.fa-heart, .fa-heart-o').click(function() { _this.singleLoop(_this); });
	this.element.find('.fa-trash-o').click(function() { _this.deleteSong(_this); });
	this.element.find('.fa-step-forward').click(function() {_this.nextSong(_this); });
	this.element.find('.fa-play, .fa-pause').click(function() { _this.playAndPause(_this); });
	this.element.find('.volume').hover(function() { $('#volume-up').css('width', _this.volume + 'px');}, function() {$('#volume-up').css('width', 0);})  //动态显示音量
	this.element.find('.volume span').hover(function() { $('#volume-tip').css('left', _this.volume + 5 + 'px'); $('#volume-tip').text(_this.volume); $('#volume-tip').show(); }, function() { $('#volume-tip').hide(); });  //动态显示音量提示符
	this.element.find('.volume span').click(function(event) { _this.dealVolume(event, _this); });
	this.element.find('.progress p').click(function(event) { _this.dealProgress(event, _this); });
	setInterval(function() {
		_this.autoNextSong();
		if(_this.element.find('audio').prop('duration') != NaN && !_this.element.find('audio').prop('paused')) {
			var currentTime = _this.dealNowTime($('#now-time').text());
			var duration = _this.changeTimeForm(_this.element.find('audio').prop('duration'));
			$('#now-time').text(currentTime);
			$('#all-time').text(duration);
			_this.refreshProgress(currentTime, duration);
		}
	}, 1000);
}

/**
 * 换歌
 * @params {number} index 歌曲的索引
 */
Audio.prototype.changeSong = function(index) {
	this.reset();
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
Audio.prototype.reset = function() {
	this.element.find('.fa-heart-o').css('display', 'inline');
	this.element.find('.fa-heart').css('display', 'none');
	this.element.find('.fa-pause').css('display', 'inline');
	this.element.find('.fa-play').css('display', 'none');
	this.element.find('#progress-bar-up').css('width', 0);
	this.element.find('#all-time').text('0:00');
	this.element.find('#now-time').text('0:00');
}

/**
 * 转换获得的时间格式
 */
Audio.prototype.changeTimeForm = function(time) {
	time = String(time);
	var time = parseInt(time.slice(0, time.indexOf('.')));
	var minute = parseInt(time / 60);
	var second = time % 60;
	if(second < 10) {
		second = '0' + second;
	}
	return minute + ':' + second;
}

/**
 * 更新进度条
 */
Audio.prototype.refreshProgress = function(currentTime, duration) {
	currentTime = currentTime.split(':');
	duration = duration.split(':');
	currentTime = parseInt(currentTime[0]) * 60 + parseInt(currentTime[1]);
	duration = parseInt(duration[0]) * 60 + parseInt(duration[1]);
	var nowWidth = Math.round((currentTime / duration) * 400);
	$('#progress-bar-up').css('width', nowWidth + 'px');
}


/**
 * 改变当前时间格式
 */
Audio.prototype.dealNowTime = function(currentTime) {
	currentTime = currentTime.split(':');
	currentTime[1] = parseInt(currentTime[1]) + 1;
	if(currentTime[1] < 10) {
		currentTime[1] = '0' + currentTime[1];
	}
	if(currentTime[1] == 60) {
		currentTime[0] = parseInt(currentTime[0]) + 1;
		currentTime[1] = '00';
	}	
	return currentTime.join(':');
}

/**
 * 点击进度条更新
 */
Audio.prototype.dealProgress = function(event, _this) {
	var currentWidth = parseInt(event.pageX) - parseInt($(_this.element.find('.progress p')).offset().left);
	_this.element.find('#progress-bar-up').css('width', currentWidth + 'px');
	var allTime = $('#all-time').text().split(':');
	allTime = parseInt(allTime[0]) * 60 + parseInt(allTime[1]);
	var nowTime = parseInt(currentWidth / 400 * allTime);
	_this.element.find('audio').prop('currentTime', nowTime); 
	_this.element.find('#now-time').text(parseInt(nowTime / 60) + ':' + (nowTime % 60));
}

Audio.prototype.dealVolume = function(event, _this) {
	var mouseX = parseInt(event.pageX);
	var volumeUp = parseInt($('#volume-up').offset().left);
	$('#volume-up').css('width', (mouseX - volumeUp) + 'px');
	_this.volume = Math.round(mouseX - volumeUp);
	$('#volume-tip').text(_this.volume);
	$('#volume-tip').css('left', _this.volume + 5 + 'px');
	$('audio').prop('volume', _this.volume / 100);
}