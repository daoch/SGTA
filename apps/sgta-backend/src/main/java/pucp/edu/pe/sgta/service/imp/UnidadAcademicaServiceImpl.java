package pucp.edu.pe.sgta.service.imp;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.service.inter.UnidadAcademicaService;
import pucp.edu.pe.sgta.dto.UnidadAcademicaDto;
import pucp.edu.pe.sgta.mapper.UnidadAcademicaMapper;
import pucp.edu.pe.sgta.repository.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UnidadAcademicaServiceImpl implements UnidadAcademicaService {
    private final UnidadAcademicaRepository unidadAcademicaRepository;

    public UnidadAcademicaServiceImpl(UnidadAcademicaRepository unidadAcademicaRepository) {
        this.unidadAcademicaRepository = unidadAcademicaRepository;
    }

    @Override
    public List<UnidadAcademicaDto> getAll() {
        return unidadAcademicaRepository.findAll().stream().map(UnidadAcademicaMapper::toDto).collect(Collectors.toList());
    }
}