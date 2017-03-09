
var data = [
	{
		title : '此生与你，不过相逢',
		author : '上古',
		songAddress : './assets/music_1.mp3',
		photoAddress : './assets/photo_1.jpg'
	},
	{
		title : '东风志',
		author : '卡修',
		songAddress : './assets/music_2.mp3',
		photoAddress : './assets/photo_2.jpg'
	}	
]
var element = $('.audio');
var audio = new Audio(data, element);