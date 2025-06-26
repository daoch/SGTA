package pucp.edu.pe.sgta.service.imp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.EmailNotificacionDto;
import pucp.edu.pe.sgta.service.inter.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String remitente;
    
    @Value("${app.name:SGTA}")
    private String nombreApp;
    
    @Value("${app.url:https://dev.app.sgta.lat}")
    private String urlApp;
    
    // Patrón para validar email
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    @Override
    public void enviarRecordatorioEntregable(String destinatario, String nombreCompleto, 
                                           String nombreEntregable, String fechaVencimiento, 
                                           int diasRestantes) {
        try {
            if (!esEmailValido(destinatario)) {
                log.warn("Correo electrónico inválido: {}", destinatario);
                return;
            }
            
            String asunto = String.format("📋 Recordatorio: %s vence %s", 
                                        nombreEntregable, 
                                        diasRestantes == 0 ? "HOY" : 
                                        diasRestantes == 1 ? "MAÑANA" : 
                                        "en " + diasRestantes + " días");
            
            String contenidoHtml = construirHtmlRecordatorio(nombreCompleto, nombreEntregable, 
                                                           fechaVencimiento, diasRestantes);
            
            enviarCorreoHtml(destinatario, asunto, contenidoHtml);
            
            log.info("Recordatorio enviado exitosamente a {} para entregable: {}", 
                    destinatario, nombreEntregable);
                    
        } catch (Exception e) {
            log.error("Error al enviar recordatorio a {}: {}", destinatario, e.getMessage(), e);
        }
    }

    @Override
    public void enviarAlertaEntregableVencido(String destinatario, String nombreCompleto,
                                            String nombreEntregable, String fechaVencimiento, 
                                            int diasAtraso) {
        try {
            if (!esEmailValido(destinatario)) {
                log.warn("Correo electrónico inválido: {}", destinatario);
                return;
            }
            
            String asunto = String.format("⚠️ ALERTA: %s está vencido (%d %s de retraso)", 
                                        nombreEntregable, diasAtraso,
                                        diasAtraso == 1 ? "día" : "días");
            
            String contenidoHtml = construirHtmlAlerta(nombreCompleto, nombreEntregable, 
                                                     fechaVencimiento, diasAtraso);
            
            enviarCorreoHtml(destinatario, asunto, contenidoHtml);
            
            log.info("Alerta de vencimiento enviada exitosamente a {} para entregable: {}", 
                    destinatario, nombreEntregable);
                    
        } catch (Exception e) {
            log.error("Error al enviar alerta a {}: {}", destinatario, e.getMessage(), e);
        }
    }

    @Override
    public void enviarNotificacionGenerica(EmailNotificacionDto emailDto) {
        try {
            if (!esEmailValido(emailDto.getDestinatario())) {
                log.warn("Correo electrónico inválido: {}", emailDto.getDestinatario());
                return;
            }
            
            String contenidoHtml = construirHtmlGenerico(emailDto);
            enviarCorreoHtml(emailDto.getDestinatario(), emailDto.getAsunto(), contenidoHtml);
            
            log.info("Notificación genérica enviada exitosamente a {}", emailDto.getDestinatario());
            
        } catch (Exception e) {
            log.error("Error al enviar notificación genérica a {}: {}", 
                     emailDto.getDestinatario(), e.getMessage(), e);
        }
    }

    @Override
    public boolean esEmailValido(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    private void enviarCorreoHtml(String destinatario, String asunto, String contenidoHtml) 
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(remitente);
        helper.setTo(destinatario);
        helper.setSubject(asunto);
        helper.setText(contenidoHtml, true);
        
        mailSender.send(message);
    }

    private String construirHtmlRecordatorio(String nombreCompleto, String nombreEntregable, 
                                           String fechaVencimiento, int diasRestantes) {
        String urgencia = diasRestantes == 0 ? "HOY" : 
                         diasRestantes == 1 ? "MAÑANA" : 
                         "en " + diasRestantes + " días";
        
        String colorUrgencia = diasRestantes == 0 ? "#dc3545" : 
                              diasRestantes == 1 ? "#fd7e14" : "#007bff";
        
        return String.format(
            "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "<meta charset=\"UTF-8\">" +
            "<title>Recordatorio de Entregable</title>" +
            "<style>" +
            "body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }" +
            ".container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }" +
            ".header { text-align: center; margin-bottom: 30px; }" +
            ".logo { color: #007bff; font-size: 24px; font-weight: bold; }" +
            ".urgencia { color: %s; font-size: 20px; font-weight: bold; margin: 20px 0; }" +
            ".entregable { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }" +
            ".fecha { color: #6c757d; font-size: 14px; }" +
            ".footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 12px; }" +
            ".btn { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }" +
            "</style>" +
            "</head>" +
            "<body>" +
            "<div class=\"container\">" +
            "<div class=\"header\">" +
            "<div class=\"logo\">📋 %s</div>" +
            "<h2>Recordatorio de Entregable</h2>" +
            "</div>" +
            "<p>Hola <strong>%s</strong>,</p>" +
            "<p>Te recordamos que tienes un entregable pendiente:</p>" +
            "<div class=\"entregable\">" +
            "<h3>📄 %s</h3>" +
            "<p class=\"urgencia\">⏰ Vence %s</p>" +
            "<p class=\"fecha\">📅 Fecha límite: %s</p>" +
            "</div>" +
            "<p>Te recomendamos que revises los detalles y prepares tu entrega con anticipación.</p>" +
            "<div style=\"text-align: center;\">" +
            "<a href=\"%s\" class=\"btn\">Ir al Sistema</a>" +
            "</div>" +
            "<div class=\"footer\">" +
            "<p>Este es un mensaje automático del Sistema de Gestión de Tesis y Asesorías (SGTA)</p>" +
            "<p>Por favor no respondas a este correo.</p>" +
            "</div>" +
            "</div>" +
            "</body>" +
            "</html>", 
            colorUrgencia, nombreApp, nombreCompleto, nombreEntregable, 
            urgencia, fechaVencimiento, urlApp);
    }

    private String construirHtmlAlerta(String nombreCompleto, String nombreEntregable, 
                                     String fechaVencimiento, int diasAtraso) {
        return String.format(
            "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "<meta charset=\"UTF-8\">" +
            "<title>Alerta - Entregable Vencido</title>" +
            "<style>" +
            "body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }" +
            ".container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }" +
            ".header { text-align: center; margin-bottom: 30px; }" +
            ".logo { color: #dc3545; font-size: 24px; font-weight: bold; }" +
            ".alerta { background-color: #f8d7da; color: #721c24; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545; }" +
            ".entregable { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }" +
            ".fecha { color: #6c757d; font-size: 14px; }" +
            ".footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 12px; }" +
            ".btn { display: inline-block; padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }" +
            "</style>" +
            "</head>" +
            "<body>" +
            "<div class=\"container\">" +
            "<div class=\"header\">" +
            "<div class=\"logo\">⚠️ %s</div>" +
            "<h2>ALERTA: Entregable Vencido</h2>" +
            "</div>" +
            "<p>Hola <strong>%s</strong>,</p>" +
            "<div class=\"alerta\">" +
            "<h3>⚠️ ATENCIÓN: Entregable vencido</h3>" +
            "<p>Tienes un entregable que ya ha superado su fecha límite de entrega.</p>" +
            "</div>" +
            "<div class=\"entregable\">" +
            "<h3>📄 %s</h3>" +
            "<p><strong>🔴 Vencido hace %d %s</strong></p>" +
            "<p class=\"fecha\">📅 Fecha límite: %s</p>" +
            "</div>" +
            "<p><strong>Acción requerida:</strong> Te recomendamos que te pongas en contacto con tu asesor " +
            "lo antes posible para coordinar la entrega y evaluar las posibles consecuencias del retraso.</p>" +
            "<div style=\"text-align: center;\">" +
            "<a href=\"%s\" class=\"btn\">Ir al Sistema</a>" +
            "</div>" +
            "<div class=\"footer\">" +
            "<p>Este es un mensaje automático del Sistema de Gestión de Tesis y Asesorías (SGTA)</p>" +
            "<p>Por favor no respondas a este correo.</p>" +
            "</div>" +
            "</div>" +
            "</body>" +
            "</html>", 
            nombreApp, nombreCompleto, nombreEntregable, diasAtraso,
            diasAtraso == 1 ? "día" : "días", fechaVencimiento, urlApp);
    }

    private String construirHtmlGenerico(EmailNotificacionDto emailDto) {
        return String.format(
            "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "<meta charset=\"UTF-8\">" +
            "<title>%s</title>" +
            "<style>" +
            "body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }" +
            ".container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }" +
            ".header { text-align: center; margin-bottom: 30px; }" +
            ".logo { color: #007bff; font-size: 24px; font-weight: bold; }" +
            ".mensaje { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }" +
            ".footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 12px; }" +
            ".btn { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }" +
            "</style>" +
            "</head>" +
            "<body>" +
            "<div class=\"container\">" +
            "<div class=\"header\">" +
            "<div class=\"logo\">📧 %s</div>" +
            "<h2>%s</h2>" +
            "</div>" +
            "<p>Hola <strong>%s</strong>,</p>" +
            "<div class=\"mensaje\">" +
            "%s" +
            "</div>" +
            "<div style=\"text-align: center;\">" +
            "<a href=\"%s\" class=\"btn\">Ir al Sistema</a>" +
            "</div>" +
            "<div class=\"footer\">" +
            "<p>Este es un mensaje automático del Sistema de Gestión de Tesis y Asesorías (SGTA)</p>" +
            "<p>Por favor no respondas a este correo.</p>" +
            "</div>" +
            "</div>" +
            "</body>" +
            "</html>", 
            emailDto.getAsunto(), nombreApp, emailDto.getAsunto(), 
            emailDto.getNombreDestinatario(), emailDto.getMensaje(), urlApp);
    }

    @Override
    public void enviarNotificacionEstadoEntregable(String destinatario, String nombreCompleto,String nombreDocumento, String nombreEntregable, String estado) {
        try {
            if (!esEmailValido(destinatario)) {
                log.warn("Correo electrónico inválido: {}", destinatario);
                return;
            }

            String asunto = String.format("📢 Entregable %s ha sido %s", nombreEntregable, estado.toUpperCase());
            String contenidoHtml = construirHtmlNotificacionEstado(nombreCompleto,nombreDocumento, nombreEntregable, estado);

            enviarCorreoHtml(destinatario, asunto, contenidoHtml);

            log.info("Notificación de estado enviada a {} para entregable: {}", destinatario, nombreEntregable);
        } catch (Exception e) {
            log.error("Error al enviar notificación de estado a {}: {}", destinatario, e.getMessage(), e);
        }
    }

    @Override
    public void enviarNotificacionEstadoEntregableRevisor(String destinatario, String nombreCompleto, String nombreCompletoAlumno,String nombreDocumento, String nombreEntregable, String estado) {
        try {
            if (!esEmailValido(destinatario)) {
                log.warn("Correo electrónico inválido: {}", destinatario);
                return;
            }

            String asunto = String.format("📢 El entregable %s ha sido %s", nombreEntregable, estado.toUpperCase());
            String contenidoHtml = construirHtmlNotificacionEstadoRevisor(nombreCompleto,nombreCompletoAlumno,nombreDocumento, nombreEntregable, estado);

            enviarCorreoHtml(destinatario, asunto, contenidoHtml);

            log.info("Notificación de estado enviada a {} para entregable: {}", destinatario, nombreEntregable);
        } catch (Exception e) {
            log.error("Error al enviar notificación de estado a {}: {}", destinatario, e.getMessage(), e);
        }
    }

    private String construirHtmlNotificacionEstado(String nombreCompleto,String nombreDocumento, String nombreEntregable, String estado) {
        String colorEstado = estado.equalsIgnoreCase("aprobado") ? "#28a745" : "#dc3545";
        String textoEstado = estado.equalsIgnoreCase("aprobado") ? "APROBADO ✅" : "RECHAZADO ❌";

        return String.format(
            "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "<meta charset=\"UTF-8\">" +
            "<title>Estado del Entregable</title>" +
            "<style>" +
            "body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }" +
            ".container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }" +
            ".header { text-align: center; margin-bottom: 30px; }" +
            ".logo { color: #007bff; font-size: 24px; font-weight: bold; }" +
            ".estado { color: %s; font-size: 20px; font-weight: bold; margin: 20px 0; }" +
            ".footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 12px; }" +
            ".btn { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }" +
            "</style>" +
            "</head>" +
            "<body>" +
            "<div class=\"container\">" +
            "<div class=\"header\">" +
            "<div class=\"logo\">📢 Estado del Entregable</div>" +
            "</div>" +
            "<p>Hola <strong>%s</strong>,</p>" +
            "<p>Te informamos que tu documento <strong>%s</strong>, perteneciente a tu entregable <strong>%s</strong> ha sido:</p>" +
            "<p class=\"estado\">%s</p>" +
            "<div style=\"text-align: center;\">" +
            "<a href=\"%s\" class=\"btn\">Ir al Sistema</a>" +
            "</div>" +
            "<div class=\"footer\">" +
            "<p>Este es un mensaje automático del Sistema de Gestión de Tesis y Asesorías (SGTA)</p>" +
            "<p>Por favor no respondas a este correo.</p>" +
            "</div>" +
            "</div>" +
            "</body>" +
            "</html>",
            colorEstado, nombreCompleto, nombreDocumento,nombreEntregable, textoEstado, urlApp
        );
    }

    private String construirHtmlNotificacionEstadoRevisor(String nombreCompleto,String nombreCompletoAlumno,String nombreDocumento, String nombreEntregable, String estado) {
        String colorEstado = estado.equalsIgnoreCase("aprobado") ? "#28a745" : "#dc3545";
        String textoEstado = estado.equalsIgnoreCase("aprobado") ? "APROBADO ✅" : "RECHAZADO ❌";

        return String.format(
            "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "<meta charset=\"UTF-8\">" +
            "<title>Estado del Entregable</title>" +
            "<style>" +
            "body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }" +
            ".container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }" +
            ".header { text-align: center; margin-bottom: 30px; }" +
            ".logo { color: #007bff; font-size: 24px; font-weight: bold; }" +
            ".estado { color: %s; font-size: 20px; font-weight: bold; margin: 20px 0; }" +
            ".footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 12px; }" +
            ".btn { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }" +
            "</style>" +
            "</head>" +
            "<body>" +
            "<div class=\"container\">" +
            "<div class=\"header\">" +
            "<div class=\"logo\">📢 Estado del Entregable</div>" +
            "</div>" +
            "<p>Hola <strong>%s</strong>,</p>" +
            "<p>Te informamos que has corregido el documento <strong>%s</strong>, perteneciente al entregable <strong>%s</strong> del alumno <strong>%s</strong> y ha sido:</p>" +
            "<p class=\"estado\">%s</p>" +
            "<div style=\"text-align: center;\">" +
            "<a href=\"%s\" class=\"btn\">Ir al Sistema</a>" +
            "</div>" +
            "<div class=\"footer\">" +
            "<p>Este es un mensaje automático del Sistema de Gestión de Tesis y Asesorías (SGTA)</p>" +
            "<p>Por favor no respondas a este correo.</p>" +
            "</div>" +
            "</div>" +
            "</body>" +
            "</html>",
            colorEstado, nombreCompleto, nombreDocumento,nombreEntregable,nombreCompletoAlumno,textoEstado, urlApp
        );
    }




} 