package com.Project.Backend.DTO;
public class LoginRequest {
    private String schoolId;
    private String password;

    // Constructors
    public LoginRequest() {}

    public LoginRequest(String schoolId, String password) {
        this.schoolId = schoolId;
        this.password = password;
    }

    // Getters and Setters
    public String getSchoolId() {
        return schoolId;
    }

    public void setSchoolId(String schoolId) {
        this.schoolId = schoolId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
