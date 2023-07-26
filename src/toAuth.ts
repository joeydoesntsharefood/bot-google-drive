import { drive_v3, google } from 'googleapis';
import { Credentials, JWT } from 'google-auth-library';
import { credentials } from './configs/google.api';

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.photos.readonly',
];

const TOKEN_PATH = 'token.json';

export const toAuth = async (): Promise<drive_v3.Drive> => {
  try {
    const client = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: SCOPES,
    });

    const token = require(`../${TOKEN_PATH}`);

    client.setCredentials({
      access_token: token,
    });

    client.on('tokens', (tokens: Credentials) => {
      client.setCredentials({
        refresh_token: tokens.refresh_token,
      });
      console.log('Catch refresh token');
    });

    return google.drive({ version: 'v3', auth: client });
  } catch (error) {
    console.error('Ocorreu um erro:', error);
  }
};
