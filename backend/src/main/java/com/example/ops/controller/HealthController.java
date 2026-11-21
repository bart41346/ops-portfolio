package com.example.ops.controller;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
@RestController
public class HealthController {
 private final StringRedisTemplate redis;
 public HealthController(StringRedisTemplate redis) { this.redis = redis; }
 @GetMapping("/api/health")
 public Map<String, String> health() {
  String redisStatus = redis.getConnectionFactory().getConnection().ping();
  return Map.of("status", "ok", "redis", redisStatus == null ? "unknown" : "ok");
 }
}
