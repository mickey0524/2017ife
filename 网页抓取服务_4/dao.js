var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/test");
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

module.exports = phantomjs;