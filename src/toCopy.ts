import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import * as fse from 'fs-extra';
import { toAuth } from "./toAuth";

const destinationPath = 'download';

export const toCopy = async (sourceDriveId: string) => {
  try {
    // Criação do cliente da API do Google Drive
    const drive = await toAuth();

    // Obter lista de arquivos e pastas com mimetype de JPG
    const response = await drive.files.list({
      q: `('${sourceDriveId}' in parents) and (mimeType = 'image/jpeg' or mimeType = 'application/vnd.google-apps.folder')`,
      fields: 'files(id, name, parents, mimeType)',
    });

    // Percorrer os arquivos encontrados
    const files = response.data.files;
    if (files && files.length) {
      for (const file of files) {
        const fileId = file.id;
        const fileName = file.name;
        const mimeType = file.mimeType;

        // Verificar se é uma pasta
        if (mimeType === 'application/vnd.google-apps.folder') {
          // Criar a estrutura de pastas correspondente no destino
          const destinationFolderPath = path.join(destinationPath, ...file.parents as string[]);
          await fse.ensureDir(destinationFolderPath);
        } else if (mimeType === 'image/jpeg') {
          // Fazer o download do arquivo para o destino
          const destinationFolderPath = path.join(destinationPath, ...file.parents as string[]);
          await fse.ensureDir(destinationFolderPath);

          const destinationFilePath = path.join(destinationFolderPath, fileName);
          const destFileStream = fs.createWriteStream(destinationFilePath);
          const res = await drive.files.get(
            { fileId, alt: 'media' },
            { responseType: 'stream' }
          );
          res.data
            .on('error', (err: Error) => {
              console.error(`Erro ao fazer o download do arquivo ${fileName}:`, err);
            })
            .pipe(destFileStream);

          await new Promise((resolve) => {
            destFileStream.on('finish', resolve);
          });

          console.log(`Download do arquivo ${fileName} concluído.`);
        }
      }

      console.log('Download dos arquivos concluído com sucesso!');
    } else {
      console.log('Nenhum arquivo ou pasta com mimetype de JPG encontrado.');
    }
  } catch (error) {
    console.error('Ocorreu um erro:', error.message);
  }
}

