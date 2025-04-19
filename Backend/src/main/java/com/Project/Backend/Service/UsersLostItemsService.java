package com.Project.Backend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Project.Backend.Entity.UsersLostItems;
import com.Project.Backend.Repository.UsersLostItemsRepository;

@Service
public class UsersLostItemsService {

    @Autowired
    private UsersLostItemsRepository usersLostItemsRepository;

    public UsersLostItems saveLostItem(UsersLostItems lostItem) {
        return usersLostItemsRepository.save(lostItem);
    }

    public List<UsersLostItems> getAllLostItems() {
        return usersLostItemsRepository.findAll();
    }

    public List<UsersLostItems> findByItemName(String itemName) {
        return usersLostItemsRepository.findByItemNameContainingIgnoreCase(itemName);
    }

    public List<UsersLostItems> findByLocation(String location) {
        return usersLostItemsRepository.findByLocationContainingIgnoreCase(location);
    }

    public List<UsersLostItems> findByUserSchoolId(String schoolId) {
        return usersLostItemsRepository.findByUserSchoolId(schoolId);
    }
}
