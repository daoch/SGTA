package pucp.edu.pe.sgta.service.imp;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.service.inter.CognitoService;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

@Service
public class CognitoServiceImpl implements CognitoService {

    @Value("${cognito.userPoolId}")
    private String userPoolId;

    @Value("${cognito.region}")
    private String region;

    private CognitoIdentityProviderClient cognitoClient;

    @PostConstruct
    public void init() {
        this.cognitoClient = CognitoIdentityProviderClient.builder()
                .credentialsProvider(DefaultCredentialsProvider.create())
                .region(Region.of(region))
                .build();
    }

    @Override
    public String registrarUsuarioEnCognito(String correo, String nombre, String grupo) throws Exception {
        // bscar si ya existe una cuenta federada con ese correo
        ListUsersRequest listRequest = ListUsersRequest.builder()
                .userPoolId(userPoolId)
                .filter("email = \"" + correo + "\"")
                .limit(1)
                .build();

        ListUsersResponse listResponse = cognitoClient.listUsers(listRequest);

        if (!listResponse.users().isEmpty()) {
            // si ya existe la cuenta federada, obtener el usrio existente
            UserType existingUser = listResponse.users().get(0);
            String username = existingUser.username();
            String idCognito = existingUser.attributes().stream()
                    .filter(attr -> attr.name().equals("sub"))
                    .findFirst()
                    .map(AttributeType::value)
                    .orElse(null);

            // asignar la cuenta esa del sso al grupo correcto
            AdminAddUserToGroupRequest groupRequest = AdminAddUserToGroupRequest.builder()
                    .username(username)
                    .groupName(grupo.toLowerCase())
                    .userPoolId(userPoolId)
                    .build();

            cognitoClient.adminAddUserToGroup(groupRequest);

            // devolver el sub ya existente para mantener la consistencia en bd
            return idCognito;
        }

        // este caso es si no existe: crear el usuario nativo en cognito, registro por primera vez
        AdminCreateUserRequest createUserRequest = AdminCreateUserRequest.builder()
                .userPoolId(userPoolId)
                .username(correo)
                .userAttributes(
                        AttributeType.builder().name("email").value(correo).build(),
                        AttributeType.builder().name("email_verified").value("true").build(),
                        AttributeType.builder().name("name").value(nombre).build()
                )
                .messageAction(MessageActionType.SUPPRESS) // no enviar email de bienvenida
                .desiredDeliveryMediums(DeliveryMediumType.EMAIL)
                .build();

        AdminCreateUserResponse createUserResponse = cognitoClient.adminCreateUser(createUserRequest);

        String idCognito = createUserResponse.user().attributes().stream()
                .filter(attr -> attr.name().equals("sub"))
                .findFirst()
                .map(AttributeType::value)
                .orElse(null);

        // agregar al grupo respectivo
        AdminAddUserToGroupRequest groupRequest = AdminAddUserToGroupRequest.builder()
                .username(correo)
                .groupName(grupo.toLowerCase())
                .userPoolId(userPoolId)
                .build();

        cognitoClient.adminAddUserToGroup(groupRequest);

        return idCognito;
    }
}
