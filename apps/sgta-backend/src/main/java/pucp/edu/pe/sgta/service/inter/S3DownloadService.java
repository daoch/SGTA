package pucp.edu.pe.sgta.service.inter;


import org.springframework.web.multipart.MultipartFile;

public interface S3DownloadService {

    byte[] download(String key);
    void upload(String filename, MultipartFile file) throws java.io.IOException;
    String getUrlFromCloudFront(String key) throws Exception;
    byte[] downloadFromCloudFront(String key) throws Exception;
    boolean existsInS3(String key); // Uncomment if needed
    void guardarJsonEnS3(String key, String json);
}