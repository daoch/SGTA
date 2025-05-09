import { CognitoUserPool } from "amazon-cognito-identity-js";

export const userPool = new CognitoUserPool({
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
  ClientId: process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID!,
});


export function getGoogleSignInUrl(): string {
  const domain    = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
  const clientId  = process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID!;
  const redirect  = encodeURIComponent(process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!);
  const scope     = encodeURIComponent("openid email profile");
  return (
    `${domain}/oauth2/authorize` +
    "?identity_provider=Google" +                
    `&redirect_uri=${redirect}` +               
    "&response_type=code" +
    `&client_id=${clientId}` +
    `&scope=${scope}`
  );
}
