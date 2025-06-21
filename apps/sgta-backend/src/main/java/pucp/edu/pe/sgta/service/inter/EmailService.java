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
} 