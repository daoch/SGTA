package pucp.edu.pe.sgta.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pucp.edu.pe.sgta.dto.UsuarioXCarreraDto;
import pucp.edu.pe.sgta.model.UsuarioXCarrera;

public interface UsuarioXCarreraRepository extends JpaRepository<UsuarioXCarrera, Integer>{
    List<UsuarioXCarrera> findByUsuarioIdAndActivoTrue(Integer usuarioId);
    List<UsuarioXCarrera> findByCarreraIdAndActivoTrue(Integer carreraId);
    boolean existsByUsuarioIdAndCarreraIdAndActivo(
                Integer usuarioId,
                Integer carreraId,
                Boolean activo
    );
    List<UsuarioXCarrera> findByUsuarioId(Integer usuarioId);
    Optional<UsuarioXCarrera> findByUsuarioIdAndCarreraId(Integer usuarioId, Integer carreraId);
    @Modifying
    @Query("DELETE FROM UsuarioXCarrera uc WHERE uc.usuario.id = :usuarioId")
    void deleteByUsuarioId(@Param("usuarioId") Integer usuarioId);

    @Query("SELECT uc FROM UsuarioXCarrera uc WHERE uc.usuario.id = :usuarioId AND uc.esCoordinador = true")
    UsuarioXCarrera getCarreraPrincipalCoordinador(@Param("usuarioId") Integer usuarioId);

    boolean existsByUsuario_IdAndEsCoordinadorTrueAndActivoTrue(Integer usuarioId);
    List<UsuarioXCarrera> findByCarreraIdAndEsCoordinadorTrueAndActivoTrue(Integer carreraId);
}
