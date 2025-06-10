package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.HistorialTemaDto;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.model.HistorialTema;
import pucp.edu.pe.sgta.model.Proyecto;
import pucp.edu.pe.sgta.model.Carrera;
import pucp.edu.pe.sgta.model.EstadoTema;

public class HistorialTemaMapper {

    public static HistorialTemaDto toDto(HistorialTema historialTema) {
        if (historialTema == null) {
            return null;
        }
        TemaDto temaDto = TemaMapper.toDto(historialTema.getTema());
        
        HistorialTemaDto dto = HistorialTemaDto.builder()
            .id(historialTema.getId())
            .tema(temaDto)
            .codigo(historialTema.getCodigo())
            .titulo(historialTema.getTitulo())
            .resumen(historialTema.getResumen())
            .metodologia(historialTema.getMetodologia())
            .objetivos(historialTema.getObjetivos())
            .descripcionCambio(historialTema.getDescripcionCambio())
            .portafolioUrl(historialTema.getPortafolioUrl())
            .proyectoId(historialTema.getProyecto() != null ? historialTema.getProyecto().getId() : null)
            .carrera(CarreraMapper.toDto(historialTema.getCarrera()))
            .fechaLimite(historialTema.getFechaLimite())
            .fechaFinalizacion(historialTema.getFechaFinalizacion())
            .activo(historialTema.getActivo())
            .fechaCreacion(historialTema.getFechaCreacion())
            .fechaModificacion(historialTema.getFechaModificacion())
            .build();
            if (historialTema.getEstadoTema() != null) {
            dto.setEstadoTemaNombre(historialTema.getEstadoTema().getNombre());
            }
        return dto;
    }

    public static HistorialTema toEntity(HistorialTemaDto dto) {
        if (dto == null) {
            return null;
        }
        HistorialTema entity = new HistorialTema();
        entity.setId(dto.getId());
        entity.setTema(dto.getTema() != null ? TemaMapper.toEntity(dto.getTema()) : null);
        entity.setCodigo(dto.getCodigo());
        entity.setTitulo(dto.getTitulo());
        entity.setResumen(dto.getResumen());
        entity.setMetodologia(dto.getMetodologia());
        entity.setObjetivos(dto.getObjetivos());
        entity.setDescripcionCambio(dto.getDescripcionCambio());
        entity.setPortafolioUrl(dto.getPortafolioUrl());
        if (dto.getCarrera() != null && dto.getCarrera().getId() != null) {
            Carrera carrera = new Carrera();
            carrera.setId(dto.getCarrera().getId());
            carrera.setNombre(dto.getCarrera().getNombre());
            entity.setCarrera(carrera);
        }
    //     if (dto.getEstadoTemaNombre() != null) {
    // // sólo seteamos el nombre; el servicio se encargará de buscar la entidad completa
    //         EstadoTema et = new EstadoTema();
    //         et.setNombre(dto.getEstadoTemaNombre());
    //         entity.setEstadoTema(et);
    //     }
        //entity.setCarrera(dto.getCarrera() != null ? CarreraMapper.toEntity(dto.getCarrera()) : null);
        entity.setFechaLimite(dto.getFechaLimite());
        entity.setFechaFinalizacion(dto.getFechaFinalizacion());
        entity.setActivo(dto.getActivo());
        return entity;
    }
}
