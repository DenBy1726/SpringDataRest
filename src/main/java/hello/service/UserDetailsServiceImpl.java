package hello.service;

import hello.model.Credential;
import hello.model.Role;
import hello.repository.CredentialRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.Set;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private CredentialRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        Credential user = userRepository.findByLogin(username);
        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
            for (Role role : user.getUser().getRole()) {
                grantedAuthorities.add(new SimpleGrantedAuthority(role.getName()));
            }
        return new org.springframework.security.core.userdetails.User(user.getLogin(), user.getPassword(), grantedAuthorities);
    }
}