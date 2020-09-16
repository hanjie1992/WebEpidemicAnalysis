function getOption(graphInfo){
//给节点设置样式
graphInfo.nodes.forEach(function (node) {
    //node.itemStyle = null;//
    //node.symbolSize = node.size;//强制指定节点的大小   
    // Use random x, y
    node.x = node.y = null;
    node.draggable = true;
});


title=graphInfo['title']
nodes=graphInfo['nodes']
links=graphInfo['links']
categories=graphInfo['categories']

//设置option样式
option = {
    title : {
        text:title,
        x:'right',
        y:'bottom'
    },
    tooltip : {
        trigger: 'item',
        //formatter: '{a} : {b}'
        formatter: '{b}'
        //formatter: function(params){//触发之后返回的参数，这个函数是关键
        //if (params.data.category !=undefined) //如果触发节点
        //   window.open("http://www.baidu.com")
        //}
    },
    color:['#EE6A50','#4F94CD','#7FFF00','#FFFF00','#DAA520'],//'#B3EE3A'
    toolbox: {
        show : true,
        feature : {
            restore : {show: true},
            //magicType: {show: true, type: ['force', 'chord']},
            magicType: {
                show: true, 
                type: ['force', 'chord'] ,
                color:"#00FF00"            
            },
            saveAsImage : {show: false}
        }
    },
    legend: {
        x: 'left',
        data: categories.map(function (a) {//显示策略
            return a.name;
        }),
        textStyle:{
            fontSize: 14,//字体大小
            color: '#ffffff'//字体颜色
        }
    },
    series : [
        {
            type:'force',
            name : title,
            ribbonType: false,
            categories : categories,
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        textStyle: {
                            color: '#333'
                        },
                        color:"	#00EE76"   //和弦图字体颜色
                    },
                    nodeStyle : {
                        brushType : 'both',
                        borderColor : 'rgba(255,215,0,0.4)',
                        borderWidth : 1
                    },
                    linkStyle: {
                        type: 'curve',
                        color:'#ffffff'
                    },
                    chordStyle:{width:1,color:"white",borderWidth:1,borderColor:"#fff",opacity:.5}
                },
                
                emphasis: {
                    label: {
                        show: false
                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                    },
                    nodeStyle : {
                        //r: 30
                    },
                    linkStyle : {}
                }
            },
            useWorker: false,
            minRadius : 15,
            maxRadius : 25,
            gravity: 1.1,
            scaling: 1.1,
            roam: 'move',
            nodes:nodes,
            links :links
        }
    ]
};
return option   
}
function createGraph(myChart,mygraph){
//设置option样式
option=getOption(mygraph)
//使用Option填充图形
myChart.setOption(option);
//点可以跳转页面
/**
myChart.on('click', function (params) {
            var data=params.value
            //点没有source属性
            if(data.source==undefined){
                nodeName=params.name
                window.open("http://www.baidu.com")
            }

});
 */
//myChart.hideLoading();
}
