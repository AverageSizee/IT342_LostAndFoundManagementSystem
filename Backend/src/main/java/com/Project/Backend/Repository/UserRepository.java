package com.Project.Backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Project.Backend.Entity.UserEntity;



@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer>{
    UserEntity findBySchoolId(String schoolId);
}
