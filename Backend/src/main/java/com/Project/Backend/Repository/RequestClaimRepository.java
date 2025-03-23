package com.Project.Backend.Repository;

import com.Project.Backend.Entity.ItemsEntity;
import com.Project.Backend.Entity.RequestClaimEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RequestClaimRepository extends JpaRepository<RequestClaimEntity, Long> {
    List<RequestClaimEntity> findByItem(ItemsEntity item);
    List<RequestClaimEntity> findByItemAndStatus(ItemsEntity item, String status);
}
