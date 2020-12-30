package com.mhxy.springboot.mongodb.demo;

import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;

/**
 * @Description:
 * @author: wy
 */
public class User implements Serializable {
    private static final long serialVersionUID = -3258839839160856613L;
    @Field("id")
    private Long id;
    @Field("user_name")
    private String userName;
    @Field("password")
    private String password;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", userName='" + userName + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
