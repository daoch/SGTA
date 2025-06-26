package pucp.edu.pe.sgta.service.inter.GoogleService;

import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.io.IOException;
import java.security.GeneralSecurityException;

public interface GoogleGmailService {
    public Gmail buildGmailClient(String accessToken) throws GeneralSecurityException, IOException;
    public void sendEmail(Gmail gmail, String to, String subject, String bodyText)  throws MessagingException, IOException;
    public Message createMessageWithEmail(MimeMessage email)  throws MessagingException, IOException;
    public MimeMessage createEmail(String to, String from, String subject, String bodyText)  throws MessagingException, IOException;
}
