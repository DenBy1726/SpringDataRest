package hello.controller;

import hello.model.Credential;
import hello.model.Role;
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
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

@RestController
@RequestMapping(value="/auth/v1")
public class Controller {


    @Autowired
    CredentialRepository userRepository;


    @RequestMapping(value="/me",method = RequestMethod.GET)
    @ResponseBody
    public Object getRoles(){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal.getClass() != User.class) {
            if(principal.getClass() != String.class)
                return principal;
            hello.model.User user = new hello.model.User();
            hello.model.Role role = new hello.model.Role();
            role.setName("ANONIM");
            Set<Role> roles = new HashSet<Role>();
            roles.add(role);
            user.setRole(roles);
            return user;
        }


        User user = (User)principal;
        String name = user.getUsername();
        Credential userInfo = userRepository.findByLogin(name);
        return userInfo.getUser();
    }



}
