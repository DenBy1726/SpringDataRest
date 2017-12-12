package hello.controller;

import hello.model.Credential;
import hello.repository.CredentialRepository;
import hello.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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


    @Autowired
    CredentialRepository userRepository;


    @RequestMapping(value="/me",method = RequestMethod.GET)
    @ResponseBody
    public Object getRoles(){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal.getClass() != User.class)
            return principal;
        User user = (User)principal;
        String name = user.getUsername();
        Credential userInfo = userRepository.findByLogin(name);
        return userInfo.getUser();
    }



}
