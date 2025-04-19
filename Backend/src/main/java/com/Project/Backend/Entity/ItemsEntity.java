package com.Project.Backend.Entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
@Table(name = "items")
public class ItemsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemID;

    private String itemName;
    private String description;
    private String foundDate;
    private String status;
    private String claimDate;
    private boolean isClaimed = false;
    private String location;
    private String imageUrl;



    @ManyToOne
    @JoinColumn(name = "reported_by", nullable = true)
    private UserEntity reportedBy; // User who reported the item

    @ManyToOne
    @JoinColumn(name = "claimed_by", nullable = true)
    private UserEntity claimedBy; // User who claimed the item

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RequestClaimEntity> claimRequests;


    // Constructors
    public ItemsEntity() {}

    @JsonCreator
    public ItemsEntity(
        @JsonProperty("itemName") String itemName, 
        @JsonProperty("description") String description, 
        @JsonProperty("foundDate") String foundDate, 
        @JsonProperty("location") String location, 
        @JsonProperty("status") String status) {
        this.itemName = itemName;
        this.description = description;
        this.foundDate = foundDate;
        this.status = status;
        this.location = location;
    }

    // Getters and Setters
    public Long getItemID() {
        return itemID;
    }

    public void setItemID(Long itemID) {
        this.itemID = itemID;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public String getDate() {
        return foundDate;
    }

    public void setDate(String foundDate) {
        this.foundDate = foundDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFoundDate() {
        return foundDate;
    }

    public void setFoundDate(String foundDate) {
        this.foundDate = foundDate;
    }

    public String getClaimDate() {
        return claimDate;
    }

    public void setClaimDate(String claimDate) {
        this.claimDate = claimDate;
    }

    public UserEntity getReportedBy() {
        return reportedBy;
    }

    public void setReportedBy(UserEntity reportedBy) {
        this.reportedBy = reportedBy;
    }

    public UserEntity getClaimedBy() {
        return claimedBy;
    }

    public void setClaimedBy(UserEntity claimedBy) {
        this.claimedBy = claimedBy;
    }

    public boolean isClaimed() {
        return isClaimed;
    }

    public void setClaimed(boolean isClaimed) {
        this.isClaimed = isClaimed;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

}

 