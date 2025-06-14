package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import pucp.edu.pe.sgta.model.TipoDedicacion;

import java.util.Optional;

public interface TipoDedicacionRepository extends JpaRepository<TipoDedicacion, Integer> {
    Optional<TipoDedicacion> findByInicialesIgnoreCase(String iniciales);
}
