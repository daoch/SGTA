package pucp.edu.pe.sgta.model;

import lombok.Data;

@Data
public class ZoomAccessTokenResponse {
    private String access_token;
    private String token_type;
    private Long expires_in;
    private String scope;
}
