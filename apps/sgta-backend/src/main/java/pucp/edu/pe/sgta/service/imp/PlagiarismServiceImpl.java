package pucp.edu.pe.sgta.service.imp;

import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import pucp.edu.pe.sgta.service.inter.S3DownloadService;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.Base64;
import java.util.Map;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Service
public class PlagiarismServiceImpl {

    private static final String API_URL = "https://api.gowinston.ai/v2/plagiarism";
    private static final String API_URL_IA = "https://api.gowinston.ai/v2/ai-content-detection";
    private static final String API_TOKEN = "yy6ghgeIg2kMOHnyL6yUbSfaJSVBiBUqPKJPh0CK98d5960c"; // Reemplaza con tu
                                                                                                // token real

    private final S3DownloadService s3DownloadService;

    public PlagiarismServiceImpl(S3DownloadService s3DownloadService) {
        this.s3DownloadService = s3DownloadService;
    }

    public JsonNode  checkPlagiarismFromS3(byte[] pdfBytes) throws Exception {
        // 1. Descarga el PDF desde S3
        //byte[] pdfBytes = s3DownloadService.download(key);

        // 2. Extrae texto
        String fullText;
        List<String> pages = new ArrayList<>();
        try (PDDocument doc = PDDocument.load(pdfBytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            int numPages = doc.getNumberOfPages();

            for (int i = 1; i <= numPages; i++) {
                stripper.setStartPage(i);
                stripper.setEndPage(i);
                pages.add(stripper.getText(doc));
            }
            // Ahora tienes el texto de cada página en 'pages'
            fullText = String.join(" ", pages);
        }

        // 3. Divide en trozos de ≤120 000 caracteres
        int chunkSize = 120_000;
        ObjectMapper mapper = new ObjectMapper();
        StringBuilder report = new StringBuilder();

        for (int start = 0; start < fullText.length(); start += chunkSize) {
            String chunk = fullText.substring(start, Math.min(start + chunkSize, fullText.length()));

            String body = mapper.writeValueAsString(Map.of(
                "text",     chunk,
                "language", "es",
                "country",  "us"
            ));

            HttpResponse<String> resp = Unirest.post(API_URL)
                    .header("Authorization", "Bearer " + API_TOKEN)
                    .header("Content-Type", "application/json")
                    .body(body)
                    .connectTimeout(10_000)
                    .socketTimeout(300_000)
                    .asString();

            report.append(resp.getBody()).append("\n");   // guarda / fusiona como prefieras
        }
        ObjectMapper mapper2 = new ObjectMapper();
        JsonNode root = mapper2.readTree(report.toString()); // tu JSON de respuesta

        // Paso 1: Obtener los offsets de página
        List<Integer> pageOffsets = new ArrayList<>();
        int offset = 0;
        for (String pageText : pages) {
            pageOffsets.add(offset);
            offset += pageText.length();
        }

        // Paso 2: Recorrer sources y plagiarismFound
        ArrayNode sources = (ArrayNode) root.path("sources");
        for (JsonNode source : sources) {
            ArrayNode plagiarismFound = (ArrayNode) source.path("plagiarismFound");
            for (JsonNode pf : plagiarismFound) {
                int start = pf.get("startIndex").asInt();
                int page = 1;
                for (int i = 0; i < pageOffsets.size(); i++) {
                    if (i == pageOffsets.size() - 1 || (start >= pageOffsets.get(i) && start < pageOffsets.get(i + 1))) {
                        page = i + 1;
                        break;
                    }
                }
                ((ObjectNode) pf).put("page", page);
            }
        }
        //String newJson = mapper.writeValueAsString(root);
        
        return root; // Devuelve el JSON modificado como JsonNode
    }
    public JsonNode  checkIAFromS3(byte[] pdfBytes) throws Exception {
        // 1. Descarga el PDF desde S3
        //byte[] pdfBytes = s3DownloadService.download(key);

        // 2. Extrae texto
        String fullText;
        List<String> pages = new ArrayList<>();
        try (PDDocument doc = PDDocument.load(pdfBytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            int numPages = doc.getNumberOfPages();

            for (int i = 1; i <= numPages; i++) {
                stripper.setStartPage(i);
                stripper.setEndPage(i);
                pages.add(stripper.getText(doc));
            }
            // Ahora tienes el texto de cada página en 'pages'
            fullText = String.join(" ", pages);
        }

        // 3. Divide en trozos de ≤120 000 caracteres
        int chunkSize = 120_000;
        ObjectMapper mapper = new ObjectMapper();
        StringBuilder report = new StringBuilder();

        for (int start = 0; start < fullText.length(); start += chunkSize) {
            String chunk = fullText.substring(start, Math.min(start + chunkSize, fullText.length()));

            String body = mapper.writeValueAsString(Map.of(
                "text",     chunk,
                "language", "es",
                "country",  "us"
            ));

            HttpResponse<String> resp = Unirest.post(API_URL_IA)
                    .header("Authorization", "Bearer " + API_TOKEN)
                    .header("Content-Type", "application/json")
                    .body(body)
                    .connectTimeout(10_000)
                    .socketTimeout(300_000)
                    .asString();

            report.append(resp.getBody()).append("\n");   // guarda / fusiona como prefieras
        }
            
        ObjectMapper mapper2 = new ObjectMapper();
        JsonNode root = mapper2.readTree(report.toString());

        ArrayNode sentences = (ArrayNode) root.path("sentences");

        // Paso 1: Obtener los offsets de página
        List<Integer> pageOffsets = new ArrayList<>();
        int offset = 0;
        for (String pageText : pages) {
            pageOffsets.add(offset);
            offset += pageText.length();
        }
        // Paso 2: Asignar página a cada sentence
        for (JsonNode sentence : sentences) {
            int start = sentence.get("start_position").asInt();
            int page = 1;
            for (int i = 0; i < pageOffsets.size(); i++) {
                if (i == pageOffsets.size() - 1 || (start >= pageOffsets.get(i) && start < pageOffsets.get(i + 1))) {
                    page = i + 1;
                    break;
                }
            }
            ((ObjectNode) sentence).put("page", page);
        }
        //aca se tiene que guardar el porcentaje de IA en version documento
        // Si quieres el JSON como String:
        //String newJson = mapper2.writeValueAsString(root);
    return root;
    }
    
}
