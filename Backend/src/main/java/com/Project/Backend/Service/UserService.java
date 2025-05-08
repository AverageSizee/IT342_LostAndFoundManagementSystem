package com.Project.Backend.Service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.Project.Backend.Entity.UserEntity;
import com.Project.Backend.Repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final CloudinaryService cloudinaryService;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    
    
    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, CloudinaryService cloudinaryService) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.cloudinaryService = cloudinaryService;
    }

    public UserEntity saveUser(UserEntity user) {
        return userRepository.save(user);
    }

    public boolean userExistsBySchoolId(String jobTitle) {
        return userRepository.findBySchoolId(jobTitle) != null;
    }

    public List<UserEntity> getAllUsers() { 
        return userRepository.findAll();
    }
    public UserEntity registerUser(UserEntity user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    
    public String getUserProfileImage(String userId) {
        UserEntity user = userRepository.findBySchoolId(userId);
        return user.getProfilePicture();
    }

    public UserEntity updateUserProfile(String userId, MultipartFile file, String firstname, String lastname, String email, String password) throws IOException {
        UserEntity user = userRepository.findBySchoolId(userId);
    
        if (file != null && !file.isEmpty()) {
            String existingImageUrl = user.getProfilePicture();
            if (existingImageUrl != null && !existingImageUrl.isEmpty()) {
                cloudinaryService.deleteImage(existingImageUrl);
            }
            String newImageUrl = cloudinaryService.uploadImage(file, "user_profiles");
            user.setProfilePicture(newImageUrl);
        }
    
        if (firstname != null && !firstname.trim().isEmpty()) {
            user.setFirstname(firstname.trim());
        }
    
        if (lastname != null && !lastname.trim().isEmpty()) {
            user.setLastname(lastname.trim());
        }
    
        if (email != null && !email.trim().isEmpty()) {
            user.setEmail(email.trim());
        }
        if (password != null && !password.trim().isEmpty()) {
            user.setPassword(bCryptPasswordEncoder.encode(password.trim()));
        }
    
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

    public UserEntity updateUser(String schoolId, UserEntity updatedUser) {
        UserEntity existingUser = userRepository.findBySchoolId(schoolId);
        if (existingUser == null) {
            return null;
        }
    
        // Update basic fields
        if (updatedUser.getFirstname() != null && !updatedUser.getFirstname().isEmpty()) {
            existingUser.setFirstname(updatedUser.getFirstname());
        }
        if (updatedUser.getLastname() != null && !updatedUser.getLastname().isEmpty()) {
            existingUser.setLastname(updatedUser.getLastname());
        }
        
        // Add email update
        if (updatedUser.getEmail() != null && !updatedUser.getEmail().isEmpty()) {
            existingUser.setEmail(updatedUser.getEmail());
        }
        
        // Add role update (with validation if needed)
        if (updatedUser.getRole() != null && !updatedUser.getRole().isEmpty()) {
            existingUser.setRole(updatedUser.getRole());
        }
    
        return userRepository.save(existingUser);
    }
     
    
}
