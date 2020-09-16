var symptomName = last_month_day();
var vm = null;
var zdgc_list = [];
var yjinfo_list =[];

var school = null;
var url = ""; //http://127.0.0.1:8083/

var mapChart = null;
var mapChart2 = null;


function addLoadEvent(func) {
    //把现有的window.onload事件处理函数的值都存入变量oldOnLoad。
    var oldOnLoad = window.onload;
    if(typeof window.onload != 'finction'){
        //如果在这个处理函数上还没有绑定任何函数，就像平时那样把新的函数添加给它。
        window.onload = func;
    }else {
        //如果在这个处理函数上已经绑定了一些函数，就把新的函数追加到现有指令的末尾。
        window.onload = function() {
            oldOnLoad();
            func();
        }
    }
}



function create_zdgc_tbody(per){
    console.log("per-------------------",per);
    //window.onload = function(){
    //    var tbody = document.getElementById('zdgc_tbody');
    //    for(var i = 0;i < per.length; i++)
    //    { console.log("i-------------------",i);
    //        var trow = getDataRow(per[i]); 
    //        tbody.appendChild(trow);
     //   }
    //}

    //function fn2(){
        var tbody = document.getElementById('zdgc_tbody');
        for(var i = 0;i < per.length; i++)
        { //console.log("i-------------------",i);
            var trow = getDataRow(per[i]); 
            tbody.appendChild(trow);
        }
    //}

    //addLoadEvent(fn2); 
}
addLoadEvent(create_zdgc_tbody); 

function getDataRow(h){   
    var row = document.createElement('tr'); //创建行
    var nameCell = document.createElement('td'); //创建第一列
    nameCell.innerHTML = "<a >"+h.name+'</a>'; 
    row.appendChild(nameCell); 
    var xyCell = document.createElement('td');//创建第二列
    xyCell.innerHTML = h.xy;
    row.appendChild(xyCell);
    var fromCell = document.createElement('td');//创建第三列
    fromCell.innerHTML = h.from;
    row.appendChild(fromCell);
    var from_numCell = document.createElement('td');//创建第四列
    from_numCell.innerHTML = h.from_num;
    row.appendChild(from_numCell);

    return row; //返回tr数据
}


function test(){
    //console.log('hhhhhhhhhhhhhhhh');
    var tbody = document.getElementById('yj_tbody');
        
    var trow = tbody.insertRow(0);
    var xyCell = document.createElement('td');
    xyCell.innerHTML = Math.round(Math.random()*100).toString() + "小新在南门扫码" ;
    trow.appendChild(xyCell); 
    var rowNum = tbody.rows.length;
    //console.log("rowNum=",rowNum);
    if(rowNum>30){
        for (i=29;i<rowNum;i++)
        {
            tbody.deleteRow(i);
            rowNum=rowNum-1;
                
        }
    }
        

}
//setInterval("test()",2000);

function create_yj_tbody(per){
    console.log("per",per);
    //window.onload = function(){
    //    var tbody = document.getElementById('yj_tbody');
    //    for(var i = 0;i < per.length; i++){
    //    var trow = tbody.insertRow(0);
    //    var xyCell = document.createElement('td');
    //    xyCell.innerHTML = per[i].name + per[i].event;
    //    trow.appendChild(xyCell); 
    //    }
    //}

    //function fn1(){
        var tbody = document.getElementById('yj_tbody');

        

        for(var i = 0;i < per.length; i++){
            var trow = tbody.insertRow(0);
            var xyCell = document.createElement('td');
            xyCell.innerHTML = per[i].name +"  "+ per[i].event;
            if(per[i].isWarning==true){ //重点预警，高亮显示
                xyCell.style.cssText = "color:red;font-weight: bold;";//或者
                //xyCell.setAttribute("style","border:1px; border-style:solid; border-color:black");//可行
            }
            trow.appendChild(xyCell); 
            var rowNum = tbody.rows.length;
            if(rowNum>30){
                for (i=29;i<rowNum;i++)
                {
                    tbody.deleteRow(i);
                    rowNum=rowNum-1;
                    
                }
            }
        

        }
    //}
    //addLoadEvent(fn1);
}
addLoadEvent(create_yj_tbody); 

function initVue() {
    vm = new Vue({
        el: '#app',
        data: {
            baseinfo:{fx_num:1,wsfx_num:2,jwfx_num:3,zdgc_num:4},
            yqjkinfo:{qg:[1,2,3,4,5,6],
                qshen:[7,8,9,10,11,12],
                qshi:[13,14,15,16,17,18],
                qx:[19,20,21,22,23,24]
            }

        }
    })
}
//大屏最顶端信息
function getData_base_info() {
    console.log('获取大屏最顶端信息');
    $.ajax({
        type : "GET",
        async : true,            //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url : url+"getEpideSituDisplayEnti/sy_baseinfo?school="+school,    //请求发送
        data : {},
        dataType : "json",        //返回数据形式为json
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            //{error:0,result:{‘fx_num’:10,’wsfx_num’:10,’jwfx_num’:10,’zdgc_num’:10}}
            //console.log("getData_base_info-----",result);
            Vue.set(vm.baseinfo, 'fx_num', result.result.fx_num);
            Vue.set(vm.baseinfo, 'wsfx_num', result.result.wsfx_num);
            Vue.set(vm.baseinfo, 'jwfx_num', result.result.jwfx_num);
            Vue.set(vm.baseinfo, 'zdgc_num', result.result.zdgc_num);
            
        },
        error : function(errorMsg) {
            //请求失败时执行该函数
            alert("获取大屏最顶端信息 请求数据失败!");
        
        }
    })
    //$(data).each(function (i, v) {
    //    myOption1.xAxis.data.push(v.name);
    //    myOption1.series.data.push(v.count);
    //});
    //myChart1.hideLoading();
    //myChart1.setOption(myOption1);
}
//setInterval('getData_base_info()',2500);
//疫情监控数据
function getData_yqjkinfo(){
    $.ajax({
        type : "GET",
        async : true,            //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url :  url+"getEpideSituDisplayEnti/sy_yqjkinfo?school="+school,    //请求发送
        data : {},
        dataType : "json",        //返回数据形式为json
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
           // console.log("getData_yqjkinfo-----",result);
           
            
            console.log("result");
            console.log(result);
            Vue.set(vm.yqjkinfo, 'qg', result.result.qg);
            Vue.set(vm.yqjkinfo, 'qshen', result.result.qshen);
            Vue.set(vm.yqjkinfo, 'qshi', result.result.qshi);
            Vue.set(vm.yqjkinfo, 'qx', result.result.qx);
            //alert("请求数据!");
            
        },
        error : function(errorMsg) {
            //请求失败时执行该函数
            alert( "疫情监控数据 请求失败");
        
        }
    })
}
//setInterval('getData_yqjkinfo()',2500);
//重点观察人员
function getData_zdgcryinfo(){
    $.ajax({
        type : "GET",
        async : true,            //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url :  url+"getEpideSituDisplayEnti/sy_zdgcryinfo?school="+school,    //请求发送
        data : {},
        dataType : "json",        //返回数据形式为json
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            console.log("重点观察人员-----",result);
            //if(result.result && zdgc_list.length!=result.result.length)
            //{
                //console.log("cccccccccccccccc----");
                zdgc_list = result.result;
                create_zdgc_tbody(result.result);
           // }
            

            //alert("请求数据!");
            
        },
        error : function(errorMsg) {
            //请求失败时执行该函数
            alert("重点观察人员 请求数据失败!");
        
        }
    })
}
//setInterval('getData_zdgcryinfo()',2500);
//校园人员分布
function getData_xyryfbinfo(){
    $.ajax({
        type : "GET",
        async : true,            //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url :  url+"getEpideSituDisplayEnti/sy_xyryfbinfo?school="+school,    //请求发送
        data : {},
        dataType : "json",        //返回数据形式为json
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            console.log("校园人员分布",result);
            create_mapchart(result);

            //alert("请求数据!");
            
        },
        error : function(errorMsg) {
            //请求失败时执行该函数
            alert("校园人员分布 请求数据失败!");
        
        }
    })    
}
//setInterval('getData_xyryfbinfo()',15000);
//预警信息
function getData_yjinfo(){
    $.ajax({
        type : "GET",
        async : true,            
        url :  url+"getEpideSituDisplayEnti/sy_yjinfo?school="+school, 
        data : {},
        dataType : "json",
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            
            console.log("---预警信息---",result);
            if(yjinfo_list.length ==0 || yjinfo_list.length!= result.result.length){
                yjinfo_list = result.result;
               // console.log("---xxxxxxxxxxxxxxxxxxxxxxxx---");
               
                create_yj_tbody(yjinfo_list);
            }else{
                console.log("---预警信息    没有新的的--");
            }
            
            
            //alert("请求数据!");
            
        },
        error : function(errorMsg) {
            //请求失败时执行该函数
            //alert("预警信息 请求数据失败!");
        
        }
    })        
}
setInterval('getData_yjinfo()',2500);
//热门来源
function getData_rmlyinfo(){
    $.ajax({
        type : "GET",
        async : true,            
        url :  url+"getEpideSituDisplayEnti/sy_rmlyinfo?school="+school, 
        data : {},
        dataType : "json",
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            //console.log("---getData_rmlyinfo---",result);
           
            create_worldcloud(result.result);
            //alert("请求数据!");
            
        },
        error : function(errorMsg) {
            //请求失败时执行该函数
            alert("预警信息 请求数据失败!");
        
        }
    })       
}
//setInterval('getData_rmlyinfo()',2500);
//返校交通
function getData_fxjtinfo(){
    $.ajax({
        type : "GET",
        async : true,            
        url :  url+"getEpideSituDisplayEnti/sy_fxjtinfo?school="+school, 
        data : {},
        dataType : "json",
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            //console.log("---getData_fxjtinfo---",result);
            create_pieChart4(result.result);

            //alert("请求数据!");
            
        },
        error : function(errorMsg) {
            //请求失败时执行该函数
            alert("预警信息 请求数据失败!");
        
        }
    })        
}
//setInterval('getData_fxjtinfo()',2500);
//返校人员来源
function getData_fxrylyinfo(){
    console.log('请求开始返校人员来源-----------------------------------------');
    var date1=new Date();  //开始时间
    //结束时间

    $.ajax({
        type : "GET",
        async : true,            
        url :  url+'getEpideSituDisplayEnti/sy_fxrylyinfo?school='+school, 
        data : {},
        dataType : "json",
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            var date2=new Date();
            var date3=date2.getTime()-date1.getTime()  //时间差的毫秒数
            console.log('返校人员来源---请求时间----------------------------------------',date3);
           console.log('返校人员来源-------------------------------------------',result.result);
           create_mapchart2(result.result);
            //alert("请求数据!");
            
        },
        error : function(errorMsg) {
            //请求失败时执行该函数
            //alert("预警信息 请求数据失败!");
        
        }
    })        
}
//setInterval('getData_fxrylyinfo()',15000);

//疫情动态
function getData_yqdtinfo(){
    var oDiv = document.getElementById("marqueeDiv");
    $.ajax({
        type : "GET",
        async : true,            
        url :  url+"getEpideSituDisplayEnti/sy_yqdtinfo?school="+school, 
        data : {},
        dataType : "json",
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            console.log("---疫情动态---",result);
           
            var data = result.result;
            if(data){
                var html = '';
			    for(var i=0; i< data.length; i++){
				//console.log(data[i]);
				    html += '<li>' + data[i] + '</li>' + "<li>  </li>";				
			    }
			    oDiv.innerHTML = html;
            }
			
            //alert("请求数据!");
            
        },
        error : function(errorMsg) {
            //请求失败时执行该函数
            alert("疫情动态 请求数据失败!");
        
        }
    })        
}
setInterval('getData_yqdtinfo()',300000);
//各个学院返校信息
function getData_ejxyfxinfo(){
    $.ajax({
        type : "GET",
        async : true,            
        url :  url+"getEpideSituDisplayEnti/sy_ejxyfxinfo?school="+school, 
        data : {},
        dataType : "json",
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            console.log("各个学院返校信息",result);
            create_histogramChart2(result.result);

            //alert("请求数据!");
            
        },
        error : function(errorMsg) {
            //请求失败时执行该函数
            alert("预警信息 请求数据失败!");
        
        }
    })        
}
//setInterval('getData_ejxyfxinfo()',15000);

function create_mapchart(res){
    var ceter = res.result.center;
    var points = res.poits;
    
    
    var point = new BMap.Point(ceter[0], ceter[1]);
    mapChart.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_SATELLITE_MAP ]}));
    mapChart.centerAndZoom(new BMap.Point(ceter[0], ceter[1]), 13);  // 初始化地图,设置中心点坐标和地图级别
    
    var circle = new BMap.Circle(point, 4325, {
        fillOpacity: 0.3,
        strokeOpacity: 0.5,
        strokeWeight: 1,
        strokeStyle: 'dashed',
        strokeColor: 'blue'
    });
    
    mapChart.addOverlay(circle);
    
    mapChart.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
    
    mapChart.setMapStyle({
        styleJson: [
            {
                "featureType": "all",
                "elementType": "all",
                "stylers": {
                    "lightness": 61,
                    "saturation": -70
                }
            }
        ]
    });
    mapChart.setMapStyle({style:'midnight'})
    
    var dataSet = new mapv.DataSet(points);
    
    var options = {
            fillStyle: 'rgba(180, 80, 80, 0.5)',
            size: 3,
            draw: 'simple'
    }
   
    var mapvLayer = new mapv.baiduMapLayer(mapChart, dataSet, options);
}

function create_worldcloud(JosnList){
    var optionFour = {
        title:{
            text:"热\n \n门 \n\n来 \n\n源",
            show:true,
            textStyle:{
                fontStyle:'normal',
                fontSize:14,
                color:'#e2992d',
            },
            left:10,
            top:10,
        },
        tooltip: {
            show: true
        },
        series: [{
            name: '',
            type: 'wordCloud',
            sizeRange: [8, 25],//文字范围
            //文本旋转范围，文本将通过rotationStep45在[-90,90]范围内随机旋转
            //rotationRange: [0, 0],//[-45, 90],
            rotationStep: 45,
            textRotation: [0, 0],//[0, 45, 90, -45],
            //形状
            shape: 'circle',
            gridSize: 10,
            rotationRange: [-60, 60],
            shape: "pentagon",

            textStyle: {
                normal: {
                    color: function() {//文字颜色的随机色
                        //var colors= ['rgb(194,154,212)','rgb(124,172,155)','rgb(201,201,138)','rgb(242,220,252)'];
                        //return colors[Math.floor(Math.random() * colors.length)];
                        return 'rgb(' + [
                            Math.round(Math.random() * 255),
                            Math.round(Math.random() * 255),
                            Math.round(Math.random() * 255)
                        ].join(',') + ')';
                    }
                },
                //悬停上去的颜色设置
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            data: JosnList
        }]
    };
    var myChartFour = echarts.init(document.getElementById('image'));
    //使用制定的配置项和数据显示图表
    myChartFour.setOption(optionFour);
}

function create_mapchart2(res){
    var school = res.school;
    var center_ = res.center;
    var from_list = res.from;
    

    var dataT = res.from;
    

   
    //geoCoordMap['池州学院'] = [117.574797,30.650055];
  
    var GZData = [];
    var tempData = [school, GZData];
    var sort_map = {};
    dataT.map((item, index) => {
        
        if(sort_map[item.value]){
            sort_map[item.value].push(item.name);
        }else{
            sort_map[item.value] = [];
            sort_map[item.value].push(item.name);
        }
        
        
        var arr = [];
        arr.push(item)
        arr.push({
            name: school
        })
        GZData.push(arr)
    })
    //console.log("GZData=",GZData);
    console.log("sort_map=",sort_map);
    var arr_keys = Object.keys(sort_map);
    console.log("sort_map  keys=",arr_keys);
    var top_name = [];
    var top_value =[];
    for(var i=arr_keys.length-1;i>=0;i--){
        for(var j=0;j<sort_map[arr_keys[i]].length;j++){
            if(top_name.length>=5){
                break;
            }
            top_value.push(Number(arr_keys[i]));
            top_name.push(sort_map[arr_keys[i]][j]);
        }
        
    }
    console.log("top_name",top_name);
    console.log("top_value",top_value);

    
  
    var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = dataItem[0].gps;//geoCoordMap[dataItem[0].name];
            var toCoord = center_;//geoCoordMap[dataItem[1].name];
            if (fromCoord && toCoord) {
                res.push({
                    fromName: dataItem[0].name,
                    toName: dataItem[1].name,
                    coords: [fromCoord, toCoord],
                    value: dataItem[0].value
                });
    
            }
        }
        return res;
    };
  
    var color = ['#00ff78', '#ff971b', '#acff43', '#ff73b7', '#ffff46', '#27bbfe'];
    var series = [{
        type: 'map',
        map: 'china',
        //    width: '100%',
        geoIndex: 1,
        zlevel: 1,
        //    aspectScale: 0.75, //长宽比
        showLegendSymbol: true, // 存在legend时显示
        label: {
            normal: {
                show: true,
            },
            emphasis: {
                show: false,
                textStyle: {
                    color: '#fff'
                }
            }
        },
        roam: true,
        itemStyle: {
            normal: {
                areaColor: 'rgba(128, 128, 128, 0)',
                borderColor: '#49a7d5', //省市边界线00fcff 516a89
    
            },
            emphasis: {
                areaColor: 'rgba(128, 128, 128, 0)',
            }
        },
        data: [{
            name: '南海诸岛',
            value: 0,
            itemStyle: {
                normal: {
                    opacity: 0,
                    label: {
                        show: false
                    }
                }
            }
        }]
    }, ];
  
    series.push({
        name: tempData[0],
        type: 'lines',
        coordinateSystem: 'bmap', 
        zlevel: 1,
        symbol: ['none', 'circle'],
        effect: {
            show: true,
            period: 3, //箭头指向速度，值越小速度越快
            trailLength: 0.01, //特效尾迹长度[0,1]值越大，尾迹越长重
            symbolSize: 4, //图标大小
        },
        lineStyle: {
            normal: {
                opacity: 1,
                curveness: 0.4, //曲线的弯曲程度
                color: '#609fd4'
            }
        },
        data: convertData(tempData[1])
    },
    
    {
        name: tempData[0],
        type: 'scatter',
        coordinateSystem: 'bmap',
        zlevel: 2,
        rippleEffect: {
            brushType: 'stroke'
        },
        label: {
            normal: {
                show: true,
                position: 'right',
                formatter: '{b}',
    
            }
        },
        symbolSize: 15,
        //symbolSize: function(val) {
        //   console.log(val)
        //   return val[2] / 2;
        //},
        itemStyle: {
            normal: {
                //                fontSize: 80,
            }
        },
        data: tempData[1].map(function(dataItem) {
            return {
                name: dataItem[0].name,
                value: dataItem[0].gps.concat([dataItem[0].value])//geoCoordMap[dataItem[0].name].concat([dataItem[0].value])
            };
        })
    }, 
    {
        type: 'effectScatter',
        coordinateSystem: 'bmap',
        zlevel: 4,
        symbolSize: 15,
        label: {
            normal: {
                show: true,
                position: 'right',
                formatter: '{b}',
    
                color: 'white'
            }
        },
        itemStyle: {
            normal: {
                color: 'white'
            }
        },
        rippleEffect: {
            scale: 4,
            brushType: 'stroke'
        },
        data: [{
            name: tempData[0],
            value: center_,
            visualMap: false
        }],
    }, {
        type: 'scatter',
        coordinateSystem: 'bmap',
        zlevel: 4,
        symbolSize: 10,
        symbol: 'pin',
        itemStyle: {
            normal: {
                color: 'white',
            }
        },
        rippleEffect: {
            //        brushType: 'stroke'
        },
        data: [{
            name: tempData[0],
            value: center_,
            visualMap: false
        }],
    },
    //添加柱状图tdd
    {       
        zlevel: 2,       
        type: 'bar',    
        symbol: 'none',       
        barWidth: 8,       
        //barBorderRadius: 20,  
            
        itemStyle: {    
            color: 'red',
            normal: {        
            //barWidth: 8,                   
            barBorderRadius: 5,
            color : {
                type : 'linear',
                x : 0,
                y : 0,
                x2 : 0,
                y2 : 1,
                colorStops : [ {
                    offset : 0,
                    color : '#6ae6dd' // 0% 处的颜色
                }, {
                    offset : 1,
                    color : '#3b8ce4' // 100% 处的颜色
                } ]
            },
               
            //color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{                       
            //    offset: 0,                       
            //    color: "#FFC0CB"//'#99d9ea'  
            //    // 2a333d  99d9ea                   
            //    }, {                       
             //       offset: 1,                       
             //       color: '#3fa7dc'                   
            //}]),
                            
            //shadowColor: 'rgba(0, 0, 0, 0.4)',                   
            shadowBlur: 2,                   
            label : {                 
                    show : true,            
                    position : 'right'
            }                  
        }       
    },        
    //  data:  [2,2,2,2,2,2,2,2,2,2,2]      
    // data:  [12,5,5,5,5,2,2,2,2,2,2]     
    data: top_value//[12,5,5,5,5,2,2,2,2,2]   
}, 
);

    option = {
        bmap: { // 加载 bmap 组件
            center: center_,
            zoom: 4, // 地图当前的缩放比例
            roam: true, // 开启鼠标缩放和平移漫游
            },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                if (params.seriesType == "scatter" && params.name != tempData[0]) {
                    return "<br>" + params.data.name + " ---> " + params.seriesName + "<br />数量：" + params.data.value[2];
                } else if (params.seriesType == "lines") {
                    return "<br>" + params.data.fromName + " ---> " + params.data.toName + "<br />数量：" + params.data.value;
                } else {
                    return params.name;
                }
            }
        },
        visualMap: {
            min: 0,
            max: 100,
            calculable: true,
            color: color,
            //            textStyle: {
            //                color: '#fff',
            //            },
            show: false
        },
        //新添加tdd
        grid: {       
            right:21,       
            //top:160,
            containLabel:false,
            bottom: 0,       
            width: '8%', 
            height:"50%"  
        },   
        xAxis: {    
            min:0, 
            show : false,       
            type: 'value',       
            scale: true,       
            position: 'top',       
            triggerEvent:true,       
            boundaryGap: false,       
            splitLine: {           
                show: false       
            },       
            axisLine: {           
                show: false       
            },       
            axisTick: {          
                show: false       
            },       
            axisLabel: {           
                margin: 2,           
                textStyle: {               
                    color: '#aaa'           
                }       
            },   
        },   
        yAxis: {       
            type: 'category', 
            inverse: true,//倒叙      
            name: 'TOP 5',
            nameLocation:'start',
            nameGap: 10,
            axisLine: {           
                show: true,           
                lineStyle: {               
                    color: '#ddd'           
                }       
            },       
            axisTick: {           
                show: false,           
                lineStyle: {               
                    color: '#ddd'           
                }       
            },       
            axisLabel: {           
                interval: 0,           
                textStyle: {               
                    color: '#ddd'           
                }       
            },       
            data: top_name},//["上海","北京","上海","北京","上海","北京","上海","北京","上海","北京"]   },
        series: series
    };
    mapChart2.clear();
   
    mapChart2.setOption(option);
    mapChart2.hideLoading();
    
    window.addEventListener("resize", function() {
      mapChart2.resize();
    });
    var bmap = mapChart2.getModel().getComponent('bmap').getBMap()
    bmap.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_SATELLITE_MAP ]}));
    bmap.setMapStyle({style:'midnight'})

}

function create_pieChart4(jtlist){
    var labelFromatter = {
        normal : {
            label : {
               position : 'center',
                formatter : function (params){
                  console.log(params)
                  for(var i=0;i<jtlist.length;i++){
                    if(params.name == jtlist[i].name){
                        return jtlist[i].name+":"+(params.percent + '%')
                        break;
                      }
                    } 
                },
            },
            labelLine : {
                show : false
            }
        },
        };
        var pieChart4 = echarts.init(document.getElementById('pieChart4'));
        pieChart4.setOption({
            title:{
                text:"返 \n\n校 \n\n交 \n\n通",
                show:true,
                textStyle:{
                    fontStyle:'normal',
                    fontSize:14,
                    color:'#e2992d',
                },
                left:10,
                top:10,
            },
            
             color: ['#87cefa','#FD6C88','#00ff00','#4ec44e','#567cbc'],
             tooltip : {
                 trigger: 'item',
                 formatter: "{b}({c})<br/>{d}%"
             },
     
             series : [
                 {
                     type : 'pie',
                     center : ['50%', '50%'],
                     radius : [45, 75],
                     x: '0%', // for funnel
                     itemStyle : labelFromatter,
                     data : jtlist
                 },
             ],
        });
}

function create_histogramChart2(xylist){
    var xy_name = [];
    var xy_value = [];
    for(var i=0;i<xylist.length;i++){
        xy_name.push(xylist[i].name);
        xy_value.push(xylist[i].value);
    }
    var min_value =  Math.min.apply(null,xy_value);
    var max_value =  Math.max.apply(null,xy_value);
    console.log("xy_name--------",xy_name);
	console.log("max_value--------",xy_value);
    var histogramChart2 = echarts.init(document.getElementById('histogramChart2'));
    histogramChart2.setOption({
 
      color:['#FD6C88'],
      fontsize:16,
      padding: [0, 0, 10, 10] , // 位置
      grid:{
          top:10,
          left: 0,
          right:10,
          bottom: 10,
          containLabel: true
      },
      tooltip : {
         trigger: 'item',
         formatter: "{a}<br/>{b}<br/>{c}人"
     },
      calculable : true,
      yAxis : [
          {
              type : 'category',
              data : xy_name,//['大数据与人工智能学院','大数据与人工智能学院','大数据与人工智能学院','大数据与人工智能学院','文学与传媒学院','外国语学院','马克思主义学院','旅游与历史文化学院','地理与规划学院','机电工程学院','艺术与教育学院','材料与环境工程学院','商学院','体育学院'],
              axisLine:{
                   lineStyle:{
                       color: '#FD6C88'
                   },
               },
               axisLabel : {
				   show: true,
                   textStyle: {
                      color: '#FFFFFF'
                  }
				   
               }
          }
      ],
      xAxis : [
          {
              type : 'value',
              axisLine:{
                  lineStyle:{
                      color: '#FD6C88'
                  },
              },
              min:0,
              max:max_value,
              splitLine: {
                  "show": false
              },
              axisLabel: {
                  textStyle: {
                      color: '#FFFFFF'
                  },
                  formatter: function (value) {
                      return value + ""
                  },
              },
          }
      ],
      series : [
          {
              name:'',
              type:'bar',
              barWidth : 15,
              data:xy_value,//[1750,1416,1136,819,704,413,251,175,1750,1750,175,1750,1750,1750],
          },
      ]
    });
}





$(function(){
    school = getQueryString("school");
    if(school==null || school==undefined) school="山东英才学院";
    url =  getQueryString("url");

    initVue();
    init();
    getData_base_info();
    getData_yqjkinfo();

    getData_xyryfbinfo();


    getData_rmlyinfo();
    getData_fxjtinfo();
    getData_yqdtinfo();
    getData_yjinfo();
    getData_zdgcryinfo();
    getData_ejxyfxinfo();
    getData_fxrylyinfo();
})
function init(){
    
   
    mapChart = new BMap.Map("mapChart", {enableMapClick: false}); 
    

    mapChart2 = echarts.init(document.getElementById('mapChart2'));
    mapChart2.showLoading("default",{
        text: '正在加载...',
        color: '#347fff',
        textColor: "#fff",//'#68728c',
        maskColor: "#081832",//'rgba(255, 255, 255, 0.6)',
        zlevel: 0
    });//加载动画
    
    
    //消息通知上下翻滚
    var num=$("#notice").find("li").length;
    if (num>4) {
        setInterval(function(){
            $('#notice').animate({
                marginTop:"-30px"
            },1000,function(){
                $(this).css({marginTop : "0"}).find("li:first").appendTo(this);
            });
        }, 3000);
    }


}
function scroll(className){                
    var uls = $("."+className+">ul");                
    var interval = 1200;                
    var rowHeight = 40;                
    var curIndex=0;                
    function  playScroll() {                    
        for(var i=0;i<uls.length;i++){                        
            if(i<curIndex){                            
                uls.eq(i).stop(true).animate({top:(i-curIndex-1+uls.length)*rowHeight+'px'
            });                        
        }else if(i>curIndex){                            
            uls.eq(i).stop(true).animate({top:(i-curIndex-1)*rowHeight+'px'});                        
        }else{                            
            uls.eq(i).stop(true).animate({top: -rowHeight},function(){                                
                $(this).css({top:(uls.length-1)*rowHeight+'px'});                            
            });                        
        }                    
    }                    
    if(curIndex==uls.length-1){                        
        curIndex=0                    
    }else{                        
        curIndex++                    
    }                
}                
    timer = setInterval(playScroll,interval);                
    $('.'+className).mouseenter(function () {                    
    clearInterval(timer);                
    }).mouseleave(function () {                    
    timer = setInterval(playScroll,interval);                
    });            
}

function tbody_click(){
    var tr = event.srcElement; // 通过event.srcElement 获取激活事件的对象 td 

　　　　//alert("行号：" + tr.parentElement.rowIndex); 
   //console.log("e.target=========");
    //console.log("---------------------",tr.parentElement.rowIndex);
    //console.log("-------eee--------",zdgc_list);
    //zdgc_list[tr.parentElement.rowIndex];
    //实现页面的跳转
    if(tr.parentElement.rowIndex){
        
        var xh = zdgc_list[tr.parentElement.rowIndex-1]['xh'];
       // console.log("-------xh--------",xh);
       window.location.href='quota.html?url='+url+'&school='+school+'&no=' + xh;
    }
    
}

