package com.Project.Backend.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.Project.Backend.Entity.ItemsEntity;
import com.Project.Backend.Service.ItemsService;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/items")
public class ItemsController {

    @Autowired
    private ItemsService itemsService;

    @PostMapping("/report/{userID}")
    public ItemsEntity reportItem(@PathVariable String userID, @RequestBody ItemsEntity item,@RequestPart(value = "image", required = false) MultipartFile imageFile) {
        // System.out.println(userID);
        // System.out.println(item);
        return itemsService.reportItem(userID, item, imageFile);
    }

    @PostMapping("/claim/{itemId}/{userID}")
    public ItemsEntity claimItem(@PathVariable Long itemId, @PathVariable String userID) {
        return itemsService.claimItem(itemId, userID);
    }

    @GetMapping
    public List<ItemsEntity> getAllItems() {
        return itemsService.getAllItems();
    }
    @PutMapping("/confirm/{itemId}")
    public ItemsEntity confirmItem(@PathVariable Long itemId) {
        return itemsService.confirmItem(itemId);
    }
}