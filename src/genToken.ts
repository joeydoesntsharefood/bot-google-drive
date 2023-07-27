import { JWT, OAuth2Client, auth } from 'google-auth-library';
import { credentials } from './configs/google.api';
import { question } from 'readline-sync';
// import { oauth2 } from 'googleapis/build/src/apis/oauth2';
// import { toAuth } from './toAuth';
import { writeFileSync } from 'fs';

const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  console.log(
    `Token Gerado as ${hours}:${minutes}:${seconds} expira em ${
      Number(hours) + 1
    }:${minutes}:${seconds}`,
  );
};

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';

export const genToken = async () => {
  try {
    const client = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: SCOPES,
    });

    const token = await client.getAccessToken();

    const accessToken = token?.token;

    // const client = new OAuth2Client(
    //   credentials.client_id,
    //   credentials.client_secret,
    //   credentials.redirect_uris[1],
    // );

    // const authUrl = client.generateAuthUrl({
    //   access_type: 'offline',
    //   scope: SCOPES,
    // });

    // console.log('Autorize o aplicativo acessando esta URL:', authUrl);

    // const authorizationCode = question('Digite o código: ');

    // console.log(authorizationCode);

    // const authorization = await client.getToken(authorizationCode);

    // client.setCredentials(authorization.tokens);

    // const accessToken = authorization.tokens.access_token;

    if (accessToken) {
      const tokenString = `"${accessToken}"`;
      writeFileSync(TOKEN_PATH, tokenString);
      getCurrentTime();
    } else {
      console.error('Falha ao gerar o token de acesso.');
    }

    // return client;
  } catch (error) {
    console.error('Ocorreu um erro[TOKEN]:', error);
  }
};
