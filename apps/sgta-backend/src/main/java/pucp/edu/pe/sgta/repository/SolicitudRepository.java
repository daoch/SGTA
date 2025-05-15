package pucp.edu.pe.sgta.repository;

import pucp.edu.pe.sgta.model.Solicitud;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Integer>{
    List<Solicitud> findByTipoSolicitudId(Integer tipoSolicitudId);
    List<Solicitud> findByTipoSolicitudNombre(String tipoSolicitudNombre);
}
