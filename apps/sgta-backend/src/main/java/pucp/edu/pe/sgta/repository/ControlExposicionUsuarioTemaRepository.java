package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pucp.edu.pe.sgta.model.ControlExposicionUsuarioTema;

import java.util.Optional;

public interface ControlExposicionUsuarioTemaRepository extends JpaRepository<ControlExposicionUsuarioTema, Integer> {
    Optional<ControlExposicionUsuarioTema> findByExposicionXTema_IdAndUsuario_Id(Integer exposicionXTemaId, Integer usuarioXTemaId);

    @Modifying
    @Query(value = "CALL terminar_planificacion(:idExposicion, :idEtapaFormativa)", nativeQuery = true)
    void insertarControlesDeExposicion(@Param("idExposicion") Integer exposicionId,
                                       @Param("idEtapaFormativa") Integer etapaFormativa);

}
