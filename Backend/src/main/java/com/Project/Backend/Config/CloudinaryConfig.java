package com.Project.Backend.Config;
import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "drlesk0sw");
        config.put("api_key", "836224622512876");
        config.put("api_secret", "4c8wf_wl_Yr6wCQBclgqgvJFmhQ");
        return new Cloudinary(config);
    }
}
