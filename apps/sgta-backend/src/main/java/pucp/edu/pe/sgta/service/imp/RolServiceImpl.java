package pucp.edu.pe.sgta.service.imp;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.QueryRolResponse;
import pucp.edu.pe.sgta.dto.RolDto;
import pucp.edu.pe.sgta.mapper.RolMapper;
import pucp.edu.pe.sgta.model.Rol;
import pucp.edu.pe.sgta.repository.RolRepository;
import pucp.edu.pe.sgta.service.inter.RolService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RolServiceImpl implements RolService {

    private final RolRepository rolRepository;

    public RolServiceImpl(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    @Override
    public List<RolDto> findAllRoles() {
        List<Rol> roles = rolRepository.findAll();
        return roles.stream()
                .map(RolMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public QueryRolResponse findRolesPaginated(int page, int size, String nombre) {
        Pageable pageable = PageRequest.of(page, size);
        
        // Si se proporciona un nombre, filtrar por nombre
        Page<Rol> rolesPage;
        if (nombre != null && !nombre.trim().isEmpty()) {
            // Asumiendo que exista un método en el repositorio que permita búsqueda por nombre
            // Si no existe, deberías crear uno
            rolesPage = rolRepository.findByNombreContainingIgnoreCase(nombre, pageable);
        } else {
            rolesPage = rolRepository.findAll(pageable);
        }
        
        List<RolDto> rolDtos = rolesPage.getContent().stream()
                .map(RolMapper::toDto)
                .collect(Collectors.toList());
        
        return QueryRolResponse.builder()
                .roles(rolDtos)
                .totalPages(rolesPage.getTotalPages())
                .totalElements(rolesPage.getTotalElements())
                .currentPage(rolesPage.getNumber())
                .pageSize(rolesPage.getSize())
                .build();
    }

    @Override
    public Optional<RolDto> findRolById(Integer id) {
        return rolRepository.findById(id)
                .map(RolMapper::toDto);
    }

    @Override
    public Optional<RolDto> findRolByNombre(String nombre) {
        return rolRepository.findByNombre(nombre)
                .map(RolMapper::toDto);
    }
}