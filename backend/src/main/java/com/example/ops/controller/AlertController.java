package com.example.ops.controller;
import com.example.ops.model.Alert;
import com.example.ops.service.AlertService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/alerts")
public class AlertController {
 private final AlertService service;
 public AlertController(AlertService service) { this.service = service; }
 @GetMapping public List<Alert> list() { return service.list(); }
 @PostMapping public Alert create(@Valid @RequestBody CreateAlert body) { return service.create(body.severity(), body.title(), body.resource()); }
 @PatchMapping("/{id}/resolve") public void resolve(@PathVariable String id) { service.resolve(id); }
 public record CreateAlert(@NotBlank String severity, @NotBlank String title, @NotBlank String resource) {}
}
