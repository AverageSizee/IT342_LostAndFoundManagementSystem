package com.Project.Backend.Service;
import org.hibernate.cache.spi.support.AbstractReadWriteAccess.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.Project.Backend.Entity.ItemsEntity;

import com.Project.Backend.Entity.UserEntity;
import com.Project.Backend.Repository.ItemsRepository;
import com.Project.Backend.Repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;


@Service
public class ItemsService {

    @Autowired
    private ItemsRepository itemsRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private UserRepository usersRepository;

    public ItemsEntity reportItem(String userID, ItemsEntity item, MultipartFile file) {
        UserEntity user = usersRepository.findBySchoolId(userID);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Upload image to Cloudinary
        String imageUrl= null;
        try {
            imageUrl = cloudinaryService.uploadImage(file, "item_images");
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        item.setImageUrl(imageUrl);

        item.setReportedBy(user);
        item.setStatus("Reported");
        return itemsRepository.save(item);
    }

    public ItemsEntity claimItem(Long itemId, String userID) {
        ItemsEntity item = itemsRepository.findById(itemId) // Call on instance
            .orElseThrow(() -> new RuntimeException("Item not found"));
    
        if (item.isClaimed()) {
            throw new RuntimeException("Item is already claimed");
        }
    
        UserEntity user = usersRepository.findBySchoolId(userID);
        if (user == null) { 
            throw new RuntimeException("User not found");
        }
    
        if (item.getReportedBy() != null) {
            item.getReportedBy().getItemsReported().remove(item);
        }
    
        item.setClaimedBy(user);
        item.setClaimed(true);
        item.setStatus("Claimed");
    
        return itemsRepository.save(item);
    }

    public List<ItemsEntity> getAllItems() {
        return itemsRepository.findAll();
    }

    public ItemsEntity confirmItem(Long itemId) {
        ItemsEntity item = itemsRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));
    
        item.setStatus("Confirmed");
        return itemsRepository.save(item);
    }

    public ItemsEntity updateItem(Long itemId, ItemsEntity updatedItem) {
        ItemsEntity existingItem = itemsRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));

        // Update fields as necessary
        existingItem.setItemName(updatedItem.getItemName());
        existingItem.setLocation(updatedItem.getLocation());
        existingItem.setFoundDate(updatedItem.getFoundDate());
        existingItem.setStatus(updatedItem.getStatus());
        existingItem.setDescription(updatedItem.getDescription());
        
        // Save the updated item
        return itemsRepository.save(existingItem);
    }

    // New method for deleting an item
    public void deleteItem(Long itemId) {
        ItemsEntity item = itemsRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));

        itemsRepository.delete(item);
    }

    
    public ItemsEntity markItemAsUnclaimed(Long id) {
        ItemsEntity item = itemsRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Item not found"));
    
        item.setStatus("Confirmed");
        item.setClaimed(false);
        item.setClaimedBy(null); // Optional: clear who claimed it
        return itemsRepository.save(item);
    }
    

    
}
