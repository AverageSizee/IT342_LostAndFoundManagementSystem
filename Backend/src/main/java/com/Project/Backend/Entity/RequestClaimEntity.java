package com.Project.Backend.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "request_claims")
public class RequestClaimEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user; // User who requested the item

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private ItemsEntity item; // The item being claimed

    private String status = "PENDING"; // Status: PENDING, APPROVED, REJECTED
    private String claimDate;
    private String reason;

    // Constructors
    public RequestClaimEntity() {}

    public RequestClaimEntity(UserEntity user, ItemsEntity item,String claimDate,String reason) {
        this.user = user;
        this.item = item;
        this.status = "PENDING";
        this.claimDate = claimDate;
        this.reason = reason;
    }

    // Getters and Setters
    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public ItemsEntity getItem() {
        return item;
    }

    public void setItem(ItemsEntity item) {
        this.item = item;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getClaimDate() {
        return claimDate;
    }

    public void setClaimDate(String claimDate) {
        this.claimDate = claimDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    
}
