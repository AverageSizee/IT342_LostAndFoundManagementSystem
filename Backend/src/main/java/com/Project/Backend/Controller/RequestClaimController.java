package com.Project.Backend.Controller;

import com.Project.Backend.Service.RequestClaimService;
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
            @RequestParam Long itemId) {
        
        String response = requestClaimService.requestClaim(userId, itemId);
        return ResponseEntity.ok(response);
    }
}
