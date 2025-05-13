package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {


    // Comprueba si existe un usuario con ese id y cuyo tipoUsuario.nombre = el pasado.
    Boolean existsByIdAndTipoUsuarioNombre(Integer usuarioId, String tipoNombre);
    // verificar que usuario existe y activo
    Boolean existsByIdAndActivoTrue(Integer usuarioId);

}
