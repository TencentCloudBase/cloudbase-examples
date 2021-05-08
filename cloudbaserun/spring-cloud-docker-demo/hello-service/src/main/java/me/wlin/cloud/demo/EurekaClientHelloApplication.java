package me.wlin.cloud.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableEurekaClient
@RestController
@RequestMapping("/hello")
public class EurekaClientHelloApplication {

	public static void main(String[] args) {
		SpringApplication.run(EurekaClientHelloApplication.class, args);
	}

	@Value("${server.port}")
	private String port;

	@RequestMapping("")
	public String hello(@RequestParam(value = "name") String name){
		return "hi," + name + ".I'm hello-service from the port " + port;
	}


}
