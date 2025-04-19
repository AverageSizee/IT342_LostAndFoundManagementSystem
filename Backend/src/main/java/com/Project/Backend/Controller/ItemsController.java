package com.Project.Backend.Controller;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ItemsEntity reportItem(@PathVariable String userID, @RequestPart("item") ItemsEntity item,@RequestPart(value = "image", required = false) MultipartFile imageFile) {
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

    // New DELETE endpoint to delete an item
    @DeleteMapping("/delete/{itemId}")
    public void deleteItem(@PathVariable Long itemId) {
        itemsService.deleteItem(itemId);
    }

    // New PUT endpoint to update an item
    @PutMapping("/update/{itemId}")
    public ItemsEntity updateItem(@PathVariable Long itemId, @RequestBody ItemsEntity updatedItem) {
        return itemsService.updateItem(itemId, updatedItem);
    }

    @PutMapping("/{id}/unclaim")
    public ResponseEntity<ItemsEntity> markItemAsUnclaimed(@PathVariable Long id) {
        ItemsEntity updatedItem = itemsService.markItemAsUnclaimed(id);
        return ResponseEntity.ok(updatedItem);
    }

}