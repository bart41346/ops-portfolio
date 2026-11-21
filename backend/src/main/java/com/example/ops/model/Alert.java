package com.example.ops.model;
public record Alert(String id, String severity, String title, String resource, String status, String createdAt) {}
