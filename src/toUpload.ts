import { toAuth } from './toAuth';
import { createReadStream, statSync } from 'fs';
import { toDelete } from './toDelete';
import { drive_v3 } from 'googleapis';

interface Props {
  fileName: string;
  folderId: string;
  filePath: string;
  server: any;
  // drive: drive_v3.Drive;
}

export const toUpload = async (props: Props) => {
  const { fileName, filePath, folderId, server } = props;

  const fileSize = statSync(filePath).size;
  let uploadedBytes = 0;

  try {
    const drive = await toAuth();

    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      mimeType: 'application/octet-stream',
      body: createReadStream(filePath),
    };

    const response = await drive.files.create(
      {
        requestBody: fileMetadata,
        media: media,
        supportsTeamDrives: true,
      },
      {
        onUploadProgress: (evt) => {
          uploadedBytes += evt.bytesRead;
          const progress = ((uploadedBytes / fileSize) * 100).toFixed(2);
          process.stdout.write(`Progresso do upload: ${progress}%\r`);
        },
      },
    );

    console.log('Arquivo enviado com sucesso!');
    server(`Arquivo enviado com sucesso ${fileName}`);
    console.log('ID do arquivo:', response.data.id);
    toDelete(`./download/${fileName}`, fileName);
  } catch (err: any) {
    toDelete(`./download/${fileName}`, fileName);
    console.log('[Upload] Ocorreu um erro: ', err?.errors?.[0].message);
  }
};
