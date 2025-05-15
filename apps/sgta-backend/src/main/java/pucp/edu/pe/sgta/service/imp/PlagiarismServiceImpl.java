package pucp.edu.pe.sgta.service.imp;

import kong.unirest.HttpResponse;
import kong.unirest.Unirest;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.Base64;
import java.nio.file.Path;
@Service
public class PlagiarismServiceImpl {

    private final S3Client s3Client;

    @Value("${s3.bucket}")
    private String bucketName;

    private static final String API_URL = "https://api.gowinston.ai/v2/plagiarism";
    private static final String API_TOKEN = "QCjk3OIgrXwcJXJuTkR9OgoeSWT6hpAa7GMfWdy40d96f018"; // Reemplaza con tu token real

    public PlagiarismServiceImpl(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String checkPlagiarismFromS3(String key) throws Exception {
        // 1. Descargar archivo de S3
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        Path tempFile = Files.createTempFile("s3download-", ".pdf");
        try (InputStream s3is = s3Client.getObject(getObjectRequest);
             FileOutputStream fos = new FileOutputStream(tempFile.toFile())) {
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = s3is.read(buffer)) != -1) {
                fos.write(buffer, 0, bytesRead);
            }
        }
        System.out.println("Archivo guardado temporalmente en: " + tempFile);
        byte[] fileBytes = Files.readAllBytes(tempFile);
        String base64File = Base64.getEncoder().encodeToString(fileBytes);
        String urlString="https://bkt-revision.s3.us-east-2.amazonaws.com/E1-short-2.pdf?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH0aCXVzLWVhc3QtMiJHMEUCICM8zjaFitVN4el02UslSogZOMYF2134RRienL1IQK4CAiEApCAesjDe7MTrUHu%2B6SjIX3kVBHenow2F5PdaMDsXQKoqzAMINhAAGgw1MzMyNjY5NjU3MTciDAc2s%2BPdpH6Q6w0n2CqpAynHWjMPwmlKd74%2FgK%2FYKtUCTlOhVMx6K9Mqe8kTbOw%2FZSK9b7m8L2mLAdf3%2BL3DZOuqh3yYMMwsqeQCvBDDHLDf2gN3lVCqLt2%2FruwF9RZzirkE%2FnvQzxIfgt8Ug1vdlKJC%2FBt3FsazRBLLbFPbvkPXPZpkc1XAVvuXHl6K5KkuXhnS8tvZwiP1UN0U2YeHaKjs8aCIGXsYTvLSM8CL9XokKEt7bE5wMM%2F%2B%2B4JYqpJ%2Bf0zPQvuyvTkGoncZC1VRh4e%2Fc20%2Fl3m%2FMa29zeoWifkuknjYjxZo8WYxx8S90gv49TwrAUeF1Fq1cp%2BAsgQTtQvY1WlJOXTHYIevdqNpQDRhc1Vr2mCW7Ddb0WnF0dqBIXkHrWk%2Byu1qkh60rvcHe84e1wHQ1fviWiEEFE73JUBDCH5rAw0U06yhpt3yw9%2FyXA1MCpDmIF%2B%2ByJDfk289tQjvvfe5Sze4QRLZXr4LjoZXnptLnmgm7wBQJO7eoFpjSfep6tVi1RCHpYkCRvyvQlPAllW5sTTwmIFchcxKF6U1fI7bMrv%2FfdIJqgXvkqbzSt9IFl%2FNhZenMOilmcEGOt4CGFBVtLjIMgu43azXFDAIXMZFPnJEaFnqK1dat8oFf6Zav1RO%2B1DkootP%2Bs12ljtvKvwY21gjhb4Y3zJaRkVsoCO0Ps2vKzNpk7kFnl3h2rosdbwvGS7dAV2U%2Fr7AdU7mXxgbPu%2BUK7Uhvk21cacltsanupOoIV7bdQXAAL%2BHYMswLJc4ZgGd%2FhF6p%2FKH73YvS%2Bwdq5qk1H7nver3WE4j7Fx6I%2B6CnnsDW%2B0zIMTuiUd3X0nc1qol1PiPjWqog6GCBFLOGK0AMcYKkOXTa6mhBSdSzkP8r2lnquLywzZvckTcvx0VNMoaK2rZaFmsxs3m2HvLNn9lMqcs35%2F6vqjudk5YxK9pLcGKYi%2FJIZHupNlfwlSarwroMEcjYQfxyPLlgpm4StMIMUmNLFqzt8e09PEcX0aUDhu1Gg0I83yYFKkI%2BbGFd8FCqlar7i5%2Fiv2j4OX9FDurCd1Jg10aqnA%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAXYKJQETKYHD4CVW6%2F20250515%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250515T211014Z&X-Amz-Expires=21600&X-Amz-SignedHeaders=host&X-Amz-Signature=b20f9ca0e565023d909ae4a2d5581b31fa1edf2f3e97e7e17c09ae0aa8fd54c0";
        String jsonBody = "{"
                + "\"file\": \"" + urlString + "\","
                + "\"language\": \"es\","
                + "\"country\": \"us\""
                + "}";

        HttpResponse<String> response = Unirest.post(API_URL)
                .header("Authorization", "Bearer " + API_TOKEN)
                .header("Content-Type", "application/json")
                .body(jsonBody)
                .asString();

        return response.getBody();
    }
}
