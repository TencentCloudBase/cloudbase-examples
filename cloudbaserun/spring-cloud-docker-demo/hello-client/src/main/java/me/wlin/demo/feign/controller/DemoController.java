package me.wlin.demo.feign.controller;

import feign.Param;
import me.wlin.demo.feign.service.DemoServiceCaller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 类名称：HelloController
 * 类描述： ${DESCRIPTION}
 *
 * @author wlin
 * @version 1.0
 * @since 2018/1/3
 */
@RestController
@RequestMapping("/client")
public class DemoController {

    @Autowired
    DemoServiceCaller demoServiceCaller;

    @Value("${foo}")
    String foo;


    @RequestMapping("/config/foo")
    public String getFoo(){
        return foo;
    }

    @RequestMapping("/hello")
    public String hi(@Param(value = "name") String name){
        return demoServiceCaller.sayHi(name);
    }

}
