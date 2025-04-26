package pucp.edu.pe.sgta.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@Tag(name = "Test", description = "Controller for testing purposes")
public class TestController {

    @GetMapping("/ping")
    @Operation(summary = "Ping Test", description = "Endpoint to test if the server is running.")
    public String ping() {
        log.info("Received request to /ping endpoint");
        log.debug("Debug log - useful during development");
        log.warn("Warn log - test warning");
        log.error("Error log - simulated error");

        return "pong";
    }
}
