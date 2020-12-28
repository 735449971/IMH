var initDistance=10, //初始化公里数
    myCompOverlay,//自定义地图覆盖物
    height, //覆盖物高度
    point, //地图经纬度
    regionName = '河南省', //地图行政区划
    infoBoxList = [],//点位详情窗体
    dischargeData = []; //排放量数据
layui.use(['layer','form','element'], function () {
    var $ = layui.jquery;
    var layer = layui.layer;
    var form = layui.form;
    var element = layui.element;
    //监听折叠
    element.on('collapse(leftPanelBox)', function(data){
        // layer.msg('展开状态：'+ data.show);
    });
    var panelHeight = $('.panelBox').height();
    $('.panelBox .layui-collapse .layui-colla-content').css('maxHeight',panelHeight/2-50+'px');
    window.map=initMap();  //初始化地图
    window.mapLevel = 12;//默认显示地图级别
    window.mapSiteConfig = {
        "siteTypeData": ["nationalAirSite", "provinceAirSite", "countyAirSite",
            "gasPollType", "electricalSite", "emissionSite"],
        "siteObj": {
            "nationalAirSite": {"name": "国控站", "code": "G", "type": "air", "data": [], "label": []},
            "provinceAirSite": {"name": "省控站", "code": "S", "type": "air", "data": [], "label": []},
            "countyAirSite": {"name": "乡镇站", "code": "X", "type": "air", "data": [], "label": []},
            "gasPollType": {"name": "废气", "type": "pollution", "value": "2", "data": [], "label": []},
            "electricalSite": {"name": "用电量监管", "type": "pollution", "value": "4", "data": [], "label": []},
            "emissionSite": {"name": "无组织排放", "type": "pollution", "value": "1", "data": [], "label": []}
        },
        "imgData": [
            ["marker_standard_1.png", "marker_standard_2.png", "marker_standard_3.png", "marker_standard_4.png", "marker_standard_5.png", "marker_standard_6.png", "marker_standard_lost.png"], //标准站
            ["marker_town_1.png", "marker_town_2.png", "marker_town_3.png", "marker_town_4.png", "marker_town_5.png", "marker_town_6.png", "marker_town_lost.png"], //乡村站
            ["marker_small_1.png", "marker_small_2.png", "marker_small_3.png", "marker_small_4.png", "marker_small_5.png", "marker_small_6.png", "marker_small_lost.png"],//微型站
            ["marker_gas_green.png", "marker_gas_red.png", "marker_gas_lost.png", "icon-undefined-gray"],//废气
            ["marker_electrical_green.png", "marker_electrical_red.png", "marker_electrical_lost.png", "icon-undefined-gray"],//用电量监管
            ["marker_emission_green.png","marker_emission_red.png", "marker_emission_lost.png"],//无组织排放
            [["icon-undefined-green.png", "icon-undefined-red.png"], ["icon-water-green.png", "icon-water-red.png"], ["icon-gas-green.png", "icon-gas-red.png"], ["icon-gw-green.png", "icon-gw-red.png"], ["icon-waterdeal-green.png", "icon-waterdeal-red.png"]]
        ]
    };
    window.siteTypeData = mapSiteConfig.siteTypeData; //各个站点参数
    window.imgData=mapSiteConfig.imgData; //默认图片名称
    window.imgRootPath = "/assets/images/map/";//图片路径
    mapLayerEvent();//图层事件
    panelBtn();//面板控制
    clearHistory();
    // 获取上级页面传值
    var airLabelJsonStr = sessionStorage.getItem('airLabelData');
    window.airLabelEntity = JSON.parse(airLabelJsonStr);
    var regionCode = airLabelEntity.regionCode,
        siteName = airLabelEntity.siteName,
        siteCode = airLabelEntity.siteCode,
        aqi = airLabelEntity.aqi,
        Latitude = airLabelEntity.Latitude,
        Longitude = airLabelEntity.Longitude,
        pointType = airLabelEntity.pointType,
        img = airLabelEntity.img,
        factor = airLabelEntity.factor,
        monitorTime = airLabelEntity.monitorTime;
    window.point = new BMap.Point(Longitude, Latitude);
    var timeTamp = new Date(monitorTime).getTime();
    var timeStr = new Date(new Date(timeTamp - 3600 * 1000));
    var startTime = $.format.date(timeStr, 'yyyy-MM-dd 00:00'); //开始时间为大气站点所监测日期的零点
    var endTime = $.format.date(monitorTime, 'yyyy-MM-dd HH:00');//結束時間为大气站点所监测时间
    getWeatherData(startTime,endTime,regionCode);//获取天气
    mapAirLabel(pointType, siteName, siteCode, aqi, Latitude, Longitude, img, factor);//添加目标空气点位
    mapCircle(Longitude, Latitude, initDistance);//添加圆形区域 ,默认圆形半径为20km
    getCountDischarge(Longitude, Latitude, startTime, endTime, initDistance);//获取今日累计排放量
    addCustomOverlay(); // 添加自定义覆盖物
    getDischargeRank(Longitude, Latitude, startTime, endTime,initDistance);//获取今日累计排放量榜單
    mapEnpLabel(Latitude, Longitude, startTime, endTime, initDistance);//添加目标区域内的污染源企业
    getAirRealData(siteCode,startTime, endTime);//获取站点空气质量
    getExceedData(Longitude, Latitude,siteCode,startTime, endTime,initDistance);//获取超标数据

    $('#search').click(function () {
        dischargeData = [];
        $(".gridInfo").hide();
        map.clearOverlays();
        clearHistory();//清除历史覆盖物
        var distance = $("#distance").val();
        mapAirLabel(pointType, siteName, siteCode, aqi, Latitude, Longitude, img, factor);//添加目标空气点位
        mapCircle(Longitude, Latitude, distance);//添加圆形区域 ,默认圆形半径为20km
        getCountDischarge(Longitude, Latitude,startTime, endTime, distance);//获取今日累计排放量
        getDischargeRank(Longitude, Latitude, startTime, endTime,distance);//获取今日累计排放量榜單
        mapEnpLabel(Latitude, Longitude, startTime, endTime, distance);//添加目标区域内的污染源企业
        getAirRealData(siteCode,startTime, endTime);//获取站点空气质量
        getExceedData(Longitude, Latitude,siteCode,startTime, endTime,distance);//获取超标数据
    });

});

function initMap() {
    // 创建地图实例
    var map = new BMap.Map("realTimeMap", {enableMapClick: false, minZoom: 6, maxZoom: 18});
    // map.centerAndZoom('许昌市',9);
    var mapStyle =  [
        {
            'featureType': 'land', //调整土地颜色
            'elementType': 'geometry',
            'stylers': {
                'color': '#081734'
            }
        }, {
            'featureType': 'building', //调整建筑物颜色
            'elementType': 'geometry',
            'stylers': {
                'color': '#04406F'
            }
        }, {
            'featureType': 'building', //调整建筑物标签是否可视
            'elementType': 'labels',
            'stylers': {
                'visibility': 'off'
            }
        }, {
            'featureType': 'highway', //调整高速道路颜色
            'elementType': 'geometry',
            'stylers': {
                // 'color': '#015B99'
                'color': '#12223D'
            }
        }, {
            'featureType': 'highway', //调整高速名字是否可视
            'elementType': 'labels',
            'stylers': {
                'visibility': 'off'
            }
        }, {
            'featureType': 'arterial', //调整一些干道颜色
            'elementType': 'geometry',
            'stylers': {
                'color': '#12223d'
            }
        },
        {
            'featureType': 'arterial', //调整一些干道颜色
            'elementType': 'geometry.fill',
            'stylers': {
                'color': '#12223d'
            }
        },{
            'featureType': 'arterial',
            'elementType': 'labels',
            'stylers': {
                'visibility': 'on'
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#374a46"
            }
        }, {
            'featureType': 'green',
            'elementType': 'geometry',
            'stylers': {
                'visibility': 'off'
            }
        }, {
            'featureType': 'water',
            'elementType': 'geometry',
            'stylers': {
                'visibility': 'on',
                'color': '#0E1B30'
            }
        }, {
            'featureType': 'subway', //调整地铁颜色
            'elementType': 'geometry.stroke',
            'stylers': {
                'color': '#003051'
            }
        }, {
            'featureType': 'subway',
            'elementType': 'labels',
            'stylers': {
                'visibility': 'off'
            }
        }, {
            'featureType': 'railway',
            'elementType': 'geometry',
            'stylers': {
                'visibility': 'off'
            }
        }, {
            'featureType': 'railway',
            'elementType': 'labels',
            'stylers': {
                'visibility': 'off'
            }
        }, {
            'featureType': 'all', //调整所有的标签的边缘颜色
            'elementType': 'labels.text.stroke',
            'stylers': {
                'color': '#313131'
            }
        }, {
            'featureType': 'all',
            'elementType': 'labels.text',
            'stylers': {
                "fontsize": 20
            }
        }, {
            'featureType': 'all', //调整所有标签的填充颜色
            'elementType': 'labels.text.fill',
            'stylers': {
                'color': '#2DC4BB'
            }
        }, {
            'featureType': 'manmade',
            'elementType': 'geometry',
            'stylers': {
                'visibility': 'on'
            }
        }, {
            'featureType': 'manmade',
            'elementType': 'labels',
            'stylers': {
                'visibility': 'on'
            }
        }, {
            'featureType': 'local',
            'elementType': 'geometry',
            'stylers': {
                'visibility': 'on'
            }
        }, {
            'featureType': 'local',
            'elementType': 'labels',
            'stylers': {
                'visibility': 'on'
            }
        }, {
            'featureType': 'subway',
            'elementType': 'geometry',
            'stylers': {
                'lightness': -65
            }
        }, {
            'featureType': 'railway',
            'elementType': 'all',
            'stylers': {
                'lightness': -40
            }
        }, {
            'featureType': 'boundary',
            'elementType': 'geometry',
            'stylers': {
                'color': '#8b8787',
                'weight': '1',
                'lightness': -29
            }
        },
        {
            "featureType": "local",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#ecd606"
            }
        },
        {
            "featureType": "tertiaryway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#ecd606"
            }
        },{
            "featureType": "local",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#ecd606"
            }
        },
        {
            "featureType": "fourlevelway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#ecd606"
            }
        }];
    map.setMapStyle({styleJson: mapStyle});
    map.enableScrollWheelZoom();
    map.enableDragging();
    map.addEventListener("zoomstart", function () {
        $(".gridInfo").hide();
    });
    map.addEventListener("movestart", function () {
        $(".gridInfo").hide();
    });
    boundarya(regionName);//  添加行政区划
    return map;
}

//  添加行政区划
function boundarya(name) {
    var bdary = new BMap.Boundary();
    bdary.get(name, function (rs) {       //获取行政区域
        var count = rs.boundaries.length; //行政区域的点有多少个
        for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(rs.boundaries[i], {
                strokeWeight: 3,
                strokeColor: '#1E9FFF',
                fillOpacity: .1,
                strokeOpacity: 0.7,
                fillColor: '#1E9FFF'
            }); //建立多边形覆盖物
            map.addOverlay(ply);  //添加覆盖物
            ply.disableMassClear();
        }
        window.bdaryPolygon = rs.boundaries[0].split(';').map(function(x) {return [parseFloat(x.split(',')[0]), parseFloat(x.split(',')[1])]});
    });
}

function mapLayerEvent() {
    //点击空白处隐藏弹出层
    $(document).click(function (event) {
        var _con = $('.operateItem');
        if (!_con.is(event.target) && _con.has(event.target).length === 0) {
            $('.typeList').slideUp();
        }
    });
    $('.dataType').click(function () {
        $('.typeList').slideToggle();
    });

    $('.dataType li').unbind('click').click(function (e) {
        e.stopPropagation();
        $(this).toggleClass('active');
        var dataType = $(this).data('type');
        if(dataType=='realData'){
            if($('.realData').hasClass('active')){
                $(".factors-OverProof").show();
                showOverlays('pollutantEnp');
            }else{
                $(".factors-OverProof").hide();
                hideOverlays('pollutantEnp');
            }
        }else if(dataType=='electricalData'){
            if($('.electricalData').hasClass('active')){
                $(".factors-abnormal").show();
            }else{
                $(".factors-abnormal").hide();
            }
        }else if(dataType=='gridDischargeData'){
            if($('.gridDischargeData').hasClass('active')){
                $(".factors-discharge").show();
                map.addOverlay(myCompOverlay);
                setTimeout(function () {
                    map.panBy(0,0);
                },500)
            }else{
                map.removeOverlay(myCompOverlay);
            }
        }else if(dataType=='windData'){
            $(".factors-discharge").hide();
            if($('.windData').hasClass('active')){
                $("#windChart").css("display","block");
            }else{
                $("#windChart").css("display","none");
            }
        }
    });

    //实时超标数据
    $(".dataItemArea li.exceed").find(".iCheck-helper").click(function () {
        var allOverlay = map.getOverlays();
        if($(this).parent("div").hasClass("checked")){
            $(".icon-overProof").show();
            for (var i = 0; i < allOverlay.length ; i++) {
                if (allOverlay[i].toString() == "[object Label]") {
                    if (allOverlay[i].labelType && allOverlay[i].labelType == 'realExceed') {
                        allOverlay[i].show()
                    }
                }
            }
        }else{
            $(".icon-overProof,.infoBox").hide();
            for (var i = 0; i < allOverlay.length ; i++) {
                if (allOverlay[i].toString() == "[object Label]") {
                    if (allOverlay[i].labelType && allOverlay[i].labelType == 'realExceed') {
                        allOverlay[i].hide()
                    }
                }
            }
        }
    });

    //用電量监管点击事件
    $(".dataItemArea li.electrical input").on('ifChecked',function () {
        $('.icon-electrical-color').show();
        var allOverlay = map.getOverlays();
        for (var i = 0; i < allOverlay.length ; i++) {
            if (allOverlay[i].toString() == "[object Label]") {
                if (allOverlay[i].labelType && allOverlay[i].labelType == 'electrical') {
                    allOverlay[i].show()
                }
            }
        }
    }).on("ifUnchecked", function (e){
        $('.icon-electrical-color').hide();
        var allOverlay = map.getOverlays();
        for (var i = 0; i < allOverlay.length ; i++) {
            if (allOverlay[i].toString() == "[object Label]") {
                if (allOverlay[i].labelType && allOverlay[i].labelType == 'electrical') {
                    allOverlay[i].hide()
                }
            }
        }
    });

    //风力玫瑰图显示隐藏
    $(".dataItemArea li.windDirect").on('ifChecked',function () {
        $("#windChart").css("display","block");
    }).on('ifUnchecked',function () {
        $("#windChart").css("display","none");
    });

    //今日排放量点击事件
    $(".dataItemArea li.discharge").on('ifChecked',function () {
        $(".infoBox").hide();
        map.panBy(0,0);
        $(".icon-colorRange").show();
        $('.leftBtn').show();
        $('.dischargeArea').css("left","0");
        map.addOverlay(myCompOverlay);
    }).on('ifUnchecked',function () {
        $(".icon-colorRange").hide();
        $('.leftBtn').hide();
        $('.dischargeArea').css("left","-300px");
        map.removeOverlay(myCompOverlay);
    });

}

function panelBtn() {
    //右侧边数据点击事件
    $(".rightBtn .layui-icon-left").click(function () {
        $(this).hide().siblings().show();
        $(".rightPanelBox").animate({"right": "0px"});
        $(".rightBtn").animate({"right": "460px"});
    });
    $(".rightBtn .layui-icon-right").click(function () {
        $(this).hide().siblings().show();
        $(".rightPanelBox").animate({"right": "-460px"});
        $(".rightBtn").animate({"right": "0"});
    });

    //左侧边数据点击事件
    $(".leftBtn .layui-icon-left").click(function () {
        $(this).hide().siblings().show();
        $(".leftPanelBox").animate({"left": "-400px"});
        $(".leftBtn").animate({"left": "0px"});
    });
    $(".leftBtn .layui-icon-right").click(function () {
        $(this).hide().siblings().show();
        $(".leftPanelBox").animate({"left": "0px"});
        $(".leftBtn").animate({"left": "400px"});
    });
}

function getWeatherData(startTime,endTime,regionCode) {
    var weather={"晴":"sun","多云":"cloudy","阴":"yin","雨":"smallrain","小雨":"smallrain","雷阵雨":"hail","中雨":"middlerain","大雨":"bigrain","暴雨":"",
            "雪":"smallsnow","小雪":"smallsnow","中雪":"middlesnow","大雪":"bigsnow","暴雪":"hardsnow","阵雪":"snowshower",
            "雾":"fog","雾霾":"raisedust","霾":"raisedust","雨夹雪":"rainsnow","-":"sun","扬沙":"smoke"};
    getDataByAjax('/gis/atmosphere/air/real/time/weather',{regionCode:regionCode,startTime:startTime,endTime:endTime},'GET',true,function (initData) {
        if (initData.code == 200 &&  initData.data && initData.data.length > 0) {
            var data = initData.data[0];
            $(".weatherArea .weatherImg").html('<img src="../../../assets/images/map/weather-'+weather[data.condTxt]+'-white.png">');
            $('.weatherArea .weatherText').html('天气:'+data.condTxt+' 温度:'+data.tmp+'℃ ' +data.windDir +' '+ data.windSc+'级');
        }else{
            $('.weatherArea').html('天气：暂无数据');
        }
    })
}

//添加大气标注
function mapAirLabel(pointType, siteName, siteCode, aqi, Latitude, Longitude, img, factor) {
    var point = new BMap.Point(Longitude, Latitude);
    var size =[38,38], factorNum;
    if (siteTypeData.indexOf(pointType) != -1) {
        var index = siteTypeData.indexOf(pointType);
        if (index < 3) {
            img = imgData[index][parseInt(aqiItemMapLevel('AQI',aqi)) - 1];
        } else {
            img = imgData[index];
            factorNum = " ";
        }
    } else {
        img = "icon-" + pointType + "-lost.png";
        factorNum = pointType == "nationalAirSite" || pointType == "provinceAirSite" || pointType == "countyAirSite" ? "-" : "";
    }
    var myLabel = new BMap.Label("<div id='windChart' style='width:260px;height: 260px;position: absolute;top:-220px" +
        ";left:-106px;z-index: 99 ;display:"+isShow()+"'></div>" +
        "<span id='" + siteCode + "' class='" + pointType + " labelData" + "' style='color:#fff;display:" +
        " inline-block;margin-left: -3px;'></span>" +
        "<div class='siteLabelTitle' style='display: block;top: 50px;margin-left:-12px'>" + siteName + "</div>" ,    //为lable填写内容
        {
            offset: new BMap.Size(-size[0] / 2, -size[1]),
            position: point
        });
    myLabel.setStyle({
        color : "#ccc",
        fontSize : "12px",
        height: size[1] + "px",         //高度
        lineHeight : size[1] -8 + "px",
        fontFamily:"微软雅黑",
        border:'none',
        backgroundColor:'none',
        textAlign: "center",            //文字水平居中显示
        padding:'2px 4px',
        maxWidth: size[0] + "px",
        width: size[0] + "px",  //宽
        display: "inline-block",
        background: "url(" + imgRootPath + img + ") no-repeat",    //背景图片
        cursor: "pointer"
    });
    var centerPoint = new BMap.Point(Longitude, Latitude);  // 创建点坐标
    // map.panTo(centerPoint);
    map.centerAndZoom(centerPoint, mapLevel);
    map.addOverlay(myLabel);
    setTimeout(function () {
       getWindRoseChart(siteCode);
    },500);
}

// 风力玫瑰图显示隐藏事件
function isShow(){
    if($(".windData").hasClass('active')){
        return "block";
    }else{
        return "none";
    }
}

//风速风力玫瑰图
function getWindRoseChart(siteCode) {
    getDataByAjax('/gis/atmosphere/rose/wind',{psCode:siteCode},'GET',true,function (initData) {
        if (initData.code == 200 &&  initData.data ) {
            var seriesData=[];
            var dataList=initData.data.dataList;
            $.each(dataList,function (index,value) {
                seriesData.push({
                    type: 'bar',
                    data: value.data,
                    coordinateSystem: 'polar',
                    name: value.name,
                    stack: 'a'
                })
            });
            var roseChart = echarts.init(document.getElementById('windChart'));
            var option = {
                legend: {
                    show: false
                },
                tooltip: {
                    formatter: "{b}:{a}({c}m/s)"
                },
                color: ["#61d800", "#ccb21a", "#f5a623", "#f12f1c", "#9c0d71", "#630445"],
                angleAxis: {
                    show: true,//是否显示极坐标轴
                    type: 'category',
                    data: initData.data.wDList,
                    z: 0,
                    boundaryGap: false,
                    scale: false,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#999',
                            type: 'solid'
                        }
                    },
                    splitArea: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#aeeeee'
                        }
                    }
                },
                radiusAxis: {
                    show: true, //是否显示坐标轴
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#aeeeee'
                        }
                    },
                    splitLine: {
                        show: true,
                        interval: "auto",
                        lineStyle: {
                            color: '#999'
                        }

                    }
                },
                polar: {
                    show: true,//是否显示
                    center: ['50%', '50%'],
                    radius: '50%'
                },
                series: seriesData
            };
            roseChart.setOption(option);
        }
    });
}

//大气污染因子类别（1小时平均）
function aqiItemMapLevel(code,data) {
    var level="";
    var levelArr = [];
    if (code == "PM10" || code == "pm10") {
        levelArr = [50, 150, 250, 350, 500]
    } else if (code == "PM2.5" || code == "PM25" || code=="pm25") {
        levelArr = [35, 75, 115, 150, 250]
    } else if (code == "SO2" || code == "so2") {
        levelArr = [150, 500, 650, 800, 1600]
    } else if (code == "NO2" || code == "no2") {
        levelArr = [100, 200, 700, 1200, 2340]
    } else if (code == "CO" || code=="co") {
        levelArr = [5, 10, 35, 60, 90]
    } else if (code == "O3" || code == "o3") {
        levelArr = [160, 200, 300, 400, 800, 1200]
    } else if (code == "AQI" || code=="aqi") {
        levelArr = [50, 100, 150, 200, 300]
    }else if( code == "O3H8" || code=="o3h8"){
        levelArr = [100, 160, 215, 265, 800, 1200]
    }
    if(data){
        level = data <= levelArr[0] ? "1"
            : data > levelArr[0] && data <= levelArr[1] ? "2"
                : data > levelArr[1] && data <= levelArr[2] ? "3"
                    : data > levelArr[2] && data <= levelArr[3] ? "4"
                        : data > levelArr[3] && data <= levelArr[4] ? "5"
                            : data > levelArr[4] ? "6" : "7";
    }else{
        level='7'
    }
    return level;
}

//添加地图圆形区域
function mapCircle(Longitude, Latitude, distance) {
    var mPoint = new BMap.Point(Longitude, Latitude);
    var radius = ((distance == "") ? initDistance : distance) * 1000;
    var circle = new BMap.Circle(mPoint, radius, {
        fillColor: "#256076",
        strokeColor: "red",
        strokeWeight: 4,
        fillOpacity: 0.3,
        strokeOpacity: 0.6
    });
    map.addOverlay(circle);
    //获取圆形地理区域范围
    var bs = circle.getBounds();  //获取当前地图范围的经纬度
    var bssw = bs.getSouthWest();		//获取西南角的经纬度(左下端点)
    var bsne = bs.getNorthEast();		//获取东北角的经纬度(右上端点)
    var circleBounds = {'x1': bssw.lng, 'y1': bssw.lat, 'x2': bsne.lng, 'y2': bsne.lat};
    var point = new BMap.Point((bssw.lng + bsne.lng) / 2, bssw.lat);// 当前点位正下方点
    height = map.pointToPixel(point).y - map.pointToPixel(mPoint).y; //计算圆形半径的像素高度
    if (myCompOverlay && $(".gridDischargeData").hasClass("active")) {
        height = map.pointToPixel(point).y - map.pointToPixel(mPoint).y;
        map.removeOverlay(myCompOverlay);
        myCompOverlay = new ComplexCustomOverlay(point);
        map.addOverlay(myCompOverlay);//将标注添加到地图中
    }
    // 监听地图的缩放完成事件
    map.addEventListener('zoomend', function () {
        if (myCompOverlay && $(".gridDischargeData").hasClass("active")) {
            height = map.pointToPixel(point).y - map.pointToPixel(mPoint).y;
            map.removeOverlay(myCompOverlay);
            myCompOverlay = new ComplexCustomOverlay(point);
            map.addOverlay(myCompOverlay);//将标注添加到地图中
        }
    });
    map.addEventListener("moveend", function () {
        if (myCompOverlay && $(".gridDischargeData").hasClass("active")) {
            height = map.pointToPixel(point).y - map.pointToPixel(mPoint).y;
            map.removeOverlay(myCompOverlay);
            myCompOverlay = new ComplexCustomOverlay(point);
            map.addOverlay(myCompOverlay);//将标注添加到地图中
        }
    });

    setTimeout(function () {
        map.panBy(0,0);
    },500)
}

function getCountDischarge(Longitude, Latitude, startTime, endTime,initDistance) {
    $("#dischargeTable tbody").empty();
    getDataByAjax('/gis/atmosphere/grid/pollute/accumulate',{distance:initDistance,lat:Latitude,lng:Longitude,startTime:startTime,endTime:endTime},'GET',true,function (initData) {
        if (initData.code == 200 &&  initData.data && initData.data.length > 0) {
            var rowsData=initData.data;
            dischargeData = rowsData;
            var grid = $('#distance').val() * 2; // 网格一行数量
            var count = height * 2 / grid; //  网格宽度
            //绘制网格
            drawGrid(canvas, ctx, count, grid, 1, dischargeData);
            var number = 1;
            var pageNum = Math.ceil(rowsData.length / 6);
            var dataType='dischargeTable';
            loadData(1, rowsData, dataType);
            $('.data-list-footer').unbind("click");//移除点击事件
            if (rowsData.length > 6) {
                $(".dischargeTable-list-footer").html("加载更多");
                $(".dischargeTable-list-footer").click(function () {
                    number++;
                    if (number < pageNum) {
                        loadData(number, rowsData, dataType);
                    } else if (number == pageNum) {
                        loadData(number, rowsData, dataType);
                        $(".dischargeTable-list-footer").html("暂无更多数据");
                    } else {
                        $(".dischargeTable-list-footer").html("暂无更多数据");
                    }
                });
            } else {
                $(".dischargeTable-list-footer").html("暂无更多数据");
            }
        } else {
            $("#dischargeTable tbody").append("<tr><td colspan='7'>暂无数据</td></tr>");
        }
    });
}

function  getDischargeRank(Longitude, Latitude, startTime, endTime, initDistance) {
    $("#countRankTable tbody").empty();
    getDataByAjax('/gis/atmosphere/grid/pollute',{distance:initDistance,lat:Latitude,lng:Longitude,startTime:startTime,endTime:endTime},'GET',true,function (initData) {
        if (initData.code == 200 &&  initData.data && initData.data.length > 0) {
            var rowsData=initData.data;
            var number = 1;
            var pageNum = Math.ceil(rowsData.length / 6);
            var dataType='countRankTable';
            loadData(1, rowsData, dataType);
            $('.data-list-footer').unbind("click");//移除点击事件
            if (rowsData.length > 6) {
                $(".rankTable-list-footer").html("加载更多");
                $(".rankTable-list-footer").click(function () {
                    number++;
                    if (number < pageNum) {
                        loadData(number, rowsData, dataType);
                    } else if (number == pageNum) {
                        loadData(number, rowsData, dataType);
                        $(".rankTable-list-footer").html("暂无更多数据");
                    } else {
                        $(".rankTable-list-footer").html("暂无更多数据");
                    }
                });
            } else {
                $(".rankTable-list-footer").html("暂无更多数据");
            }
        } else {
            $("#countRankTable tbody").append("<tr><td colspan='6'>暂无数据</td></tr>");
        }
    });
}

//加载条数限制
function loadData(number, data, dataType) {
    var tr = "";
    if (dataType == "dischargeTable") {
        $.each(data, function (i, value) {
            for(var key in value){
                if(value[key]!=0 && !value[key]){
                    value[key]='';
                }
            }
            if (i >= 6 * (number - 1) && i < 6 * number) {
                tr += "<tr><td style='width: 7%'>"+(i+1)+"</td><td style='width: 14%'>("+value.ZX+","+value.ZY+")</td>" +
                    "<td style='width: 26%' class='text-left overHiddenText' title="+value.PSNameS+">" + value.PSNameS + "</td><td style='width: 14%'>" +value.GasPFL + "</td>" +
                    "<td style='width: 8%'>" + value.ItemPFL001 + "</td><td style='width: 14%'>" + value.ItemPFL002 + "</td>" +
                    "<td style='width: 14%'>" + value.ItemPFL003 + "</td></tr>";
            }
        });

    } else if(dataType=='countRankTable') {
        $.each(data, function (i, value) {
            for(var key in value){
                if(value[key]!=0 && !value[key]){
                    value[key]='';
                }
            }
            if (i >= 6 * (number - 1) && i < 6 * number) {
                tr += "<tr><td style='width: 7%'>"+(i+1)+"</td><td style='width: 33%' class='text-left overHiddenText' title="+value.Psname+">"+value.Psname+"</td>" +
                    "<td style='width: 15%'>" + value.GasPFL + "</td>" +
                    "<td style='width: 15%'>" + value.ItemPFL001 + "</td>" +
                    "<td style='width: 15%'>" + value.ItemPFL002 + "</td>" +
                    "<td style='width: 15%'>" + value.ItemPFL003 + "</td></tr>";
            }
        })
    }else if(dataType=='exceedDataTable'){
        $.each(data, function (i, value) {
            for(var key in value){
                if(value[key]!=0 && !value[key]){
                    value[key]='';
                }
            }
            if (i >= 6 * (number - 1) && i < 6 * number) {
                tr += "<tr><td style='width: 8%'>"+(i+1)+"</td><td style='width: 14%' class='text-left overHiddenText' title="+value.Psname+">"+value.PSName+"</td>" +
                    "<td style='width: 12%'>" + value.OutputName + "</td>" +
                    "<td style='width: 14%'>" + value.PollutantName + "</td>" +
                    "<td style='width: 14%'>" + value.monitorTime + "</td>" +
                    "<td style='width: 12%'>" + value.jcValue + "</td>" +
                    "<td style='width: 12%'>" + value.standValue + "</td>" +
                    "<td style='width: 14%'>" + value.overMultiple + "</td>" +
                    "</tr>";
            }
        })
    }
    $("#"+dataType).find('tbody').append(tr);
}

//污染源企业
function mapEnpLabel(Latitude, Longitude, startTime, endTime, distance) {
    var obj = {};
    obj.startTime = startTime;
    obj.endTime = endTime;
    obj.pollutanttype = 2;
    obj.lng = Longitude;
    obj.lat = Latitude;
    obj.distance = (distance == "") ? initDistance : distance;
    getDataByAjax('/gis/atmosphere/limit/enterprise',obj,'GET',true,function (initData) {
        if (initData.code == 200 && initData.data && initData.data.length>0) {
            $.each(initData.data, function (index, data) {
                mapPollutionLabel(data);
            });
        }
    });
}

//添加污染源标注
function mapPollutionLabel(data) {
    var size=[38,38];
    var tmpPt = new BMap.Point(data.Longitude, data.Latitude);
    var iconName = data.IsOverProof==0?'marker_gas_green.png':'marker_gas_red.png';
    var tmpMarkIcon = new BMap.Icon(imgRootPath + iconName  , new BMap.Size(size[0], size[1]));
    var tmpMarker = new BMap.Marker(tmpPt, {
        "title": data.PSName,
        "icon": tmpMarkIcon
    });
    tmpMarker.siteType = 'pollutantEnp';
    var label = new BMap.Label("<div class='siteLabelTitle' id="+data.PSCode+">"+data.PSName+"</div>",{offset:new BMap.Size(-((data.PSName).length*13/2)+15,size[1]+3)});
    label.setStyle({
        color : "#ccc",
        fontSize : "12px",
        height : "20px",
        lineHeight : "20px",
        fontFamily:"微软雅黑",
        border:'none',
        backgroundColor:'none',
        padding:'2px 4px'
    });
    tmpMarker.setLabel(label);
    tmpMarker.enableMassClear();//允许清除覆盖物
    //将点位存储至map集合工具类中
    window.curEntAndMatlsDic.put(data.PSCode, {
        "data": data,
        "marker": tmpMarker,
        "click": function () {
            window.map.panTo(tmpPt);
            var info = '<div class="popup"><div class="popup-content-wrapper"><div class="popup-content">' +
                '<div class="map-air-quality-popup map-popup-model">' +
                '<div class="header modelTitle"><h4 class="text-center">点位详情</h></div>' +
                '<div class="popup-info"><div class="siteDataArea"><ul>' +
                '<li><span class="li-style">企业名称：</span><span>'+data.PSName+'</span></li>' +
                '<li><span class="li-style">所属环保机构：</span><span>'+data.RegionName+'</span></li>' +
                '<li><span class="li-style">所属地区：</span><span>'+data.RegionName+'</span></li>' +
                '<li><span class="li-style">所属行业：</span><span>'+data.IndustryTypeName+'</span></li>' +
                '<li><span class="li-style">国控类别：</span><span>'+data.StateControlledTypeName+'</span></li>' +
                '<li><span class="li-style">监测类型：</span><span>'+data.PSMonitorCategoryTypeName+'</span></li>' +
                '<li><span class="li-style">关注程度：</span><span>'+data.AttName+'</span></li>' +
                '<li><span class="li-style">单位地址：</span><span>'+data.PSAddress+'</span></li>' +
                '</ul></div>' +
                '<div class="site-data-detailbtn"> <ul class="list-inline">' +
                // '<li class="active icon-blue" data-code='+data.PSCode+' data-type="site-chart" data-chart="exceedData" style="'+(data.IsOverProof==0?"display:none":"")+'">超标信息</li>' +
                '<li class="site-trend active icon-blue"  data-code='+data.RegionCode+' data-type="site-chart" data-chart="chartData">排放量趋势</li>' +
                '<li class="site-exceed icon-blue" data-code='+data.PSCode+' data-type="site-chart" data-chart="exceedData" >超标信息</li>' +
                '<li class="site-link icon-blue"  data-code='+data.PSCode+' data-type="site-chart" data-chart="realData">最新数据</li>' +
                '</ul><div class="layui-icon layui-icon-up" onclick=isOpenTablePanel(this)></div> </div>' +
                '<div class="chartArea">' +
                '<div class="chartData"><div id="dischargeChart"></div></div>' +
                '<div class="exceedData" style="display: none"><table id="exceedDataTable"></table></div>' +
                '<div class="realData" style="display: none"><table id="realDataTable"></table></div>' +
                '</div>'+
                '</div></div></div></div>' +
                '<div class="popup-tip-container"><div class="popup-tip"></div></div>' +
                '</div>';
            var infoBox = new BMapLib.InfoBox(window.map,info, {
                boxStyle: {
                    width: "550px",
                    Height: "340px",
                    marginLeft:"8px",
                    backgroundColor: "white"
                },
                offset:new BMap.Size(-size[0]/2, size[1]),
                closeIconMargin: "12px 8px 4px 4px",
                closeIconUrl: imgRootPath +"back.png",
                enableAutoPan: false,
                align: INFOBOX_AT_TOP
            });
            window.infoBoxList.push(infoBox);
            infoBoxList.forEach(function(infobox){infobox.close();});
            //点位跳动
            tmpMarker.setAnimation(BMAP_ANIMATION_BOUNCE);

            //infoBox关闭时执行的操作
            infoBox.addEventListener("close", function (e) {
                //取消marker的跳动效果
                tmpMarker.setAnimation(null);
            });
            infoBox.open(tmpMarker);   //图片加载完毕重绘infowindow
            getPollutantChartData('exceedData',$('.site-data-detailbtn li:first-child').data('code'));//获取废气超标数据
            getPollutantChartData('realData',$('.site-data-detailbtn li:last-child').data('code'));//获取废气最新数据
            getPollutantChartData('chartData',$('.site-data-detailbtn [data-chart="chartData"]').data('code'));//获取排放量趋势
            if(data.IsOverProof==0){  }else{}
            $('.site-data-detailbtn li').click(function () {
                $(this).addClass('active').siblings().removeClass('active');
                var type = $(this).data('chart');
                $('.'+type).show().siblings().hide();
            });
        }
    });

    //定义点位点击触发事件
    tmpMarker.addEventListener("click", function () {
        window.curEntAndMatlsDic.get(data.PSCode).click();
    });
    //将点位添加至地图
    map.addOverlay(tmpMarker);
}

//数据折叠效果
function isOpenTablePanel(ele) {
    if($(ele).hasClass('layui-icon-down')){
        $('.chartArea').slideDown();
        $(ele).removeClass('layui-icon-down').addClass('layui-icon-up');
    }else{
        $('.chartArea').slideUp();
        $(ele).removeClass('layui-icon-up').addClass('layui-icon-down');
    }

}

function getPollutantChartData(type,pscode) {
    var dataHtml = '', startTime='',endTime='';
    if(type=='realData'){
        dataHtml = '<thead>' +
            '<th style="width: 14%;" rowspan="2">监控点名称</th>' +
            '<th style="width: 16%;" rowspan="2">监测时间</th>' +
            '<th colspan="2">烟尘(mg/m³)</th>' +
            '<th colspan="2">二氧化硫(mg/m³)</th>' +
            '<th colspan="2">氮氧化物(mg/m³)</th>' +
            '</tr>' +
            '<tr><th style="width: 10%">监测值</th><th style="width: 10%">标准值</th>' +
            '<th style="width: 10%">监测值</th><th style="width:10%">标准值</th>' +
            '<th style="width: 10%">监测值</th><th style="width: 10%">标准值</th></tr>' +
            '</tr></thead><tbody>';
        getDataByAjax('/gis/atmosphere/enterprise/realtime',{pscode:pscode},'GET',true,function (initData) {
            if(initData.code==200 && initData.data && initData.data.length>0){
                $.each(initData.data, function (i, itemData) {
                    for(var key in itemData){
                        if(!itemData[key]){
                            itemData[key] = '';
                        }
                    }
                    dataHtml += '<tr>' +
                        '<td title=' + itemData.OutputName + '>' + itemData.OutputName + '</td>' +
                        '<td title=' + itemData.MonitorTime + '>' + itemData.MonitorTime + '</td>' +
                        '<td >' + itemData.Item001YS + '</td>' +
                        '<td >' + itemData.Item001StandardValue + '</td>' +
                        '<td >' + itemData.Item002YS + '</td>' +
                        '<td >' + itemData.Item002StandardValue + '</td>' +
                        '<td >' + itemData.Item003YS + '</td>' +
                        '<td >' + itemData.Item003StandardValue + '</td>' +
                        '</tr>';
                });
            }else{
                dataHtml += "<tr><td colspan='6' style='text-align: center'>暂无数据</td></tr>";
            }
            dataHtml += '</tbody>';
            $('#realDataTable').empty().append(dataHtml);
        });
    }else if(type=='exceedData'){
        endTime = $.format.date(new Date(),'yyyy-MM-dd HH:mm:ss');
        startTime = $.format.date(new Date(new Date(new Date().getTime() - 1000*60*60)),'yyyy-MM-dd HH:mm:ss');
        dataHtml = '<thead>' +
            '<tr><th style="width: 16%;">监测点名称</th><th style="width: 16%;">超标因子</th><th style="width: 16%;">监测时间</th>' +
            '<th style="width: 16%;">浓度范围</th><th style="width: 16%;">倍数范围</th><th style="width: 16%;">天数/小时数</th>' +
            '</tr></thead><tbody>';
        getDataByAjax('/gis/atmosphere/pollution/source/timeout',{pscode:pscode,startTime:startTime,endTime:endTime},'GET',true,function (initData) {
            if(initData.code==200 && initData.data && initData.data.length>0){
                $.each(initData.data, function (i, itemData) {
                    for(var key in itemData){
                        if(!itemData[key]){
                            itemData[key] = '';
                        }
                    }
                    dataHtml += '<tr>' +
                        '<td>' + itemData.OutputName + '</td>' +
                        '<td>' + itemData.PollutantName + '</td>' +
                        '<td>' + itemData.monitorTime + '</td>' +
                        '<td>' + itemData.StrengthRange + '</td>' +
                        '<td>' + itemData.BSRange + '</td>' +
                        '<td>' + itemData.nums + '</td>' +
                        '</tr>';
                });
            }else{
                dataHtml += "<tr><td colspan='6' style='text-align: center'>暂无数据</td></tr>";
            }
            dataHtml += '</tbody>';
            $('#exceedDataTable').empty().append(dataHtml);
        });

    }else if(type=='chartData'){
        startTime = $.format.date(new Date(new Date(new Date().getTime() - 1000*60*60*24*6)),'yyyy-MM-dd HH:mm:ss');
        endTime = $.format.date(new Date(),'yyyy-MM-dd HH:mm:ss');
        $.get('/gis/city/yj/day/list?startTime='+startTime+'&endTime='+endTime+'&regionCode='+pscode,function (initData) {
            if(initData.code == 200 && initData.data && initData.data.length>0){
                var goalPFL=[],PFL =[],warnPLF=[],timeData=[];
                $.each(initData.data,function (index,value) {
                    timeData.push((value.timeStamp)?value.timeStamp.substr(5,5):'');
                    goalPFL.push(value.target);
                    PFL.push(value.pflLc);
                    warnPLF.push(value.pflC);
                });
                $('#dischargeChart').css({'width':'500px','height':'150px'});
                var chart = echarts.init(document.getElementById("dischargeChart"));
                var option = {
                    color: ['#7dc3fe', '#3685fe', '#929fff'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    grid:{
                        y:'20%',
                        y2:'15%'
                    },
                    legend: {
                        data: ['目标排放量','排放量','预警前排放量']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: timeData,
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name:'(t)',
                            nameGap:3,
                            axisLabel: {
                                formatter: '{value}'
                            }
                        }
                    ],
                    series: [
                        {
                            name: '目标排放量',
                            type: 'bar',
                            data: goalPFL
                        },
                        {
                            name: '排放量',
                            type: 'bar',
                            data: PFL
                        },{
                            name: '预警前排放量',
                            type: 'bar',
                            data: warnPLF
                        }

                    ]
                };
                chart.setOption(option);
            }else{
                $('#dischargeChart').html('暂无数据').css('text-align','center')
            }
        })
    }
}

function getAirRealData(siteCode,startTime,endTime) {
    getDataByAjax('/gis/atmosphere/site/air/quality/record',{siteCode:siteCode,startTime:startTime,endTime:endTime},'GET',true,function (initData) {
        if (initData.code == 200 &&  initData.data && initData.data.length > 0) {
           var lastHourData = initData.data[0];
           var countData = initData.data[1];
           for(var key in lastHourData){
               $('#airTable tbody tr:first-child [data-item='+key+']').html((lastHourData[key])?lastHourData[key]:'');
           }
            for(var value in countData){
                $('#airTable tbody tr:last-child [data-item='+value+']').html((countData[value])?countData[value]:'');
            }
        } else {
            $("#airTable tbody").empty().append("<tr><td colspan='10'>暂无数据</td></tr>");
        }
    });
    getAirMinuteChart(siteCode,startTime,endTime);//获取空气质量趋势
}

function getAirMinuteChart(siteCode,startTime,endTime) {
    getDataByAjax('/gis/atmosphere/site/air/quality/trend',{siteCode:siteCode,startTime:startTime,endTime:endTime},'GET',true,function (initData) {
        if (initData.code == 200 &&  initData.data && initData.data.length > 0) {
            $("#airMinuteChart").removeAttr("_echarts_instance_").css({'height':'180px','width':'100%'});
            var siteDataChart = echarts.init(document.getElementById('airMinuteChart'));
            var dataArr = [[],[],[],[],[],[],[]],
                nameList = ['AQI','PM25','PM10','SO2','NO2','CO','O3'],
                timeList = [],seriesData=[],
                color=["#49D3C7","#81C8AC","#83B9D7","#1A7853","#51635C","#23A974","#49D374"];
            $.each(initData.data,function (index,data) {
                timeList.push($.format.date(data.MonitorTime,'HH:mm'));
                $.each(dataArr,function (x,y) {
                    y.push(data[nameList[x]])
                });
            });
            $.each(nameList,function (index,value) {
                seriesData.push(
                    {
                        name: nameList[index],
                        type: 'bar',
                        smooth: true,
                        symbolSize: 6,
                        barWidth: "8",
                        data: barColor(dataArr[index], nameList[index]),
                        itemStyle: {
                            normal: {
                                color: color[index]
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: "top"
                            }
                        }
                    }
                );
            });
            var siteDataOption = {
                tooltip: {
                    trigger: 'axis'
                },
                grid:{
                    bottom:'10%'
                },
                legend: {
                    data: nameList,
                    textStyle: {
                        color: "#838385"
                    },
                    selectedMode: "single"
                },
                xAxis: {
                    type: 'category',
                    nameGap: "20",
                    nameLocation: "start",
                    splitLine: {
                        show: true
                    },
                    data: timeList,
                    axisLine: {
                        lineStyle: {
                            color: "#919191"
                        }
                    },
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#79797B"
                        }
                    },
                    boundaryGap: true
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        show: true
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#919191"
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#79797B"
                        }
                    }
                },
                series:seriesData
            };
            siteDataChart.setOption(siteDataOption);
        }else{
            $('#airMinuteChart').css('text-align','center').html('暂无数据');
        }
    })
}

//根据数据显示柱状图
function barColor(datas, type) {
    var barData = [];
    $.each(datas, function (i, data) {
        var dataColor = aqiColor(data, type);
        var rankingData = {
            value: data,
            itemStyle: {
                normal: {
                    color: dataColor
                }
            }
        };
        barData.push(rankingData)
    });
    return barData;
}

//污染等级颜色
function aqiColor(data, type) {
    var color = "#9B9B9B";
    var levelArr = [];
    if (type == "pm10" || type == "PM10") {
        levelArr = [50, 150, 250, 350, 500]
    } else if (type == "pm25" || type == "PM2.5" || type=='PM25') {
        levelArr = [35, 75, 115, 150, 250]
    } else if (type == "so2" || type == "SO2") {
        levelArr = [150, 500, 650, 800, 1600]
    } else if (type == "no2" || type == "NO2") {
        levelArr = [100, 200, 700, 1200, 2340]
    } else if (type == "co" || type == "CO") {
        levelArr = [5, 10, 35, 60, 90]
    } else if (type == "o3" || type == "O3") {
        levelArr = [160, 200, 300, 400, 800, 1200]
    } else if (type == "aqi" || type == "AQI") {
        levelArr = [50, 100, 150, 200, 300]
    }
    color = data <= levelArr[0] ? "#61D800"
        : data > levelArr[0] && data <= levelArr[1] ? "#CCB21A"
            : data > levelArr[1] && data <= levelArr[2] ? "#F5A623"
                : data > levelArr[2] && data <= levelArr[3] ? "#F12F1C"
                    : data > levelArr[3] && data <= levelArr[4] ? "#9C0D71"
                        : data > levelArr[4] ? "#630445" : "#9B9B9B";
    return color;
}

function getExceedData(Longitude, Latitude,siteCode,startTime,endTime,distance) {
    $("#exceedDataTable tbody").empty();
    getDataByAjax('/gis/atmosphere/pollution/source/timeout/ps',{
        distance:distance,psCode:'',startTime:startTime,endTime:endTime,lat:Latitude,lng:Longitude
        // distance:distance,psCode:'410100001860',startTime:'2020-06-17 22:00',endTime:'2020-06-19 23:00',lat:'115.042061',lng:'35.715451'
    },'GET',true,function (initData) {
        if (initData.code == 200 &&  initData.data && initData.data.length > 0) {
            var rowsData=initData.data;
            var number = 1;
            var pageNum = Math.ceil(rowsData.length / 6);
            var dataType='exceedDataTable';
            loadData(1, rowsData, dataType);
            $('.data-list-footer').unbind("click");//移除点击事件
            if (rowsData.length > 6) {
                $(".exceedTable-list-footer").html("加载更多");
                $(".exceedTable-list-footer").click(function () {
                    number++;
                    if (number < pageNum) {
                        loadData(number, rowsData, dataType);
                    } else if (number == pageNum) {
                        loadData(number, rowsData, dataType);
                        $(".exceedTable-list-footer").html("暂无更多数据");
                    } else {
                        $(".exceedTable-list-footer").html("暂无更多数据");
                    }
                });
            } else {
                $(".exceedTable-list-footer").html("暂无更多数据");
            }
        } else {
            $("#exceedDataTable tbody").append("<tr><td colspan='8'>暂无数据</td></tr>");
        }
    })
};

//清除地图历史记录
function clearHistory() {
    if(window.removeOverlays){
        window.removeOverlays = [];
    }
    //定义存储所有点位
    if (window.curEntAndMatlsDic) {
        window.curEntAndMatlsDic.clear();
    } else {
        window.curEntAndMatlsDic = new MapUtil();
    }
}


function addCustomOverlay() {
    myCompOverlay = new ComplexCustomOverlay(point);
    map.addOverlay(myCompOverlay);// 将标注添加到地图中
}

// 扩展画笔画扇形的方法
CanvasRenderingContext2D.prototype.sector = function (x, y, n) {
    this.save();
    this.beginPath();
    this.moveTo(x, y);
    this.closePath();
    this.stroke();
    this.restore();
    return this;
};

function ComplexCustomOverlay(point) {
    this._point = point;
}

// 继承百度地图API的BMap.Overlay
ComplexCustomOverlay.prototype = new BMap.Overlay();

// 初始化自定义覆盖物
ComplexCustomOverlay.prototype.initialize = function (map) {
    // 保存map对象实例
    this._map = map;
    var div = document.createElement('div');
    window.canvas = this.canvas = document.createElement('canvas'); // 创建元素，作为自定义覆盖物的容器
    window.ctx = this.canvas.getContext('2d');
    var canvasHeight = Math.ceil(height / 100) * 100;
    canvas.height = height * 2;
    canvas.width = height * 2;
    canvas.style.cssText = 'position:absolute;left:0;top:0;z-index:-9999999;';
    ctx.translate(0, height * 2);
    ctx.scale(1, -1);
    div.appendChild(canvas);
    map.getPanes().labelPane.appendChild(div);//getPanes(),返回值:MapPane,返回地图覆盖物容器列表

    // getCountDischarge(); //污染源排放量
    var grid = $('#distance').val() * 2; // 网格一行数量
    var count = height * 2 / grid; //  网格宽度
    //绘制网格
    drawGrid(canvas, ctx, count, grid, 1, dischargeData);
    return div;
};

// 绘制覆盖物
ComplexCustomOverlay.prototype.draw = function () {
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this.canvas.style.left = pixel.x - parseInt(height) + "px";
    this.canvas.style.top = pixel.y - parseInt(height * 2) + "px";
};

// 自定义覆盖物添加事件方法
ComplexCustomOverlay.prototype.addEventListener = function (event, fun) {
    this.canvas['on' + event] = fun;
};

/*
 * 绘制网格
 * @param ctx Context2D对象
 * @param count 网格宽度
 * @param grid 网格一行数量
 * @param lineWidth 网格线宽度
 * @param allData 网格报警数据与报警数据
 */
function drawGrid(canvas, ctx, count, grid, lineWidth, dischargeData) {
    var gridData = dischargeData;
    if (ctx) {
        ctx.clearRect(0, 0, ctx.width * 2, ctx.height * 2);
        //  获取对应的CanvasRenderingContext2D对象(画笔)
        ctx.lineWidth = lineWidth;
        var spaceWidth = lineWidth / 2;
        for (var k = 0; k < grid; k++) {
            for (var j = 0; j < grid; j++) {
                ctx.strokeStyle = '#79a9f1';
                ctx.globalAlpha = 0.5;
                ctx.strokeRect(j * count + spaceWidth, k * count + spaceWidth, count, count);
                drawBorder(ctx, k, j, grid, count, spaceWidth);
            }
        }
        if (gridData.length > 0) {
            $.each(gridData, function (index, val) {
                var color = pointColor(val.MaxGasPFL, val.GasPFL);
                ctx.strokeStyle = color;
                // ctx.strokeRect((val.ZX - 1) * count + spaceWidth, (val.ZY - 1) * count + spaceWidth, count, count);
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.5;
                ctx.fillRect((val.ZX - 1) * count + spaceWidth, (val.ZY - 1) * count + spaceWidth, count, count);
                canvas.onmousedown = function (event) {
                    // var xMouse = Math.ceil((event.clientX - ctx.canvas.offsetLeft) / count);
                    // var yMouse = grid - Math.ceil((event.clientY - ctx.canvas.offsetTop) / count);
                    var point = windowToCanvas(canvas,event.clientX, event.clientY);
                    var xMouse = Math.ceil(point.x / count);
                    var yMouse = grid - Math.ceil(point.y / count);
                    // console.log("鼠标坐标",xMouse,yMouse);
                    $.each(gridData, function (index, val) {
                        // console.log("数据坐标",val.ZX,val.ZY);
                        if (val.ZX == xMouse && (val.ZY-1) == yMouse) {
                            // gridInfo.style.left = event.clientX + "px";
                            // gridInfo.style.top = event.clientY + "px";
                            $("#gridInfo").css({"display": "block","left":event.clientX + "px","top":event.clientY+"px"}).html("<p><span class='gridTitle'>企 业 名 称：</span>" + val.PSNameS + "</p><p><span class='gridTitle'>坐&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;标：</span>" + val.ZX + "," + val.ZY + "</p><p><span class='gridTitle'>企业排放量：</span>" + val.GasPFL + "</p>");
                        }
                    });
                };
            });
        }
    }
}

/**
 * 绘制描边边框
 */
function drawBorder(ctx, k, j, grid, count, spaceWidth) {
    if (k === ( grid - 1 ) || j === ( grid - 1 )) {
        if (k === ( grid - 1 ) && j === ( grid - 1 )) {
            ctx.beginPath();
            ctx.moveTo(j * count - spaceWidth, ( k + 1 ) * count - spaceWidth);
            ctx.lineTo(( j + 1 ) * count - spaceWidth, ( k + 1 ) * count - spaceWidth);
            ctx.lineTo(( j + 1 ) * count - spaceWidth, k * count - spaceWidth);
            ctx.stroke();
        } else if (k === ( grid - 1 )) {
            ctx.beginPath();
            ctx.moveTo(j * count - spaceWidth, ( k + 1 ) * count - spaceWidth);
            ctx.lineTo(( j + 1 ) * count - spaceWidth, ( k + 1 ) * count - spaceWidth);
            ctx.stroke();
        } else if (j === ( grid - 1 )) {
            ctx.beginPath();
            ctx.moveTo(( j + 1 ) * count - spaceWidth, ( k + 1 ) * count - spaceWidth);
            ctx.lineTo(( j + 1 ) * count - spaceWidth, k * count - spaceWidth);
            ctx.stroke();
        }
    }
}

// 根据值判断颜色
function pointColor(maxVal, val) {
    var colorRange = maxVal - val;
    var maxValColor = "rgb(255,0,0)";
    if (val == 0) {
        return "#ccc"
    } else {
        return 'rgba(' + (255 - Math.ceil(colorRange)) + ',' + Math.floor(20*colorRange) + ',' + Math.floor(20*colorRange) + ',1)';
    }
}

/**
 * 返回鼠标相对于canvas左上角的坐标
 * @param {Number} x 鼠标的屏幕坐标x
 * @param {Number} y 鼠标的屏幕坐标y
 */
function windowToCanvas(canvas, x, y) {
    var bbox = canvas.getBoundingClientRect(); // bbox中存储的是canvas相对于屏幕的坐标
    return {
        x: x - bbox.left,
        y: y - bbox.top
    }
}

function getDataByAjax(url,paras,requsttype,isAsync,callback) {
    var result = "";
    $.ajax({
        url: url,
        type: requsttype,
        timeout: 0,
        async: isAsync,
        data: paras,
        beforeSend:function(){
            layer.load(2);
        },
        success: function (initData) {
            if(initData.code == 200 && initData.data){
                if (callback) {
                    callback(initData);
                }
                result = initData;
            }else if(initData.code==500){
                layer.alert(initData.msg);
            }
        },
        error: function (e) {
            layer.alert(e.msg);
        },
        complete:function () {
            layer.closeAll('loading');
        }
    });
    return result;
}

//   删除指定的Overlays
function deleteOverlays(content) {
    var allOverlay  = map.getOverlays();
    var labelContent="";
    if (allOverlay.length) {
        for (var i=0; i < allOverlay.length; i++) {
            if(allOverlay[i].toString() == "[object Marker]"){
                var elem = allOverlay[i];
                labelContent = allOverlay[i].siteType;
                if (labelContent && labelContent == content ) {
                    map.removeOverlay(elem);
                }
            }
        }
    }
}
//隐藏地图覆盖物
function hideOverlays(content) {
    var allOverlay  = map.getOverlays();
    var labelContent="";
    if (allOverlay.length) {
        for (var i=0; i < allOverlay.length; i++) {
            if(allOverlay[i].toString() == "[object Marker]"){
                var elem = allOverlay[i];
                labelContent = allOverlay[i].siteType;
                if (labelContent && labelContent == content ) {
                    elem.hide();
                }
            }
        }
    }
}
//显示地图覆盖物
function showOverlays(content) {
    var allOverlay  = map.getOverlays();
    var labelContent="";
    if (allOverlay.length) {
        for (var i=0; i < allOverlay.length; i++) {
            if(allOverlay[i].toString() == "[object Marker]"){
                var elem = allOverlay[i];
                labelContent = allOverlay[i].siteType;
                if (labelContent && labelContent == content ) {
                    elem.show();
                }
            }
        }
    }
}
