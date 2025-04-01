package com.Project.Backend.Controller;

import com.Project.Backend.Entity.RequestClaimEntity;
import com.Project.Backend.Service.RequestClaimService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/claims")
public class RequestClaimController {

    @Autowired
    private RequestClaimService requestClaimService;

    @PostMapping("/request")
    public ResponseEntity<String> requestClaim(
            @RequestParam String userId,
            @RequestParam Long itemId,
            @RequestParam String claimDate,
            @RequestParam String reason) {
        
        String response = requestClaimService.requestClaim(userId, itemId, claimDate, reason);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/getall")
    public ResponseEntity<List<RequestClaimEntity>> getAllRequestedItems() {
        List<RequestClaimEntity> claims = requestClaimService.getAllClaims();
        return ResponseEntity.ok(claims);
    }
    @PutMapping("/approve/{requestId}")
    public ResponseEntity<String> approveClaim(@PathVariable Long requestId) {
        String response = requestClaimService.approveClaim(requestId);  
        if (response.equals("Claim approved.")) {
            return ResponseEntity.ok(response);  
        } else {
            return ResponseEntity.status(404).body(response);  
        }
    }
    @DeleteMapping("/delete/{requestId}")
    public ResponseEntity<String> deleteClaim(@PathVariable Long requestId) {
        String result = requestClaimService.deleteClaim(requestId);
        return ResponseEntity.ok(result);
    }
}
