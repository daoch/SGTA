package pucp.edu.pe.sgta.job;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.stereotype.Component;
import pucp.edu.pe.sgta.model.BloqueHorarioExposicion;
import pucp.edu.pe.sgta.model.ExposicionXTema;
import pucp.edu.pe.sgta.model.JornadaExposicion;
import pucp.edu.pe.sgta.model.JornadaExposicionXSalaExposicion;
import pucp.edu.pe.sgta.repository.BloqueHorarioExposicionRepository;
import pucp.edu.pe.sgta.repository.ExposicionXTemaRepository;
import pucp.edu.pe.sgta.repository.JornadaExposicionRepository;
import pucp.edu.pe.sgta.repository.JornadaExposicionXSalaExposicionRepository;
import pucp.edu.pe.sgta.util.EstadoExposicion;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@Component
public class EstadoExposicionJob implements Job {

    private final JornadaExposicionRepository jornadaExposicionRepository;

    private final JornadaExposicionXSalaExposicionRepository jornadaXSalaRepository;

    private final BloqueHorarioExposicionRepository bloqueHorarioRepository;

    private final ExposicionXTemaRepository exposicionXTemaRepository;

    public EstadoExposicionJob(JornadaExposicionRepository jornadaExposicionRepository,
            JornadaExposicionXSalaExposicionRepository jornadaXSalaRepository,
            BloqueHorarioExposicionRepository bloqueHorarioRepository,
            ExposicionXTemaRepository exposicionXTemaRepository) {
        this.jornadaExposicionRepository = jornadaExposicionRepository;
        this.jornadaXSalaRepository = jornadaXSalaRepository;
        this.bloqueHorarioRepository = bloqueHorarioRepository;
        this.exposicionXTemaRepository = exposicionXTemaRepository;
    }

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        OffsetDateTime ahora = OffsetDateTime.now(ZoneId.of("America/Lima"));

        List<JornadaExposicion> jornadas = jornadaExposicionRepository.findAll();

        for (JornadaExposicion jornada : jornadas) {
            OffsetDateTime fin = jornada.getDatetimeFin();

            if (fin.isBefore(ahora)) {
                List<JornadaExposicionXSalaExposicion> salas = jornadaXSalaRepository
                        .findByJornadaExposicionId(jornada.getId());

                for (JornadaExposicionXSalaExposicion sala : salas) {
                    List<BloqueHorarioExposicion> bloques = bloqueHorarioRepository
                            .findByJornadaExposicionXSalaId(Long.valueOf(sala.getId()));
                    for (BloqueHorarioExposicion bloque : bloques) {
                        ExposicionXTema exposicion = bloque.getExposicionXTema();

                        if (exposicion == null) {
                            continue;
                        }
                        if (exposicion.getEstadoExposicion() == EstadoExposicion.PROGRAMADA) {
                            exposicion.setEstadoExposicion(EstadoExposicion.COMPLETADA);
                            exposicionXTemaRepository.save(exposicion);
                        }
                    }
                }
            }
        }
    }
}
