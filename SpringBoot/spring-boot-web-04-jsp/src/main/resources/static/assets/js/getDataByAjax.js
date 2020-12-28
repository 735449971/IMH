/*
* author wangbx
* purpose 封装ajax获取数据方法以及一些公共函数
* date 20200820
* */

//获取数据
/*
* url:接口地址
* paras：接口参数
* requestType：数据请求方法（GET、POST）
* isAsync: 请求方式 (异步：true，同步：false)
* contentType 内容编码类型(默认值：application/x-www-form-urlencoded，json：application/json)
* callback：回调函数
* */
function getDataByAjax(url,paras,requestType,isAsync,contentType,callback) {
    var result = "";
    $.ajax({
        url: url,
        data: paras,
        type: requestType,
        timeout: 0,
        async: isAsync,
        contentType:contentType,
        beforeSend:function(){
            layer.load(2);
        },
        success: function (initData) {
            layer.closeAll('loading');
            if(initData.code == 200 || initData.code == 0){
                if( initData.data){
                    if (callback) {
                        callback(initData);
                    }
                    result = initData;
                }
            }
        },
        error: function (e) {
            //layer.alert(e.responseText);
        },
        complete:function () {
            layer.closeAll('loading');
        }
    });
    return result;
}

//多维数组去重
function uniq(array){
    // var temp = []; //一个新的临时数组
    // for(var i = 0; i < array.length; i++){
    //     if(temp.indexOf(array[i]) == -1){
    //         temp.push(array[i]);
    //     }
    // }
    // return temp;
    var obj = {},
        result = [],
        len = array.length;
    for(var i = 0; i<len; i++){
        if(Object.prototype.toString.call(array[i])=='[object Array]'){
            if(!obj[array[i]]){
                obj[array[i]] = 'seat'; //seat占位 没有具体作用
                result.push(uniq(array[i])); //递归再次过滤
            }
        }else{
            if(result.indexOf(array[i]) == -1){
                result.push(array[i]);
            }
        }
    }
    return result;
}

//转换颜色、文字
function getControlInfo(value,type) {
    if(type=='color'){
        return value==0?'green':value==1?'red':value==2?'orange':'yellow';
    }else if(type=='name'){
        return value=='未启动'?'green':value=='红色预警'?'red':value=='橙色预警'?'orange':'yellow';
    }else if(type=='text'){
        return value==0?'未启动':value==1?'红色预警':value==2?'橙色预警':'黄色预警';
    }
}