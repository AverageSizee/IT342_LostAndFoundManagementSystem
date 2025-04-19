package com.Project.Backend.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    public boolean userExistsByEmail(String email) {
        return userRepository.findByEmail(email) != null;
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

    public UserEntity updateUserProfile(String userId, MultipartFile file, String firstname, String lastname, String password) throws IOException {
        UserEntity user = userRepository.findBySchoolId(userId);
        
        // Check if a new profile image is provided
        if (file != null && !file.isEmpty()) {
            // Delete the previous image from Cloudinary (if it exists)
            String existingImageUrl = user.getProfilePicture();
            if (existingImageUrl != null && !existingImageUrl.isEmpty()) {
                cloudinaryService.deleteImage(existingImageUrl);
            }
    
            // Upload new image
            String newImageUrl = cloudinaryService.uploadImage(file, "user_profiles");
            user.setProfilePicture(newImageUrl);
        }
    
        // Update other fields if provided
        if (firstname != null && !firstname.isEmpty()) {
            user.setFirstname(firstname);
        }
        if (lastname != null && !lastname.isEmpty()) {
            user.setLastname(lastname);
        }
        if (password != null && !password.isEmpty()) {
            user.setPassword(bCryptPasswordEncoder.encode(password)); // Ensure password is hashed before saving
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

    public boolean isMicrosoftUser(String schoolId) {
        UserEntity user = userRepository.findBySchoolId(schoolId);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return user.isMicrosoft();
    }

        public ResponseEntity<Map<String, String>> updateFcmToken(String schoolId, String fcmToken) {
        UserEntity user = userRepository.findBySchoolId(schoolId);
        if (user == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "User not found"));
        }
        user.setFcmToken(fcmToken);
        userRepository.save(user);
        return ResponseEntity.ok(Collections.singletonMap("message", "FCM token updated successfully"));
    }
}
