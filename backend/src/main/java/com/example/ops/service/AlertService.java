package com.example.ops.service;
import com.example.ops.model.Alert;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
@Service
public class AlertService {
 private final StringRedisTemplate redis;
 public AlertService(StringRedisTemplate redis) { this.redis = redis; }
 public List<Alert> list() { return redis.opsForList().range("ops:alerts", 0, 49).stream().map(this::decode).toList(); }
 public Alert create(String severity, String title, String resource) { var a = new Alert(UUID.randomUUID().toString(), severity, title, resource, "OPEN", Instant.now().toString()); redis.opsForList().leftPush("ops:alerts", encode(a)); redis.opsForList().trim("ops:alerts", 0, 49); return a; }
 public void resolve(String id) { var all = list(); redis.delete("ops:alerts"); all.stream().map(a -> a.id().equals(id) ? new Alert(a.id(), a.severity(), a.title(), a.resource(), "RESOLVED", a.createdAt()) : a).forEach(a -> redis.opsForList().rightPush("ops:alerts", encode(a))); }
 private String encode(Alert a) { return String.join("|", a.id(), a.severity(), a.title().replace("|", " "), a.resource().replace("|", " "), a.status(), a.createdAt()); }
 private Alert decode(String s) { var p = s.split("\\|", 6); return new Alert(p[0], p[1], p[2], p[3], p[4], p[5]); }
}
