package hello.controller;

import hello.model.Credential;
import hello.model.Role;
import hello.repository.CredentialRepository;
import hello.repository.RoleRepository;
import hello.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;

@RestController
@RequestMapping(value="/auth/v1")
public class Controller {


    @Autowired
    CredentialRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    @Qualifier("authenticationManager")
    AuthenticationManager authenticationManager;


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

    @RequestMapping(value="/registration",method = RequestMethod.POST)
    @ResponseBody
    public Boolean registration(@RequestBody Credential credential,HttpServletRequest request) throws Exception {
        if(credential.getPassword().equals(credential.getPasswordAgain()) == false){
            throw new Exception("passwords must be equals");
        }
        if(userRepository.findByLogin(credential.getLogin()) != null)
            throw new Exception("user already exists");
        Set<Role> roles = new HashSet<>();
        Role role = roleRepository.findByName("USER");
        roles.add(role);
        credential.getUser().setRole(roles);
        userRepository.save(credential);

        Credential newUser = userRepository.findByLogin(credential.getLogin());
        if(newUser == null)
            throw new Exception("user didn't save");

        User user = new User(newUser.getLogin(),newUser.getPassword(),
                UserDetailsServiceImpl.createGrantedAuthority(newUser.getUser().getRole()));
        doAutoLogin(user,request);
        return true;
    }

    private void doAutoLogin(User user,HttpServletRequest request) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(user.getUsername()
                , user.getPassword(),user.getAuthorities());
        HttpSession session = request.getSession();
        token.setDetails(new WebAuthenticationDetails(request));
        Authentication authenticatedUser = authenticationManager.authenticate(token);// authenticates the token
        SecurityContextHolder.getContext().setAuthentication(authenticatedUser);
        request.getSession().setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY
                , SecurityContextHolder.getContext());// creates context for that session.
//set necessary details in session
        session.setAttribute("username", user.getUsername());
        session.setAttribute("authorities", token.getAuthorities());
    }





}
