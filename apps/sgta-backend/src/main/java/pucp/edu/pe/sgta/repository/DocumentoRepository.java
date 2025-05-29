package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import pucp.edu.pe.sgta.model.Documento;

import java.util.List;

@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Integer> {

    @Query(value = "SELECT * FROM  listar_documentos_x_entregable(:entregableId)", nativeQuery = true)
    List<Object[]> listarDocumentosPorEntregable(@Param("entregableId") Integer entregableId);
} 