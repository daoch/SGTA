package pucp.edu.pe.sgta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sgta.model.Reunion;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReunionRepository extends JpaRepository<Reunion, Integer> {

    // Buscar reuniones activas
    List<Reunion> findByActivoTrue();

    // Buscar reuniones disponibles
    List<Reunion> findByDisponibleTrueAndActivoTrue();

    // Buscar reunión por ID y activa
    Optional<Reunion> findByIdAndActivoTrue(Integer id);

    // Buscar reuniones por rango de fechas
    @Query("SELECT r FROM Reunion r WHERE r.fechaHoraInicio >= :fechaInicio AND r.fechaHoraFin <= :fechaFin AND r.activo = true")
    List<Reunion> findReunionesEnRangoFechas(@Param("fechaInicio") OffsetDateTime fechaInicio,
                                             @Param("fechaFin") OffsetDateTime fechaFin);

    // Buscar reuniones futuras
    @Query("SELECT r FROM Reunion r WHERE r.fechaHoraInicio > :fechaActual AND r.activo = true ORDER BY r.fechaHoraInicio ASC")
    List<Reunion> findReunionesFuturas(@Param("fechaActual") OffsetDateTime fechaActual);

    // Buscar reuniones pasadas
    @Query("SELECT r FROM Reunion r WHERE r.fechaHoraFin < :fechaActual AND r.activo = true ORDER BY r.fechaHoraInicio DESC")
    List<Reunion> findReunionesPasadas(@Param("fechaActual") OffsetDateTime fechaActual);

    // Buscar reuniones por título (contiene texto)
    List<Reunion> findByTituloContainingIgnoreCaseAndActivoTrue(String titulo);

    // Verificar si hay conflicto de horarios
    @Query("SELECT COUNT(r) > 0 FROM Reunion r WHERE r.activo = true AND " +
            "((r.fechaHoraInicio <= :fechaInicio AND r.fechaHoraFin > :fechaInicio) OR " +
            "(r.fechaHoraInicio < :fechaFin AND r.fechaHoraFin >= :fechaFin) OR " +
            "(r.fechaHoraInicio >= :fechaInicio AND r.fechaHoraFin <= :fechaFin))")
    boolean existeConflictoHorarios(@Param("fechaInicio") OffsetDateTime fechaInicio,
                                    @Param("fechaFin") OffsetDateTime fechaFin);

}