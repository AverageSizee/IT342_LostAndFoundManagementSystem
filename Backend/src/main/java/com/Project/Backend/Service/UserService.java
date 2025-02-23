package com.Project.Backend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.Project.Backend.Entity.UserEntity;
import com.Project.Backend.Repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private final UserRepository userRepository;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    
    
    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public UserEntity saveUser(UserEntity user) {
        return userRepository.save(user);
    }

    public List<UserEntity> getAllUsers() { 
        return userRepository.findAll();
    }
    public UserEntity registerUser(UserEntity user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public boolean loginUser(String schoolId, String password) {
        UserEntity user = userRepository.findBySchoolId(schoolId);
        
        if (user == null) {
            return false; // User not found
        }
        
        return user.getPassword().equals(password);
    }

    public UserEntity getUserById(int userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public UserEntity getUserBySchoolId(String schoolId) {
        return userRepository.findBySchoolId(schoolId);
    }

    public void deleteUser(int userId) {
        userRepository.deleteById(userId);
    }

    public boolean authenticate(String schooldId, String password) {
        UserEntity user = userRepository.findBySchoolId(schooldId);
        if(!user.getSchoolId().equals(schooldId)){
            throw new UsernameNotFoundException("User not found");
        }

        if (!bCryptPasswordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        return true;
    }
}
