package pucp.edu.pe.sgta.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByCodigoPucp(String codigoPucp);
}
