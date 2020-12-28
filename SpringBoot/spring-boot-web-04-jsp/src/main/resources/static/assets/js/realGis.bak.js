var meteorologicalUrl = 'http://111.6.98.127:9007/',//气象图层请求接口路径
    lastInfoBox = null,//点位详情窗体
    nationLayer=[],nationLabel=[], //全国数据
    cityLayer = [],cityLabel=[], //城市数据
    countyLayer = [],countyLabel=[], //区县数据
    siteLayer = [],siteLabel=[], //站点数据
    meteorologicalImg ; //气象图层
    pollutantGasData =[],//污染源废气数据
    markerClusterer=""; //点位聚合物
//地图样式
var myChart= null,
    infoBoxList = [],//点位详情窗体
    removeOverlays = [],//地图覆盖物
    wData = null, //风场数据
    regionName = '河南省'; //地图行政区划
var mapStyleJson = [
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
layui.use(['layer','form'], function () {
    var $ = layui.jquery;
    var layer = layui.layer;
    var form = layui.form;
    window.mapLevel = 6;//默认显示地图级别
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
    window.imgRootPath = "../assets/images/map/";//图片路径
    initMap();  //初始化地图
    mapLayerEvent();//图层事件
    mapMoveEvent();//地图移动事件
    factorClickEvent();//因子点击事件
    foldPanel();//面板折叠事件
    getSiteAqiLabel('realData');//获取全国站点数据
    //监听风场开关
    form.on('switch(switchWind)', function(data){
        if(this.checked){
            map.addOverlay(windyCanvas);
            seriesOption.data=wData;
            myChart.setOption({series:[seriesOption]});
            showWindSpeed();
        }else{
            seriesOption.data=[];
            myChart.setOption({series:[seriesOption    ]});
        }
    });
});

function initMap() {
    window.myChart = echarts.init(document.getElementById("realTimeMap"));
    window.chartOption={
        visualMap: {
            show:false,
            left: 'right',
            min: 0,
            max: 0,
            dimension: 4,
            inRange: {
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            },
            realtime: false,
            calculable: true,
            textStyle: {
                color: '#fff'
            }
        },
        bmap: {
            // center: [mapPointLng, mapPointLat ],
            center: ['105.7260', '34.5690' ], //设置甘肃省天水市为地图视野中心点
            zoom: mapLevel,
            roam: true,
            mapStyle: {
                'styleJson':mapStyleJson
            }
        },
        series: [{
            type: 'flowGL',
            coordinateSystem: 'bmap',
            data: [],
            supersampling: 4,
            particleTrail :1.5,
            particleType: 'line',
            particleDensity: 100,
            particleSpeed: 1,
            itemStyle: {
                opacity: 0.7
            }
        }]
    };
    window.seriesOption={
        type: 'flowGL',
        coordinateSystem: 'bmap',
        data: [],
        supersampling: 4,
        particleTrail :1.5,
        particleType: 'line',
        particleDensity: 100,
        particleSpeed: 4,
        itemStyle: {
            opacity: 0.7
        }
    };
    myChart.setOption(chartOption);
    window.map = myChart.getModel().getComponent('bmap').getBMap();
    map.addControl(new BMap.MapTypeControl({
        mapTypes:[
            BMAP_NORMAL_MAP, //普通
            BMAP_SATELLITE_MAP, //卫星
            BMAP_HYBRID_MAP //混合
        ]}));
    setTimeout(function () {
        drawChinaBoundary();
    },1000);
    map.setMinZoom(6);
    // var h=new BMap.Point(50,0),
    //     m=new BMap.Point(180,61.148); //气象图层边界
    var h=new BMap.Point(52,2),
        m=new BMap.Point(175,58);
    var viewBounds = new BMap.Bounds(h,m);
    BMapLib.AreaRestriction.setBounds(map, viewBounds);//限制可拖拽区域
    map.enableScrollWheelZoom();
    map.enableDragging();
    //给地图添加监听事件
    $(window).resize(function () {
        myChart.resize()
    });
    boundarya(regionName);
    if(!wData){
        getWindData();//获取风场数据
    }
    if(!window.windyCanvas){
        var o=map.getOverlays();
        for(var i=0;i<o.length;i++){
            if(o[i].toString()=='[object Overlay]' && o[i].heatmap==undefined){
                window.windyCanvas=o[i];
            }
        }
    }
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

//绘制中国区域行政边界
function drawChinaBoundary() {
    /*画遮蔽层的相关方法
     *思路: 首先在中国地图最外画一圈，圈住理论上所有的中国领土，然后再将每个闭合区域合并进来，并全部连到西北角。
     *      这样就做出了一个经过多次西北角的闭合多边形*/
    //定义中国东南西北端点，作为第一层
    //向数组中添加一次闭合多边形，并将西北角再加一次作为之后画闭合区域的起点
    var pStart = new BMap.Point(180,90);
    var pEnd = new BMap.Point(0,-90);
    var pArray = [
        new BMap.Point(pStart.lng,pStart.lat),
        new BMap.Point(pEnd.lng,pStart.lat),
        new BMap.Point(pEnd.lng,pEnd.lat),
        new BMap.Point(pStart.lng,pEnd.lat)
    ];
    //循环添加各闭合区域
    $.get('../../../assets/libs/bmap/ChinaPly.json',{},function (data) {
        var chinaPly=data.chinaPly;
        $.each(chinaPly,function (index,value) {
            pArray.push(new BMap.Point(value[0],value[1]));
        });
        //添加遮蔽层
        var plyall = new BMap.Polygon(pArray,
            { strokeOpacity: 1, strokeColor: "#091934",
                strokeWeight: 1, fillColor: "#091934",fillOpacity: 1 }); //建立多边形覆盖物
        map.addOverlay(plyall);

        pStart = new BMap.Point(180,90);
        pEnd = new BMap.Point(0,-90);
        pArray = [
            new BMap.Point(135.077218,48.454352),
            new BMap.Point(pStart.lng,pStart.lat),
            new BMap.Point(pStart.lng,pEnd.lat),
            new BMap.Point(135.077218,48.454352)];
        var boundary = new BMap.Polygon(pArray,
            { strokeOpacity: 1, strokeColor: "#091934",
                strokeWeight: 1, fillColor: "#091934",fillOpacity: 1}); //建立多边形覆盖物
        map.addOverlay(boundary);
    });
}

//获取风场数据
function getWindData() {
    $.getJSON('https://tf.istrongcloud.com/data/gfs/gfs.json', function(windData) {
        windData = Object.values(windData)[0];
        if(windData && windData.length>0){
            buildGrid(windData, function(header, grid) {
                var data = [];
                var p = 0;
                var maxMag = 0;
                var minMag = Infinity;
                for (var j = 0; j < header.ny; j++) {
                    for (var i = 0; i < header.nx; i++) {
                        var vx = grid[j][i][0];
                        var vy = grid[j][i][1];
                        var mag = Math.sqrt(vx * vx + vy * vy);
                        var lng = i / header.nx * 360;
                        if (lng >= 180) {
                            lng = 180 - lng;
                        }
                        // 数据是一个一维数组
                        // [ [经度, 纬度，向量经度方向的值，向量纬度方向的值] ]
                        data.push([
                            lng,
                            90 - j / header.ny * 180,
                            vx,
                            vy,
                            mag
                        ]);
                        maxMag = Math.max(mag, maxMag);
                        minMag = Math.min(mag, minMag);
                    }
                }
                window.wData=data;
                chartOption.visualMap.min=minMag;
                chartOption.visualMap.max=maxMag;
                myChart.setOption(chartOption);
                if(wData) showWindSpeed();//显示风速风向信息
                var o = map.getOverlays();
                for(var i =0;i<o.length;i++){
                    if(o[i].toString()=='[object Overlay]' && o[i].heatmap==undefined){
                        window.windyCanvas=o[i];
                    }
                    if(o[i].toString()=='[object Label]' && o[i].lableType=='windSpeed'){
                        map.removeOverlay(o[i]);
                    }
                }
            });
        }
    });
    var buildGrid = function(data, callback) {
        var builder = createBuilder(data);
        var header = builder.header;
        var λ0 = header.lo1,
            φ0 = header.la1; // the grid's origin (e.g., 0.0E, 90.0N)
        var Δλ = header.dx,
            Δφ = header.dy; // distance between grid points (e.g., 2.5 deg lon, 2.5 deg lat)
        var ni = header.nx,
            nj = header.ny; // number of grid points W-E and N-S (e.g., 144 x 73)
        var date = new Date(header.refTime);
        date.setHours(date.getHours() + header.forecastTime);
        var grid = [],
            p = 0;
        var isContinuous = Math.floor(ni * Δλ) >= 360;
        for (var j = 0; j < nj; j++) {
            var row = [];
            for (var i = 0; i < ni; i++, p++) {
                row[i] = builder.data(p);
            }
            if (isContinuous) {
                row.push(row[0]);
            }
            grid[j] = row;
        }
        callback(header, grid);
    };
    var createWindBuilder = function(uComp, vComp) {
        var uData = uComp.data,
            vData = vComp.data;
        return {
            header: uComp.header,
            data: function(i) {
                return [uData[i], vData[i]];
            }
        }
    };
    var createBuilder = function(data) {
        var uComp = null,
            vComp = null,
            scalar = null;
        data.forEach(function(record) {
            switch (record.header.parameterCategory + "," + record.header.parameterNumber) {
                case "2,2":
                    uComp = record;
                    break;
                case "2,3":
                    vComp = record;
                    break;
                default:
                    scalar = record;
            }
        });
        return createWindBuilder(uComp, vComp);
    };
}

function showWindSpeed() {
    var windLabel=new BMap.Label();
    windLabel.lableType = 'windSpeed';
    windLabel.setStyle({
        maxWidth:'unset',
        color: "rgb(173, 170, 170)",
        font:'normal 13px 微软雅黑',
        border: "0",
        cursor: "pointer",
        verticalAlign: "middle",
        backgroundColor: "rgba(10, 26, 56, 0.7)",
        fontWeight: "bold",
        padding:'3px 5px',
        borderRadius:'5px',
        lineHeight:'24px'
    });
    map.addOverlay(windLabel);
    var p=0.41933480175838683;
    var q=2.4443255873719596;
    map.addEventListener('mousemove',function(e){
        if(wData){
            var direction;
            var item=bilinear(e.point.lng,e.point.lat);
            // var speed=Math.sqrt(Math.pow(item[0],2)+Math.pow(item[1],2))*3.6;//km/h
            var speed=Math.sqrt(Math.pow(item[0],2)+Math.pow(item[1],2));//m/s
            var kmLevel=speed<=1?'(无风)':
                speed>1&&speed<=5?'(1级)':
                    speed>5&&speed<=11?'(2级)':
                        speed>11&&speed<=19?'(3级)':
                            speed>19&&speed<=28?'(4级)':
                                speed>28&&speed<=38?'(5级)':
                                    speed>39&&speed<=49?'(6级)':
                                        speed>49&&speed<=61?'(7级)':
                                            speed>61&&speed<75?'(8级)':'(狂风)';
            var level=speed<=0.2?'(无风)':
                speed>0.3&&speed<=1.5?'(1级)':
                    speed>1.6&&speed<=3.3?'(2级)':
                        speed>3.4&&speed<=5.4?'(3级)':
                            speed>5.5&&speed<=7.9?'(4级)':
                                speed>8.0&&speed<=10.7?'(5级)':
                                    speed>10.8&&speed<=13.8?'(6级)':
                                        speed>13.9&&speed<=17.1?'(7级)':
                                            speed>17.2&&speed<20.7?'(8级)':'(狂风)';
            var rate=Math.abs(item[1]/item[0]); //返回斜率，求绝对值
            if((item[0])<0&&(item[1])>0){
                if(rate>p&&rate<q)
                {
                    direction="东南风";
                }
                else if(rate<p)
                {
                    direction="东风";
                }
                else if(rate>q){
                    direction="南风";
                }
            }
            else if((item[0])<0&&(item[1])<0){
                if(rate>p&&rate<q)
                {
                    direction="东北风";
                }
                else if(rate<p)
                {
                    direction="东风";
                }
                else if(rate>q){
                    direction="北风";
                }
            }
            else if((item[0])>0&&(item[1])<0){
                if(rate>p&&rate<q)
                {
                    direction="西北风";
                }
                else if(rate<p)
                {
                    direction="西风";
                }
                else if(rate>q){
                    direction="北风";
                }
            }
            else if((item[0])>0&&(item[1])>0){
                if(rate>p&&rate<q)
                {
                    direction="西南风";
                }
                else if(rate<p)
                {
                    direction="西风";
                }
                else if(rate>q){
                    direction="南风";
                }
            }
            windLabel.setPosition(e.point);
            windLabel.setContent("<div>"+direction+" "+speed.toFixed(2)+"m/s "+level+"</div>");
            if($('.windSite').hasClass('active')){
                windLabel.show();
            } else{
                windLabel.hide();
            }
        }
    });
}

function bilinear(lng,lat){
    var v_na_nb=wData.find(function (x) {
        return (lng-x[0])<1&&(lng-x[0])>0&&(lat-x[1])<1&&(lat-x[1])>0
    });
    var v_na_mb=wData.find(function (x) {
        return (lng-x[0])<1&&(lng-x[0])>0&&(x[1]-lat)<1&&(x[1]-lat)>0
    });
    var v_ma_nb=wData.find(function(x){
        return (x[0]-lng)<1&&(x[0]-lng)>0&&(lat-x[1])<1&&(lat-x[1])>0
    });
    var v_ma_mb=wData.find(function(x){
        return (x[0]-lng)<1&&(x[0]-lng)>0&&(x[1]-lat)<1&&(x[1]-lat)>0
    });
    var na=v_na_nb[0];
    var nb=v_na_nb[1];
    var fa=lng-na;
    var fb=lat-nb;
    var result1=v_na_nb[2]*(1-fa)*(1-fb)+v_ma_nb[2]*fa*(1-fb)+v_na_mb[2]*(1-fa)*fb+v_ma_mb[2]*fa*fb;
    var result2=v_na_nb[3]*(1-fa)*(1-fb)+v_ma_nb[3]*fa*(1-fb)+v_na_mb[3]*(1-fa)*fb+v_ma_mb[3]*fa*fb;
    return [result1,result2]
}

function mapLayerEvent() {
    //点击空白处隐藏弹出层
    $(document).click(function (event) {
        var _con = $('.operateItem');
        if (!_con.is(event.target) && _con.has(event.target).length === 0) {
            $('.mapRegionList').slideUp();
            if(!$('.nation').hasClass('active') && !$('.areaType li').hasClass('active')){
                $('.map-region-layer').removeClass('active');
            }
        }
        if (!_con.is(event.target) && _con.has(event.target).length === 0) {
            $('.dataTypeList').slideUp();
            if(!$('.dataTypeList li').hasClass('active')){
                $('.map-dataType-layer').removeClass('active');
            }
        }
        if (!_con.is(event.target) && _con.has(event.target).length === 0) {
            $('.layerTypeList').slideUp();
            if(!$('.layerTypeList li').hasClass('active')){
                $('.map-layerType-layer').removeClass('active');
            }
        }
        if (!_con.is(event.target) && _con.has(event.target).length === 0) {
            $('.mapStyleList').slideUp();
            if(!$('.mapStyleList li').hasClass('active')){
                $('.map-style-layer').removeClass('active');
            }
        }
    });

    $('.mapLayer').off('click').click(function () {
        $(this).toggleClass('active');
        $(this).find('.typeList').slideToggle();
        var type = $(this).data('type');
        if(type=='map-layerType-layer'){
            layerTypeEvent();
        }else if(type=='map-rank-layer'){ //排名
            if($('.map-rank-layer').hasClass('active')){
                getAqiRankData();
                $('.rankPanel').show('slow');
            }else{
                $('.rankPanel').hide('slow');
            }
        }else if(type=='map-style-layer'){ //样式
            if($('.map-style-layer').hasClass('active')){
                $('.mapStyleList li').unbind('click').click(function (e) {
                    e.stopPropagation();
                    $(this).addClass('active').siblings().removeClass('active');
                    //设置地图风格样式
                    if($(this).data('type')=='normal'){
                        $('[title=显示普通地图]').click()
                    }else if($(this).data('type')=='satellite'){
                        $('[title=显示卫星影像]').click()
                    }else{
                        $('[title=显示带有街道的卫星影像]').click()
                    }
                })
            }
        }
    });

    $('.closePanelButton').click(function () {
        $('.rankPanel').hide('slow');
        $('.map-rank-layer').removeClass('active');
    });

}

function layerTypeEvent() {
    $('.layerTypeList .siteType').unbind('click').click(function (e) {
        e.stopPropagation();
        var layerType = $(this).data('type');
        if(layerType=='pollutantMap'){ //污染地图
            $(this).addClass('active').siblings().removeClass('active');
            map.clearOverlays();
            $('.dataTypeList').slideToggle();
            $('.mapSiteArea,.show-site-name').hide();
            $('.air-factor,.areaList,.cityList').show();
            $('.areaList ul').slideDown();
            $('.cityList ul').slideUp();
            if($('.pollutantMap').hasClass('active')){
                $(this).find('.icon').removeClass('icon-down').addClass('icon-up');
            }else{
                $(this).find('.icon').removeClass('icon-up').addClass('icon-down');
                // $('.dataTypeList li').removeClass('active');
            }
            if($('.dataTypeList li.active').length>0){
                nationSiteEvent($('.dataTypeList li.active').data('type'));//全国站点事件
                $('.regionArea').show();
            }
            $('.dataTypeList li').unbind('click').click(function (e) {
                e.stopPropagation();
                $(this).toggleClass('active').siblings().removeClass('active');
                if($('.dataTypeList li.active').length>0){
                    $('.pollutantMap').addClass('active');
                    $('.regionArea').show();
                }
                if(nationLabel.length>0){removeMapLabel(nationLabel);}
                if(cityLabel.length>0)removeMapLabel(cityLabel);
                if(countyLabel.length>0)removeMapLabel(countyLabel);
                if(siteLabel.length>0)removeMapLabel(siteLabel);
                nationLayer = cityLayer = countyLayer = siteLayer  = [];
                nationSiteEvent($(this).data('type'));//全国站点事件
            })
        }else if(layerType=='realMonitor'){ //实时监测
            $(this).toggleClass('active').siblings().removeClass('active');
            map.clearOverlays();
            map.centerAndZoom('许昌市',9);
            $('.mapSiteArea,.show-site-name').show();
            $('.dataTypeList li').removeClass('active');
            $('.realMonitorSite').show().siblings().hide();
            $('.areaList').hide();
            $('.cityList ul').slideDown();
            initRealMonitorData();
        }else{ //企业管控
            $(this).toggleClass('active').siblings().removeClass('active');
            map.clearOverlays();
            map.centerAndZoom('许昌市',9);
            $('.mapSiteArea,.show-site-name').show();
            $('.legendArea,.air-factor,.areaList').hide();
            $('.dataTypeList li').removeClass('active');
            $('.realMonitorSite').hide().siblings().show();
            $('.cityList ul').slideDown();
            initIndustryData();
        }
        otherLayerIsShow();
    })
}

function nationSiteEvent(type) {
    var zoomLevel=map.getZoom();
    if($('.'+type).hasClass('active')){
        if(zoomLevel!=6){
            map.setZoom(6);
        }
        if(nationLayer.length>0){
            addMapLabel(1,nationLayer)
        }else{
            getSiteAqiLabel(type);
        }
    }else{
        if(zoomLevel<=6){
            removeMapLabel(nationLabel);
        }else if(zoomLevel>6 && zoomLevel <=8){
            removeMapLabel(cityLabel);
        }else if(zoomLevel>8 && zoomLevel <=10){
            removeMapLabel(countyLabel);
        }else if(zoomLevel>10){
            removeMapLabel(siteLabel)
        }
    }
}

function  getAreaType() {
    $('.regionArea>div').click(function(){
        $(this).find('ul').slideDown();
        $(this).siblings().find('ul').slideUp();
    });

    //全国区域
    $('.areaList ul li').click(function (e) {
        $(this).addClass('active').siblings().removeClass('active');
        var index=$(this).data('index');
        switch(index)
        {
            case 1: map.centerAndZoom('廊坊',7);break;
            case 2: map.centerAndZoom('湖州',8); break;
            case 3: map.centerAndZoom('广州',8); break;
            case 4: map.centerAndZoom('武汉',7); break;
            case 5: map.centerAndZoom('成都',7); break;
            case 6: map.centerAndZoom('长春',7); break;
        }
    });

    //河南省区域
    $('.cityList ul li').click(function (e) {
        $(this).addClass('active').siblings().removeClass('active');
        var name=$(this).data('name');
        map.centerAndZoom(name,12);
        if($('.pollutantMap').hasClass('active')){
            setTimeout(function () {
                addMapLabel(4,filterMapLabel(siteLayer,'air'));
                map.panTo(0,0)
            },500);
        }else if($('.realMonitor').hasClass('active')){
            setTimeout(function () {
                filterMapLabel(pollutantGasData,'pollutant');
                map.panTo(0,0)
            },500);
        }

    });

}

function mapMoveEvent() {
    //地图缩放事件
    map.addEventListener('zoomend',function () {
        if(map.getZoom()<7){
            drawChinaBoundary();
        }
        if($('.pollutantMap').hasClass('active')){
            if(nationLabel.length>0){removeMapLabel(nationLabel);nationLabel=[];}
            if(cityLabel.length>0)removeMapLabel(cityLabel);cityLabel=[];
            if(countyLabel.length>0)removeMapLabel(countyLabel);countyLabel=[];
            if(siteLabel.length>0)removeMapLabel(siteLabel);siteLabel=[];
            var type = $('.dataTypeList .active').data('type');
            if($('.'+type).hasClass('active')){
                var zoomLevel=map.getZoom();
                if(zoomLevel<=6){
                    if(nationLayer.length>0){
                        addMapLabel(1,nationLayer)
                    }else{
                        getSiteAqiLabel(type);
                    }
                }else if(zoomLevel>6 && zoomLevel <=8){
                    if(cityLayer.length>0){
                        addMapLabel(2,cityLayer)
                    }else{
                        getSiteAqiLabel(type);
                    }
                }else if(zoomLevel>8 && zoomLevel <=10){
                    if(countyLayer.length>0){
                        addMapLabel(3,countyLayer)
                    }else{
                        getSiteAqiLabel(type);
                    }
                }else if(zoomLevel>10){
                    if(siteLayer.length>0){
                        addMapLabel(4,filterMapLabel(siteLayer,'air'));
                    }else{
                        getSiteAqiLabel(type);
                    }
                }
            }
        }
    });
    //地图拖拽事件
    map.addEventListener('dragend',function(){
        if(map.getZoom()<7){
            drawChinaBoundary();
        }
        if(map.getZoom()<=10) return ;
        if($('.pollutantMap').hasClass('active')){
            var type = $('.dataTypeList .active').data('type');
            if($('.'+type).hasClass('active')){
                if(nationLabel.length>0){removeMapLabel(nationLabel);nationLabel=[];}
                if(cityLabel.length>0)removeMapLabel(cityLabel);cityLabel=[];
                if(countyLabel.length>0)removeMapLabel(countyLabel);countyLabel=[];
                if(siteLabel.length>0)removeMapLabel(siteLabel);siteLabel=[];
                addMapLabel(4,filterMapLabel(siteLayer,'air'));
            }
        }
    });

}

function factorClickEvent() {
    //大气监测
    $('.air-factor ul li').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        var factorName=$(this).data('name');
        var factorItem=$(this).data('item');
        $('.factors-AQI').empty().html('<img src="../../../assets/images/map/'+factorName+'.png">');
        if($('.pollutantMap').hasClass('active') && $('.dataTypeList li').hasClass('active')){
            if(nationLabel.length>0){removeMapLabel(nationLabel)}
            if(cityLabel.length>0){removeMapLabel(cityLabel)}
            if(siteLabel.length>0)removeMapLabel(siteLabel);
            var zoomLevel=map.getZoom();
            if(zoomLevel<=6){
                if(nationLayer.length>0){
                    addMapLabel(1,nationLayer)
                }else{
                    getSiteAqiLabel();
                }
            }else if(zoomLevel>6 && zoomLevel <=8){
                if(cityLayer.length>0){
                    addMapLabel(2,cityLayer)
                }else{
                    getSiteAqiLabel();
                }
            }else if(zoomLevel>8 && zoomLevel <=10){
                if(countyLayer.length>0){
                    addMapLabel(3,countyLayer)
                }else{
                    getSiteAqiLabel();
                }
            }else if(zoomLevel>10){
                if(siteLayer.length>0){
                    addMapLabel(4,filterMapLabel(siteLayer,'air'));
                }else{
                    getSiteAqiLabel();
                }
            }
        }
    });

    //气象监测
    $('.meteorological-factor ul li').click(function () {
        $(this).toggleClass('active').siblings().removeClass('active');
        var item=$(this).data('elem');
        if($(this).hasClass('active')){
            showGraphImg();
            if(item=='TMP' || item=='RH' || item=='WIND'){
                $('.press-factor').show();
                //垂直高度
                $('.press-factor .btn').unbind('click').click(function(e){
                    e.stopPropagation();
                    $(this).toggleClass('active').siblings().removeClass('active');
                    showGraphImg();//展示气象图层
                })
            }else{
                $('.press-factor').hide();
            }
        }else{
            if(meteorologicalImg){map.removeOverlay(meteorologicalImg);}
            $('.press-factor,.meteorologicalLegend').hide();
        }
    });

    //排名面板因子切换事件
    $('.itemContainer .factor .btn').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
    });

    //排名时间选项
    $('#dateList .btn').click(function(){
        getAqiRankData();
    });

    //排名区域选项
    $('#areaList .btn').click(function(){
        getAqiRankData();
    });

    //全国区域点击事件
    getAreaType();
}

function getSiteAqiLabel(type) {
    var zoomLevel=map.getZoom();
    //获取地图数据层级，1,2,3,4分别为全国，城市，区县，站点数据
    var mapDataLevel=zoomLevel<=6?1:zoomLevel>6 && zoomLevel<=8?2:zoomLevel>8 && zoomLevel<=10?3:4;
    var mapZoomLevel=zoomLevel<=8?1:zoomLevel>8 && zoomLevel<=10?2:3;
    var url = type=='realData'?'/gis/atmosphere/air/city/hour/record':'/gis/atmosphere/air/city/hour/accumulate/record';
    getDataByAjax(url,{mapZoomLevel:mapZoomLevel,monitortime:''},'GET',true,function (initData) {
        if(initData.code==200 && initData.data){
            if(nationLabel.length>0){removeMapLabel(nationLabel);}
            if(cityLabel.length>0)removeMapLabel(cityLabel);
            if(countyLabel.length>0)removeMapLabel(countyLabel);
            if(siteLabel.length>0)removeMapLabel(siteLabel);
            // map.clearOverlays();
            if(zoomLevel==6){
                drawChinaBoundary();
            }
            var layerData=initData.data;
            if(mapDataLevel==1){
                nationLayer = [] = initData.data;//全国
            }else if(mapDataLevel==2){
                cityLayer = [] = initData.data;//城市数据
            }else if(mapDataLevel==3){
                countyLayer = [] = initData.data;//区县
            }else{
                siteLayer = [] = initData.data; //站点
            }
            if(mapDataLevel==4){
                layerData=filterMapLabel(initData.data,'air');
            }
            addMapLabel(mapDataLevel,layerData);
        }
    })
}

//删除点位
function removeMapLabel(layer){
    layer.forEach(function(item){map.removeOverlay(item);});
}

//隐藏点位
function hideMapLabel(layer){
    layer.forEach(function(item){item.hide();});
}

function hideNationMapLabel() {
    if(nationLabel.length>0){hideMapLabel(nationLabel);}
    if(cityLabel.length>0)hideMapLabel(cityLabel);
    if(countyLabel.length>0)hideMapLabel(countyLabel);
    if(siteLabel.length>0)hideMapLabel(siteLabel);
}

//过滤视野内数据
function filterMapLabel(layerData,layerType) {
    return layerData.filter(function (x) {
        var b = map.getBounds();
        if(layerType =='air'){
            return parseFloat(x['lng'])>=b.Ne && parseFloat(x['lng'])<=b.Je && parseFloat(x['lat'])>=b.Zd && parseFloat(x['lat'])<=b.Xd;
        }else if(layerType =='pollutant'){
            return parseFloat(x['Longitude'])>=b.Ne && parseFloat(x['Longitude'])<=b.Je && parseFloat(x['Latitude'])>=b.Zd && parseFloat(x['Latitude'])<=b.Xd;
        }
    });
}


//绘制点位
function addMapLabel(mapZoomLevel,layer){
    if(mapZoomLevel==1){
        nationLabel=[];
    }else if(mapZoomLevel==2){
        cityLabel=[];
    }else if(mapZoomLevel==3){
        countyLabel=[];
    }else if(mapZoomLevel==4){
        siteLabel=[];
    }
    var factorItem=$('.air-factor .btn.active').data('name');
    $.each(layer,function (index,item) {
        var point = new BMap.Point(item.lng, item.lat);
        var opts = {
            position: point,    // 指定文本标注所在的地理位置
            offset: new BMap.Size(0, -35)    //设置文本偏移量
        };
        var label="";
        if(mapZoomLevel==1){
            label = new BMap.Label("<div class='siteLabelArea'>" +
                "<p  class='itemNum' style='border-color:"+aqiItemMapLevelColor(factorItem,item[factorItem])+";'>" +
                "<i style='background:"+aqiItemMapLevelColor(factorItem,item[factorItem])+"'>"+item[factorItem]+"</i></p>" +
                "</div>", opts);  // 创建文本标注对象
        }else if(mapZoomLevel==2||mapZoomLevel==3){
            label = new BMap.Label("<div class='siteLabelArea'>" +
                "<p  class='itemNum' style='border-color:"+aqiItemMapLevelColor(factorItem,item[factorItem])+"'>" +
                "<i style='background:"+aqiItemMapLevelColor(factorItem,item[factorItem])+"'>"+item[factorItem]+"</i></p>" +
                "<p class='itemName'>"+item.Name+"</p></div>", opts);  // 创建文本标注对象
        }else{
            label = new BMap.Label("<div class='siteLabelArea'>" +
                "<p  class='itemNum' style='border-color:"+aqiItemMapLevelColor(factorItem,item[factorItem])+"'>" +
                "<i style='background:"+aqiItemMapLevelColor(factorItem,item[factorItem])+"'>"+item[factorItem]+"</i></p>" +
                "<p class='itemName'>"+item.Name+""+isShowSiteType(item.Levels)+"</p></div>", opts);  // 创建文本标注对象
        }
        label.setStyle({
            color: "#333",
            fontSize: "14px",
            border: "0",
            padding:0,
            cursor: "pointer",
            textAlign: "center",
            verticalAlign: "middle",
            backgroundColor: "rgba(255,255,255,.7)",
            fontFamily: "微软雅黑",
            zIndex:99
        });
        if(item[factorItem]){
            map.addOverlay(label);
        }
        label.addEventListener('click',function () {
            var monitorTime=$.format.date(item.MonitorTime,'yyyy-MM-dd HH:mm');
            var info = '<div class="popup"><div class="popup-content-wrapper"><div class="popup-content">' +
                '<div class="map-air-quality-popup map-popup-model">' +
                '<div class="header modelTitle"><h4 class="text-center">点位详情</h></div>' +
                '<div class="pollution-detail"><div class="fl itemInfo"><div class="map-card" style="width: 168px">' +
                '<div class="top text-center background-blue" title="'+item.Name+'"><span>'+item.Name+'</span></div>'+
                '<div class="bottom text-center"><span>'+monitorTime+'</span></div></div>' +
                '<div class="map-card fl" style="width: 168px;"><div class="top' +
                ' text-center aqiBg'+aqiItemMapLevel("AQI",item.AQI)+'"><span>AQI</span></div>'+
                '<div class="bottom text-center"><span>'+item.AQI+'</span></div></div>'+
                '<div class="map-card fl" style="width: 168px;"><div class="top text-center ' +
                'aqiBg'+getComplexIndex(item.CompoSiteIndex)+'"><span>综合指数</span></div>'+
                '<div class="bottom text-center"><span>'+item.CompoSiteIndex+'</span></div></div></div>'+
                '<div class="itemArea fl">' +
                '<div class="map-card fl"><div class="top text-center aqiBg'+aqiItemMapLevel("PM2.5",item.PM25)+'"><span>PM2.5</span></div>'+
                '<div class="bottom text-center"><span>'+item.PM25+'</span></div></div>'+
                '<div class="map-card fl"><div class="top text-center aqiBg'+aqiItemMapLevel("PM10",item.PM10)+'"><span>PM10</span></div>'+
                '<div class="bottom text-center"><span>'+item.PM10+'</span></div></div>'+
                '<div class="map-card fl"><div class="top text-center aqiBg'+aqiItemMapLevel("SO2",item.SO2)+'" ><span>SO2</span></div>'+
                '<div class="bottom text-center"><span>'+item.SO2+'</span></div></div>'+
                '<div class="map-card fl"><div class="top text-center aqiBg'+aqiItemMapLevel("NO2",item.NO2)+'"><span>NO2</span></div>'+
                '<div class="bottom text-center"><span>'+item.NO2+'</span></div></div>'+
                '<div class="map-card fl"><div class="top text-center aqiBg'+aqiItemMapLevel("O3",item.O3)+'"><span>O3</span></div>'+
                '<div class="bottom text-center"><span>'+item.O3+'</span></div></div>'+
                '<div class="map-card fl"><div class="top text-center aqiBg'+aqiItemMapLevel("CO",item.CO)+'"><span>CO</span></div>' +
                '<div class="bottom text-center"><span>'+item.CO+'</span></div></div></div></div>'+
                '<div class="chartTitle">最近二十四小时变化趋势</div>'+
                '<div class="map-chart" id="mapAqiChart"></div></div> </div></div>' +
                '<div class="popup-tip-container"><div class="popup-tip"></div></div>' +
                '</div>';
            var offsetX=$('.siteLabelArea').width();
            var infoBox = new BMapLib.InfoBox(map, info, {
                boxStyle: {
                    width: "380px",
                    Height: "340px",
                    marginLeft:"12px",
                    backgroundColor: "white"
                },
                offset:new BMap.Size(-offsetX, 80),
                closeIconMargin: "12px 8px 4px 4px",
                closeIconUrl: imgRootPath +"back.png",
                enableAutoPan: true,
                align: INFOBOX_AT_TOP
            });
            if (lastInfoBox) {
                lastInfoBox.close();
            }
            lastInfoBox = infoBox;
            infoBox.open(point);
            setTimeout(function () {
                drawAqiRealChart(item.OID);
            },100);
        });
        if(mapZoomLevel==1){
            nationLabel.push(label);
        }else if(mapZoomLevel==2){
            cityLabel.push(label);
        }else if(mapZoomLevel==3){
            countyLabel.push(label);
        }else if(mapZoomLevel==4){
            siteLabel.push(label);
        }
    });
}

//综合指数颜色定义
function getComplexIndex(index)    {
    var indexLevel='';
    if(index==0) {
        indexLevel=0;
    }else if(index<=4){
        indexLevel=1;
    }else if(index<=6){
        indexLevel=2;
    }else if(index<=8){
        indexLevel=3;
    }else if(index<=10){
        indexLevel=4;
    }else if(index<=12){
        indexLevel=5;
    }else{
        indexLevel=6;
    }
    return indexLevel;
}

//获取点位趋势数据
function drawAqiRealChart(oid) {
    var zoomLevel=map.getZoom();
    var mapZoomLevel=zoomLevel<=8?1:zoomLevel>8 && zoomLevel<=10?2:3;
    getDataByAjax('/gis/atmosphere/air/city/hour/24/trend',{RegionCode:oid,mapZoomLevel:mapZoomLevel},'GET',true,function (initData) {
        if(initData.code==200 && initData.data && initData.data.length>0){
            var formatTimeDate = [],monitorData = [], aqiData = [];
            $.each(initData.data,function (index,value) {
                formatTimeDate.push($.format.date(value.MonitorTime,'HH:mm'));
                monitorData.push($.format.date(value.MonitorTime,'yyyy-MM-dd HH:mm'));
                aqiData.push((value.AQI?value.AQI:''));
            });
            var myChart = echarts.init(document.getElementById('mapAqiChart'));
            var option = {
                "tooltip": {
                    "trigger": "axis",
                    "formatter":function (params) {
                        return monitorData[params[0].seriesIndex]+'<br/>'+"AQI："+params[0].value;
                    }
                },
                "grid": {
                    "top": "12%",
                    "left": "10%",
                    "right": "5%",
                    "bottom": "25%"
                },
                "xAxis": [{
                    "type": "category",
                    "data": formatTimeDate,
                    "axisLine": {
                        "lineStyle": {
                            "color": "#fff"
                        }
                    },
                    "axisLabel": {
                        "show": true,
                        "textStyle": {
                            "color": "#333"
                        }
                    }
                }],
                "yAxis": {
                    "type": "value",
                    "axisLabel": {
                        "show": true,
                        "textStyle": {
                            "color": "#333"
                        }
                    },
                    "axisTick": {
                        "show": false
                    },
                    "splitLine": {
                        "show": false
                    },
                    "axisLine": {
                        "show": false
                    }
                },
                "series": [{
                    "name": "AQI",
                    "type": "bar"
                }, {
                    "data": aqiData,
                    "type": "bar",
                    "smooth": true,
                    "itemStyle": {
                        normal: {
                            color: function(params) {
                                return aqiItemMapLevelColor('AQI',params.value);
                            }
                        }
                    }
                }]
            };
            myChart.setOption(option);
        }else{
            $("#mapAqiChart").html('暂无数据').css('text-align','center')
        }
    })
}

//展示气象图层
function showGraphImg(){
    if(meteorologicalImg){map.removeOverlay(meteorologicalImg);}
    meteorologicalImg = null;
    var searchDate=$.format.date(new Date(),'yyyyMMddHHmmss'),//当前时间
        elementName=$('.meteorological-factor li.active').data('elem'),
        elementText=$('.meteorological-factor li.active').text(),
        levelType='ground',
        key='xc05r3s9xm4';
    if(elementName=='TMP' || elementName=='RH' || elementName=='WIND'){
        levelType=$('.press-factor .btn.active').data('item');
    }
    var h=new BMap.Point(50,0),
        m=new BMap.Point(180,61.148),
        groundOverlayOptions={opacity:0.6,zIndex:-99};
    var imageLayer=new BMap.GroundOverlay(new BMap.Bounds(h,m),groundOverlayOptions);
    var imgurl = meteorologicalUrl+"/EnvDataCenterService/envdatacenter/NoAuthorData/GetGfsImage?searchDate=" + searchDate +"&elementName=" + elementName + "&levelType="+levelType;
    imageLayer.setImageURL(imgurl);
    imageLayer.id='qqq';
    imageLayer.type='meteorologicalImg';
    map.addOverlay(imageLayer);
    meteorologicalImg  = imageLayer;
    var temp = '';
    getDataByAjax('/gis/atmosphere/air/temp',{ele:elementName},'GET',true,function (initdata) {
        if(initdata.code = 200 && initdata.data && initdata.data.length>0){
            var data=initdata.data[0];
            var item = (data.interval).split(',');
            var colorList = eval(data.colors);
            temp+='<li>'+elementText+"("+data.unit+")"+'</li>';
            $.each(colorList,function (index,value) {
                var color="rgba"+value.replace('{','(').replace('}',')');
                temp += '<li style="background:'+color+'">'+item[index]+'</li>';
            });
        }
        $('.meteorologicalLegend').empty().html('<ul>'+temp+'</ul>');
    })
}

function getAqiRankData() {
    var dateCode=$('#dateList .btn.active').data('value');
    var areaCode=$('#areaList .btn.active').data('value');
    var areaText=$('#areaList .btn.active').text();
    var theadTr='',tr='',num=0;
    if(areaCode==5 || areaCode==6){ //省、县区
        num=4;
        theadTr = '<tr><th style="width: 25%">序号</th>' +
            '<th style="width: 25%">城市</th><th style="width: 25%">AQI</th><th style="width: 25%">首要污染物</th></tr>';
    }else{
        num=5;
        theadTr='<tr><th style="width: 15%">序号</th><th style="width: 25%">省份</th>' +
            '<th style="width: 25%">城市</th><th style="width: 15%">AQI</th><th style="width: 20%">首要污染物</th></tr>';
    }
    getDataByAjax('/gis/atmosphere/air/aqi/top',{regionFlag:areaCode,DataType:dateCode},'GET',true,function (initData) {
        if(initData.code==200 && initData.data.length>0){
            var monitorTime = initData.data[0].MonitorTime;
            var format=dateCode==1?'yyyy年MM月dd日HH时':'yyyy年MM月dd日';
            var timeStr=$.format.date(monitorTime,format);
            $('.itemTableTitle').html(timeStr + ' ' + areaText + '城市空气质量排序');
            if(areaCode==5 || areaCode==6){
                $.each(initData.data,function (index,value) {
                    for(var key in value){
                        if(!value[key]){
                            value[key] = ''
                        }
                    }
                    var cssStyle =  value.AQI?"one-bg-level"+aqiItemMapLevel('AQI',value.AQI):'';
                    tr+='<tr '+isRemark(value.RegionCode)+'><td style="width: 25%">'+(index+1)+'</td><td style="width: 25%">'+value.RegionName+'</td>' +
                        '<td style="width: 25%"><span class='+cssStyle+'>'+value.AQI+'</span></td>' +
                        '<td style="width: 25%">'+((value.PrimaryPollutant)?value.PrimaryPollutant:'')+'</td></tr>';
                });
            }else{
                $.each(initData.data,function (index,value) {
                    for(var key in value){
                        if(!value[key]){
                            value[key] = ''
                        }
                    }
                    var cssStyle =  value.AQI?"one-bg-level"+aqiItemMapLevel('AQI',value.AQI):'';
                    tr+='<tr '+isRemark(value.RegionCode)+'><td style="width: 15%">'+(index+1)+'</td><td style="width: 25%">'+value.parentname+'</td>' +
                        '<td style="width: 25%">'+value.RegionName+'</td><td style="width: 15%"><span class='+cssStyle+'>'+value.AQI+'</span></td>' +
                        '<td style="width: 20%">'+((value.PrimaryPollutant)?value.PrimaryPollutant:'')+'</td></tr>';
                });
            }
        }else{
            $('.itemTableTitle').html( areaText + '城市空气质量排序');
            tr='<tr><td colspan='+num+' class="text-center">暂无数据</td></tr>'
        }
        $('#aqiRankTable thead').empty().append(theadTr);
        $('#aqiRankTable tbody').empty().append(tr);
    });
}

function isRemark(value) {
    if(value == '410100000'){
        return 'style="background:#a52626"';
    }else{
        return ''
    }
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
    if(data || data==0){
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

//大气污染因子类别
function aqiItemMapLevelColor(code,data) {
    var color="";
    var levelArr = [];
    if (code == "PM10" || code == 'pm10') {
        levelArr = [50, 150, 250, 350, 500]
    } else if (code == "PM2.5" || code == "pm25" || code == "PM25") {
        levelArr = [35, 75, 115, 150, 250]
    } else if (code == "SO2" || code == "so2") {
        levelArr = [150, 500, 650, 800, 1600]
    } else if (code == "NO2" || code == "no2") {
        levelArr = [100, 200, 700, 1200, 2340]
    } else if (code == "CO" || code == "co") {
        levelArr = [5, 10, 35, 60, 90]
    } else if (code == "O3" || code == "o3") {
        levelArr = [160, 200, 300, 400, 800, 1200]
    } else if (code == "AQI" || code == "aqi") {
        levelArr = [50, 100, 150, 200, 300]
    }
    if(data){
        color = data <= levelArr[0] ? "#61D800"
            : data > levelArr[0] && data <= levelArr[1] ? "#CCB21A"
                : data > levelArr[1] && data <= levelArr[2] ? "#F5A623"
                    : data > levelArr[2] && data <= levelArr[3] ? "#F12F1C"
                        : data > levelArr[3] && data <= levelArr[4] ? "#9C0D71"
                            : data > levelArr[4] ? "#630445" : "";

    }else{
        color='#999'
    }
    return color;
}

function isShowSiteType(level) {
    if(level==0){
        return '<i style="color: red;font-style: normal">省</i>'
    }else if(level==1){
        return '<i style="color: red;font-style: normal">国</i>'
    }else{
        return ''
    }
}

function foldPanel() {
    $(".airType").on("click",".icon-up",function () {
        $(".airType .map-type-content").slideUp();
        $(this).addClass("icon-down").removeClass("icon-up");
    });
    $(".airType").on("click",".icon-down",function () {
        $(".airType .map-type-content").slideDown();
        $(this).addClass("icon-up").removeClass("icon-down");
    });

    $(".pollutantType").on("click",".icon-up",function () {
        $(".pollutantType .map-type-content").slideUp();
        $(this).addClass("icon-down").removeClass("icon-up");
    });
    $(".pollutantType").on("click",".icon-down",function () {
        $(".pollutantType .map-type-content").slideDown();
        $(this).addClass("icon-up").removeClass("icon-down");
    });

    $(".industryType").on("click",".icon-up",function () {
        $(".industryType .map-type-content").slideUp();
        $(this).addClass("icon-down").removeClass("icon-up");
    });
    $(".industryType").on("click",".icon-down",function () {
        $(".industryType .map-type-content").slideDown();
        $(this).addClass("icon-up").removeClass("icon-down");
    });

    //直观/普通
    $(".show-site-name").on("click", "li", function () {
        $(this).addClass("active").siblings(".active").removeClass("active");
        if ($(this).hasClass("showName")) {
            $(".siteLabelTitle").each(function () {
                $(this).show();
            });
        } else if ($(this).hasClass("normal")) {
            $(".siteLabelTitle").each(function () {
                $(this).hide();
            });
        }
    });
}

function initIndustryData() {
    clearHistory();//删除历史数据
    // 初始化工业源点位数据
    var typeSelected = $(".industryTypeArea li.active").length;
    if(typeSelected>0){
        getEnpControlData();
    }

    //工业源点击事件
    $(".industryType .item-industry").click(function () {
        $(this).toggleClass('active');
        if(!$(this).hasClass('active')){
            $('.icon-industry img')[0].src = '../../../assets/images/map/icon-map-pollutant.png';
            $('.industryTypeArea li').each(function () {
                $(this).removeClass('active');
                deleteOverlays($(this).data('sitetype'));
            })
        }else{
            $('.icon-industry img')[0].src = '../../../assets/images/map/icon-map-pollutant-active.png';
            $(".industryTypeArea li").each(function () {
                $(this).addClass('active');
                getEnpControlData();
            });
        }
    });

    // 工业源类型点击事件
    $(".industryTypeArea li").click(function () {
        infoBoxList.forEach(function(infobox){infobox.close();});
        $(this).addClass('active').siblings().removeClass('active');
        var activeLiNum = $(".industryTypeArea li.active").length;
        if(activeLiNum==0){
            $('.item-industry').removeClass('active');
            $('.icon-industry img')[0].src = '../../../assets/images/map/icon-map-pollutant.png';
        }
        deleteOverlays($(this).data('sitetype'));
        getEnpControlData();
    });
}

//获取工业源数据
function getEnpControlData() {
    var type = $('.industryTypeArea .active').data('value');
    getDataByAjax('/gis/atmosphere/enterprise/monitor',{statisticsType:type},'GET',true,function (initData) {
        if(initData.code==200 && initData.data && initData.data.length>0){
            $.each(initData.data,function (index,data) {
                mapEnpControlLabel(data);
            })
        }
    })
}

// 添加工业源类型点位
function mapEnpControlLabel(data) {
    var size=[38,38];
    var tmpPt = new BMap.Point(data.longitude, data.latitude);
    var tmpMarkIcon = new BMap.Icon(imgRootPath + 'marker_gas_green.png'  , new BMap.Size(size[0], size[1]));
    var tmpMarker = new BMap.Marker(tmpPt, {
        "title": data.psName,
        "icon": tmpMarkIcon
    });
    tmpMarker.siteType = 'industrySource';
    var opts = {
        position: tmpPt,    // 指定文本标注所在的地理位置
        offset: new BMap.Size(0, -35)    //设置文本偏移量
    };
    var label = new BMap.Label("<div class='siteLabelTitle' id="+data.psCode+">"+data.psName+"</div>",{offset:new BMap.Size(-((data.psName).length*13/2)+15,size[1]+3)});
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
    //允许清除覆盖物
    tmpMarker.enableMassClear();

    //将点位存储至map集合工具类中
    window.curEntAndMatlsDic.put(data.psCode, {
        "data": data,
        "marker": tmpMarker,
        "click": function () {
            window.map.panTo(tmpPt);
            var info = '<div class="popup"><div class="popup-content-wrapper"><div class="popup-content">' +
                '<div class="map-air-quality-popup map-popup-model">' +
                '<div class="header modelTitle"><h4 class="text-center">点位详情</h></div>' +
                '</div></div></div>' +
                '<div class="popup-tip-container"><div class="popup-tip"></div></div>' +
                '</div>';
            var infoBox = new BMapLib.InfoBox(window.map,info, {
                boxStyle: {
                    width: "380px",
                    Height: "340px",
                    marginLeft:"12px",
                    backgroundColor: "white"
                },
                // offset:new BMap.Size(-offsetX, 80),
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
        }
    });

    //定义点位点击触发事件
    tmpMarker.addEventListener("click", function () {
        window.curEntAndMatlsDic.get(data.psCode).click();
    });
    //将点位添加至地图
    map.addOverlay(tmpMarker);
    if($('.showName').hasClass('active')){
        $('.siteLabelTitle').show();
    }else{
        $('.siteLabelTitle').hide();
    }
}

function initRealMonitorData() {
    clearHistory();//删除历史数据
    initAirData();//初始化空气数据
    initPollutantMap(); //初始化污染源
}

function initAirData() {
    // 初始化大气点位数据
    var siteCode=[],siteType = [];
    $(".airSiteArea li.active").each(function () {
        siteCode.push($(this).data("value"));
        siteType.push($(this).data("point"));
    });
    siteCode=siteCode.join(',');
    siteType=siteType.join(',');
    if($('.item-air').hasClass('active')){
        getAirMapData(siteCode,siteType);
    }

    //大气点击事件
    $(".airType .item-air").click(function () {
        $(this).toggleClass('active');
        if(!$(this).hasClass('active')){
            $('.icon-air img')[0].src = '../../../assets/images/map/icon-air.png';
            $('.airFactorArea').hide();
            $('.airSiteArea li').each(function () {
                $(this).removeClass('active');
                hideOverlays($(this).data('point'));
            })
        }else{
            $('.icon-air img')[0].src = '../../../assets/images/map/icon-air-active.png';
            $('.airFactorArea').show();
            $(".airSiteArea li").each(function () {
                $(this).addClass('active');
                showOverlays($(this).data('point'));
            });
        }
    });

    // 大气站点类型点击事件
    $(".airSiteArea li").click(function () {
        infoBoxList.forEach(function (infobox) {  infobox.close(); });
        var siteCode=$(this).data("value");
        var sitePoint=$(this).data("point");
        $(this).toggleClass('active');
        var liNum = $(".airSiteArea li").length,
            activeLiNum = $(".airSiteArea li.active").length;
        if(liNum == activeLiNum || activeLiNum>0){
            $('.item-air').addClass('active');
            $('.icon-air img')[0].src='../../../assets/images/map/icon-air-active.png';
        }else if(activeLiNum==0){
            $('.item-air').removeClass('active');
            $('.icon-air img')[0].src = '../../../assets/images/map/icon-air.png';
            $('.airFactorArea').hide();
        }
        if(!$(this).hasClass('active')){
            hideOverlays(sitePoint);
        }else{
            $('.airFactorArea').show();
            showOverlays(sitePoint);
        }
    });
}

function getAirMapData() {
    var factorName = $('.air-factor li.active').attr('data-name');
    getDataByAjax('/gis/atmosphere/air/site/type/record',{siteType:''},'GET',true,function (initData) {
        if(initData.code==200 && initData.data && initData.data.length>0){
            $.each(initData.data,function (index,data) {
                var siteTypeCode = data.siteTypeCode;
                var pointType='';
                if(siteTypeCode.indexOf('G')>-1){ //国控站
                    pointType="nationalAirSite";
                }else if(siteTypeCode.indexOf('S')>-1){ // 省控站
                    pointType="provinceAirSite";
                }else if(siteTypeCode.indexOf('X')>-1){ //乡镇站
                    pointType="countyAirSite";
                }
                data.siteType = "air";
                data.pointType = pointType;
                data.factor = factorName ;
               mapAirLabel(data);
            })
        }
    })
}

function mapAirLabel(data) {
    var tmpPt = new BMap.Point(data.lng, data.lat);
    var size=[38,38], factorNum,index,pointType=data.pointType;
    if (siteTypeData.indexOf(data.pointType) > -1) {
        index = pointType=='nationalAirSite'?0:pointType=='provinceAirSite'?1:2;
        if(data[data.factor]){
            factorNum = data[data.factor];
            data.img = imgData[index][parseInt(aqiItemMapLevel(data.factor,factorNum)-1)];
        }else{
            data.img =  imgData[siteTypeData.indexOf(pointType)][6];
        }
    } else {
        var type = pointType=='nationalAirSite'?'standard':pointType=='provinceAirSite'?'town':'small';
        data.img = "marker_" + type + "_lost.png";
    }
    //分类各点位图标
    var tmpMarkIcon = new BMap.Icon(imgRootPath + data.img , new BMap.Size(size[0], size[1]));
    var tmpMarker = new BMap.Marker(tmpPt, {
        "title": data.Name,
        "icon": tmpMarkIcon
    });
    tmpMarker.siteType=pointType;
    var label = new BMap.Label("<div class='siteLabelTitle hide' id="+data.OID+">"+data.Name+"</div>",{offset:new BMap.Size(-((data.Name).length*13/2)+15,size[1]+3)});
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
    //允许清除覆盖物
    tmpMarker.enableMassClear();
    //将点位存储至map集合工具类中
    window.curEntAndMatlsDic.put(data.OID, {
        "data": data,
        "marker": tmpMarker,
        "click": function () {
            window.map.panTo(tmpPt);
            var infoBox = new BMapLib.InfoBox(window.map,getAirSiteInfo(data), {
                boxStyle: {
                    width: "380px",
                    Height: "340px",
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
            setTimeout(function () {
                drawAqiRealChart(data.OID);
            },100);
        }
    });
    //定义点位点击触发事件
    tmpMarker.addEventListener("click", function () {
        window.curEntAndMatlsDic.get(data.OID).click();
    });
    //将点位添加至地图
    window.map.addOverlay(tmpMarker);

    if (aqiItemMapLevel(data.factor,factorNum) >= 3 && aqiItemMapLevel(data.factor,factorNum) != 7) {
        tmpMarker.setAnimation(BMAP_ANIMATION_BOUNCE);
    }
}

function getAirSiteInfo(item){
    var monitorTime=$.format.date(item.MonitorTime,'yyyy-MM-dd HH:mm');
    var info = '<div class="popup"><div class="popup-content-wrapper"><div class="popup-content">' +
        '<div class="map-air-quality-popup map-popup-model">' +
        '<div class="header modelTitle"><h4 class="text-center">点位详情</h></div>' +
        '<div class="pollution-detail"><div class="fl itemInfo"><div class="map-card" style="width: 168px">' +
        '<div class="top text-center background-blue" title="'+item.Name+'"><span>'+item.Name+'</span></div>'+
        '<div class="bottom text-center"><span>'+monitorTime+'</span></div></div>' +
        '<div class="map-card fl" style="width: 168px;"><div class="top' +
        ' text-center aqiBg'+aqiItemMapLevel("AQI",item.AQI)+'"><span>AQI</span></div>'+
        '<div class="bottom text-center"><span>'+item.AQI+'</span></div></div>'+
        '<div class="map-card fl" style="width: 168px;"><div class="top text-center ' +
        'aqiBg'+getComplexIndex(item.CompoSiteIndex)+'"><span>综合指数</span></div>'+
        '<div class="bottom text-center"><span>'+item.CompoSiteIndex+'</span></div></div></div>'+
        '<div class="itemArea fl">' +
        '<div class="map-card fl"><div class="top text-center aqiBg'+aqiItemMapLevel("PM2.5",item.PM25) +' '+getFirstPollutant("PM2.5",item.PrimaryPollutant)+'"><span>PM2.5</span></div>'+
        '<div class="bottom text-center"><span>'+item.PM25+'</span></div></div>'+
        '<div class="map-card fl"><div class="top text-center aqiBg'+aqiItemMapLevel("PM10",item.PM10)+' '+getFirstPollutant("PM10",item.PrimaryPollutant)+'"><span>PM10</span></div>'+
        '<div class="bottom text-center"><span>'+item.PM10+'</span></div></div>'+
        '<div class="map-card fl"><div class="top text-center aqiBg'+aqiItemMapLevel("SO2",item.SO2)+' '+getFirstPollutant("SO2",item.PrimaryPollutant)+'" ><span>SO2</span></div>'+
        '<div class="bottom text-center"><span>'+item.SO2+'</span></div></div>'+
        '<div class="map-card fl"><div class="top text-center aqiBg'+aqiItemMapLevel("NO2",item.NO2)+' '+getFirstPollutant("NO2",item.PrimaryPollutant)+'"><span>NO2</span></div>'+
        '<div class="bottom text-center"><span>'+item.NO2+'</span></div></div>'+
        '<div class="map-card fl"><div class="top text-center aqiBg'+aqiItemMapLevel("O3",item.O3)+' '+getFirstPollutant("O3",item.PrimaryPollutant)+'"><span>O3</span></div>'+
        '<div class="bottom text-center"><span>'+item.O3+'</span></div></div>'+
        '<div class="map-card fl"><div class="top text-center aqiBg'+aqiItemMapLevel("CO",item.CO)+' '+getFirstPollutant("CO",item.PrimaryPollutant)+'"><span>CO</span></div>' +
        '<div class="bottom text-center"><span>'+item.CO+'</span></div></div></div></div>'+
        '<div class="chartTitle">最近二十四小时变化趋势</div>'+
        '<div class="map-chart" id="mapAqiChart"></div><div class="linkBtn"><a href="/gis/atmosphere/grid" target="_blank">附近的污染源排放分析</a></div></div> </div></div>' +
        '<div class="popup-tip-container"><div class="popup-tip"></div></div>' +
        '</div>';
    setItems(item);//存储传值
    return info;
}

//添加首要污染物
function getFirstPollutant(item,pollutant) {
    if(item==pollutant){
        return 'user_first_pollutant'
    }else{
        return  ''
    }
}

//存储传值
function setItems(dataObj) {
    var airLabelEntity = {
        regionCode:dataObj.regionCode,
        pointType: dataObj.pointType,
        monitorTime: dataObj.MonitorTime,
        factor: dataObj.factor,
        img: dataObj.img,
        siteName: dataObj.Name,
        siteCode: dataObj.OID,
        aqi:dataObj.AQI,
        Latitude: dataObj.lat,
        Longitude: dataObj.lng
    };
    sessionStorage.setItem('airLabelData', JSON.stringify(airLabelEntity));
}

function initPollutantMap(){
    // 初始化污染源地图点位数据
    var typeSelected = $(".industryTypeArea li.active").length;
    if(typeSelected>0 || $('.item-pollutant').hasClass('active')){
        $('.factors-OverProof,.factors-abnormal').show();
       getPollutantMapData();
    }

    //污染源点击事件
    $(".pollutantType .item-pollutant").click(function () {
        $(this).toggleClass('active');
        if(!$(this).hasClass('active')){
            $('.icon-pollutant img')[0].src = '../../../assets/images/map/icon-map-pollutant.png';
            $('.pollutantSiteArea li').each(function () {
                $(this).removeClass('active');
                hideOverlays($(this).data('point'));
            })
        }else{
            $('.icon-pollutant img')[0].src = '../../../assets/images/map/icon-map-pollutant-active.png';
            $(".pollutantSiteArea li").each(function () {
                $(this).addClass('active');
                showOverlays($(this).data('point'));
            });
        }
    });

    // 污染源数据类型点击事件
    $(".pollutantSiteArea li").click(function () {
        infoBoxList.forEach(function (infobox) {  infobox.close(); });
        $(this).toggleClass('active');
        var liNum=$(".pollutantSiteArea li").length,
            activeLiNum=$(".pollutantSiteArea li.active").length;
        if(liNum==activeLiNum || activeLiNum>0){
            $('.item-pollutant').addClass('active');
            $('.icon-pollutant img')[0].src = '../../../assets/images/map/icon-map-pollutant-active.png';
        }else if(activeLiNum==0){
            $('.item-pollutant').removeClass('active');
            $('.icon-pollutant img')[0].src = '../../../assets/images/map/icon-map-pollutant.png';
        }
        var pointType=$(this).data("point");
        var siteType=$(this).data("sitetype");
        if(!$(this).hasClass('active')){
            hideOverlays(pointType);
        }else{
            showOverlays(pointType);//显示用电量监管数据
        }
    });
}

//获取污染源数据
function getPollutantMapData() {
    var type = $('.pollutantSiteArea .active').data('point');
    var startTime = $.format.date(new Date(),'yyyy-MM-dd HH:mm:ss');
    var endTime = $.format.date(new Date(new Date(new Date().getTime() - 1000*60*60)),'yyyy-MM-dd HH:mm:ss');
    // 410100000
    getDataByAjax('/gis/atmosphere/waste/monitor/enterprise',{RegionCode:'',psname:'',startTime:startTime,endTime:endTime},'GET',true,function (initData) {
        if(initData.code==200 && initData.data && initData.data.length>0){
           var siteData = initData.data;
           var pointData = filterMapLabel(initData.data,'pollutant');
           // console.log(pointData);
           var points = [];
            // $.each(pointData,function (index,data) {
            //      mapPollutionLabel(data,type);
            // });
            $.each(initData.data,function (index,data) {
                points.push(new BMap.Point(data.Longitude, data.Latitude));
                // mapPollutionLabel(data,type);
            });
            var options = {
                size: BMAP_POINT_SIZE_NORMAL,
                shape: BMAP_POINT_SHAPE_STAR,
                color: '#d340c3'
            };
            var pointCollection = new BMap.PointCollection(points, options);
            // console.log(pointCollection)
            pointCollection.addEventListener('click', function (e) {
                var data = '';//弹窗信息
                //循环查出值
                for (var i = 0; i < siteData.length; i++) {
                    // points.push(new BMap.Point(siteData[i].longitude,siteData[i].latitude));
                    if(siteData[i].Longitude==e.point.lng&&siteData[i].Latitude==e.point.lat){//经度==点击的,维度
                        data = siteData[i];
                        break;
                    }
                }
                var tmpPt = new BMap.Point(e.point.lng, e.point.lat);
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
                    '<li class="active icon-blue" data-code='+data.PSCode+' data-type="site-chart" data-chart="exceedData" >超标信息</li>' +
                    '<li class="site-link icon-blue"  data-code='+data.PSCode+' data-type="site-chart" data-chart="realData">最新数据</li>' +
                    '</ul><div class="layui-icon layui-icon-down" onclick=isOpenTablePanel(this)></div> </div>' +
                    '<div class="chartArea"><div class="exceedData"><table id="exceedDataTable"></table></div>' +
                    '<div class="realData" style="display: none"><table id="realDataTable"></table></div></div>'+
                    '</div></div></div></div>' +
                    '<div class="popup-tip-container"><div class="popup-tip"></div></div>' +
                    '</div>';
                var offsetX=$('.siteLabelArea').width();
                var infoBox = new BMapLib.InfoBox(map, info, {
                    boxStyle: {
                        width: "380px",
                        Height: "340px",
                        marginLeft:"12px",
                        backgroundColor: "white"
                    },
                    offset:new BMap.Size(-offsetX, 80),
                    // closeIconMargin: "12px 8px 4px 4px",
                    closeIconUrl: imgRootPath +"back.png",
                    enableAutoPan: true,
                    align: INFOBOX_AT_TOP
                });
                if (lastInfoBox) {
                    lastInfoBox.close();
                }
                lastInfoBox = infoBox;
                infoBox.open(tmpPt);
            });
            pointCollection.siteType = type;
            map.addOverlay(pointCollection);  // 添加Overlay
        }
    })
}

function mapPollutionLabel(data,type) {
    var size=[38,38];
    var tmpPt = new BMap.Point(data.Longitude, data.Latitude);
    var iconName = data.IsOverProof==0?imgData[siteTypeData.indexOf(type)][0]:imgData[siteTypeData.indexOf(type)][1];
    var tmpMarkIcon = new BMap.Icon(imgRootPath + iconName  , new BMap.Size(size[0], size[1]));
    var tmpMarker = new BMap.Marker(tmpPt, {
        "title": data.PSName,
        "icon": tmpMarkIcon
    });
    var opts = {
        position: tmpPt,    // 指定文本标注所在的地理位置
        offset: new BMap.Size(0, -15)    //设置文本偏移量
        // offset:new BMap.Size(-((data.PSName).length*13/2)+15,-size[1]+3)
    };
    // var label = new BMap.Label("<div class='siteLabelTitle' id="+data.PSCode+">"+data.PSName+"</div>",{offset:new BMap.Size(-((data.PSName).length*13/2)+15,size[1]+3)});
    var label = new BMap.Label("<div class='siteLabelBox'><div class='siteLabelIcon'></div><div class='siteLabelTitle' id="+data.PSCode+">"+data.PSName+"</div></div>",opts);
    label.setStyle({
        color : "#ccc",
        fontSize : "12px",
        lineHeight : "20px",
        fontFamily:"微软雅黑",
        border:'none',
        padding:0
    });
    label.siteType = type;
    label.addEventListener('click',function () {
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
            '<li class="active icon-blue" data-code='+data.PSCode+' data-type="site-chart" data-chart="exceedData" >超标信息</li>' +
            '<li class="site-link icon-blue"  data-code='+data.PSCode+' data-type="site-chart" data-chart="realData">最新数据</li>' +
            '</ul><div class="layui-icon layui-icon-down" onclick=isOpenTablePanel(this)></div> </div>' +
            '<div class="chartArea"><div class="exceedData"><table id="exceedDataTable"></table></div>' +
            '<div class="realData" style="display: none"><table id="realDataTable"></table></div></div>'+
            '</div></div></div></div>' +
            '<div class="popup-tip-container"><div class="popup-tip"></div></div>' +
            '</div>';
        var offsetX=$('.siteLabelArea').width();
        var infoBox = new BMapLib.InfoBox(map, info, {
            boxStyle: {
                width: "380px",
                Height: "340px",
                marginLeft:"12px",
                backgroundColor: "white"
            },
            offset:new BMap.Size(-offsetX, 80),
            // closeIconMargin: "12px 8px 4px 4px",
            closeIconUrl: imgRootPath +"back.png",
            enableAutoPan: true,
            align: INFOBOX_AT_TOP
        });
        if (lastInfoBox) {
            lastInfoBox.close();
        }
        lastInfoBox = infoBox;
        infoBox.open(tmpPt);
    });
    // tmpMarker.setLabel(label);
    // tmpMarker.enableMassClear();//允许清除覆盖物
  //  tmpMarker.disableMassClear();//不允许清除覆盖物
    //将点位存储至map集合工具类中
    window.curEntAndMatlsDic.put(data.PSCode, {
        "data": data,
        "marker": label,
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
                '<li class="active icon-blue" data-code='+data.PSCode+' data-type="site-chart" data-chart="exceedData" >超标信息</li>' +
                '<li class="site-link icon-blue"  data-code='+data.PSCode+' data-type="site-chart" data-chart="realData">最新数据</li>' +
                '</ul><div class="layui-icon layui-icon-down" onclick=isOpenTablePanel(this)></div> </div>' +
                '<div class="chartArea"><div class="exceedData"><table id="exceedDataTable"></table></div>' +
                '<div class="realData" style="display: none"><table id="realDataTable"></table></div></div>'+
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
            // tmpMarker.setAnimation(BMAP_ANIMATION_BOUNCE);

            //infoBox关闭时执行的操作
            infoBox.addEventListener("close", function (e) {
                //取消marker的跳动效果
                // tmpMarker.setAnimation(null);
            });
            // infoBox.open(tmpMarker);   //图片加载完毕重绘infowindow
            getPollutantChartData('exceedData',$('.site-data-detailbtn li:first-child').data('code'));//获取废气超标数据
            getPollutantChartData('realData',$('.site-data-detailbtn li:last-child').data('code'));//获取废气最新数据
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
    map.addOverlay(label);
    if($('.showName').hasClass('active')){
        $('.siteLabelTitle').show();
    }else{
        $('.siteLabelTitle').hide();
    }
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
    var dataHtml = '';
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
    }else{
        var startTime = $.format.date(new Date(),'yyyy-MM-dd HH:mm:ss');
        var endTime = $.format.date(new Date(new Date(new Date().getTime() - 1000*60*60)),'yyyy-MM-dd HH:mm:ss');
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

    }
}

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
            }
        },
        error: function (e) {
            layer.alert(e.responseText);
        },
        complete:function () {
            layer.closeAll('loading');
        }
    });
    return result;
}

// 判断气象图层的选中状态
function otherLayerIsShow() {
    if($('.layui-form-switch').hasClass('layui-form-onswitch')){
        map.addOverlay(windyCanvas);
        seriesOption.data=wData;
        myChart.setOption({series:[seriesOption]});
        showWindSpeed();
    }else{
        seriesOption.data=[];
        myChart.setOption({series:[seriesOption    ]});
    }

    if($('.meteorological-factor li').hasClass('active')){
        showGraphImg(); //显示气象图层
    }
}