import { drive_v3, google } from 'googleapis';
import { createFolderRecursive } from './createFolderRecursive';
import { toDelete } from './toDelete';
import { downloadFile } from './toDownload';
import { toUpload } from './toUpload';
import { auth } from 'google-auth-library';
import { ConsoleLogger } from '@nestjs/common';
import { toRevision } from './toRevision';
// import { AuthClient, OAuth2Client, auth } from 'google-auth-library';
// import { genToken } from './genToken';
// import { oauth2 } from 'googleapis/build/src/apis/oauth2';

interface Props {
  file: drive_v3.Schema$File;
  driveUploadId: string;
  uploadFolder: string;
  folderIdUpload: string;
  server(value: string): void;
  onFinish(): void;
  // drive: drive_v3.Drive;
}

export const toMove = async ({
  file,
  driveUploadId,
  uploadFolder,
  folderIdUpload,
  server,
  onFinish,
}: // drive,
Props) => {
  const conditional =
    file.name.includes('.avi') ||
    file.name.includes('.mp4') ||
    file.name.includes('.mov');

  // const client = await auth.getClient();

  // client.on('tokens', (tokens) => {
  //   if (tokens.refresh_token) {
  //     console.log('Refresh tokens expiry date: ', tokens.expiry_date);
  //     console.log('Refresh token: ', tokens.refresh_token);
  //   }

  //   console.log('Access token', tokens.access_token);
  // });

  if (conditional) {
    console.log(`Iniciando movimentação do arquivo ${file.name}`);

    // await createFolderRecursive(driveUploadId, uploadFolder, drive)
    await createFolderRecursive(driveUploadId, uploadFolder)
      .then((folderId) => {
        console.log('Pasta criada com sucesso. ID:', folderId);
        folderIdUpload = folderId;
      })
      .catch((error) => {
        console.error(
          'Ocorreu um erro ao criar a pasta:',
          error?.errors?.[0] ?? 'Não definido',
        );

        // toDelete(`./download/${file.name}`, file.name);
      });

    console.log(folderIdUpload);

    let breakLoop = false;

    await toRevision({
      folderIdUpload,
      fileName: file.name,
      onRevision: (value) => (breakLoop = value),
    });

    if (!breakLoop) {
      // await downloadFile(file.id, './download', file.name, drive)
      await downloadFile(file.id, './download', file.name)
        .then(() => {
          server(`Download concluído com sucesso do arquivo: ${file.name}`);
          console.log('Download concluído com sucesso!');
        })
        .catch((error) => {
          server(`Ocorreu um erro durante o download do arquivo: ${file.name}`);
          console.error('Ocorreu um erro durante o download:', error);
        });

      if (folderIdUpload.length !== 0) {
        await toUpload({
          // drive,
          server,
          fileName: file.name,
          folderId: folderIdUpload,
          filePath: `./download/${file.name}`,
        });
      }

      onFinish();
    }
  }
};
