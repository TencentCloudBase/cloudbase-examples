package me.wlin.demo.feign.service;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 类名称：DemoServiceCaller
 * 类描述： ${DESCRIPTION}
 *
 * @author wlin
 * @version 1.0
 * @since 2018/1/3
 */
@FeignClient(value = "hello-service",fallback = DemoServiceCallerHystrix.class)
public interface DemoServiceCaller {

    @RequestMapping(value = "/hello",method = RequestMethod.GET)
    String sayHi(@RequestParam(value = "name") String name);

}
