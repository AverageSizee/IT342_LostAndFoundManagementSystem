package com.Project.Backend.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.Project.Backend.Entity.ItemsEntity;
import com.Project.Backend.Service.ItemsService;

import java.io.IOException;
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

    @PutMapping("/unclaim/{itemId}")
    public ItemsEntity markAsUnclaimed(@PathVariable Long itemId) {
        return itemsService.MarkAsUnclaimed(itemId);
    }
    

    @GetMapping
    public List<ItemsEntity> getAllItems() {
        return itemsService.getAllItems();
    }
    @PutMapping("/confirm/{itemId}")
    public ItemsEntity confirmItem(@PathVariable Long itemId) {
        return itemsService.confirmItem(itemId);
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<ItemsEntity> updateItem(
        @PathVariable Long itemId,
        @RequestParam(value = "file", required = false) MultipartFile file,
        @RequestParam(value = "itemName", required = false) String itemName,
        @RequestParam(value = "description", required = false) String description,
        @RequestParam(value = "foundDate", required = false) String foundDate,
        @RequestParam(value = "location", required = false) String location) {

        try {
            ItemsEntity updatedItem = itemsService.updateItem(itemId, file, itemName, description, foundDate, location);
            return ResponseEntity.ok(updatedItem);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/delete/{itemId}")
    public ResponseEntity<String> deleteItem(@PathVariable Long itemId) {
        itemsService.deleteItem(itemId);
        return ResponseEntity.ok("Item deleted successfully");
    }
}