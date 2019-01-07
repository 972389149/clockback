
window.onload = function(){
	

var myChart = echarts.init(document.querySelector('#attendance1'));
var myChart2 = echarts.init(document.querySelector('#attendance2'));
var myChart3 = echarts.init(document.querySelector('#attendance3'));
var myChart4 = echarts.init(document.querySelector('#attendance4'));

var option = {
	title: {
		text: '非全勤',
		x: 'center',
		y: 'center',
		textStyle: {
			fontWeight: 'normal',
			color: '#333333',
			fontSize: '14'
		}
	},
	color: ['rgba(176, 212, 251, 1)'],

	series: [{
		name: 'Line 1',
		type: 'pie',
		clockWise: true,
		radius: ['50%', '66%'],
		itemStyle: {
			normal: {
				label: {
					show: false
				},
				labelLine: {
					show: false
				}
			}
		},
		hoverAnimation: false,
		data: [{
			value: 100,
			name: '01',
			itemStyle: {
				normal: {
					color: { // 完成的圆环的颜色
						colorStops: [{
							offset: 0,
							color: 'rgba(139,221,33,1)' // 0% 处的颜色
						}, {
							offset: 1,
							color: 'rgba(189,239,69,1)' // 100% 处的颜色
						}]
					},
					label: {
						show: false
					},
					labelLine: {
						show: false
					}
				}
			}
		}, {
			name: '02',
			value: 0,
			itemStyle: {
				normal: {
					color: { // 完成的圆环的颜色
						colorStops: [{
							offset: 1,
							color: 'rgba(238,238,238,1)' // 100% 处的颜色
						}]
					},
				}
			}
		}]
	}]
}
var option2 = {
	title: {
		text: '1次',
		x: 'center',
		y: 'center',
		textStyle: {
			fontWeight: 'normal',
			color: '#333333',
			fontSize: '14'
		}
	},
	color: ['rgba(176, 212, 251, 1)'],

	series: [{
		name: 'Line 1',
		type: 'pie',
		clockWise: true,
		radius: ['50%', '66%'],
		itemStyle: {
			normal: {
				label: {
					show: false
				},
				labelLine: {
					show: false
				}
			}
		},
		hoverAnimation: false,
		data: [{
			value: 25,
			name: '01',
			itemStyle: {
				normal: {
					color: { // 完成的圆环的颜色
						colorStops: [{
							offset: 0,
							color: 'rgba(254,215,65,1)' // 0% 处的颜色
						}, {
							offset: 1,
							color: 'rgba(251,230,81,1)' // 100% 处的颜色
						}]
					},
					label: {
						show: false
					},
					labelLine: {
						show: false
					}
				}
			}
		}, {
			name: '02',
			value: 75,
			itemStyle: {
				normal: {
					color: { // 完成的圆环的颜色
						colorStops: [{
							offset: 1,
							color: 'rgba(238,238,238,1)' // 100% 处的颜色
						}]
					},
				}
			}
		}]
	}]
}
var option3 = {
	title: {
		text: '2天',
		x: 'center',
		y: 'center',
		textStyle: {
			fontWeight: 'normal',
			color: '#333333',
			fontSize: '14'
		}
	},
	color: ['rgba(176, 212, 251, 1)'],

	series: [{
		name: 'Line 1',
		type: 'pie',
		clockWise: true,
		radius: ['50%', '66%'],
		itemStyle: {
			normal: {
				label: {
					show: false
				},
				labelLine: {
					show: false
				}
			}
		},
		hoverAnimation: false,
		data: [{
			value: 50,
			name: '01',
			itemStyle: {
				normal: {
					color: { // 完成的圆环的颜色
						colorStops: [{
							offset: 0,
							color: 'rgba(113,140,215,1)' // 0% 处的颜色
						}, {
							offset: 1,
							color: 'rgba(96,127,247,1)' // 100% 处的颜色
						}]
					},
					label: {
						show: false
					},
					labelLine: {
						show: false
					}
				}
			}
		}, {
			name: '02',
			value: 50,
			itemStyle: {
				normal: {
					color: { // 完成的圆环的颜色
						colorStops: [{
							offset: 1,
							color: 'rgba(238,238,238,1)' // 100% 处的颜色
						}]
					},
				}
			}
		}]
	}]
}
var option4 = {
	title: {
		text: '3天',
		x: 'center',
		y: 'center',
		textStyle: {
			fontWeight: 'normal',
			color: '#333333',
			fontSize: '14'
		}
	},
	color: ['rgba(176, 212, 251, 1)'],

	series: [{
		name: 'Line 1',
		type: 'pie',
		clockWise: true,
		radius: ['50%', '66%'],
		itemStyle: {
			normal: {
				label: {
					show: false
				},
				labelLine: {
					show: false
				}
			}
		},
		hoverAnimation: false,
		data: [{
			value: 50,
			name: '01',
			itemStyle: {
				normal: {
					color: { // 完成的圆环的颜色
						colorStops: [{
							offset: 0,
							color: 'rgba(239,82,102,1)' // 0% 处的颜色
						}, {
							offset: 1,
							color: 'rgba(230,65,83,1)' // 100% 处的颜色
						}]
					},
					label: {
						show: false
					},
					labelLine: {
						show: false
					}
				}
			}
		}, {
			name: '02',
			value: 50,
			itemStyle: {
				normal: {
					color: { // 完成的圆环的颜色
						colorStops: [{
							offset: 1,
							color: 'rgba(238,238,238,1)' // 100% 处的颜色
						}]
					},
				}
			}
		}]
	}]
}
	myChart.setOption(option);
	myChart2.setOption(option2);
	myChart3.setOption(option3);
	myChart4.setOption(option4);
}

