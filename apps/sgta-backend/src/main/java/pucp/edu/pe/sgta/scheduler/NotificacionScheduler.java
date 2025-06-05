package pucp.edu.pe.sgta.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import pucp.edu.pe.sgta.service.inter.NotificacionService;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificacionScheduler {

    private final NotificacionService notificacionService;

    /**
     * Tarea diaria a las 08:00 AM para generar recordatorios automáticos
     * Genera recordatorios 7, 3 y 1 día antes de cada fecha prevista
     * 
     * Expresión cron: "0 0 8 * * *" = segundo 0, minuto 0, hora 8, cualquier día del mes, cualquier mes, cualquier día de la semana
     */
    @Scheduled(cron = "0 0 8 * * *")
    public void generarRecordatoriosDiarios() {
        log.info("=== INICIANDO TAREA PROGRAMADA: Generación de recordatorios diarios ===");
        try {
            notificacionService.generarRecordatoriosAutomaticos();
            log.info("=== COMPLETADA TAREA PROGRAMADA: Generación de recordatorios diarios ===");
        } catch (Exception e) {
            log.error("Error en la tarea programada de recordatorios diarios: {}", e.getMessage(), e);
        }
    }

    /**
     * Tarea que se ejecuta cada hora para generar alertas de entregables vencidos
     * Genera alertas inmediatas al superar la fecha prevista sin entrega
     * 
     * Expresión cron: "0 0 * * * *" = segundo 0, minuto 0, cualquier hora, cualquier día del mes, cualquier mes, cualquier día de la semana
     */
    @Scheduled(cron = "0 0 * * * *")
    public void generarAlertasVencidosHorario() {
        log.info("=== INICIANDO TAREA PROGRAMADA: Generación de alertas de vencidos ===");
        try {
            notificacionService.generarAlertasVencidos();
            log.info("=== COMPLETADA TAREA PROGRAMADA: Generación de alertas de vencidos ===");
        } catch (Exception e) {
            log.error("Error en la tarea programada de alertas de vencidos: {}", e.getMessage(), e);
        }
    }

    /**
     * Tarea de prueba que se ejecuta cada 5 minutos (solo para desarrollo/testing)
     * Comentar o eliminar en producción
     */
    // @Scheduled(cron = "0 */5 * * * *")
    public void tareaTestRecordatorios() {
        log.info("=== TAREA DE PRUEBA: Generando recordatorios (cada 5 minutos) ===");
        try {
            notificacionService.generarRecordatoriosAutomaticos();
            notificacionService.generarAlertasVencidos();
            log.info("=== COMPLETADA TAREA DE PRUEBA ===");
        } catch (Exception e) {
            log.error("Error en la tarea de prueba: {}", e.getMessage(), e);
        }
    }
} 