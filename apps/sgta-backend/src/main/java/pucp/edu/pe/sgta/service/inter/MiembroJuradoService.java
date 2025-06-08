package pucp.edu.pe.sgta.service.inter;

import org.springframework.http.ResponseEntity;
import pucp.edu.pe.sgta.dto.*;
import pucp.edu.pe.sgta.dto.calificacion.ExposicionCalificacionDto;
import pucp.edu.pe.sgta.dto.calificacion.ExposicionCalificacionRequest;
import pucp.edu.pe.sgta.dto.calificacion.ExposicionObservacionRequest;
import pucp.edu.pe.sgta.dto.calificacion.RevisionCriteriosRequest;
import pucp.edu.pe.sgta.dto.exposiciones.EstadoControlExposicionRequest;
import pucp.edu.pe.sgta.dto.exposiciones.EstadoExposicionJuradoRequest;
import pucp.edu.pe.sgta.dto.exposiciones.ExposicionTemaMiembrosDto;
import pucp.edu.pe.sgta.dto.temas.DetalleTemaDto;
import pucp.edu.pe.sgta.dto.exposiciones.EstadoExposicionDto;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface MiembroJuradoService {

    public List<MiembroJuradoDto> obtenerUsuarioTemaInfo();

    public List<Object[]> findAreaConocimientoByUsuarioId(Integer usuarioId);

    public List<MiembroJuradoDto> obtenerUsuariosPorEstado(Boolean activoParam);

    public List<MiembroJuradoDto> obtenerUsuariosPorAreaConocimiento(Integer areaConocimientoId);

    public Optional<Map<String, Object>> deleteUserJurado(String usuarioId);

    public List<JuradoXAreaConocimientoDto> findAreaConocimientoByUser(String usuarioId);

    ResponseEntity<?> asignarJuradoATema(AsignarJuradoRequest request,String usuarioId);

    List<MiembroJuradoXTemaDto> findByUsuarioIdAndActivoTrueAndRolId(String usuarioId);

    List<MiembroJuradoXTemaTesisDto> findTemaTesisByUsuario(String usuarioId);

    List<MiembroJuradoXTemaDto> findTemasDeOtrosJurados(String usuarioId);

    ResponseEntity<?> desasignarJuradoDeTema(AsignarJuradoRequest request,String juradoId);

    // Va para temas pero lo he colocado aquí
    public DetalleTemaDto obtenerDetalleTema(Integer temaId);

    ResponseEntity<?> desasignarJuradoDeTemaTodos(String usuarioId);

    // Detalle exposición Jurado
    List<ExposicionTemaMiembrosDto> listarExposicionXJuradoId(String juradoId);

    ResponseEntity<?> actualizarEstadoExposicionJurado(EstadoExposicionJuradoRequest request);

    ResponseEntity<?> actualizarEstadoControlExposicion(EstadoControlExposicionRequest request,String juradoId);

    List<EstadoExposicionDto> listarEstados();

    ResponseEntity<ExposicionCalificacionDto> listarExposicionCalificacion(ExposicionCalificacionRequest exposicionCalificacionRequest,String juradoId);

    ResponseEntity<?> actualizarRevisionCriterios(RevisionCriteriosRequest request);

    ResponseEntity<?> actualizarObservacionFinal(ExposicionObservacionRequest request);

}
