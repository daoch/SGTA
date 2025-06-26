package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pucp.edu.pe.sgta.model.ControlExposicionUsuarioTema;

import java.util.List;
import java.util.Optional;

public interface ControlExposicionUsuarioTemaRepository extends JpaRepository<ControlExposicionUsuarioTema, Integer> {
    Optional<ControlExposicionUsuarioTema> findByExposicionXTema_IdAndUsuario_Id(Integer exposicionXTemaId,
            Integer usuarioXTemaId);

    List<ControlExposicionUsuarioTema> findByExposicionXTema_IdAndActivoTrue(Integer exposicionXTemaId);

    @Modifying
    @Query(value = "CALL intsertar_control_exposcion(:idExposicion, :idEtapaFormativa)", nativeQuery = true)
    void insertarControlesDeExposicion(@Param("idExposicion") Integer exposicionId,
            @Param("idEtapaFormativa") Integer etapaFormativa);

    @Modifying
    @Query(value = "CALL update_estado_exposicion_usuario(:p_exposicion_id, :p_tema_id)", nativeQuery = true)
    default void updateEstadoRespuestaExposicion(@Param("p_exposicion_id") Integer exposicionId,
                                                 @Param("p_exposicion_id") Integer etapaFormativa) {

    }

    @Modifying
    @Query(value = "CALL aceptar_invitacion_correo(:p_token_unico)",nativeQuery = true)
    void aceptarInvitacionCorreo(@Param("p_token_unico") String tokenUnico);

    @Modifying
    @Query(value = "CALL rechazar_invitacion_correo(:p_token_unico)",nativeQuery = true)
    void rechazarInvitacionCorreo(@Param("p_token_unico") String tokenUnico);

    @Modifying
    @Query(value = "CALL set_token_unico(:p_id_usuario,:p_token_unico,:p_id_exposicion,:p_id_tema)",nativeQuery = true)
    void setTokenUnico(@Param("p_id_usuario") Integer idUsuario, @Param("p_token_unico") String tokenUnico ,@Param("p_id_exposicion") Integer idExposicion,@Param("p_id_tema") Integer idTema);


}
