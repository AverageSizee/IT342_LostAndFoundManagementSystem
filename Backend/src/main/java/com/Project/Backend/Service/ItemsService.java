package com.Project.Backend.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Project.Backend.Entity.ItemsEntity;
import com.Project.Backend.Entity.UserEntity;
import com.Project.Backend.Entity.UsersLostItems;
import com.Project.Backend.Repository.ItemsRepository;
import com.Project.Backend.Repository.UserRepository;
import com.Project.Backend.Repository.UsersLostItemsRepository;
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

    @Autowired
    private UsersLostItemsRepository usersLostItemsRepository;

    @Autowired
    private NotificationService notificationService;
    

    public ItemsEntity reportItem(String userID, ItemsEntity item, MultipartFile file) {
        UserEntity user = usersRepository.findBySchoolId(userID);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
    
        // Upload image to Cloudinary
        String imageUrl = null;
        try {
            imageUrl = cloudinaryService.uploadImage(file, "item_images");
        } catch (IOException e) {
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
    
        // if (item.getReportedBy() != null) {
        //     item.getReportedBy().getItemsReported().remove(item);
        // }
    
        item.setClaimedBy(user);
        item.setClaimed(true);
        item.setStatus("Claimed");
    
        return itemsRepository.save(item);
    }

    public ItemsEntity MarkAsUnclaimed(Long itemId){
        ItemsEntity item = itemsRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setClaimedBy(null);
        item.setClaimed(false);
        item.setStatus("Confirmed");
        return itemsRepository.save(item);
    }

    public List<ItemsEntity> getAllItems() {
        return itemsRepository.findAll();
    }

    public ItemsEntity confirmItem(Long itemId) {
        ItemsEntity item = itemsRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));
    
        item.setStatus("Confirmed");
        ItemsEntity confirmedItem = itemsRepository.save(item);
    
        // Notify users if the confirmed item matches their lost items
        List<UsersLostItems> matchingLostItems = usersLostItemsRepository.findByItemNameContainingIgnoreCase(confirmedItem.getItemName());
        for (UsersLostItems lostItem : matchingLostItems) {
            UserEntity lostUser = lostItem.getUser();
            try {
                String title = "Related Item Found";
                String body = "An item related to your lost item '" + lostItem.getItemName() + "' has been confirmed.";
                String deviceToken = lostUser.getFcmToken();
                if (deviceToken != null && !deviceToken.isEmpty()) {
                    notificationService.sendNotification(deviceToken, title, body);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    
        return confirmedItem;
    }
    public ItemsEntity updateItem(Long itemId, MultipartFile file, String itemName, String description, String foundDate, String location) throws IOException {
        Optional<ItemsEntity> optionalItem = itemsRepository.findById(itemId);
        
        if (optionalItem.isPresent()) {
            ItemsEntity item = optionalItem.get();
            
            // Check if a new image is uploaded
            if (file != null && !file.isEmpty()) {
                // Delete the previous image from Cloudinary (if exists)
                String existingImageUrl = item.getImageUrl();
                if (existingImageUrl != null && !existingImageUrl.isEmpty()) {
                    cloudinaryService.deleteImage(existingImageUrl);
                }
    
                // Upload new image
                String newImageUrl = cloudinaryService.uploadImage(file, "items");
                item.setImageUrl(newImageUrl);
            }

            // Update other fields
            if (itemName != null && !itemName.isEmpty()) {
                item.setItemName(itemName);
            }
            if (description != null && !description.isEmpty()) {
                item.setDescription(description);
            }
            if (foundDate != null && !foundDate.isEmpty()) {
                item.setFoundDate(foundDate);
            }
            if (location != null && !location.isEmpty()) {
                item.setLocation(location);
            }

            return itemsRepository.save(item);
        } else {
            throw new RuntimeException("Item not found with ID: " + itemId);
        }
    }
    
    public void deleteItem(Long itemId) {
        ItemsEntity item = itemsRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));
        
        itemsRepository.delete(item);
    }
}