package pucp.edu.pe.sgta.service.imp;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.service.inter.CognitoService;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

@Service
public class CognitoServiceImpl implements CognitoService {

    @Value("${cognito.userPoolId}")
    private String userPoolId;

    @Value("${cognito.region}")
    private String region;

    @Value("${AWS_ACCESS_KEY_ID}")
    private String accessKeyId;

    @Value("${AWS_SECRET_ACCESS_KEY}")
    private String secretAccessKey;

    private CognitoIdentityProviderClient cognitoClient;

    @PostConstruct
    public void init() {
        AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKeyId, secretAccessKey);

        this.cognitoClient = CognitoIdentityProviderClient.builder()
                .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
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

    @Override
    public void eliminarUsuarioEnCognito(String idCognito) throws Exception {
        try {
            AdminDeleteUserRequest deleteUserRequest = AdminDeleteUserRequest.builder()
                    .userPoolId(userPoolId)
                    .username(idCognito)
                    .build();

            // Llamar al cliente de Cognito para eliminar al usuario
            cognitoClient.adminDeleteUser(deleteUserRequest);
            System.out.println("Usuario eliminado en Cognito con ID: " + idCognito);
        } catch (Exception e) {
            System.err.println("Error al eliminar usuario en Cognito con ID: " + idCognito + ". Detalles: " + e.getMessage());
            throw new RuntimeException("Error al eliminar usuario en Cognito", e);
        }
    }

    @Override
    public void updateUsuarioEnCognito(String idCognito, String grupoAnterior, String grupoNuevo, String nuevoCorreo) {
        try {
            // Si el grupo ha cambiado, actualizar los grupos
            if (grupoAnterior != null && grupoNuevo != null) {
                AdminRemoveUserFromGroupRequest removeRequest = AdminRemoveUserFromGroupRequest.builder()
                        .userPoolId(userPoolId)
                        .username(idCognito)
                        .groupName(grupoAnterior)
                        .build();
                cognitoClient.adminRemoveUserFromGroup(removeRequest);

                AdminAddUserToGroupRequest addRequest = AdminAddUserToGroupRequest.builder()
                        .userPoolId(userPoolId)
                        .username(idCognito)
                        .groupName(grupoNuevo)
                        .build();
                cognitoClient.adminAddUserToGroup(addRequest);
            }

            // Si el correo ha cambiado, actualizarlo
            if (nuevoCorreo != null) {
                AdminUpdateUserAttributesRequest updateRequest = AdminUpdateUserAttributesRequest.builder()
                        .userPoolId(userPoolId)
                        .username(idCognito)
                        .userAttributes(AttributeType.builder()
                                .name("email")
                                .value(nuevoCorreo)
                                .build())
                        .build();
                cognitoClient.adminUpdateUserAttributes(updateRequest);
            }

            System.out.println("Usuario actualizado en Cognito con ID: " + idCognito);
        } catch (Exception e) {
            System.err.println("Error al actualizar usuario en Cognito con ID: " + idCognito + ". Detalles: " + e.getMessage());
            throw new RuntimeException("Error al actualizar usuario en Cognito", e);
        }
    }
}
