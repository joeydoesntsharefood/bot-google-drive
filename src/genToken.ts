import { JWT } from 'google-auth-library';
import { credentials } from './configs/google.api';
import { writeFileSync } from 'fs';

const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata',
];
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

    if (accessToken) {
      const tokenString = `"${accessToken}"`;
      writeFileSync(TOKEN_PATH, tokenString);
      console.log('Token de acesso gerado com sucesso!');
    } else {
      console.error('Falha ao gerar o token de acesso.');
    }
  } catch (error) {
    console.error('Ocorreu um erro:', error);
  }
};
