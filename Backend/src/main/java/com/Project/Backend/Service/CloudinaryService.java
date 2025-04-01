package com.Project.Backend.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    // Upload image and return URL
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
            ObjectUtils.asMap("folder", folder));

        return uploadResult.get("secure_url").toString(); // Cloudinary image URL
    }

    public void deleteImage(String publicId) {
        String nPublicId = extractPublicId(publicId);
        try {
            Map result = cloudinary.uploader().destroy(nPublicId, ObjectUtils.emptyMap());
            System.out.println("Delete response: " + result);
        } catch (Exception e) {
            System.err.println("Error deleting image: " + e.getMessage());
        }
    }
    
    
    private String extractPublicId(String imageUrl) {
        String[] parts = imageUrl.split("/");
        String fileName = parts[parts.length - 1]; // Extracts filename with extension
        String folderName = parts[parts.length - 2]; // Extract folder name
        return folderName + "/" + fileName.substring(0, fileName.lastIndexOf(".")); // Include folder in ID
    }
    
}
