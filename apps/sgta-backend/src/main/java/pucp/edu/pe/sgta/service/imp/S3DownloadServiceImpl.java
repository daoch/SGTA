package pucp.edu.pe.sgta.service.imp;

import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sgta.service.inter.S3DownloadService;
import java.io.ByteArrayOutputStream;

import org.springframework.beans.factory.annotation.Value;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.services.cloudfront.CloudFrontUtilities;
import software.amazon.awssdk.services.cloudfront.model.CannedSignerRequest;
import software.amazon.awssdk.services.cloudfront.url.SignedUrl;
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

    @Override
    public String getUrlFromCloudFront(String key) throws Exception {
        CloudFrontUtilities cloudFrontUtilities = CloudFrontUtilities.create();
        String baseUrl = System.getProperty("AWS_BASE_CLOUDFRONT_URL");
        String publicKeyId = System.getProperty("AWS_CLOUDFRONT_PUBLIC_KEY_ID");
        String resourceUrl = baseUrl + key;
        resourceUrl = resourceUrl.replaceAll("\\s", "+");

        File privateKeyFile = new File("private_key.pem");

        CannedSignerRequest cannedRequest = CannedSignerRequest.builder()
                .resourceUrl(resourceUrl)
                .privateKey(privateKeyFile.toPath())
                .keyPairId(publicKeyId)
                .expirationDate(java.time.Instant.now().plusSeconds(3600))
                .build();

        SignedUrl signedUrl = cloudFrontUtilities.getSignedUrlWithCannedPolicy(cannedRequest);

        return signedUrl.url();
    }
    @Override
    public byte[] downloadFromCloudFront(String key) throws Exception {
        // Obtén la URL firmada de CloudFront
        String signedUrl = getUrlFromCloudFront(key);

        // Descarga el archivo usando la URL firmada
        URL url = new URL(signedUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");

        try (InputStream in = connection.getInputStream();
            ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                baos.write(buffer, 0, bytesRead);
            }
            return baos.toByteArray();
        }
    }
}
