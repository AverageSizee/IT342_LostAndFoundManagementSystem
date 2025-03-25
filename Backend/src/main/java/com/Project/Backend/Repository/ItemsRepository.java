package com.Project.Backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Project.Backend.Entity.ItemsEntity;

public interface ItemsRepository extends JpaRepository<ItemsEntity, Long> {
}
