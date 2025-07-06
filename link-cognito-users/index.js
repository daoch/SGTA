const AWS = require('aws-sdk');
const cognitoIdp = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event, context, callback) => {
    console.log('Evento recibido:', JSON.stringify(event)); // debug

    const triggerSource = event.triggerSource;
    const userPoolId = event.userPoolId; // pool de cognito que dispara el trigger
    const email = event.request.userAttributes.email; // correo del usuario federado (sso de google)
    const federatedProviderUserId = event.userName.split('_')[1]; // sub/id del sso

    // si es un AdminCreateUser (carga masiva), permitir el registro siempre
    if (triggerSource === 'PreSignUp_AdminCreateUser') {
        console.log('Trigger por carga masiva (AdminCreateUser). Permitir registro sin validación.');
        callback(null, event); // Permitir el signup
        return;
    }
	
	const sourceProviderName = 'Google';

    // si es un registro normal o federado (SSO), vincular las cuentas
    const listUsersParams = {
        UserPoolId: userPoolId,
        Filter: `email = "${email}"`,
        Limit: 1
    };

    try {
        const listUsersResponse = await cognitoIdp.listUsers(listUsersParams).promise();
        console.log('Usuarios encontrados:', JSON.stringify(listUsersResponse.Users));

        if (listUsersResponse.Users.length > 0) {
            const nativeUser = listUsersResponse.Users[0];
            const nativeUsername = nativeUser.Username;

            const linkParams = {
                DestinationUser: {
                    ProviderName: 'Cognito',
                    ProviderAttributeName: 'Cognito_Subject',
                    ProviderAttributeValue: nativeUsername
                },
                SourceUser: {
                    ProviderName: sourceProviderName,
                    ProviderAttributeName: 'Cognito_Subject',
                    ProviderAttributeValue: federatedProviderUserId
                },
                UserPoolId: userPoolId
            };

            await cognitoIdp.adminLinkProviderForUser(linkParams).promise();
            console.log(`Usuario federado vinculado al nativo: ${email}`);
        } else {
			// aviso de que usuario no existe, luego el coordinador asignará el tipoUsuario con la carga masiva
            console.log(`No existe usuario nativo con correo: ${email}. Dejar login SSO google.`);
        }

        callback(null, event); // permitir el login SSO aunque no se haya hecho el link

    } catch (error) {
        console.error('Error al vincular usuarios:', error);
        callback(error);
		return;
    }
};