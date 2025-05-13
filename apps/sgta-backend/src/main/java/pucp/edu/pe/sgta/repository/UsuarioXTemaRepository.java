package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.UsuarioXTema;

import java.util.List;

@Repository
public interface UsuarioXTemaRepository extends JpaRepository<UsuarioXTema, Integer> {

	List<UsuarioXTema> findByUsuarioIdAndActivoTrue(Integer usuarioId);
	@Query(value = """
        SELECT *
            FROM obtener_numero_tesistas_asesor(:id)
    """, nativeQuery = true)
	List<Object[]> listarNumeroTesistasAsesor(@Param("id")Integer idAsesor);





	@Query(value = """
        SELECT *
            FROM obtener_tesistas_tema(:id)
    """, nativeQuery = true)
	List<Object[]> listarTesistasTema(@Param("id") Integer idTema);


    // Comprueba si el tesista está asignado a un tema
    boolean existsByUsuarioIdAndRolNombreAndActivoTrueAndAsignadoTrue(
        Integer usuarioId,
        String rolNombre
    );
}
