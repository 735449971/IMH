package com.mhxy.springboot.controller;

import com.mhxy.springboot.mongodb.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HelloController {
    @Autowired
    private UserDao userDao;
    @GetMapping("/hello")
    public String hello(Model model){
//        User user = new User();
//        user.setUserName("zs");
//        user.setPassword("123456");
//        userDao.saveUser(user);
//        User zs = userDao.findUserByUserName("zs");
//        System.out.println(user);
        model.addAttribute("message","这是Controller传过来的message");
        return "imh/runAround";
    }


}
