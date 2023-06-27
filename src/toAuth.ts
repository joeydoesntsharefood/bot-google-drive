import { drive_v3, google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { credentials } from './configs/google.api';

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.scripts',
  'https://www.googleapis.com/auth/drive.metadata',
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

    return google.drive({ version: 'v3', auth: client });
  } catch (error) {
    console.error('Ocorreu um erro:', error);
  }
};