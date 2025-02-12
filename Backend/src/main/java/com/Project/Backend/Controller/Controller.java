package com.Project.Backend.Controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class Controller {
    @GetMapping("/")
    public String test() {
        return "Hello World!";
    }

}