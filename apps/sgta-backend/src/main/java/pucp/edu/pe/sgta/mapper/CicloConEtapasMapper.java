package pucp.edu.pe.sgta.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;

import pucp.edu.pe.sgta.dto.CicloConEtapasDTO;

public class CicloConEtapasMapper {

	public static CicloConEtapasDTO mapRow(ResultSet rs) throws SQLException {
		List<String> etapas = rs.getArray("etapas_formativas") != null
				? Arrays.asList((String[]) rs.getArray("etapas_formativas").getArray()) : List.of();

		return CicloConEtapasDTO.builder()
			.id(rs.getInt("ciclo_id"))
			.semestre(rs.getString("semestre"))
			.anio(rs.getInt("anio"))
			.fechaInicio(rs.getDate("fecha_inicio").toLocalDate())
			.fechaFin(rs.getDate("fecha_fin").toLocalDate())
			.activo(rs.getBoolean("activo"))
			.fechaCreacion(rs.getObject("fecha_creacion", OffsetDateTime.class))
			.fechaModificacion(rs.getObject("fecha_modificacion", OffsetDateTime.class))
			.etapasFormativas(etapas)
			.cantidadEtapas(rs.getInt("cantidad_etapas"))
			.build();
	}

}
