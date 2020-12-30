package com.mhxy.springboot.commons;

/**
 * @author wxl
 * @date 2020/12/30 14:40
 */
public class ResJson<T> {

    /**http 状态码*/
    private int code;
    /**返回信息*/
    private String msg;
    /**返回的数据*/
    private T data;
    public ResJson() {
    }
    public ResJson(int code, String msg, T data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }
    public ResJson(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }
    public static ResJson ok() {
        return ok("操作成功",new Object());
    }
    public static ResJson ok(String message) {
        return ok(message,new Object());
    }
    public static ResJson ok(String message,Object data) {
        return ok(200, message,data);
    }
    public static ResJson ok(HttpStatus http) {
        return ok(http.code(),http.msg(),new Object());
    }
    public static ResJson ok(HttpStatus http,Object data) {
        return ok(http.code(),http.msg(),data);
    }
    public static ResJson ok(int code, String message,Object data) {
        ResJson jsonResult = new ResJson();
        jsonResult.setCode(code);
        jsonResult.setMsg(message);
        jsonResult.setData(data);
        return jsonResult;
    }

    public static ResJson error() {
        return error("操作失败");
    }

    public static ResJson error(String messag) {
        return error(501, messag,new Object());
    }
    public static ResJson error(HttpStatus http, Exception e) {
        return ok(http.code(),http.msg(), CommonUtil.getExceptionMsg(e));
    }
    public static ResJson error(int code, String message,Object data) {
        return ok(code, message,data);
    }


    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public Object getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
