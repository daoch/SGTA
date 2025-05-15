package pucp.edu.pe.sgta.util;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.HttpMethod;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import pucp.edu.pe.sgta.exception.FileStorageException;

import java.io.InputStream;
import java.net.URL;
import java.time.Instant;
import java.util.Date;

@Component
public class S3FileUtil {

    private final AmazonS3 s3Client;
    private final String bucketName;

    public S3FileUtil(AmazonS3 s3Client,
                      @Value("${AWS_S3_BUCKET}") String bucketName) {
        this.s3Client = s3Client;
        this.bucketName = bucketName;
    }

    /**
     * Sube un archivo a S3 y devuelve la URL pública.
     */
    public String uploadFile(String key, InputStream inputStream, ObjectMetadata metadata) {
        try {
            PutObjectRequest request = new PutObjectRequest(bucketName, key, inputStream, metadata);
            s3Client.putObject(request);
            URL url = s3Client.getUrl(bucketName, key);
            return url.toString();
        } catch (SdkClientException e) {
            throw new FileStorageException("Error uploading file to S3", e);
        }
    }

    /**
     * Descarga un objeto de S3.
     */
    public S3Object downloadFile(String key) {
        try {
            return s3Client.getObject(bucketName, key);
        } catch (AmazonS3Exception e) {
            throw new FileStorageException("Error downloading file from S3", e);
        }
    }

    /**
     * Genera una URL pre-firmada para obtener el objeto.
     */
    public URL generatePresignedUrl(String key, int expirationInMinutes) {
        try {
            Date expiration = Date.from(Instant.now().plusSeconds(expirationInMinutes * 60L));
            GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucketName, key)
                    .withMethod(HttpMethod.GET)
                    .withExpiration(expiration);
            return s3Client.generatePresignedUrl(request);
        } catch (SdkClientException e) {
            throw new FileStorageException("Error generating presigned URL for S3 object", e);
        }
    }
}
