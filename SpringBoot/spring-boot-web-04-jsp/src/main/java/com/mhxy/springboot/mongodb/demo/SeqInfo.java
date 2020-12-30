package com.mhxy.springboot.mongodb.demo;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @author wxl
 * @date 2020/12/30 17:31
 */
@Document(collection = "sequence")
@Data
public class SeqInfo {
    @Id
    private String id;//主键
    private String seqId;//序列值
    private String collName;//集合名称
}
