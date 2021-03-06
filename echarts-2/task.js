var myChart = echarts.init(document.getElementById('main'));

var option = {
	backgroundColor: 'rgb(215,228,235)',

	title : {
		text : "What's my credit score?",
		subtext : 'Puerto Rico, % decrease on a year earlier',
		textAlign: 'left',
		padding: [5, 5, 5, 10]
	},
	tooltip : {},
	legend : {
		data : ['Population', 'GDP'],
		align : 'left'
	},
	xAxis : [
	{
		data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"],
		axisLine: {
			show: true,
			onZero: false,
			lineStyle: {
				width: 2
			}
		},
		axisTick: {
			inside: true
		}
	},
	{
		z: 10,
	    axisLine : {                               //上面的红线
            show : true,
            lineStyle : {
                color : "red",
                width : 3
	    	}	
	    }	
	}],
	yAxis : {
		inverse: true,
		position: 'right',
		axisLine: {
			show: false
		},
		axisTick: {
			show: false
		},
		splitLine: {
		    lineStyle: {
		        // 使用深浅的间隔色
		        color: 'white',
		        width: 2
		    } 
		}
	},
	series: [
		{
			name : 'Population',
			type : 'bar',
			data: [5, 20, 36, 10, 10, 20],
			itemStyle: {
				normal: {
					color: '#33748A'
				}
			},
			barWidth: '15px'
		},
		{
			name : 'GDP',
			type : 'bar',
			data: [6, 22, 38, 12, 12, 22],
			itemStyle: {
				normal: {
					color: '#33B6E3'
				}
			},
			barGap: 0,
			barWidth: '15px'
		}
	]
}

myChart.setOption(option);