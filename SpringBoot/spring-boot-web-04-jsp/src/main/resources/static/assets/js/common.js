// 以下代码是配置layui扩展模块的目录，每个页面都需要引入
layui.config({
    base: getProjectUrl() + 'assets/module/'
}).extend({
    formSelects: 'formSelects/formSelects-v4',
    treetable: 'treetable-lay/treetable',
    dropdown: 'dropdown/dropdown',
    notice: 'notice/notice',
    step: 'step-lay/step',
    dtree: 'dtree/dtree',
    citypicker: 'city-picker/city-picker',
    iconPicker: 'iconPicker/iconPicker',
    tableSelect: 'tableSelect/tableSelect'
}).use(['layer', 'admin'], function () {
    var $ = layui.jquery;
    var layer = layui.layer;
    var admin = layui.admin;

    // 加载设置的主题
    var theme = layui.data('scsoft').theme;
    if (theme) {
        layui.link('/static/assets/module/theme/' + theme + '.css');
    }

    // 移除loading动画
    setTimeout(function () {
        admin.removeLoading();
    }, window == top ? 300 : 150);

});


// 获取当前项目的根路径，通过获取layui.js全路径截取assets之前的地址
function getProjectUrl() {
    var layuiDir = layui.cache.dir;
    if (!layuiDir) {
        var js = document.scripts, last = js.length - 1, src;
        for (var i = last; i > 0; i--) {
            if (js[i].readyState === 'interactive') {
                src = js[i].src;
                break;
            }
        }
        var jsPath = src || js[last].src;
        layuiDir = jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
        // console.info(layuiDir);
    }
    return layuiDir.substring(0, layuiDir.indexOf('assets'));
}

//给echarts图形的tooltip加单位
function addUnit(name) {
    switch (name) {
        case '烟尘':
            return '(kg)';
        case '二氧化硫':
            return '(kg)';
        case '氮氧化物':
            return '(kg)';
        case '总排放量':
            return '(kg)';
        case '污染源-烟尘':
            return '(kg)';
        case '污染源-二氧化硫':
            return '(kg)';
        case '污染源-氮氧化物':
            return '(kg)';
        case '污染源-总排放量':
            return '(kg)';
        case '周边污染源-烟尘':
            return '(kg)';
        case '周边污染源-二氧化硫':
            return '(kg)';
        case '周边污染源-氮氧化物':
            return '(kg)';
        case '周边污染源-总排放量':
            return '(kg)';
        case 'PM2.5':
            return '(ug/m3)';
        case 'SO2':
            return '(ug/m3)';
        case 'NO2':
            return '(ug/m3)';
        case '大气-PM2.5':
            return '(ug/m3)';
        case '大气-SO2':
            return '(ug/m3)';
        case '大气-NO2':
            return '(ug/m3)';
        case '大气-PM10':
            return '(ug/m3)';
        case '大气-O3':
            return '(ug/m3)';
        case '大气-CO':
            return '(mg/m3)';
        case '大气-风速':
            return '(m/s)';
        case '大气-湿度':
            return '(%)';
        case 'PM10':
            return '(ug/m3)';
        case 'O3':
            return '(ug/m3)';
        case 'CO':
            return '(mg/m3)';
        case '风速':
            return '(m/s)';
        case '湿度':
            return '(%)';
        case '排放强度':
            return '(mg/m2)';
        default:
            break;
    }
}

//根据公里数动态设置地图层级
function setMapLevel(mileage) {
    if (mileage >= 1 && mileage <= 5) {
        return 14
    } else if (mileage > 6 && mileage <= 10) {
        return 13
    } else if (mileage > 10 && mileage <= 20) {
        return 12
    } else {
        return 11
    }
}

//数组对象根据某一属性进行去重
function filterByName(data, name) {   //data是json对象，Name是根据什么字段去重
    var dest = [];
    for (var i = 0; i < data.length; i++) {
        var ai = data[i];
        if (i == 0) {
            dest.push(ai);
        } else {
            var filterData = dest.filter(function (e) {
                return e[name] == ai[name];
            })
            if (filterData.length == 0) {
                dest.push(ai);
            }
        }
    }
    return dest;
}
