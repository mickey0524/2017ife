var photoPattern = /^1[3|4|5|7|8][0-9]{9}$/g;           //手机号码的正则表达式

console.log(photoPattern.test('18812011232'));
console.log(photoPattern.test('18812312'));
console.log(photoPattern.test('12345678909'));

var repeatStr = /([a-zA-Z]+\s)\1/g;

console.log(repeatStr.exec('foo foo bar '));
console.log(repeatStr.test('foo bar foo '));
console.log(repeatStr.exec('bar barbar '));

var repeatStr_1 = /(^|\s)([a-zA-Z]+)\s+\2\b/g;

console.log(repeatStr_1.exec('foo foo bar'));
console.log(repeatStr_1.test('foo bar foo'));
console.log(repeatStr_1.exec('bar barbar'));