phantom.outputEncoding="gb2312";

var page = require('webpage').create();
var system = require('system');
var time = Date.now(), url, data = {};
var config = require('./config.json');

page.onConsoleMessage = function(mes) {
	console.log(mes);
}

if(system.args.length !== 3) {
	console.log('缺少搜索关键字!');
	phantom.exit();
}

else {
	if(!config[system.args[2]]) {
		console.log('不支持该机器');
		phantom.exit();
	}
	url = 'https://www.baidu.com/s?ie=utf-8&f=8&wd=' + encodeURIComponent(system.args[1]);
	page.settings.userAgent = config[system.args[2]]['userAgent'];
	var size = config[system.args[2]]['size'].split('*');
	size = {
		width : size[0].trim(),
		height : size[1].trim()
	}
	page.viewportSize = size;
	page.open(url, function(status) {
		if(status === 'success') {
			page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js", function() {
				var dataList = page.evaluate(function() {
					var dataList = [];
						/**
						 * pc / ipad
						 */
						if($('#content_left').length != 0 || $('.bds-result-lists').length != 0) {
							var result = $('.c-container');
							result.each(function(index, item) {
								var title = $(item).find('.t').children('a').text() || 'none';
								var info = $(item).find('.c-abstract').text() || $(item).find('.c-span-last').text() || 'none';
								var link = $(item).find('.t').children('a:first-child').attr('href') || 'none';
								var pic = $(item).find('.c-img').attr('src') || 'none';
								dataList.push({
									title : title,
									info : info,
									link : link,
									pic : pic
								});
							});							
						}
						/**
						 * iphone
						 */
						else if($('#results').length != 0) {
							var result = $('.result .c-container');
							result.each(function(index, item) {
								var title = $(item).find('.c-title').text() || 'none';
								if(title !== 'none') {
									var info = $(item).find('.c-line-clamp2').text() || $(item).find('.c-line-clamp3').text() || 'none';
									var link = $(item).children('a:first-child').attr('href') || 'none';
									var pic = $(item).find('.c-img').attr('src') || 'none';
									dataList.push({
										title : title,
										info : info,
										link : link,
										pic : pic
									});
								}
							});
						}
			        return dataList;
		   		});
				dealSuccess(dataList);
				console.log(JSON.stringify(data, undefined, 4));
				phantom.exit();
			});
		}
		else {
			dealError();
		}
	});
}

function dealError() {
	data.code = 0;
	data.msg = '抓取失败';
	data.word = system.args[1];
	data.time = Date.now() - time;
	data.device = system.args[2];
	data.dataList = [];
}

function dealSuccess(dataList) {
	data.code = 1;
	data.msg = '抓取成功';
	data.word = system.args[1];
	data.time = Date.now() - time;
	data.device = system.args[2];
	data.dataList = dataList;
}

