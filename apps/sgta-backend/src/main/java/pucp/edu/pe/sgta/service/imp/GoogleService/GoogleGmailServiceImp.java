package pucp.edu.pe.sgta.service.imp.GoogleService;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.Message;

import java.io.ByteArrayOutputStream;
import java.io.IOException;  // ✅

import java.security.GeneralSecurityException;
import java.util.Base64;
import java.util.Properties;

import jakarta.mail.*;
import jakarta.mail.internet.*;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.service.inter.GoogleService.GoogleGmailService;

@Service
public class GoogleGmailServiceImp implements GoogleGmailService {


    public Gmail buildGmailClient(String accessToken) throws GeneralSecurityException, IOException {
        HttpRequestInitializer requestInitializer = request -> {
            request.getHeaders().setAuthorization("Bearer " + accessToken);
        };

        return new Gmail.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance(),
                requestInitializer
        )
                .setApplicationName("SGTA")
                .build();
    }

    public void sendEmail(Gmail gmail, String to, String subject, String bodyText) throws MessagingException, IOException {
        MimeMessage email = createEmail(to, "me", subject, bodyText);
        Message message = createMessageWithEmail(email);
        gmail.users().messages().send("me", message).execute();
    }

    public MimeMessage createEmail(String to, String from, String subject, String bodyText) throws MessagingException {
        Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);

        MimeMessage email = new MimeMessage(session);
        email.setFrom(new InternetAddress(from));
        email.addRecipient(jakarta.mail.Message.RecipientType.TO, new InternetAddress(to));

        email.setSubject(subject);
        email.setContent(bodyText, "text/html; charset=utf-8");
        return email;
    }

    public Message createMessageWithEmail(MimeMessage email) throws MessagingException, IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        email.writeTo(buffer);
        byte[] rawMessageBytes = buffer.toByteArray();
        String encodedEmail = Base64.getUrlEncoder().encodeToString(rawMessageBytes);
        Message message = new Message();
        message.setRaw(encodedEmail);
        return message;
    }

}
