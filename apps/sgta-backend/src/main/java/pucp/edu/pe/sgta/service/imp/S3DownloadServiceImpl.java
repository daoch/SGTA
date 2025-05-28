package pucp.edu.pe.sgta.service.imp;

import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sgta.controller.DocumentoController;
import pucp.edu.pe.sgta.service.inter.S3DownloadService;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.logging.Logger;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class S3DownloadServiceImpl implements S3DownloadService {
    private final S3Client s3Client;

    private final Logger logger = Logger.getLogger(S3DownloadServiceImpl.class.getName());

    public S3DownloadServiceImpl(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public byte[] download(String key) {
        String bucket = System.getenv("s3.bucket");
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        s3Client.getObject(
            GetObjectRequest.builder().bucket(bucket).key(key).build(),
            ResponseTransformer.toOutputStream(baos)
        );
        return baos.toByteArray();
    }

    @Override
    public void upload(String filename, MultipartFile file) throws IOException {
        String bucket = System.getProperty("AWS_S3_BUCKET");
        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(filename)
                        .contentType(file.getContentType())
                        .build(), RequestBody.fromInputStream(file.getInputStream(), file.getSize())
        );
    }
}
