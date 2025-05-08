package pucp.edu.pe.sgta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pucp.edu.pe.sgta.model.Solicitud;
import pucp.edu.pe.sgta.model.UsuarioXSolicitud;

@Repository
public interface UsuarioXSolicitudRepository extends JpaRepository<UsuarioXSolicitud, Integer>{

    List<UsuarioXSolicitud> findBySolicitud(Solicitud solicitud);
}
