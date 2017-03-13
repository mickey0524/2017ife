var myChart = echarts.init(document.getElementById('main'));

var option = {
	title : {
		text : 'ECharts 入门示例'
	},
	tooltip : {},
	legend : {
		data : ['bar销量', 'line销量']
	},
	xAxis : {
		data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"],
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        }
	},
	yAxis : {},
	series: [
		{
			name : 'bar销量',
			type : 'bar',
			data: [5, 20, 36, 10, 10, 20]
		},
		{
			name : 'line销量',
			type : 'line',
			data: [5, 20, 36, 10, 10, 20]
		}
	]
}

myChart.setOption(option);