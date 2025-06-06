package pucp.edu.pe.sgta.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, Object>> handleException(Exception ex, HttpServletRequest request) {
		log.error("Unexpected error occurred at {}: {}", request.getRequestURI(), ex.getMessage(), ex);
		Map<String, Object> response = response = mapResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", ex, request);
		return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(CustomException.class)
	public ResponseEntity<Map<String, Object>> handleCustomException(CustomException ex, HttpServletRequest request) {
		log.warn("Custom error occurred at {}: {}", request.getRequestURI(), ex.getMessage(), ex);
		Map<String, Object> response = mapResponse(HttpStatus.BAD_REQUEST,"Bad Request",ex,request);
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}

	private Map<String, Object> mapResponse(HttpStatus status, String error, Exception ex, HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		response.put("timestamp", LocalDateTime.now());
		response.put("status", status.value());
		response.put("error", error);
		response.put("message", ex.getMessage());
		response.put("path", request.getRequestURI());
		return response;
	}

}
