var school=getQueryString("school"); 
if(school==null || school==undefined) school="山东英才学院";
var personNo = getQueryString("no");
var url =  getQueryString("url");
var isStudent = 1; //默认学生

//window.onload=myinit;

 var myColor = ['#1089E7', '#F57474', '#56D0E3', '#F8B448', '#8B78F6'];
    //时间点
var num = [];

//option数据
var optionData = [];

//地图对象
var map = null;

//echarts对象
var myChart = null;

//echarts绘制对象
var option = null;

//颜色
var color = ["red", "#000"]
 
var geoCoordMap = {
	//"博古楼1":[117.57327,30.64833],
	//"食堂1":[117.57327,30.64843],
	//"北校门1":[117.53527,30.64833],
	//"男校门1":[117.57627,30.64833],
	//"信工楼1":[117.54328,30.64833]
};

//地图中心点以及缩放级别等
var bmap_center = {
	//center:[117.57327,30.64843],
	//zoom: 17,
	//roam: true
};

var targetData = [
	//[{"name":"博古楼1","value":"2020-04-10 10:00:00.0"},{"name":"信工楼1","value":"2020-04-14 10:00:00.0"},1],
	//[{"name":"信工楼1","value":"2020-04-14 10:00:00.0"},{"name":"食堂1","value":"2020-04-14 13:49:08.0"},1],
	//[{"name":"食堂1","value":"2020-04-14 13:49:08.0"},{"name":"北校门1","value":"2020-04-15 10:00:00.0"},1],
	//[{"name":"北校门1","value":"2020-04-15 10:00:00.0"},{"name":"男校门1","value":"2020-04-10 10:00:00.0"},1],
	//[{"name":"男校门1","value":"2020-04-10 10:00:00.0"},{"name":"北校门1","value":"2020-04-10 10:00:00.0"},1]
];

//伴随模拟数据
var accompanyData = [

];
//地图中展示的个人轨迹数据，要在一开始就获取到，要不然加到地图时就报错
function getMapData(){
$.ajax({
	type : "get",
	async : true,    //http://154.8.222.111:8083/getEpideSituDisplayPersion/sy_grgjt?isStudent=1&personNo=19058011
	url : url+"getEpideSituDisplayPersion/sy_grgjt?school="+school+"&isStudent=1&personNo="+personNo,    //请求发送
	data : {},
	dataType : "json",        //返回数据形式为json
	success : function(result) {
		if(result.errorCode!=""){
			return;
		}
		centerData = result.center;						
		bmap_center = {
			center: centerData,
			zoom: 17,
			roam: true
		};
		targetData = result.targetData;			
		geoCoordMap = result.geoCoordMap;
		
		mapchart();
		//loadScript();
		forData();

	},
	error : function(errorMsg) {
		//请求失败时执行该函数
		alert("请求数据失败!");
	
	}
});
}


var checkSel = isStudent; //选择时暂存的是否学生的标志

$(function(){
	
	$('#idinput').val(personNo);
	$("#setBtn").click();

	//personNo = id;
	
	setInterval("init()",600000);
	init();
	//人员类别选择
	$("#barType").on('click', 'li', function () {
		
		$(this).addClass('active').siblings('li').removeClass('active');
		if ($(this).data('value') == 1) {
			$('#selkindlab').html('学号');
			if(isStudent==1){
				$('#idinput').val(personNo);
			}else{
				$('#idinput').val("");
			}
			checkSel = 1;
		} else if ($(this).data('value') == 2) {
			$('#selkindlab').html('教工号');
			if(isStudent==1){
				$('#idinput').val('');
			}else{
				$('#idinput').val(personNo);
			}
			checkSel = 0;
		}
		
	})

})

function init(){
	
  getTopData();
  //getPieData(); //放到查询中判断再加载
  getLineData(); 
  fillMarqueeData();
  //fillResponseData();	 //放到查询中判断再加载
  searchBtnClick(); 
}

//查询按钮动作
function searchBtnClick(){ 
	personNo =$('#idinput').val();
	isStudent = checkSel;
	if(personNo!=null &&  personNo!="" && personNo!=undefined){
		$('#histogramChart1')[0].style.display="none";
		$('#personInfo')[0].style.display="block";  		
		//$('#perTitle1').html="个人信息"; 没管用
		
		getPersonInfo(); 
		getRelationData(); //放在前面，只有有人员号才查
		fillResponseData_person(); 
	}else{
		$('#histogramChart1')[0].style.display="block";
		$('#personInfo')[0].style.display="none";   
		//$('#perTitle1').html="隔离人数";  
		
		getPieData(); //只有没人员号的时候才查
		fillResponseData();
	}	  		
	getMapData();
	//loadScript();
}

//获取页面顶部数字数据
function getTopData(){
   //数据格式为Json格式
   $.ajax({
	type : "get",
	async : true,            //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
	url : url+"getEpideSituDisplayPersion/entiCount?school="+school+"&isStudent=1&personNo=yyy",    //请求发送
	data : {},
	dataType : "json",        //返回数据形式为json
	success : function(result) {
		//请求成功时执行该函数内容，result即为服务器返回的json对象
		teachercount = result.teachercount;
		studentcount = result.studentcount;
		foreigner = result.foreigner;
		other = result.other;
		fromOtherCountry = result.fromOtherCountry;
		fromWuHan = result.fromWuHan;
		focusObservation = result.focusObservation;
		
		$('#teaNum').html(teachercount);
		$('#stuNum').html(studentcount);
		$('#foreignNum').html(foreigner);
		$('#otherNum').html(other);
		$('#fromOtherCountry').html(fromOtherCountry);
		$('#fromWh').html(fromWuHan);
		$('#focusNum').html(focusObservation);
	},
	error : function(errorMsg) {
		//请求失败时执行该函数
		alert("请求数据失败!");
	
	}
})
}

//获取饼状图数据
function getPieData(){
	//var piedata;
	$.ajax({
		type : "get",
		async : true,            //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
		url : url+"getEpideSituDisplayPersion/glCount?school="+school+"&isStudent=1&personNo=yyy",    //请求发送
		data : {},
		dataType : "json",        //返回数据形式为json
		success : function(result) {
			//var d=[{name:"正在14天隔离人数","value":0},{name:"结束14天隔离人数","value":0}];
			piedata = result.data;
			//var pieXdata = [];
			//var pieYdata = [];
			//for(var i = 0; i<result.length; i++){				
			//	pieXdata.push(piedata.name);
				//pieYdata.push(piedata.value);
		   //}	
			pieChartLeft(piedata);
		},
		error : function(errorMsg) {
			//请求失败时执行该函数
			alert("请求数据失败!");
		
		}
	});
	//return piedata;
}

function pieChartLeft(piedata){
    var pieChart = echarts.init(document.getElementById("histogramChart1"));

	var option = {
		//设置
		tooltip:{
			trigger:'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		//对图例组件的不同系列进行标记说明
		legend:{
			orient:'vertical',  //设置图例列表的布局朝向
			x:'left',
			textStyle:{
				fontSize: 12,//字体大小
				color: '#ffffff'//字体颜色
			},
			data:["正在14天隔离人数","结束14天隔离人数"]
		},
		
		//系列列表
		series:[
			//系列1
			{
				name:'隔离类别',
				type:'pie',    //数据统计图的类型
				//放置要展示的数据
				data:piedata
			}
		]
	}

    // 使用刚指定的配置项和数据显示图表。
    pieChart.setOption(option);
}

//获取折线图数据
function getLineData(){
	$.ajax({
		type : "get",
		async : true,            //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
		url : url+"getEpideSituDisplayPersion/xmcrCount?school="+school+"&isStudent=1&personNo=yyy",    //请求发送
		data : {},
		dataType : "json",        //返回数据形式为json
		success : function(result) {
			var yDataOther = result.yDataOther;
			var yDataTeacher = result.yDataTeacher;
			var yDataStudent = result.yDataStudent;
			var xData = result.xData ;

			lineChartBottom(xData,yDataOther,yDataTeacher,yDataStudent)
		},
		error : function(errorMsg) {
			//请求失败时执行该函数
			alert("请求数据失败!");
		
		}
	});
}
function lineChartBottom(xData,yDataOther,yDataTeacher,yDataStudent){
    var lineChart2 = echarts.init(document.getElementById('lineChart2'));
   lineChart2.setOption({

     color:["#87cefa","#ff7f50","#32cd32","#da70d6",],
     legend: {
         y : '10',
         x : 'right',
         textStyle : {
             color : '#ffffff',

         },
          data : ['学生','教师','家属/校外人员'],
     },
     calculable : false,
     tooltip : {
         trigger: 'item',
         formatter: "{a}<br/>{b}<br/>{c}人"
     },
     yAxis: [
           {
               type: 'value',
               axisLine:{
					onZero: false,
                   lineStyle:{
                       color: '#034c6a'
                   },
               },

               axisLabel: {
                   textStyle: {
                       color: '#fff'
                   },
                   formatter: function (value) {
                       return value + "人"
                   },
               },
               splitLine:{
                   lineStyle:{
                       width:0,
                       type:'solid'
                   }
               }
           }
       ],
       xAxis: [
           {
               type: 'category',
			   //data : ['01:00','03:00','05:00','07:00','09:00','11:00','13:00','15:00','17:00','19:00','21:00','23:00'],
			   data: xData,
               axisLine:{
                   lineStyle:{
                       color: '#034c6a'
                   },
               },
               splitLine: {
                   "show": false
               },
               axisLabel: {
                   textStyle: {
                       color: '#fff'
                   },
                   formatter: function (value) {
                       return value + ""
                   },
               },
               splitLine:{
                   lineStyle:{
                       width:0,
                       type:'solid'
                   }
               },
           }
       ],
       grid:{
               left: '5%',
               right: '5%',
               bottom: '20%',
			   containLabel: true,
			   borderWidth:0
       },
       series : [
         {
             name:'学生',
             type:'line',
             smooth:true,
             itemStyle: {
                 normal: {
                     lineStyle: {
                         shadowColor : 'rgba(0,0,0,0.4)'
                     }
                 }
             },
			 //data:[0,0,10,28,15, 36, 29, 45, 50, 25,14,8].reverse()
			 data:yDataStudent
         },
         {
             name:'教师',
             type:'line',
             smooth:true,
             itemStyle: {
                 normal: {
                     lineStyle: {
                         shadowColor : 'rgba(0,0,0,0.4)'
                     }
                 }
             },
			 //data:[0,0,0,5,17, 6, 9, 14, 7, 3,8,1 ].reverse()
			 data:yDataTeacher
         },
         {
             name:'家属/校外人员',
             type:'line',
             smooth:true,
             itemStyle: {
                 normal: {
                     lineStyle: {
                         shadowColor : 'rgba(0,0,0,0.4)'
                     }
                 }
             },
			 //data:[0,0,0,2,5, 8, 3, 0, 2, 0,0,0].reverse()
			 data:yDataOther
         }
     ]
   });
}

function format(fmt, date) {
	var o = {
		"M+": date.getMonth() + 1, //月份
		"d+": date.getDate(), //日
		"h+": date.getHours(), //小时
		"m+": date.getMinutes(), //分
		"s+": date.getSeconds(), //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds() //毫秒
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}


 //* 将数据组装
 //* @param {Object} one  目标数据
 //* @param {Object} two  伴随数据
 //* @param {Object} step 时间点
 //* @param {Object} flag 标志
 //* @param {Object} period1 目标秒数
 //* @param {Object} delay1 目标延迟数
 //* @param {Object} period2 目标秒数
 //* @param {Object} delay2 目标延迟数
 //
function installData(one, two, step, flag, period1, delay1, period2, delay2) {

	//此地为何判断--因echarts有一个bug,轨迹会出现错乱，将数据放在不同series中，切换执行则会避开
	if(flag === 2) {
		if(one === null) {
			optionPush([], [], two, [], period1, delay1, period2, delay2);
		} else if(two === null) {
			optionPush(one, [], [], [], period1, delay1, period2, delay2);
		} else {
			optionPush(one, [], two, [], period1, delay1, period2, delay2);
		}
	} else {
		if(one === null) {
			optionPush([], [], [], two, period1, delay1, period2, delay2);
		} else if(two === null) {
			optionPush([], one, [], [], period1, delay1, period2, delay2);
		} else {
			optionPush([], one, [], two, period1, delay1, period2, delay2);
		}
	}
	//相应时间点
	num.push(step);
}
function optionPush(one1, one2, two1, two2, period1, delay1, period2, delay2) {
	optionData.push({
		series: [{
				effect: {
					period: period1,
					delay: delay1
				},
				data: one1
			},
			{
				effect: {
					period: period1,
					delay: delay1
				},
				data: one2
			},
			{
				effect: {
					period: period2,
					delay: delay2
				},
				data: two1
			},
			{
				effect: {
					period: period2,
					delay: delay2
				},
				data: two2
			}
		]
	});
}
function logic(data) {
	//进行交叉数据，来规避轨迹出现bug
	var z = 1;
	//目标与伴随间隔一分钟之内为同时出发
	var interval = 60000;
	for(var i = 0, len = data.length; i < len; i++) {

		if(data[i + 1] != undefined) {

			//首先前为目标后为伴随时或者前为伴随后为目标才进行执行时间比对逻辑
			if(data[i][3] === 1 && data[i + 1][3] === 2) {
				var d1 = new Date(data[i][2]); //目标出发时间
				var d2 = new Date(data[i + 1][2]); //伴随出发时间
				var d3 = new Date(data[i][4]); //目标到达时间
				var d4 = new Date(data[i + 1][4]); //伴随到达时间

				//查看是否在时间间隔内
				if(d1 - d2 <= interval && d1 - d2 >= -interval) {
					installData(data[i][0], data[i + 1][0], data[i + 1][4], z++, 4, 0, 4, 0);
					i++;
				} else if(d3 > d2 && !(d2 - d3 <= interval && d2 - d3 >= -interval)) {
					installData(data[i][0], data[i + 1][0], data[i + 1][4], z++, 4, 0, 2, 2000);
					i++;
				} else {
					installData(data[i][0], null, data[i][4], z++, 4, 0, 4, 0);
				}
			} else if(data[i][3] === 2 && data[i + 1][3] === 1) {
				var d1 = new Date(data[i][2]);
				var d2 = new Date(data[i + 1][2]);
				var d3 = new Date(data[i][4]);
				var d4 = new Date(data[i + 1][4]);
				if(d1 - d2 <= interval && d1 - d2 >= -interval) {
					installData(data[i + 1][0], data[i][0], data[i][4], z++, 4, 0, 4, 0);
					i++;
				} else if(d3 > d2 && !(d2 - d3 <= interval && d2 - d3 >= -interval)) {
					installData(data[i + 1][0], data[i][0], data[i][4], z++, 2, 2000, 4, 0);
					i++;
				} else {
					installData(null, data[i][0], data[i][4], z++, 4, 0, 4, 0);
				}
			} else {
				if(data[i][3] === 1) {
					installData(data[i][0], null, data[i][4], z++, 4, 0, 4, 0);
				} else {
					installData(null, data[i][0], data[i][4], z++, 4, 0, 4, 0);
				}
			}
		} else {
			if(data[i][3] === 1) {
				installData(data[i][0], null, data[i][4], z++, 4, 0, 4, 0);
			} else {
				installData(null, data[i][0], data[i][4], z++, 4, 0, 4, 0);
			}
		}

		if(z >= 3) z = 1;
	}
}


function forData() {

	var that = this;
	//坐标信息
	var targetNum = targetData.length;
	//伴随点的数量
	var accompanyNum = accompanyData.length;

	//目标和伴随的线
	var targetLines = [];
	var accompanyLines = [];

	//坐标圆点信息
	var circleData = [];

	//将目标和伴随的数据整合到一起
	var addData = [];

	//解析数据
	var convertData = function(data) {
		var res = [];
		var fromCoord = geoCoordMap[data[0].name];
		var toCoord = geoCoordMap[data[1].name];
		if(fromCoord && toCoord) {
			res.push({
				fromName: data[0].name,
				toName: data[1].name,
				coords: [fromCoord, toCoord]
			});
		}
		return res;
	};

	//组合数据
	var sumData = function(data) {
		return [convertData(data), {
			name: data[0].name,
			value: geoCoordMap[data[0].name]
		}, data[0].value, data[2], data[1].value];
	}

	//循环目标与伴随的数据
	for(var i = 0; i < targetNum; i++) {
		targetLines.push(sumData(targetData[i])[0][0]);
		addData.push(sumData(targetData[i]));
	}
	for(var i = 0; i < accompanyNum; i++) {
		accompanyLines.push(sumData(accompanyData[i])[0][0]);
		addData.push(sumData(accompanyData[i]));
	}

	//循环得到坐标圆点
	for(var key in geoCoordMap) {
		circleData.push({
			name: key,
			value: geoCoordMap[key]
		})
	}

	//将数据进行排序
	addData.sort(function(a, b) {
		return a > b ? 1 : -1;
	});

	//进行逻辑判断
    logic(addData);
    


	option = {
		baseOption: {
			bmap: bmap_center,
			timeline: {
                show:true,
				axisType: 'category', //category
				autoPlay: true,
                playInterval: 4000,
                left:10,
                right:10,
				data: num,
				tooltip: {
					trigger: 'item',
					formatter: function(params) {
						var date = format('yyyy/MM/dd hh:mm:ss', new Date(params.name));
						return "时间:" + date;

					}
				},
				lineStyle: {
					color: '#182941',
					width: 3
				},
				checkpointStyle: {
					color: '#fff',
					borderColor: '#182941',
					symbolSize: 15,
					animationDuration: 4000
				},
				controlStyle: {
					showPrevBtn: true,
					showNextBtn: true,
					normal: {
						color: '#182941',
						borderColor: '#182941'
					},
					emphasis: {
						color: '#182941',
						borderColor: '#182941'
					},
					position: "right"
				},
				itemStyle: {
					normal: {
						color: '#182941'
					},
					emphasis: {
						color: '#182941'
					}
				},
				label: {
					formatter: function(value, index) {
						var date = format('yyyy/MM/dd hh:mm:ss', new Date(value));
						return date;
					}
				}
			},
			tooltip: {
				trigger: 'item'
			},
			geo: {
				map: 'bmap'
			},
			series: [{
					type: 'lines',
					coordinateSystem: 'bmap',
					zlevel: 2,
					effect: {
						show: true,
						// period: 3,
						trailLength: 0,
						symbol: "arrow",
						symbolSize: 15,
						// delay:2000
					},
					lineStyle: {
						normal: {
							color: color[0],
							width: 0,
							opacity: 0.4,
							curveness: 0.2
						}
					}
				},
				{
					type: 'lines',
					coordinateSystem: 'bmap',
					zlevel: 2,
					effect: {
						show: true,
						// period: 3,
						trailLength: 0,
						symbol: "arrow",
						symbolSize: 15,
						// delay:2000
					},
					lineStyle: {
						normal: {
							color: color[0],
							width: 0,
							opacity: 0.4,
							curveness: 0.2
						}
					}
				},
				{
					type: 'lines',
					coordinateSystem: 'bmap',
					zlevel: 2,
					effect: {
						show: true,
						// period: 3,
						trailLength: 0,
						symbol: "arrow",
						symbolSize: 13
					},
					lineStyle: {
						normal: {
							color: color[1],
							width: 0,
							opacity: 0.4,
							curveness: 0.4
						}
					},
				},
				{
					type: 'lines',
					coordinateSystem: 'bmap',
					zlevel: 2,
					effect: {
						show: true,
						// period: 3,
						trailLength: 0,
						symbol: "arrow",
						symbolSize: 13
					},
					lineStyle: {
						normal: {
							color: color[1],
							width: 0,
							opacity: 0.4,
							curveness: 0.4
						}
					},
				},
				{
					type: 'lines',
					coordinateSystem: 'bmap',
					zlevel: 2,
					effect: {
						show: true,
						trailLength: 0,
						symbolSize: 0
					},
					lineStyle: {
						normal: {
							color: color[0],
							width: 1,
							opacity: 0.4,
							curveness: 0.2
						}
					},
					data: targetLines
                },
                /*
				{
					type: 'lines',
					coordinateSystem: 'bmap',
					zlevel: 2,
					effect: {
						show: true,
						trailLength: 0,
						symbolSize: 0
					},
					lineStyle: {
						normal: {
							color: color[1],
							width: 1,
							opacity: 0.4,
							curveness: 0.4
						}
					},
					data: accompanyLines
                },
                */
				{
					type: 'effectScatter',
					coordinateSystem: 'bmap',
					zlevel: 2,
					rippleEffect: {
						brushType: 'stroke'
					},
					label: {
						normal: {
							show: true,
							position: 'right',
							formatter: '{b}'
						}
					},
					symbolSize: 10,
					showEffectOn: 'render',
					itemStyle: {
						normal: {
							color: "red"
						}
					},
					data: circleData
				}
			]
		},
		options: optionData
	};
}

var myStyleJson=[
	{
	"featureType": "road",
	"elementType": "geometry.stroke",
	"stylers": {
	"color": "#7996b4"
	}
}];

function mapchart() {

  //var mapChart = echarts.init(document.getElementById('mapChart'));
  
	if(myChart == null || myChart == undefined) {
		myChart = echarts.init(document.getElementById('mapChart'));
	}
	forData();
	//getMapData();
	
	myChart.clear();
	
	myChart.setOption(this.option);

	map = myChart.getModel().getComponent('bmap').getBMap();
  
        //避免时间轴拖动地图跟随移动
    myChart.getZr().on('mousedown', function(event) {
          if(event.target != undefined && event.topTarget.name != "line") {
            map.disableDragging();
          }
      })
    myChart.getZr().on('mouseup', function(event) {
        map.enableDragging();
      })
  
	  //卫星地图在放到到16以后不显示，所以注释掉BMAP_SATELLITE_MAP
	//map.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_SATELLITE_MAP]}));//BMAP_HYBRID_MAP BMAP_SATELLITE_MAP //BMAP_PERSPECTIVE_MAP
	map.setMapStyle({style:'grassgreen'})
	//map.setMapStyle({styleJson: myStyleJson });
}
/**
function loadScript() {  
	var script = document.createElement("script");  
	script.src = "../scripts/echarts-all.js?callback=getRelationData"; 
	document.body.appendChild(script);  
  } 
  */

//填充预警信息
function fillMarqueeData(){
	var oDiv = document.getElementById("marqueeDiv");
	$.ajax({
		type : "get",
		async : true,           
		url : url+"getEpideSituDisplayPersion/yjxn?school="+school,    //请求发送
		data : {},
		dataType : "json",        //返回数据形式为json
		success : function(result) {
			var data = result.result;
			var html = '';
			for(var i=0; i< data.length; i++){
				//console.log(data[i]);
				html += '<li>' + data[i] + '</li>';				
			}
			oDiv.innerHTML = html;
		},
		error : function(errorMsg) {
			//请求失败时执行该函数
			alert("请求数据失败!");
		
		}
	});
    
}

//填充响应信息
function fillResponseData(){
	var oDiv = document.getElementById("responseInfoDiv");
	$.ajax({
		type : "get",
		async : true,          
		url : url+"getEpideSituDisplayPersion/sysj?school="+school,    //请求发送
		data : {},
		dataType : "json",        //返回数据形式为json
		success : function(result) {
			var data = result.result;
			var html = '';
			for(var i=0; i< data.length; i++){
				//console.log(data[i]);
				html += '<tr><td width="20%">' + data[i].name + '</td><td width="60%">'+data[i].content + '</td><td width="20%">'+data[i].level +'</td><td>';			
			}
			oDiv.innerHTML = html;
		},
		error : function(errorMsg) {
			//请求失败时执行该函数
			alert("请求数据失败!");
		
		}
	});
}
//获取个人信息 
function getPersonInfo(){		
	$.ajax({
		type : "get",
		async : true,          
		url : url+"getEpideSituDisplayPersion/persionInfo?school="+school+"&isStudent="+isStudent+"&personNo="+personNo,    //请求发送
		data : {},
		dataType : "json",        //返回数据形式为json
		success : function(result) {
			//var data = result.sex;
			$('#data_name').html(result.name);
			//$('#data_sex').html(result.sex);
			//$('#data_age').html(result.age);
			$('#data_class').html(result.class);
			$('#data_returnTime').html(result.returnTime);
			$('#data_segregateTime').html(result.segregateTime);
			$('#data_transport').html(result.transport);
			$('#data_from').html(result.from);

			$('#data_phone').html(result.phone); //联系方式
			$('#data_parentPhone').html(result.parentPhone);  //紧急联系人电话
		},
		error : function(errorMsg) {
			//请求失败时执行该函数
			alert("请求数据失败!");
	
		}
	});
}

//单个人的响应信息
function fillResponseData_person(){
	var oDiv = document.getElementById("responseInfoDiv");
	$.ajax({
		type : "get",
		async : true,          
		url : url+"getEpideSituDisplayPersion/sy_grxysj?school="+school+"&isStudent=1&personNo="+personNo,    //请求发送
		data : {},
		dataType : "json",        //返回数据形式为json
		success : function(result) {
			var html = '';
			if(result.errorCode!=""){
				html += '<tr><td></td><td></td><td></td><td>';
				//return;
			}
			else{
				var data = result.arryObj;				
				for(var i=0; i< data.length; i++){
					//console.log(data[i]);
					html += '<tr><td width="20%">' + data[i].name + '</td><td width="60%">'+data[i].content + '</td><td width="20%">'+data[i].level +'</td><td>';			
				}
			}
			oDiv.innerHTML = html;
		},
		error : function(errorMsg) {
			//请求失败时执行该函数
			//alert("请求数据失败!");
			console.log("请求数据失败!");
		}
	});
}
    
function getRelationData(){
	var relationChart = echarts.init(document.getElementById('histogramChart2'), 'macarons');
    option = {

        legend: {
            y:'5%',
            textStyle:{
                fontSize: 14,//字体大小
                color: '#ffffff'//字体颜色
            }
        }                   
    };
	$.ajax({
		type : "get",
		async : true,          
		url : url+"getEpideSituDisplayPersion/syrelationship?school="+school+"&isStudent=1&personNo="+personNo,    //请求发送
		data : {},
		dataType : "json",        //返回数据形式为json
		success : function(result) {
			
			if(result.errorCode!=""){
				
				return;
			}
			else{
				var nodes = result.nodes;	
				var links = result.links;
				var categories = result.categories;			
				
				jsondata={"categories":categories,"nodes":nodes,"links":links} 
				//relationChart.setOption(option); 
				createGraph(relationChart,jsondata);
			}
		},
		error : function(errorMsg) {
			//请求失败时执行该函数
			//alert("请求数据失败!");
			console.log("请求数据失败!");
		}
	});
}

