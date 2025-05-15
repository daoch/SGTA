package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pucp.edu.pe.sgta.model.VersionDocumento;

@Repository
public interface VersionDocumentoRepository extends JpaRepository<VersionDocumento, Integer> {
} 