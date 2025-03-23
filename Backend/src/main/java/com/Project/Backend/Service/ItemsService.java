package com.Project.Backend.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Project.Backend.Entity.ItemsEntity;
import com.Project.Backend.Entity.UserEntity;
import com.Project.Backend.Repository.ItemsRepository;
import com.Project.Backend.Repository.UserRepository;

import java.util.List;

@Service
public class ItemsService {

    @Autowired
    private ItemsRepository itemsRepository;

    @Autowired
    private UserRepository usersRepository;

    public ItemsEntity reportItem(String userID, ItemsEntity item) {
        UserEntity user = usersRepository.findBySchoolId(userID);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

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
}