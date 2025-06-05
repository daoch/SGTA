package pucp.edu.pe.sgta.exception;

public class EntityNotFound extends RuntimeException {
    public EntityNotFound(String entityName, int entityId) {
      super("No se encontró " + entityName + " con el id " + entityId);
    }
}
