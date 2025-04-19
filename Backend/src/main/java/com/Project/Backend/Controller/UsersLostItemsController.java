package com.Project.Backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Project.Backend.Entity.UsersLostItems;
import com.Project.Backend.Service.UsersLostItemsService;
import com.Project.Backend.Service.UserService;
import com.Project.Backend.Entity.UserEntity;
import com.Project.Backend.Entity.UsersLostItems;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/users-lost-items")
public class UsersLostItemsController {

    @Autowired
    private UsersLostItemsService usersLostItemsService;

    @Autowired
    private UserService userService;

    @PostMapping("/add")
    public ResponseEntity<UsersLostItems> addLostItem(@RequestBody UsersLostItems lostItem) {
        UsersLostItems savedItem = usersLostItemsService.saveLostItem(lostItem);
        return ResponseEntity.ok(savedItem);
    }

    @PostMapping("/add/{userId}")
    public ResponseEntity<?> addLostItemWithUserId(@PathVariable String userId, @RequestBody UsersLostItems lostItemRequest) {
        UserEntity user = userService.getUserBySchoolId(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found with id: " + userId);
        }

        UsersLostItems lostItem = new UsersLostItems();
        lostItem.setItemName(lostItemRequest.getItemName());
        lostItem.setDescription(lostItemRequest.getDescription());
        lostItem.setLocation(lostItemRequest.getLocation());
        lostItem.setUser(user);

        UsersLostItems savedItem = usersLostItemsService.saveLostItem(lostItem);
        return ResponseEntity.ok(savedItem);
    }

    @GetMapping
    public ResponseEntity<List<UsersLostItems>> getAllLostItems() {
        List<UsersLostItems> lostItems = usersLostItemsService.getAllLostItems();
        return ResponseEntity.ok(lostItems);
    }

    @GetMapping("/by-user/{schoolId}")
    public ResponseEntity<List<UsersLostItems>> getLostItemsByUser(@PathVariable String schoolId) {
        List<UsersLostItems> lostItems = usersLostItemsService.findByUserSchoolId(schoolId);
        return ResponseEntity.ok(lostItems);
    }
}
