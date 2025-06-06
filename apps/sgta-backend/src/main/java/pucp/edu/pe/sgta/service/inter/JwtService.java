package pucp.edu.pe.sgta.service.inter;

import jakarta.servlet.http.HttpServletRequest;

public interface JwtService {

    /**
     * Extracts a specific claim from a JWT token
     */
    public Object extractClaimFromToken(String token, String claimName);

    /**
     * Convenience method to extract subject directly from request
     */
    public String extractSubFromRequest(HttpServletRequest request);
}
