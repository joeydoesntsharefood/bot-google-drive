import { drive_v3, google } from 'googleapis';
import { JWT, auth } from 'google-auth-library';
import { credentials } from './configs/google.api';
// import { genToken } from './genToken';

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

    // const tokens = await auth.getAccessToken();

    // console.log(tokens);

    const token = require(`../${TOKEN_PATH}`);

    client.setCredentials({
      access_token: token,
    });

    // const client = await genToken();

    return google.drive({ version: 'v3', auth: client });
  } catch (error) {
    console.error('Ocorreu um erro[AUTH]:', error);
  }
};
