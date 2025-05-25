package pucp.edu.pe.sgta.service.inter;

import org.springframework.http.ResponseEntity;
import pucp.edu.pe.sgta.dto.*;
import pucp.edu.pe.sgta.dto.exposiciones.EstadoControlExposicionRequest;
import pucp.edu.pe.sgta.dto.exposiciones.EstadoExposicionJuradoRequest;
import pucp.edu.pe.sgta.dto.exposiciones.ExposicionTemaMiembrosDto;
import pucp.edu.pe.sgta.dto.temas.DetalleTemaDto;
import pucp.edu.pe.sgta.model.UsuarioXTema;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface MiembroJuradoService {

	public List<MiembroJuradoDto> obtenerUsuarioTemaInfo();

	public List<Object[]> findAreaConocimientoByUsuarioId(Integer usuarioId);

	public List<MiembroJuradoDto> obtenerUsuariosPorEstado(Boolean activoParam);

	public List<MiembroJuradoDto> obtenerUsuariosPorAreaConocimiento(Integer areaConocimientoId);

	public Optional<Map<String, Object>> deleteUserJurado(Integer usuarioId);

	public List<JuradoXAreaConocimientoDto> findAreaConocimientoByUser(Integer usuarioId);

	ResponseEntity<?> asignarJuradoATema(AsignarJuradoRequest request);

	List<MiembroJuradoXTemaDto> findByUsuarioIdAndActivoTrueAndRolId(Integer usuarioId);

	List<MiembroJuradoXTemaTesisDto> findTemaTesisByUsuario(Integer usuarioId);

	List<MiembroJuradoXTemaDto> findTemasDeOtrosJurados(Integer usuarioId);

	ResponseEntity<?> desasignarJuradoDeTema(AsignarJuradoRequest request);

	// Va para temas pero lo he colocado aquí
	public DetalleTemaDto obtenerDetalleTema(Integer temaId);

	ResponseEntity<?> desasignarJuradoDeTemaTodos(Integer usuarioId);

	// Detalle exposición Jurado
	List<ExposicionTemaMiembrosDto> listarExposicionXJuradoId(Integer juradoId);

	ResponseEntity<?> actualizarEstadoExposicionJurado(EstadoExposicionJuradoRequest request);

	ResponseEntity<?> actualizarEstadoControlExposicion(EstadoControlExposicionRequest request);

}
