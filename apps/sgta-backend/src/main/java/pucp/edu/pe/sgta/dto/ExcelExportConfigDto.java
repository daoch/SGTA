package pucp.edu.pe.sgta.dto;

import lombok.Data;
import java.util.List;

/**
 * DTO para configurar la exportación de Excel
 */
@Data
public class ExcelExportConfigDto {
    

    private List<String> sections;
    private String contentType;
    private String fileName;
    public ExcelExportConfigDto() {}

    public ExcelExportConfigDto(List<String> sections, String contentType, String fileName) {
        this.sections = sections;
        this.contentType = contentType;
        this.fileName = fileName;
    }
} 