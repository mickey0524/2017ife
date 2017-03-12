
var mongoose = require('mongoose');
var http = require('http');
var url = require('url');
var exec = require('child_process').exec;
var iconv = require('iconv-lite');
var encoding = 'cp936';
var binaryEncoding = 'binary';

mongoose.connect('mongodb://localhost/test');
var phantomjs = mongoose.model('phantomjs', {
  code: Number,
  msg: String,
  word: String,
  time: Number,
  dataList: [{
  	info: String,
	link: String,
	pic: String,
	title: String}]
});
var cmdStr = 'phantomjs hello.js ';


http.createServer(function(req, res) {
	if(req.url !== '/favicon.ico') {
		var search = url.parse(req.url, true).query.search;
		res.writeHead(200, {"Content-Type": "text/plain"});  
		exec(cmdStr + search, { encoding: 'binary' }, function(err, stdout, stderr) {
			if(err) {
				console.log('exec error' + err);
				res.write('404');
				res.end();
			}
			else {
				var data = iconv.decode(new Buffer(stdout, binaryEncoding), encoding);
				res.write(data);
				res.end();
				data = JSON.parse(data);	
				var result = new phantomjs(data);
				result.save(function(err) {
					if(err) {
						console.log('数据库err');
					}
					else {
						console.log('数据库正常');
					}
				})
			}
		});
				
	}
}).listen(8000);
console.log('server started');

// // new 一个新对象，名叫 kitty
// // 接着为 kitty 的属性们赋值
// var kitty = new Cat({ name: 'Zildjian', friends: ['tom', 'jerry']});
// kitty.age = 3;

// // 调用 .save 方法后，mongoose 会去你的 mongodb 中的 test 数据库里，存入一条记录。
// kitty.save(function (err) {
//   if (err) // ...
//   console.log('meow');
// })