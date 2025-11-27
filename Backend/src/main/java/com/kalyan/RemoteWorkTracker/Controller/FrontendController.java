package com.kalyan.RemoteWorkTracker.Controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class FrontendController {

    // Handle root path explicitly
    @GetMapping("/")
    public String index() {
        return "forward:/index.html";
    }

    // Handle all other SPA routes (except API, Swagger, etc.)
    @GetMapping("/{path:^(?!rwt|swagger-ui|v3|actuator).*$}")
    public String forward() {
        return "forward:/index.html";
    }
}
