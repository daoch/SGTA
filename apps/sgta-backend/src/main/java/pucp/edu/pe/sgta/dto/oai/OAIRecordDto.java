package pucp.edu.pe.sgta.dto.oai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAIRecordDto {
    private String identifier;
    private String datestamp;
    private List<String> setSpec;
    private OAIMetadataDto metadata;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OAIMetadataDto {
        private String title;
        private List<String> creator;
        private List<String> subject;
        private String description;
        private String publisher;
        private List<String> contributor;
        private String date;
        private String type;
        private String format;
        private String identifier;
        private String source;
        private String language;
        private String relation;
        private String coverage;
        private String rights;
    }
}
