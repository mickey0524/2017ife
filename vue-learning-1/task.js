function Observer(obj) {
	var result = {};
	for(var i in obj) {
		result.i = obj.i;
		Object.defineProperty(result, i, {
			set : function(newValue) {
				result.i = newValue;
				console.log('你设置了 ' + i + ', 新的值为' + newValue);
			},
			get : function() {
				console.log()
				console.log('你访问了 ' + i);
				return i;
			}
		})
	}
	return { data : result };
}

var app1 = new Observer({
  name: 'youngwind',
  age: 25
});

app1.data.name;
app1.data.age = 100;
