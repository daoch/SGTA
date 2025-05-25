package pucp.edu.pe.sgta.service.inter;


public interface S3DownloadService {

    byte[] download(String key);
}