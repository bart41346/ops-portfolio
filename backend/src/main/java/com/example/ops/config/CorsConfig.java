package com.example.ops.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import java.util.Arrays;
@Configuration
public class CorsConfig {
 @Bean
 CorsFilter corsFilter(@Value("${app.cors.allowed-origin:http://localhost:5173}") String origins) {
  var config = new CorsConfiguration();
  config.setAllowedOrigins(Arrays.stream(origins.split(",")).map(String::trim).toList());
  config.setAllowedMethods(Arrays.asList("GET", "POST", "PATCH", "OPTIONS"));
  config.setAllowedHeaders(Arrays.asList("Content-Type", "Accept"));
  config.setMaxAge(3600L);
  var source = new UrlBasedCorsConfigurationSource();
  source.registerCorsConfiguration("/api/**", config);
  return new CorsFilter(source);
 }
}
