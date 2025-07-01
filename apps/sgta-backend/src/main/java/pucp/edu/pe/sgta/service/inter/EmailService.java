package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.EmailNotificacionDto;

public interface EmailService {
    
    /**
     * Envía un correo de recordatorio para un entregable
     */
    void enviarRecordatorioEntregable(String destinatario, String nombreCompleto, 
                                    String nombreEntregable, String fechaVencimiento, 
                                    int diasRestantes);
    
    /**
     * Envía un correo de alerta por entregable vencido
     */
    void enviarAlertaEntregableVencido(String destinatario, String nombreCompleto,
                                     String nombreEntregable, String fechaVencimiento, 
                                     int diasAtraso);
    
    /**
     * Envía un correo de notificación genérica
     */
    void enviarNotificacionGenerica(EmailNotificacionDto emailDto);
    
    /**
     * Valida si un correo electrónico tiene formato válido
     */
    boolean esEmailValido(String email);

    /**
     * Envía un correo de confirmacion al alumno si su entregable ha sido aprobado/rechazado por su asesor
     */
    void enviarNotificacionEstadoEntregable(String destinatario, String nombreCompleto, String nombreDocumento,
                                    String nombreEntregable, String estado);

    /**
     * Envía un correo de confirmacion al revisor de su aprobacion/rechazo del entregable.
     */
    void enviarNotificacionEstadoEntregableRevisor(String destinatario, String nombreCompleto, String nombreCompletoAlumno, String nombreDocumento,
                                    String nombreEntregable, String estado);
} 