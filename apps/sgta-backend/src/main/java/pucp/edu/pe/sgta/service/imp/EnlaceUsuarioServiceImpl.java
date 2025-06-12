package pucp.edu.pe.sgta.service.imp;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.asesores.EnlaceUsuarioDto;
import pucp.edu.pe.sgta.model.EnlaceUsuario;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.repository.EnlaceUsuarioRepository;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class EnlaceUsuarioServiceImpl {
    @Autowired
    EnlaceUsuarioRepository enlaceUsuarioRepository;

    public List<EnlaceUsuarioDto> listarParaPerfilPorUsuario(Integer idUsuario) {
        List<Object[]> queryResult = enlaceUsuarioRepository.listarEnlacesParaPerfilPorUsuario(idUsuario);
        List<EnlaceUsuarioDto> enlaceUsuarios = new ArrayList<>();
        for (Object[] o : queryResult) {
            EnlaceUsuarioDto enlaceUsuario = EnlaceUsuarioDto.fromQuery(o);
            enlaceUsuarios.add(enlaceUsuario);
        }
        return enlaceUsuarios;
    }

    @Transactional
    public void sincronizarEnlacesUsuario(List<EnlaceUsuarioDto> enlacesDto, Usuario usuario) {
        // 1. Obtener enlaces actuales de la BD
        List<EnlaceUsuario> existentes = enlaceUsuarioRepository.findByUsuarioId(usuario.getId());

        // 2. Mapear existentes por ID
        Map<Integer, EnlaceUsuario> existentesMap = existentes.stream()
                .filter(e -> e.getId() != null)
                .collect(Collectors.toMap(EnlaceUsuario::getId, Function.identity()));
        // 3. Preparar listas
        List<EnlaceUsuario> nuevos = new ArrayList<>();
        List<EnlaceUsuario> actualizados = new ArrayList<>();
        Set<Integer> idsEnviados = new HashSet<>();

        for (EnlaceUsuarioDto dto : enlacesDto) {
            if (dto.getId() == null) {
                // Nuevo enlace
                EnlaceUsuario nuevo = new EnlaceUsuario();
                nuevo.setUsuario(usuario);
                nuevo.setPlataforma(dto.getPlataforma());
                nuevo.setEnlace(dto.getEnlace());
                nuevos.add(nuevo);
            } else {
                // Posible actualización
                idsEnviados.add(dto.getId());
                EnlaceUsuario actual = existentesMap.get(dto.getId());
                if (actual != null &&
                        (!Objects.equals(actual.getPlataforma(), dto.getPlataforma()) ||
                                !Objects.equals(actual.getEnlace(), dto.getEnlace()))) {
                    actual.setPlataforma(dto.getPlataforma());
                    actual.setEnlace(dto.getEnlace());
                    actualizados.add(actual);
                }
            }
        }

        // 4. Detectar eliminados (los que están en BD pero no en el nuevo listado)
        List<Integer> idsExistentes = existentes.stream()
                .map(EnlaceUsuario::getId)
                .toList();

        List<Integer> idsParaEliminar = idsExistentes.stream()
                .filter(id -> !idsEnviados.contains(id))
                .collect(Collectors.toList());

        // 5. Operaciones en BD
        if (!nuevos.isEmpty()) {
            enlaceUsuarioRepository.saveAll(nuevos);
        }
        if (!actualizados.isEmpty()) {
            enlaceUsuarioRepository.saveAll(actualizados);
        }
        if (!idsParaEliminar.isEmpty()) {
            enlaceUsuarioRepository.deleteByIdIn(idsParaEliminar);
        }
    }

}
