package com.Project.Backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Project.Backend.Entity.UsersLostItems;

import java.util.List;

@Repository
public interface UsersLostItemsRepository extends JpaRepository<UsersLostItems, Long> {
    List<UsersLostItems> findByItemNameContainingIgnoreCase(String itemName);
    List<UsersLostItems> findByLocationContainingIgnoreCase(String location);
    List<UsersLostItems> findByUserSchoolId(String schoolId);
}
