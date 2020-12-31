package com.mhxy.springboot.controller;

import com.mhxy.springboot.commons.ResJson;
import com.mhxy.springboot.mongodb.dao.RunAroundDao;
import com.mhxy.springboot.mongodb.demo.RunAround;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author wxl
 * @date 2020/12/30 14:36
 */
@Controller
@RequestMapping("/mhxyRunAround")
public class RunAroundController {
    @Autowired
    private RunAroundDao runAroundDao;
    @GetMapping("/queryRunAround")
    @ResponseBody
    public ResJson queryRunAround(RunAround runAround){
        int page = runAround.getPage();
        int limit = runAround.getLimit();
        Page<RunAround> arounds = runAroundDao.findRunAroundPagination(page, limit, "aroundNum");
        return ResJson.ok(200, "查询成功!", arounds);
    }

    @GetMapping("/saveRunAround")
    @ResponseBody
    public ResJson saveRunAround(RunAround runAround){
        runAroundDao.saveRunAroundTable(runAround);
        return ResJson.ok(200, "添加成功!", 1);
    }

    @GetMapping("/updateRunAround")
    @ResponseBody
    public ResJson updateRunAround(RunAround runAround){
        runAroundDao.updateRunAround(runAround);
        return ResJson.ok(200, "更新成功!", 1);
    }



}
