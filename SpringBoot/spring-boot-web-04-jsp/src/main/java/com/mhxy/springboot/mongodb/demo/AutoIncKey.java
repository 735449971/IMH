package com.mhxy.springboot.mongodb.demo;

/**
 * @author wxl
 * @date 2020/12/30 17:21
 */

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @program: wasutv-api
 * @description: springboot-mongodb 自增注解
 * @author: GP_Bao
 * @create: 2020-03-09 15:50
 **/
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AutoIncKey {
}
