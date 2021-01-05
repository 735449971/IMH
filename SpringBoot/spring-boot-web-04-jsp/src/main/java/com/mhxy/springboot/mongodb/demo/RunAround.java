package com.mhxy.springboot.mongodb.demo;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import lombok.Data;

/**
 * @Description:
 * @author: wxl
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "run_around")
public class RunAround implements Serializable {
    @AutoIncKey
    @Id
    private String id;
    @Field("userName")
    private String userName;
    @Field("aroundNum")
    private int aroundNum;
    @Field("searchPerson")
    private int searchPerson;
    @Field("sixwq")
    private int sixwq;
    @Field("sixzb")
    private int sixzb;
    @Field("sevenwq")
    private int sevenwq;
    @Field("sevenzb")
    private int sevenzb;
    @Field("eightwq")
    private int eightwq;
    @Field("eightzb")
    private int eightzb;
    @Field("by")
    private int by;
    @Field("zhiBy")
    private int zhiBy;
    @Field("score")
    private int score;
    @Field("moneyForMH")
    private double moneyForMH;
    @Field("goldPrice")
    private double goldPrice;
    @Field("moneyForRMB")
    private double moneyForRMB;
    @Field("avgAround")
    private double avgAround;
    @Field("flower")
    private int flower;

    private int page;
    private int limit;


    @Override
    public String toString() {
        return "RunAround{" +
                "id=" + id +
                ", aroundNum=" + aroundNum +
                ", searchPerson=" + searchPerson +
                ", sixwq=" + sixwq +
                ", sixzb=" + sixzb +
                ", sevenwq=" + sevenwq +
                ", sevenzb=" + sevenzb +
                ", eightwq=" + eightwq +
                ", eightzb=" + eightzb +
                ", by=" + by +
                ", zhiBy=" + zhiBy +
                ", score=" + score +
                ", moneyForMH=" + moneyForMH +
                ", goldPrice=" + goldPrice +
                ", moneyForRMB=" + moneyForRMB +
                ", page=" + page +
                ", limit=" + limit +
                '}';
    }
}
