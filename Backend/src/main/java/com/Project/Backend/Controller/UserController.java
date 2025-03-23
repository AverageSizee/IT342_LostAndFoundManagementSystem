package com.Project.Backend.Controller;

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
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/getcurrentuser")
     public ResponseEntity<Map<String, String>> getSchoolId(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Invalid token"));
        }

        String token = authHeader.substring(7);
        String schoolId = tokenService.extractSchoolId(token);

        return ResponseEntity.ok(Collections.singletonMap("schoolId", schoolId));
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
