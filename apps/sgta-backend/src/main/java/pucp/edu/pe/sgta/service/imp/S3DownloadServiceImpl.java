package pucp.edu.pe.sgta.service.imp;

import pucp.edu.pe.sgta.service.inter.S3DownloadService;
import java.io.ByteArrayOutputStream;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

@Service
public class S3DownloadServiceImpl implements S3DownloadService {
    private final S3Client s3Client;

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
}
