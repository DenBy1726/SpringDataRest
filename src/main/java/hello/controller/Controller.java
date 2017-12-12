package hello.controller;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping(value="/auth/v1")
public class Controller {

    @RequestMapping(value="/me",method = RequestMethod.GET)
    @ResponseBody
    public Object getRoles(){
        Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return user;
    }



}
