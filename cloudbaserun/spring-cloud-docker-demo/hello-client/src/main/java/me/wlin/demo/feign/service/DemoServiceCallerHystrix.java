package me.wlin.demo.feign.service;

import org.springframework.stereotype.Component;

/**
 * 类名称：DemoServiceCallerHystric
 * 类描述： ${DESCRIPTION}
 *
 * @author wlin
 * @version 1.0
 * @since 2018/1/8
 */
@Component
public class DemoServiceCallerHystrix implements  DemoServiceCaller {

    @Override
    public String sayHi(String name) {
        return "sorry,can not connect!"+name;
    }

}
