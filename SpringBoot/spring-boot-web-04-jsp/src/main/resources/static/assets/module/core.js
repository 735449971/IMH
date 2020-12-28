layui.define(["jquery","admin"], function(exports) {
	var $ = layui.jquery;
	var admin = layui.admin;
	var core = {
		dict: function (code, value) {
			var label;
			var data=admin.getTempData(code);
            if (data!='undefined' && data!=null){
				var dict=data[value];
				if (dict!=undefined){
					var sort=dict.sort;
					if (sort>10){
						sort.substring(sort.length-1,sort.length);
					}
					label =" <span class=\"layui-badge dictlable"+sort+" \">" +dict.label+"</span>";
				} else {
					label ="无数据";
				}
				return label;
			} else {
			$.ajax({
				url: '/system/dict/getDicts',
				type: "get",
				dataType: "json",
				async: false,
				data: {
					code: code,
					value: value
				},
				success: function (data) {
					if (data.code=200){
						admin.putTempData(code, data.data);
						var dict=data.data[value];
						if (dict!=undefined){
							var sort=dict.sort;
							if (sort>10){
								sort.substring(sort.length-1,sort.length);
							}
							label =" <span class=\"layui-badge dictlable"+sort+" \">" +dict.label+"</span>";
						} else {

							label ="!!无数据";
						}
					}else{
						label ="无此字典组";
					}

					msg = data.msg;
				}
			});
			return label;
		}
		},

		dictLable: function (code, value) {
			var label;

				$.ajax({
					url: '/system/dict/getLable',
					type: "get",
					dataType: "json",
					async: false,
					data: {
						code: code,
						value: value
					},
					success: function (data) {
						if (data.code=200){
							var sort=data.data.sort;
							if (sort>10){
								sort.substring(sort.length-1,sort.length);
							}
							label =" <span class=\"layui-badge dictlable"+sort+" \">" +data.data.label+"</span>";
						}else{
							label ="";
						}

						msg = data.msg;
					}
				});
				return label;
			}
	};
	exports("core", core);
});