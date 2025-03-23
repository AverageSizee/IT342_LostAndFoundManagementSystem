package com.Project.Backend.Service;

import com.Project.Backend.Entity.ItemsEntity;
import com.Project.Backend.Entity.RequestClaimEntity;
import com.Project.Backend.Entity.UserEntity;
import com.Project.Backend.Repository.ItemsRepository;
import com.Project.Backend.Repository.RequestClaimRepository;
import com.Project.Backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RequestClaimService {

    @Autowired
    private RequestClaimRepository requestClaimRepository;

    @Autowired
    private ItemsRepository itemsRepository;

    @Autowired
    private UserRepository userRepository;

    // Request an item
    public String requestClaim(String userId, Long itemId) {
        UserEntity user = userRepository.findBySchoolId(userId); // Directly gets the UserEntity
        Optional<ItemsEntity> itemOpt = itemsRepository.findById(itemId);
    
        if (user != null && itemOpt.isPresent()) { // Check if user exists
            ItemsEntity item = itemOpt.get();
    
            // Check if the item is already claimed
            if (item.getClaimedBy() != null) {
                return "This item has already been claimed.";
            }
    
            RequestClaimEntity claim = new RequestClaimEntity(user, item); // No need to use .get()
            requestClaimRepository.save(claim);
            return "Claim request submitted successfully.";
        }
        return "User or Item not found.";
    }

    // Approve a claim request
    public String approveClaim(Long requestId) {
        Optional<RequestClaimEntity> requestOpt = requestClaimRepository.findById(requestId);

        if (requestOpt.isPresent()) {
            RequestClaimEntity request = requestOpt.get();
            ItemsEntity item = request.getItem();

            // Assign the item to the user and mark it as claimed
            item.setClaimedBy(request.getUser());
            itemsRepository.save(item);

            // Update request status
            request.setStatus("APPROVED");
            requestClaimRepository.save(request);

            // Reject other pending claims for this item
            List<RequestClaimEntity> otherRequests = requestClaimRepository.findByItemAndStatus(item, "PENDING");
            for (RequestClaimEntity otherRequest : otherRequests) {
                otherRequest.setStatus("REJECTED");
                requestClaimRepository.save(otherRequest);
            }

            return "Claim approved.";
        }
        return "Claim request not found.";
    }

    // Reject a claim request
    public String rejectClaim(Long requestId) {
        Optional<RequestClaimEntity> requestOpt = requestClaimRepository.findById(requestId);

        if (requestOpt.isPresent()) {
            RequestClaimEntity request = requestOpt.get();
            request.setStatus("REJECTED");
            requestClaimRepository.save(request);
            return "Claim rejected.";
        }
        return "Claim request not found.";
    }

    // Get all claims for an item
    public List<RequestClaimEntity> getClaimsByItem(Long itemId) {
        Optional<ItemsEntity> itemOpt = itemsRepository.findById(itemId);
        return itemOpt.map(requestClaimRepository::findByItem).orElse(null);
    }
}
