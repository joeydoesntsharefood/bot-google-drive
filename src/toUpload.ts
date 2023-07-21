import { toAuth } from './toAuth';
import { createReadStream } from 'fs';
import { toDelete } from './toDelete';

interface Props {
  fileName: string;
  folderId: string;
  filePath: string;
}

export const toUpload = async (props: Props) => {
  const { fileName, filePath, folderId } = props;

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

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
    });

    console.log('Arquivo enviado com sucesso!');
    console.log('ID do arquivo:', response.data.id);
    toDelete(`./download/${fileName}`, fileName);
  } catch (err: any) {
    toDelete(`./download/${fileName}`, fileName);
    console.log('[Upload] Ocorreu um erro: ', err?.errors?.[0].message);
  }
};
