package com.Project.Backend.Security;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.Project.Backend.Entity.UserEntity;

public class UserPrincipal implements UserDetails{

    private UserEntity userEntity;
    
    public UserPrincipal(UserEntity userEntity) {
        this.userEntity = userEntity;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        
        return Collections.singleton(new SimpleGrantedAuthority("USER"));
    }

    @Override
    public String getPassword() {
        
        return userEntity.getPassword();
    }

    @Override
    public String getUsername() {
        return userEntity.getSchoolId();
    }

    


}
