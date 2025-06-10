package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pucp.edu.pe.sgta.model.UsuarioXRol;

import java.util.Collection;
import java.util.List;

public interface UsuarioXRolRepository extends JpaRepository<UsuarioXRol, Integer> {
    List<UsuarioXRol> findByUsuarioIdIn(Collection<Integer> ids);
    boolean existsByUsuarioIdAndRolNombreIgnoreCase(Integer usuarioId, String rolNombre);
    @Query(value = """
        SELECT * FROM es_profesor_asesor(:usuarioId)
        """, nativeQuery = true)
    List<Object[]> esProfesorAsesor(
            @Param("usuarioId") Integer usuarioId
    );
    @Query(value = """
        SELECT * FROM es_usuario_alumno(:usuarioId)
        """, nativeQuery = true)
    List<Object[]> esUsuarioAlumno(
            @Param("usuarioId") Integer usuarioId
    );
    List<UsuarioXRol> findByUsuarioIdAndActivoTrue(Integer usuarioId);
    List<UsuarioXRol> findByUsuarioId(Integer usuarioId);
    @Modifying
    @Query("DELETE FROM UsuarioXRol ur WHERE ur.usuario.id = :usuarioId")
    void deleteByUsuarioId(@Param("usuarioId") Integer usuarioId);

    boolean existsByUsuario_IdCognitoAndRol_Nombre(String usuarioIdCognito, String rolNombre);
}
