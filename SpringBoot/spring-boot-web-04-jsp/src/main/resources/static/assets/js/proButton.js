layui.use(['layer','element','admin','form'], function () {
    var element = layui.element;
    var form = layui.form;
    var $ = layui.jquery;
    var layer = layui.layer;
    var admin = layui.admin;
    var data = admin.getTempData("t_todo");//该流程实例缓存data
    //其他参数
    var proIns=data.proInstId;//流程实例ID
    var businessId=data.businessId;//公文id
    var taskDefinitionKey=data.taskDefinitionKey;//节点流程定义id
    var taskId=data.taskId;//任务ID
    var defineId=data.proDefId;//流程定义ID
    $('#tijiao').on('click', function(){
        var layHref = $(this).attr("lay-href");
        layer.open({
            type:2,
            title: "节点办理",
            area:  ['600px', '500px'],
            id:'LAY_layuipro',
            content:layHref+"?taskId="+taskId+"&defineId="+defineId+"&taskDefinitionKey="+taskDefinitionKey,
            btn: ['确定', '取消'],
            yes: function(index, layero){
                var nodeCheckedTitle = $(layero).find("iframe")[0].contentWindow.nodeCheckedTitle;
                var nodeHandlerCheckedValue = $(layero).find("iframe")[0].contentWindow.nodeHandlerCheckedValue;
                var handleType = $(layero).find("iframe")[0].contentWindow.handleType;
                // 获取子页面 DOM　元素
                var iframeBody = layer.getChildFrame('body',index);
                var iframeOpinions = iframeBody.find('#opinions').val();
                if(nodeCheckedTitle==""){
                    layer.msg("未选择下级节点，请选择！", {icon: 2});
                    return false;
                }
                if(nodeHandlerCheckedValue.length==0){
                    layer.msg("未选择办理人，请选择！", {icon: 2});
                    return false;
                }
                layer.confirm('确定要提交么?', function(index){
                    layer.load(2);
                    $.post('/process/handle/submitPro', {

                        "taskId":data.taskId,"nodeName":nodeCheckedTitle,
                        "assignees":nodeHandlerCheckedValue.join(","),"handleType":handleType,
                        "message":iframeOpinions
                    }, function (data) {
                        layer.closeAll('loading');
                        if (data.code == 200) {
                            layer.msg(data.msg, {icon: 1});
                        } else {
                            layer.msg(data.msg, {icon: 2});
                        }
                        admin.putTempData("formOk", true);
                        layer.closeAll();
                        var index = parent.parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.parent.layer.close(index); //再执行关闭
                    });
                });
            }
        });
    });
    //打印
    $('#print').on('click', function(){
        var layHref = $(this).attr("lay-href");
        top.layer.open({
            type: 2,
            title: '打印',
            area: ['100%', '100%'],
            maxmin: true,
            content: layHref+businessId
        });
    });
    //查看正文
    $('#ckzw').on('click', function(){
        var layHref = $(this).attr("lay-href");
        top.layer.open({
            type: 2,
            title: '查看正文',
            area: ['100%', '100%'],
            maxmin: true,
            content: layHref+businessId
        });
    });
    //编辑正文
    $('#bianji1').on('click', function(){
        var layHref = $(this).attr("lay-href");
        top.layer.open({
            type: 2,
            title: '编辑正文',
            area: ['100%', '100%'],
            maxmin: true,
            content: layHref+businessId
        });
    });
    //套模板
    $('#tmb').on('click', function(){
        var layHref = $(this).attr("lay-href");
        top.layer.open({
            type: 2,
            title: '套模板',
            area: ['100%', '100%'],
            maxmin: true,
            content: layHref+businessId
        });
    });
    //ofd转版
    $('#ofdzb').on('click', function(){
        var layHref = $(this).attr("lay-href");
        top.layer.open({
            type: 2,
            title: 'ofd转版',
            area: ['100%', '100%'],
            maxmin: true,
            content: layHref+businessId
        });
    });
    //ofd查看
    $('#ofdck').on('click', function(){
        var layHref = $(this).attr("lay-href");
        top.layer.open({
            type: 2,
            title: 'ofd查看',
            area: ['100%', '100%'],
            maxmin: true,
            content: layHref+businessId
        });
    });
    //自由跳转
    $('#zytz').on('click', function(){
        var layHref = $(this).attr("lay-href");
        layer.open({
            type:2,
            title: "自由跳转",
            area:  ['600px', '500px'],
            id:'LAY_layuipro',
            content:layHref+"?taskId="+taskId+"&defineId="+defineId+"&taskDefinitionKey="+taskDefinitionKey,
            btn: ['确定', '取消'],
            yes: function(index, layero){
                var nodeCheckedTitle = $(layero).find("iframe")[0].contentWindow.nodeCheckedTitle;
                var nodeCheckedValue = $(layero).find("iframe")[0].contentWindow.nodeCheckedValue;
                var nodeHandlerCheckedValue = $(layero).find("iframe")[0].contentWindow.nodeHandlerCheckedValue;
                var handleType = $(layero).find("iframe")[0].contentWindow.handleType;
                // 获取子页面 DOM　元素
                var iframeBody = layer.getChildFrame('body',index);
                var iframeOpinions = iframeBody.find('#opinions').val();
                if(nodeCheckedTitle==""){
                    layer.msg("未选择下级节点，请选择！", {icon: 2});
                    return false;
                }
                if(nodeHandlerCheckedValue.length==0){
                    layer.msg("未选择办理人，请选择！", {icon: 2});
                    return false;
                }
                layer.confirm('确定要提交么?', function(index){
                    layer.load(2);
                    $.post('/process/handle/randomComitProcess', {
                        "taskId":data.taskId,"activityId":nodeCheckedValue,
                        "assignees":nodeHandlerCheckedValue.join(","),"handleType":handleType,
                        "message":iframeOpinions
                    }, function (data) {
                        layer.closeAll('loading');
                        if (data.code == 200) {
                            layer.msg(data.msg, {icon: 1});
                        } else {
                            layer.msg(data.msg, {icon: 2});
                        }
                        admin.putTempData("formOk", true);
                        layer.closeAll();
                        var index = parent.parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.parent.layer.close(index); //再执行关闭
                    });
                });
            }
        });
    });
    //退回
    $('#tuihui').on('click', function(){
        var layHref = $(this).attr("lay-href");
        layer.open({
            type: 2,
            title: '退回',
            area:  ['500px', '400px'],
            maxmin: true,
            content: layHref+"?taskId="+taskId,
            btn: ['退回', '取消'],
            yes: function(index, layero){
                 // 获取子页面 DOM　元素
                var iframeBody = layer.getChildFrame('body',index);
                var iframeOpinions = iframeBody.find('#opinions').val();
                 var taskId = data.taskId;
                 layer.confirm('确定要退回么?', function(index){
                     layer.load(2);
                     $.post('/process/handle/backProcess', {
                         "taskId":taskId,
                         "message":iframeOpinions
                     }, function (data) {
                         layer.closeAll('loading');
                         if (data.code == 200) {
                             layer.msg(data.msg, {icon: 1});
                         } else {
                             layer.msg(data.msg, {icon: 2});
                         }
                         admin.putTempData("formOk", true);
                         layer.closeAll();
                         var index = parent.parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                         parent.parent.layer.close(index); //再执行关闭
                     });
                 });
             }
        });
    });
    //任意退回
    $('#ryth').on('click', function(){
        var layHref = $(this).attr("lay-href");
        layer.open({
            type: 2,
            title: '任意退回',
            area:  ['600px', '500px'],
            maxmin: true,
            content: layHref+"?taskId="+taskId,
            btn: ['退回', '取消'],
            yes: function(index, layero){
                var nodeCheckedValue = $(layero).find("iframe")[0].contentWindow.nodeCheckedValue;
                // 获取子页面 DOM　元素
                var iframeBody = layer.getChildFrame('body',index);
                var iframeOpinions = iframeBody.find('#opinions').val();
                layer.confirm('确定要退回么?', function(index){
                    layer.load(2);
                    $.post('/process/handle/randomBackProcess', {
                        "taskId":data.taskId,
                        "activityId":nodeCheckedValue,
                        "message":iframeOpinions
                    }, function (data) {
                        layer.closeAll('loading');
                        if (data.code == 200) {
                            layer.msg(data.msg, {icon: 1});
                        } else {
                            layer.msg(data.msg, {icon: 2});
                        }
                        admin.putTempData("formOk", true);
                        layer.closeAll();
                        var index = parent.parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.parent.layer.close(index); //再执行关闭
                    });
                });
            }
        });
    });
    //暂存
    $('#zancun').on('click', function(){
        var layHref = $(this).attr("lay-href");
        top.layer.open({
            type: 2,
            title: '暂存',
            area: ['100%', '100%'],
            maxmin: true,
            content: layHref
        });
    });
    //转办
    $('#zhuanban').on('click', function(){
        var layHref = $(this).attr("lay-href");
        layer.open({
            type: 2,
            title: '转办',
            area: ['600px', '500px'],
            maxmin: true,
            content: layHref,
            btn: ['转办', '取消'],
            yes: function(index, layero){
                var nodeHandlerCheckedValue = $(layero).find("iframe")[0].contentWindow.nodeHandlerCheckedValue;

                if (nodeHandlerCheckedValue.length==0){
                    layer.msg("未选择办理人，请重新选择！", {icon: 2});
                    return false;
                }
                if (nodeHandlerCheckedValue.length>1){
                    layer.msg("只能选择一个办理人！", {icon: 2});
                    return false;
                }
                // 获取子页面 DOM　元素
                var iframeBody = layer.getChildFrame('body',index);
                var iframeOpinions = iframeBody.find('#opinions').val();
                layer.confirm('确定要转办么?', function(index){
                    layer.load(2);
                    $.post('/process/handle/transfer', {
                        "taskId":data.taskId,
                        "assignee":nodeHandlerCheckedValue[0],
                        "message":iframeOpinions
                    }, function (data) {
                        layer.closeAll('loading');
                        if (data.code == 200) {
                            layer.msg(data.msg, {icon: 1});
                        } else {
                            layer.msg(data.msg, {icon: 2});
                        }
                        admin.putTempData("formOk", true);
                        layer.closeAll();
                        var index = parent.parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.parent.layer.close(index); //再执行关闭
                    });
                });
            }
        });
    });
    //挂起
    $('#guaqi').on('click', function(){
        var layHref = $(this).attr("lay-href");
        layer.confirm('确定要挂起流程吗？', function (index) {
            layer.close(index);
            layer.load(2);
            $.post(layHref, {
                "proIns":proIns,
                "state":false
            }, function (data) {
                layer.closeAll('loading');
                if (data.code == 200) {
                    layer.msg(data.msg, {icon: 1});
                } else {
                    layer.msg(data.msg, {icon: 2});
                }
                admin.putTempData("formOk", true);
                layer.closeAll();
                var index = parent.parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                parent.parent.layer.close(index); //再执行关闭
            });
        });
    });
    //终止
    $('#zhongzhi').on('click', function(){
        var layHref = $(this).attr("lay-href");
        layer.open({
            type: 2,
            title: '终止',
            area:  ['500px', '400px'],
            maxmin: true,
            content: layHref+"?taskId="+taskId,
            btn: ['终止', '取消'],
            yes: function(index, layero){
                var iframeBody = layer.getChildFrame('body',index);
                var iframeOpinions = iframeBody.find('#opinions').val();
                var taskId = data.taskId;
                layer.confirm('确定要终止么?', function(index){
                    layer.load(2);
                    $.post('/process/handle/endProcess', {
                        "taskId":taskId,
                        "message":iframeOpinions
                    }, function (data) {
                        layer.closeAll('loading');
                        if (data.code == 200) {
                            layer.msg(data.msg, {icon: 1});
                        } else {
                            layer.msg(data.msg, {icon: 2});
                        }
                        admin.putTempData("formOk", true);
                        layer.closeAll();
                        var index = parent.parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.parent.layer.close(index); //再执行关闭
                    });
                });
            }
        });
    });
    //办结
    $('#banjie').on('click', function(){
        var layHref = $(this).attr("lay-href");
        layer.open({
            type: 2,
            title: '办结',
            area:  ['500px', '400px'],
            maxmin: true,
            content: layHref+"?taskId="+taskId,
            btn: ['办结', '取消'],
            yes: function(index, layero){
                var iframeBody = layer.getChildFrame('body',index);
                var iframeOpinions = iframeBody.find('#opinions').val();
                var taskId = data.taskId;
                layer.confirm('确定要办结么?', function(index){
                    layer.load(2);
                    $.post('/process/handle/endProcess', {
                        "taskId":taskId,
                        "message":iframeOpinions
                    }, function (data) {
                        layer.closeAll('loading');
                        if (data.code == 200) {
                            layer.msg(data.msg, {icon: 1});
                        } else {
                            layer.msg(data.msg, {icon: 2});
                        }
                        admin.putTempData("formOk", true);
                        layer.closeAll();
                        var index = parent.parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.parent.layer.close(index); //再执行关闭
                    });
                });
            }
        });
    });
    //撤回
    $('#chehui').on('click', function(){
        var layHref = $(this).attr("lay-href");
        layer.open({
            type: 2,
            title: '撤回',
            area:  ['500px', '400px'],
            maxmin: true,
            content: layHref+"?taskId="+taskId,
            btn: ['撤回', '取消'],
            yes: function(index, layero){
                // 获取子页面 DOM　元素
                var iframeBody = layer.getChildFrame('body',index);
                var iframeOpinions = iframeBody.find('#opinions').val();
                var taskId = data.taskId;
                layer.confirm('确定要撤回么?', function(index){
                    layer.load(2);
                    $.post('/process/handle/callBackProcess', {
                        "taskId":taskId,
                        "message":iframeOpinions
                    }, function (data) {
                        layer.closeAll('loading');
                        if (data.code == 200) {
                            layer.msg(data.msg, {icon: 1});
                        } else {
                            layer.msg(data.msg, {icon: 2});
                        }
                        admin.putTempData("formOk", true);
                        layer.closeAll();
                        var index = parent.parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.parent.layer.close(index); //再执行关闭
                    });
                });
            }
        });
    });

    //关闭
    $('#guanbi').on('click', function(){
        parent.layer.close(parent.layer.getFrameIndex(window.name));
    });
    //交办
    $('#jiaoban').on('click', function(){
        var layHref = $(this).attr("lay-href");
        layer.load(2);
        $.post(layHref, {
            "taskId":taskId,
            "userId":"1239361268550197250"
        }, function (data) {
            layer.closeAll('loading');
            if (data.code == 200) {
                layer.msg(data.msg, {icon: 1});
            } else {
                layer.msg(data.msg, {icon: 2});
            }
            layer.closeAll();
        });
    });


});
