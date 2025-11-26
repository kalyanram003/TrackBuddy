package com.kalyan.RemoteWorkTracker.Controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class FrontendController {

    @GetMapping("/{path:^(?!api|swagger-ui|v3|actuator).*$}")
    public String forward() {
        return "forward:/index.html";
    }
}
