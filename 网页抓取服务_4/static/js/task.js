
new Vue({
	el : '#container',
	data : {
		search : '',
		device : '',
		dataList : []
	},
	methods : {
		submit : function() {
			var _this = this, thisDataList = this.dataList;
			if(this.search) {
				$.ajax({
					url : '/submit',
					data : { search : _this.search, device : _this.device },
					type : 'post',
					dataType : 'json',
					async : true,
					cache : false,
					success : function(data) {
						thisDataList.push.apply(thisDataList, data.dataList);
					}
				});				
			}
		}
	}
})
