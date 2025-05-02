package pucp.edu.pe.sgta.service.imp;


import jakarta.transaction.Transactional;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.SubAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.mapper.TemaMapper;
import pucp.edu.pe.sgta.mapper.UsuarioMapper;
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.repository.*;
import pucp.edu.pe.sgta.service.inter.SubAreaConocimientoService;
import pucp.edu.pe.sgta.service.inter.TemaService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import pucp.edu.pe.sgta.util.EstadoTemaEnum;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class TemaServiceImpl implements TemaService {

    private final TemaRepository temaRepository;
    private final UsuarioService usuarioService;
    private final SubAreaConocimientoService subAreaConocimientoService;

    private final UsuarioXTemaRepository usuarioXTemaRepository;
    private final SubAreaConocimientoXTemaRepository subAreaConocimientoXTemaRepository;
    private final RolRepository rolRepository;

    private final Logger logger = Logger.getLogger(TemaServiceImpl.class.getName());
    private final EstadoTemaRepository estadoTemaRepository;

    public TemaServiceImpl(TemaRepository temaRepository, UsuarioXTemaRepository usuarioXTemaRepository,
                           UsuarioService usuarioService, SubAreaConocimientoService subAreaConocimientoService,
                           SubAreaConocimientoXTemaRepository subAreaConocimientoXTemaRepository, RolRepository rolRepository, EstadoTemaRepository estadoTemaRepository) {
        this.temaRepository = temaRepository;
        this.usuarioXTemaRepository = usuarioXTemaRepository;
        this.subAreaConocimientoXTemaRepository = subAreaConocimientoXTemaRepository;
        this.subAreaConocimientoService = subAreaConocimientoService;
        this.usuarioService = usuarioService;
        this.rolRepository = rolRepository;
        this.estadoTemaRepository = estadoTemaRepository;
    }

    @Override
    public List<TemaDto> getAll() {
        List<Tema> temas = temaRepository.findAll();
        List<TemaDto> temasDto = temas.stream()
                .map(TemaMapper::toDto)
                .toList(); //we map to DTO
        return temasDto;
    }

    @Override
    public TemaDto findById(Integer id) {
        Tema tema = temaRepository.findById(id).orElse(null);
        if (tema != null) {
            return TemaMapper.toDto(tema);
        }
        return null;
    }

    @Transactional
    @Override
    public void createTemaPropuesta(TemaDto dto, Integer idUsuarioCreador) {
        dto.setId(null);
        Tema tema = TemaMapper.toEntity(dto);
        EstadoTema estadoTema = estadoTemaRepository.findByNombre(EstadoTemaEnum.PROPUESTO.name()).orElse(null);
        boolean foundSubArea = false;

        if(estadoTema == null){
            logger.severe("Alerta: EstadoTema 'PROPUESTO' no encontrado en la base de datos.");
            throw new RuntimeException("EstadoTema 'PROPUESTO' no encontrado en la base de datos.");
        }
        tema.setEstadoTema(estadoTema);

        //TO DO limit by number of cotesistas and asesores according to global config parameter

        // Create and set up UsuarioXTema

        UsuarioXTema usuarioXTema = new UsuarioXTema();
        usuarioXTema.setId(null);
        usuarioXTema.setTema(tema);

        UsuarioDto usuarioDto = usuarioService.findUsuarioById(idUsuarioCreador);

        if (usuarioDto == null) {
            throw new RuntimeException("Usuario no encontrado con ID: " + idUsuarioCreador);
        }

        // Save the Tema first to generate its ID. We assume the tema has an areaEspecializacion
        temaRepository.save(tema);

        // TO DO Start Historial Tema

        Rol rolaux = rolRepository.findByNombre("Creador").orElse(null);
        if(rolaux == null){
            logger.severe("Alerta: Rol 'Creador' no encontrado en la base de datos.");
            throw new RuntimeException("Rol 'Creador' no encontrado en la base de datos.");
        }
        usuarioXTema.setUsuario(UsuarioMapper.toEntity(usuarioDto));
        usuarioXTema.setAsignado(true);
        usuarioXTema.setActivo(true);
        usuarioXTema.setFechaCreacion(OffsetDateTime.now());
        usuarioXTema.setRol(rolaux);
        try {
            usuarioXTemaRepository.save(usuarioXTema);
        } catch (Exception ex) {
            logger.severe("Error when attempting to save tema's creator: " + ex.getMessage());
            // this RuntimeException will trigger a rollback of the entire transaction
            throw new RuntimeException("UsuarioXTema register not created. Reverting transaction.", ex);
        }
        // Save the subareas of knowledge
        if(dto.getIdSubAreasConocimientoList() == null || dto.getIdSubAreasConocimientoList().isEmpty()){
            throw new RuntimeException("No subAreaConocimiento provided. Reverting transaction.");
        }

        for(Integer idSubAreaConocimiento : dto.getIdSubAreasConocimientoList()){
            SubAreaConocimientoXTema subAreaConocimientoXTema = new SubAreaConocimientoXTema();
            subAreaConocimientoXTema.setTemaId(tema.getId());
            SubAreaConocimientoDto subAreaConocimientoDto = subAreaConocimientoService.findById(idSubAreaConocimiento);

            if (subAreaConocimientoDto == null) {
                logger.severe("Alert: SubAreaConocimiento not found with ID: " + idSubAreaConocimiento);
                continue;
            }
            else{
                foundSubArea = true;
            }
            subAreaConocimientoXTema.setSubAreaConocimientoId(idSubAreaConocimiento);
            subAreaConocimientoXTema.setFechaCreacion(OffsetDateTime.now());
            subAreaConocimientoXTemaRepository.save(subAreaConocimientoXTema);
        }

        //validate if at least one subarea was found
        if(!foundSubArea){
            logger.severe("Alerta: No valid subareaconocimientos provided.");
            throw new RuntimeException("No subAreaConocimiento provided. Reverting transaction.");
        }

        //Add the other users
        for(Integer idUsuarioInvolucrado : dto.getIdUsuarioInvolucradosList()){
            UsuarioXTema usuarioXTemaInvolucrado = new UsuarioXTema();
            usuarioXTemaInvolucrado.setId(null);
            usuarioXTemaInvolucrado.setTema(tema);

            if(idUsuarioInvolucrado.equals(idUsuarioCreador)){ //In case the same idcreador is passed as involucrado
                logger.warning("Alerta: Usuario involucrado no puede ser el creador del tema. ID: " + idUsuarioInvolucrado);
                continue;
            }

            // add rol, FIRST fetch usuario
            UsuarioDto usuarioInvolucradoDto = usuarioService.findUsuarioById(idUsuarioInvolucrado);
            if (usuarioInvolucradoDto == null) {
                logger.severe("Alerta: Usuario no encontrado con ID: " + idUsuarioInvolucrado);
                continue;
            }

            //TO DO  ver tipo de usuario
            String nombreTipoUsuario = usuarioInvolucradoDto.getTipoUsuario().getNombre();
            Rol rol = rolRepository.findByNombre(nombreTipoUsuario).orElse(null);

            if(rol == null){
                logger.severe("Alerta: Rol '" + nombreTipoUsuario + "' not found in database.");
                continue;
            }

            usuarioXTemaInvolucrado.setUsuario(UsuarioMapper.toEntity(usuarioInvolucradoDto));
            usuarioXTemaInvolucrado.setAsignado(false); //Not assigned but part of the propuesta lest he doesn't accept it
            usuarioXTemaInvolucrado.setActivo(true);
            usuarioXTemaInvolucrado.setFechaCreacion(OffsetDateTime.now());

            usuarioXTemaRepository.save(usuarioXTemaInvolucrado);
        }
    }

    @Override
    public void update(TemaDto dto) {
        Tema tema = TemaMapper.toEntity(dto);
        temaRepository.save(tema);
    }

    @Override
    public void delete(Integer id) {
        Tema tema = temaRepository.findById(id).orElse(null);
        if (tema != null) {
            tema.setActivo(false);
            temaRepository.save(tema); // Set activo to false instead of deleting
        }
    }

    @Override
    public List<TemaDto> findByUsuario(Integer idUsuario) {
        List<UsuarioXTema> relations = usuarioXTemaRepository.findByUsuarioIdAndActivoTrue(idUsuario);

        if (!relations.isEmpty()) {
            return relations.stream()
                    .map(ux -> TemaMapper.toDto(ux.getTema()))
                    .collect(Collectors.toList());
        }
        return List.of(); // Return an empty list if no relations found

    }
}