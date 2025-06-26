package pucp.edu.pe.sgta.service.imp;

import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import pucp.edu.pe.sgta.service.inter.S3DownloadService;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.Base64;
import java.util.Map;
import java.nio.file.Path;

@Service
public class PlagiarismServiceImpl {

    private static final String API_URL = "https://api.gowinston.ai/v2/plagiarism";
    private static final String API_URL_IA = "https://api.gowinston.ai/v2/ai-content-detection";
    private static final String API_TOKEN = "N82GMv2fWAR51dSB5M9tOxGzpghulDcmvu1IxU8u3b7056d9"; // Reemplaza con tu
                                                                                                // token real

    private final S3DownloadService s3DownloadService;

    public PlagiarismServiceImpl(S3DownloadService s3DownloadService) {
        this.s3DownloadService = s3DownloadService;
    }

    public String  checkPlagiarismFromS3(String key) throws Exception {
        // 1. Descarga el PDF desde S3
        byte[] pdfBytes = s3DownloadService.download(key);

        // 2. Extrae texto
        String fullText;
        try (PDDocument doc = PDDocument.load(pdfBytes)) {
            fullText = new PDFTextStripper().getText(doc);
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
    return report.toString();
    }
    public String  checkIAFromS3(String key) throws Exception {
        // 1. Descarga el PDF desde S3
        byte[] pdfBytes = s3DownloadService.download(key);

        // 2. Extrae texto
        String fullText;
        try (PDDocument doc = PDDocument.load(pdfBytes)) {
            fullText = new PDFTextStripper().getText(doc);
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
    return report.toString();
    }
    
}
