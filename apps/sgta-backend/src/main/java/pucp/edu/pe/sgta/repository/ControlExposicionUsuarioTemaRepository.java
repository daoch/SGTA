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
    @Query(value = "CALL intsertar_control_exposcion(:idExposicion, :idEtapaFormativa)", nativeQuery = true)
    void insertarControlesDeExposicion(@Param("idExposicion") Integer exposicionId,
                                       @Param("idEtapaFormativa") Integer etapaFormativa);;

    @Modifying
    @Query(value = "CALL update_estado_exposicion_usuario(:p_exposicion_id, :p_tema_id)", nativeQuery = true)
    void updateEstadoRespuestaExposicion(@Param("p_exposicion_id") Integer exposicionId,
                                       @Param("p_exposicion_id") Integer etapaFormativa);
}
