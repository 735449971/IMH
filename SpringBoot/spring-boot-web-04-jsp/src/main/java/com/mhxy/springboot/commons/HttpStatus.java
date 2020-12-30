package com.mhxy.springboot.commons;

public enum HttpStatus {

    OK(200, "请求成功"),
    BAD_REQUEST(400, "请求无效,请稍后重新尝试"),
    TOKEN_UPDATE(401, "Token过期，请更新token"),
    TOKEN_INVALID(402, "Token失效,重新登陆"),
    FORBIDDEN(403, "没有操作权限"),
    NOT_FOUND(404, "找不到服务"),
    CALL_FAILURE(405,"未知异常，返回异常信息"),
    INTERNAL_SERVER_ERROR(500, "服务器出错"),


    APP_VERSION_MISE(600, "有新版本升级，请升级版本"),
    APP_VERSION_NOMISE(601, "没有升级"),



    /*参数错误 10001-19999 */
    PARAM_IS_INVALID(10001, "参数无效"),
    PARAM_IS_BLANK(10002, "参数为空"),
    PARAM_TYPE_BIND_ERROR(10003, "参数类型错误"),
    PARAM_NOT_COMPLETE(10004, "参数缺失"),



    /* 用户错误：20001-29999*/
    USER_NOT_LOGGED_IN(20001, "用户未登录"),
    USER_LOGIN_ERROR(20002, "账号不存在或密码错误"),
    USER_ACCOUNT_FORBIDDEN(20003, "账号已被禁用"),
    USER_NOT_EXIST(20004, "用户不存在"),
    USER_HAS_EXISTED(20005, "用户已存在"),
    Cert_HAS_EXISTED(20006, "认证已存在"),
    APP_PORTAL_NO(20007, "用户名下无门户，使用默认门户"),
    /* 接口错误：60001-69999 */
    INTERFACE_INNER_INVOKE_ERROR(60001, "内部系统接口调用异常"),
    INTERFACE_OUTTER_INVOKE_ERROR(60002, "外部系统接口调用异常"),
    INTERFACE_FORBID_VISIT(60003, "该接口禁止访问"),
    INTERFACE_ADDRESS_INVALID(60004, "接口地址无效"),
    INTERFACE_REQUEST_TIMEOUT(60005, "接口请求超时"),

    INTERFACE_EXCEED_LOAD(60006, "接口负载过高");


    private int code;

    private String msg;

    HttpStatus(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public int code() {
        return code;
    }

    public String msg() {
        return msg;
    }
}
