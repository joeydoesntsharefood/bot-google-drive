import { toAuth } from "./toAuth";

interface Props {
  fileName: string
  folderId: string
  filePath: string
}

export const toUpload = async ({ fileName, filePath, folderId }: Props) => {
  try {
    const drive = await toAuth();

    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      mimeType: 'application/octet-stream',
      body: require('fs').createReadStream(filePath),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
    });

    console.log('Arquivo enviado com sucesso!');
    console.log('ID do arquivo:', response.data.id);
  } catch (err: any) {
    console.log('[Upload] Ocorreu um erro: ', err?.errors?.[0].message);
  }
};
