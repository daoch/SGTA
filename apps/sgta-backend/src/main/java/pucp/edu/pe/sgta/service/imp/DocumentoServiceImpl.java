package pucp.edu.pe.sgta.service.imp;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sgta.dto.DocumentoConVersionDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.model.Documento;
import pucp.edu.pe.sgta.model.EntregableXTema;
import pucp.edu.pe.sgta.model.RevisionDocumento;
import pucp.edu.pe.sgta.model.VersionXDocumento;
import pucp.edu.pe.sgta.repository.DocumentoRepository;
import pucp.edu.pe.sgta.repository.EntregableRepository;
import pucp.edu.pe.sgta.service.inter.*;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class DocumentoServiceImpl implements DocumentoService {
    private final DocumentoRepository documentoRepository;
    private final VersionXDocumentoService versionXDocumentoService;
    private final S3DownloadService s3DownloadService;
    private final RevisionDocumentoService revisionDocumentoService;
    private final UsuarioService usuarioService;
    private final EntregableRepository entregableRepository;
    private final HistorialAccionService historialAccionService;
    
    private static final String S3_PATH_DELIMITER = "/";

    public DocumentoServiceImpl(DocumentoRepository documentoRepository,VersionXDocumentoService versionXDocumentoService,
                                S3DownloadService s3DownloadService, RevisionDocumentoService revisionDocumentoService,
                                UsuarioService usuarioService, EntregableRepository entregableRepository,
                                HistorialAccionService historialAccionService) {
        this.documentoRepository = documentoRepository;
        this.versionXDocumentoService = versionXDocumentoService;
        this.s3DownloadService = s3DownloadService;
        this.revisionDocumentoService = revisionDocumentoService;
        this.usuarioService = usuarioService;
        this.entregableRepository = entregableRepository;
        this.historialAccionService = historialAccionService;
    }

    @Override
    public List<DocumentoConVersionDto> listarDocumentosPorEntregable(Integer entregableXTemaId) {
        List<Object[]> result = documentoRepository.listarDocumentosPorEntregable(entregableXTemaId);
        List<DocumentoConVersionDto> documentos = new ArrayList<>();

        for(Object[] row : result){
            DocumentoConVersionDto dto = new DocumentoConVersionDto();
            dto.setDocumentoId((Integer) row[0]);
            dto.setDocumentoNombre((String) row[1]);
            dto.setDocumentoFechaSubida(((Instant) row[2]).atOffset(ZoneOffset.UTC));
            dto.setDocumentoLinkArchivo((String) row[3]);
            dto.setEntregableTemaId((Integer) row[4]);
            dto.setDocumentoPrincipal((Boolean) row[5]);
            documentos.add(dto);
        }
        return documentos;
    }
    @Override
    public List<DocumentoConVersionDto> listarDocumentosPorRevision(Integer revisionId) {
        RevisionDocumento revisionDocumento = revisionDocumentoService.findById(revisionId);
        if (revisionDocumento == null) {
            throw new EntityNotFoundException("Revision not found with id: " + revisionId);
        }
        
        VersionXDocumento versionXDocumento = revisionDocumento.getVersionDocumento();
        if (versionXDocumento == null) {
            throw new EntityNotFoundException("VersionXDocumento not found for revision with id: " + revisionId);
        }
        List<Object[]> result = documentoRepository.listarDocumentosPorEntregable(versionXDocumento.getEntregableXTema().getEntregableXTemaId());
        List<DocumentoConVersionDto> documentos = new ArrayList<>();

        for(Object[] row : result){
            DocumentoConVersionDto dto = new DocumentoConVersionDto();
            dto.setDocumentoId((Integer) row[0]);
            dto.setDocumentoNombre((String) row[1]);
            dto.setDocumentoFechaSubida(((Instant) row[2]).atOffset(ZoneOffset.UTC));
            dto.setDocumentoLinkArchivo((String) row[3]);
            dto.setEntregableTemaId((Integer) row[4]);
            dto.setDocumentoPrincipal((Boolean) row[5]);
            if (!dto.isDocumentoPrincipal()) {
                documentos.add(dto);
            }
            // Solo agregar documentos que no son principales
        }
        return documentos;
    }

    @Transactional
    @Override
    public Integer create(Documento documento){
        documentoRepository.save(documento);
        return documento.getId();
    }

    @Transactional
    @Override
    public ResponseEntity<String> subirDocumentos(Integer entregableXTemaId, MultipartFile[] archivos,
                                                  String ciclo, String curso, String comentario,
                                                  String estado, String documentoPrincipalNombre, String cognitoId) {
        UsuarioDto user = usuarioService.findByCognitoId(cognitoId);
        String codigoAlumno = user.getCodigoPucp();

        entregableRepository.entregarEntregable(entregableXTemaId, comentario, estado);

        for (MultipartFile archivo : archivos) {
            try {
                String filename = ciclo + S3_PATH_DELIMITER + curso + S3_PATH_DELIMITER +
                        codigoAlumno + S3_PATH_DELIMITER + archivo.getOriginalFilename();
                s3DownloadService.upload(filename, archivo);

                Documento documento = new Documento();
                documento.setId(null);
                documento.setNombreDocumento(archivo.getOriginalFilename());
                documento.setFechaSubida(OffsetDateTime.now());
                documento.setUltimaVersion(1);
                Integer documentoId = create(documento);
                VersionXDocumento version = new VersionXDocumento();
                version.setId(null);
                documento.setId(documentoId);
                version.setDocumento(documento);
                version.setFechaUltimaSubida(OffsetDateTime.now());
                version.setNumeroVersion(1);
                version.setLinkArchivoSubido(filename);
                if(documentoPrincipalNombre != null && !documentoPrincipalNombre.isEmpty()) {
                    version.setDocumentoPrincipal(Objects.equals(archivo.getOriginalFilename(), documentoPrincipalNombre));
                } else {
                    version.setDocumentoPrincipal(false);
                }
                EntregableXTema entregableXTema = new EntregableXTema();
                entregableXTema.setEntregableXTemaId(entregableXTemaId);
                version.setEntregableXTema(entregableXTema);
                versionXDocumentoService.create(version);
                historialAccionService.registrarAccion(cognitoId, "Se subió el documento " + documentoId +
                        " para el entregable " + entregableXTemaId);
                revisionDocumentoService.crearRevisiones(entregableXTemaId);
                revisionDocumentoService.crearRevisionesRevisores(entregableXTemaId);
                revisionDocumentoService.crearRevisionesJurado(entregableXTemaId);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Error al crear el documento: " + e.getMessage());
            }
        }
        return ResponseEntity.ok("Archivos subidos exitosamente");
    }

    @Transactional
    @Override
    public void borrarDocumento(Integer documentoId, String cognitoId) {
        documentoRepository.borrarDocumento(documentoId);
        //borrar revisiones asociadas
        VersionXDocumento version= versionXDocumentoService.findbyDocumento(documentoId);
        if (version != null) {
            revisionDocumentoService.borrarRevision(version.getId());
        }
        historialAccionService.registrarAccion(cognitoId, "Se borró el documento con ID: " + documentoId);
    }

}
