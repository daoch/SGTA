package pucp.edu.pe.sgta.service.imp;

import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sgta.service.inter.S3DownloadService;
import java.io.ByteArrayOutputStream;

import org.springframework.beans.factory.annotation.Value;
import java.io.IOException;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class S3DownloadServiceImpl implements S3DownloadService {
    private final S3Client s3Client;

    public S3DownloadServiceImpl(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Value("${s3.bucket}")
    private String bucketName;

    @Override
    public byte[] download(String key) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        s3Client.getObject(
                GetObjectRequest.builder().bucket(bucketName).key(key).build(),
                ResponseTransformer.toOutputStream(baos));
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
                        .build(),
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
    }
}
