package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pucp.edu.pe.sgta.model.Documento;

@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Integer> {

}