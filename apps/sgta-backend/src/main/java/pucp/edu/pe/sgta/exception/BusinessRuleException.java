package pucp.edu.pe.sgta.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Excepción para indicar una violación de una regla de negocio.
 * Por ejemplo, intentar crear una entidad que lógicamente no debería crearse
 * (ej. un duplicado funcional, una acción no permitida en el estado actual, etc.).
 *
 * Usualmente resulta en una respuesta HTTP 400 (Bad Request) o 409 (Conflict).
 */
@ResponseStatus(HttpStatus.BAD_REQUEST) // Por defecto, esta excepción resultará en un 400 Bad Request
// Puedes cambiarlo a HttpStatus.CONFLICT (409) si es más apropiado
// para ciertos casos de duplicados.
public class BusinessRuleException extends RuntimeException {

    public BusinessRuleException(String message) {
        super(message);
    }

    public BusinessRuleException(String message, Throwable cause) {
        super(message, cause);
    }
}