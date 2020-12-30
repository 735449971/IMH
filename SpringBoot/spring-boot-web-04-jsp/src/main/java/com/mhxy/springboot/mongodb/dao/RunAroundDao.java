package com.mhxy.springboot.mongodb.dao;


import com.mhxy.springboot.mongodb.demo.RunAround;
import com.mhxy.springboot.mongodb.demo.User;
import com.mhxy.springboot.mongodb.page.PageModel;
import com.mhxy.springboot.mongodb.page.SpringPageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

import java.util.List;


/**
 * @Description:
 * @author: wxl
 */
@Component
public class RunAroundDao {
    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 保存runAround
     *
     * @param runAround runAround
     */
    public void saveRunAround(RunAround runAround) {
        mongoTemplate.save(runAround);
    }

    /**
     * 保存runAround指定操作表
     *
     * @param runAround
     */
    public void saveRunAroundTable(RunAround runAround) {
        mongoTemplate.save(runAround,"run_around");
    }

    /**
     * 更新runAround
     *
     * @param runAround runAround
     */
    public void updateRunAround(RunAround runAround) {
        Query query = new Query(Criteria.where("id").is(runAround.getId()));
        Update update = new Update().set("searchPerson", runAround.getSearchPerson());
        mongoTemplate.updateFirst(query, update, User.class);
    }


    /**
     * 分页查询
     * @param pageNum 页数
     * @param pageSize 每页数量
     * @param sortField 排序字段
     * @return pages
     */
    public Page<RunAround> findRunAroundPagination(Integer pageNum, Integer pageSize, String sortField) {
        SpringPageable pageable = new SpringPageable();
        PageModel pm = new PageModel();
        Query query = new Query();
        Sort sort = new Sort(Sort.Direction.DESC,sortField);
        pm.setPagenumber(pageNum);
        pm.setPagesize(pageSize);
        pm.setSort(sort);
        pageable.setPage(pm);
        Long count = mongoTemplate.count(query, RunAround.class);
        List<RunAround> list = mongoTemplate.find(query.with(pageable), RunAround.class,"run_around");
        return new PageImpl<>(list, pageable, count);
    }

}
