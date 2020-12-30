package com.mhxy.springboot.mongodb.dao;



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
 * @author: wy
 */
@Component
public class UserDao {
    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 保存user
     *
     * @param user user
     */
    public void saveUser(User user) {
        mongoTemplate.save(user);
    }
    /**
     * 保存user指定操作表
     *
     * @param user user
     */
    public void saveUserTable(User user) {
        mongoTemplate.save(user,"user_info");
    }

    /**
     * 根据用户名查询user
     *
     * @param userName userName
     * @return user
     */
    public User findUserByUserName(String userName) {
        Query query = new Query(Criteria.where("userName").is(userName));
        return mongoTemplate.findOne(query, User.class);
    }

    /**
     * 更新user
     *
     * @param user user
     */
    public void updateUser(User user) {
        Query query = new Query(Criteria.where("id").is(user.getId()));
        Update update = new Update().set("userName", user.getUserName()).set("password", user.getPassword());
        mongoTemplate.updateFirst(query, update, User.class);
    }

    /**
     * 删除user
     *
     * @param id id
     */
    public void deleteUserById(Long id) {
        Query query = new Query(Criteria.where("id").is(id));
        mongoTemplate.remove(query, User.class);
    }

    /**
     * 分页查询
     * @param pageNum 页数
     * @param pageSize 每页数量
     * @param sortField 排序字段
     * @return pages
     */
    public Page<User> findUserPagination(Integer pageNum, Integer pageSize, String sortField) {
        SpringPageable pageable = new SpringPageable();
        PageModel pm = new PageModel();
        Query query = new Query();
        Sort sort = new Sort(Sort.Direction.DESC,sortField);
        pm.setPagenumber(pageNum);
        pm.setPagesize(pageSize);
        pm.setSort(sort);
        pageable.setPage(pm);
        Long count = mongoTemplate.count(query, User.class);
        List<User> list = mongoTemplate.find(query.with(pageable), User.class);
        return new PageImpl<>(list, pageable, count);
    }
}
