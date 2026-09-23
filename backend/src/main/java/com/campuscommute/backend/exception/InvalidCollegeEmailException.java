package com.campuscommute.backend.exception;

public class InvalidCollegeEmailException extends RuntimeException {
    public InvalidCollegeEmailException(String message) {
        super(message);
    }
}
