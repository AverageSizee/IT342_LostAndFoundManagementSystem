package com.Project.Backend.Controller;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.Project.Backend.DTO.LoginRequest;
import com.Project.Backend.Entity.UserEntity;
import com.Project.Backend.Service.TokenService;
import com.Project.Backend.Service.UserService;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    private final TokenService tokenService;
    

    public UserController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping("/create")
    public ResponseEntity<UserEntity> createUser(@RequestBody UserEntity user) {
        return ResponseEntity.ok(userService.saveUser(user));
    }

    @PostMapping("/register")
    public ResponseEntity<UserEntity> registerUser(@RequestBody UserEntity user) {
        UserEntity savedUser = userService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/getall")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/check-user")
    public Map<String, Boolean> checkUser(@RequestParam String jobTitle) {
        boolean exists = userService.userExistsBySchoolId(jobTitle);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return response;
    }

    @GetMapping("/check-email")
    public Map<String, Boolean> checkEmail(@RequestParam String email) {
        boolean exists = userService.userExistsByEmail(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return response;
    }

    @GetMapping("/check-isMicrosoft")
    public Map<String, Boolean> checkIsMicrosoft(@RequestParam String schoolId) {
        boolean isMicrosoft = userService.isMicrosoftUser(schoolId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isMicrosoft", isMicrosoft);
        return response;
    }

    @PostMapping("/upload/user/{userId}")
    public ResponseEntity<?> updateUserProfile(
        @PathVariable String userId,
        @RequestParam(value = "file", required = false) MultipartFile file,
        @RequestParam(value = "firstname", required = false) String firstname,
        @RequestParam(value = "lastname", required = false) String lastname,
        @RequestParam(value = "password", required = false) String password
    ) {
        try {
            UserEntity updatedUser = userService.updateUserProfile(userId, file, firstname, lastname, password);
            return ResponseEntity.ok(updatedUser);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Profile update failed: " + e.getMessage());
        }
    }

    @GetMapping("/getcurrentuser")
    public ResponseEntity<Map<String, String>> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Invalid token"));
        }

        String token = authHeader.substring(7);
        String schoolId = tokenService.extractSchoolId(token);
        UserEntity user = userService.getUserBySchoolId(schoolId);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "User not found"));
        }

        Map<String, String> response = new HashMap<>();
        response.put("schoolId", user.getSchoolId());
        response.put("firstname", user.getFirstname());
        response.put("lastname", user.getLastname());
        response.put("email", user.getEmail());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/image")
    public ResponseEntity<?> getUserProfileImage(@RequestHeader("Authorization") String token) {
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Invalid or missing token");
            }
    
            // Extract the actual token (remove "Bearer " prefix)
            token = token.substring(7);
    
            String schoolId = tokenService.extractSchoolId(token);
            if (schoolId == null || schoolId.isEmpty()) {
                return ResponseEntity.status(401).body("Invalid token: schoolId missing");
            }
    
            // System.out.println("Fetching profile image for schoolId: " + schoolId); // Debugging log
    
            String profileImage = userService.getUserProfileImage(schoolId);
    
            if (profileImage == null || profileImage.isEmpty()) {
                return ResponseEntity.badRequest().body("No profile image found");
            }
    
            return ResponseEntity.ok(profileImage);
        } catch (Exception e) {
            e.printStackTrace(); // Debugging
            return ResponseEntity.status(500).body("Error fetching profile image: " + e.getMessage());
        }
    }
    @GetMapping("/getcurrentrole")
    public ResponseEntity<Map<String, String>> getUserRole(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Invalid token"));
        }

        String token = authHeader.substring(7); 
        String role = tokenService.extractRole(token);

        return ResponseEntity.ok(Collections.singletonMap("role", role));
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate(); 
        return "Logout successful";
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody LoginRequest loginRequest, HttpSession session) {
        try{
            boolean isAuthenticated = userService.authenticate(loginRequest.getSchoolId(), loginRequest.getPassword());

            if(isAuthenticated){

                UserEntity user = userService.getUserBySchoolId(loginRequest.getSchoolId());

                Authentication authentication = new UsernamePasswordAuthenticationToken(user,null,null);

                String token = tokenService.generateToken(authentication,user.getSchoolId(),user.getRole());

                session.setAttribute("user", loginRequest.getSchoolId());
                //System.out.println(session.getAttribute("user"));
                //System.out.println("Session ID: " + session.getId()); 


                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("token", token);
                responseBody.put("user", loginRequest.getSchoolId());
                responseBody.put("role", user.getRole());
                return ResponseEntity.ok(responseBody);
            }else{
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "Invalid credentials"));
            }
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    

    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> getUserById(@PathVariable int id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
}
