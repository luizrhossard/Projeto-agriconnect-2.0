package com.agricultura;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ProjetoSpringApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjetoSpringApplication.class, args);
    }
}
