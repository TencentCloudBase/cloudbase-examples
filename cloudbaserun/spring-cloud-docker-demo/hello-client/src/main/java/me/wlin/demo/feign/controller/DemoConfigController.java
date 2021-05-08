package me.wlin.demo.feign.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
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
@RefreshScope
@RequestMapping("/demo")
public class DemoConfigController {

    @Value("${foo}")
    String foo;

    //@Value("${sever.port}")
    //String port;

    @RequestMapping("/config/foo")
    public String getFoo(){
        return foo;
    }

    //@RequestMapping("/config/port")
    //public String getPort(){
    //    return port;
    //}

}
