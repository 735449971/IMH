package com.mhxy.springboot.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HelloController {
    @GetMapping("/hello")
    public String hello(Model model){
        model.addAttribute("message","这是Controller传过来的message");
        System.out.println("sdfasdQfa");
        return "success";
    }
}
