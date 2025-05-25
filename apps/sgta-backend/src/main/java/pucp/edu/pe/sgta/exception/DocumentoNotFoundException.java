package pucp.edu.pe.sgta.exception;

public class DocumentoNotFoundException extends RuntimeException {

	public DocumentoNotFoundException(String message) {
		super(message);
	}

	public DocumentoNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}

}