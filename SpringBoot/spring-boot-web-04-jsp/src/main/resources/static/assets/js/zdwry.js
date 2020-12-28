var $,form;
layui.use(['index','form'], function () {
    $ = layui.jquery;
    form = layui.form;
});

// 根据地市编码获取县
function getMonitorCityFunction(elem, regionCode) {
    var option='<option value="">请选择</option>';
    $.ajax({
        url: '/urgent/region/findCityRegionName',
        type: 'GET',
        async:false,
        data: {
            regionCode:regionCode
        },
        success: function(data) {
            $("#"+elem).empty();
            if(data && data.length>0){
                $.each(data, function(index,value) {
                    option += "<option value="+value.regionCode+">"+value.regionName+"</option>";
                });
                $("#"+elem).append(option);
            }
            form.render();
        }
    });
};

/**
 * 根据地市，县区和企业名称获取企业信息
 * @param el 该控件绑定的div的id
 * @param elem1 返回值绑定的企业编码
 * @param elem2 返回值绑定的企业名称
 * @param regionCode 地市编码
 * @param areaCode 县区编码
 */
function getEnterpriseInfo(el,elem1,elem2,regionCode,areaCode){
    $.get("/automonitor/enterprise/list",{regionCode:regionCode,areaCode:areaCode,psName:''},function (jsonData) {
        if(jsonData && jsonData.length>0){
            var i = 0;
            while(i < jsonData.length){
                jsonData[i]["value"] = jsonData[i]['psCode'];
                jsonData[i]["name"] = jsonData[i]['psName'];
                delete jsonData[i]["psCode"];
                delete jsonData[i]["psName"];
                i++;
            }
        }

        //搜索下拉框
        xmSelect.render({
            el: '#'+el,
            delay: 800,//输入停止800毫秒后进行搜索过滤
            autoRow: true,//是否开启自动换行(选项过多时)
            toolbar: { show: false },//去除全选和清除
            filterable: true,//是否开启搜索
            remoteSearch: true,//远程搜索
            tips: '请选择企业',//select框提示文字信息
            searchTips: '请输入企业',//搜索提示信息
            //empty: '无数据',//搜索为空时提示信息
            showCount:20,//最大显示数量, 0:不限制
            radio: false,//是否单选
            //clickClose: true,//单选后关闭下拉框
            paging: true,//启用分页
            pageSize:25,//每页多少条
            pageEmptyShow: false,//无数据不展示分页
            data:jsonData,
            remoteMethod: function(val, cb, show){
                //这里如果val为空, 则不触发搜索
                if(!val){
                    return cb([]);
                }
                //从数据库中获取数据xxxxx, 把获取的数据渲染到页面上
                $.get("/automonitor/enterprise/list",{regionCode:$('#regionCode').val(),areaCode:$('#areaCode').val(),psName:val},function (jsonData) {
                    if(jsonData && jsonData.length>0){
                        var i = 0;
                        while(i < jsonData.length){
                            //data格式应为：[{name:,value:},{name:,value:}]
                            jsonData[i]["value"] = jsonData[i]['psCode'];
                            jsonData[i]["name"] = jsonData[i]['psName'];
                            delete jsonData[i]["psCode"];
                            delete jsonData[i]["psName"];
                            i++;
                        }
                    }
                    cb(jsonData)
                },'json');
            },
            on: function (data) {
                //arr:  当前已选中的数据
                var arr = data.arr;
                //change, 此次选择变化的数据,数组
                var change = data.change;
                //isAdd, 此次操作是新增还是删除
                var isAdd = data.isAdd;
                if(arr!==undefined){
                    var psCode=[];
                    var psName=[];
                    for(var i=0,lengths=arr.length;i<lengths;i++){
                        psCode[i]=arr[i].value;
                        psName[i]=arr[i].name;
                    }
                    $("#"+elem1).val(psCode);
                    $("#"+elem2).val(psName);
                }
            }
        });

    },'json');
}

/**
 *  因子靠右显示(因子保留一位小数位显示)
 */
function factorOnRight(elem) {
    if(elem!=undefined && elem!=null && elem!=''){
        return '<div style="text-align: right">'+elem.toFixed(1)+'</div>'
    }else{
        return "";
    }
}

/**
 *  名称类、标题和描述居左，例如：所属行业、企业名称、公文号
 */
function fieldOnLeft(elem) {
    if(elem!=undefined && elem!=null && elem!=''){
        return '<div style="text-align: left">'+elem+'</div>'
    }else{
        return ''
    }
}