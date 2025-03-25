package com.Project.Backend.Entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class UserEntity {
    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int userId;

    private String schoolId;

    private String firstname;

    private String lastname;

    private String email;

    private String password;

    private String role;

    @OneToMany(mappedBy = "reportedBy", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ItemsEntity> itemsReported; // Items reported by this user

    @OneToMany(mappedBy = "claimedBy", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ItemsEntity> itemsClaimed; // Items claimed by this user

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<RequestClaimEntity> claims; // Claims made by the user

    public UserEntity() {
    }

    public UserEntity(String schoolId, String firstname, String lastname, String email, String password, String role) {
        this.schoolId = schoolId;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getSchoolId() {
        return schoolId;
    }

    public void setSchoolId(String schoolId) {
        this.schoolId = schoolId;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<ItemsEntity> getItemsReported() {
        return itemsReported;
    }

    public void setItemsReported(List<ItemsEntity> itemsReported) {
        this.itemsReported = itemsReported;
    }

    public List<ItemsEntity> getItemsClaimed() {
        return itemsClaimed;
    }

    public void setItemsClaimed(List<ItemsEntity> itemsClaimed) {
        this.itemsClaimed = itemsClaimed;
    }

    public List<RequestClaimEntity> getClaims() {
        return claims;
    }

    public void setClaims(List<RequestClaimEntity> claims) {
        this.claims = claims;
    }
    
    
    

    
}
