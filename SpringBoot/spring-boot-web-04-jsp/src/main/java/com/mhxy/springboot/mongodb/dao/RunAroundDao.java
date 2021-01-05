package com.mhxy.springboot.mongodb.dao;


import com.mhxy.springboot.mongodb.demo.RunAround;
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

import java.math.BigDecimal;
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
        System.out.println(runAround.getId());
        System.out.println(runAround.getSearchPerson());
        Query query = new Query(Criteria.where("_id").is(runAround.getId()));
        Update update = new Update().set("searchPerson", runAround.getSearchPerson());
        update.set("aroundNum",runAround.getAroundNum());
        update.set("score",runAround.getScore());
        update.set("sixwq", runAround.getSixwq());
        update.set("sixzb", runAround.getSixzb());
        update.set("sevenwq", runAround.getSevenwq());
        update.set("sevenzb", runAround.getSevenzb());
        update.set("eightwq", runAround.getEightwq());
        update.set("eightzb", runAround.getEightzb());
        update.set("by", runAround.getBy());
        update.set("zhiBy", runAround.getZhiBy());
        update.set("moneyForMH", runAround.getMoneyForMH());
        update.set("goldPrice", runAround.getGoldPrice());
        update.set("moneyForRMB", runAround.getMoneyForRMB());
        update.set("flower", runAround.getFlower());
        mongoTemplate.updateFirst(query, update, RunAround.class);
    }


    /**
     * 分页查询
     * @param pageNum 页数
     * @param pageSize 每页数量
     * @param sortField 排序字段
     * @return pages
     */
    public Page<RunAround> findRunAroundPagination(Integer pageNum, Integer pageSize, String sortField,String userName) {
        SpringPageable pageable = new SpringPageable();
        PageModel pm = new PageModel();
        if("".equals(userName)){
            return null;
        }
        //条件查询1，多条件is("值")后面可以加and("字段2").is("值2")
        Query query = new Query(Criteria.where("userName").is(userName));
        Sort sort = new Sort(Sort.Direction.DESC,sortField);
        pm.setPagenumber(pageNum);
        pm.setPagesize(pageSize);
        pm.setSort(sort);
        pageable.setPage(pm);
        Long count = mongoTemplate.count(query, RunAround.class);
        List<RunAround> list = mongoTemplate.find(query.with(pageable), RunAround.class,"run_around");
        for (RunAround r:list) {
            if(r.getAroundNum()==0){
                r.setAvgAround(0);
            }else{
                double i = r.getMoneyForMH()/r.getAroundNum();
                BigDecimal   b   =   new BigDecimal(i);
                double   f1   =   b.setScale(2,   BigDecimal.ROUND_HALF_UP).doubleValue();
                r.setAvgAround(f1);
            }
            if(!"".equals(r.getGoldPrice())){
                double rmb =r.getGoldPrice()*r.getMoneyForMH();
                BigDecimal   b   =   new BigDecimal(rmb);
                double   f1   =   b.setScale(2,   BigDecimal.ROUND_HALF_UP).doubleValue();
                r.setMoneyForRMB(f1);
            }
        }

        return new PageImpl<>(list, pageable, count);
    }
    /**
     * 删除RunAround
     *
     * @param id id
     */
    public void deleteRunAroundById(String id) {
        Query query = new Query(Criteria.where("_id").is(id));
        mongoTemplate.remove(query, RunAround.class);
    }

}
