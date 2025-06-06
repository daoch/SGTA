package pucp.edu.pe.sgta.service.imp;

import com.amazonaws.services.kms.model.NotFoundException;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.AsesorTesistaDto;
import pucp.edu.pe.sgta.repository.AsesorTesistaRepository;
import pucp.edu.pe.sgta.service.inter.AsesorTesistaService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AsesorTesistaImpl implements AsesorTesistaService {
    private final AsesorTesistaRepository asesorTesistaRepository;

    public AsesorTesistaImpl(AsesorTesistaRepository asesorTesistaRepository) {
        this.asesorTesistaRepository = asesorTesistaRepository;
    }

    @Override
    public List<AsesorTesistaDto> findAsesorTesista(String carrera) {
        List<Object[]> results = this.asesorTesistaRepository.findAsesorTesistaByCarrera(carrera);

        if (results.isEmpty()) {
            throw new NotFoundException("No se encontraron asesores y tesistas para la carrera ingresada: " + carrera);
        }

        // Convertir Object[] a DTO
        return results.stream()
                .map(AsesorTesistaDto::new)
                .collect(Collectors.toList());
    }
}