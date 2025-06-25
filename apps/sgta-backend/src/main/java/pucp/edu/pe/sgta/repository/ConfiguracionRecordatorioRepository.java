package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.ConfiguracionRecordatorio;

import java.util.Optional;

@Repository
public interface ConfiguracionRecordatorioRepository extends JpaRepository<ConfiguracionRecordatorio, Integer> {
    Optional<ConfiguracionRecordatorio> findByUsuarioId(Integer usuarioId);
    boolean existsByUsuarioId(Integer usuarioId);
}