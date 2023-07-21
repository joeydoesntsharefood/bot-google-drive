import * as fs from 'fs';
import { toAuth } from './toAuth';
import { toUpload } from './toUpload';
import * as path from 'path';
import { createFolderRecursive } from './createFolderRecursive';
import { toDelete } from './toDelete';

const downloadFile = async (
  fileId: string,
  outputPath: string,
  fileName: string,
) => {
  try {
    const drive = await toAuth();

    const res = await drive.files.get(
      {
        fileId,
        alt: 'media',
      },
      {
        responseType: 'stream',
      },
    );

    const outputFilePath = path.join(outputPath, fileName);

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const dest = fs.createWriteStream(outputFilePath);
    res.data.pipe(dest);

    return new Promise<void>((resolve, reject) => {
      dest.on('finish', resolve);
      dest.on('error', reject);
    });
  } catch (err: any) {
    console.log('Download incompleto: ', err);
  }
};

export const downloadFolder = async ({
  server,
  clientName,
  driveId,
  driveUploadId,
  folderId,
}: {
  server: any;
  folderId: string;
  driveId: string;
  clientName: string;
  driveUploadId: string;
}) => {
  try {
    const drive = await toAuth();

    server(`Client: ${clientName}`);
    console.log('Client:', clientName);

    const res = await drive.files.list({
      driveId,
      corpora: 'drive',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      supportsTeamDrives: true,
      orderBy: 'name',
      pageSize: 1000,
      q: `'${folderId}' in parents`,
      fields: 'files(id, name, mimeType)',
    });

    const filterFiles = res.data.files.filter((value) => value.name[0] !== '_');

    if (filterFiles.length === 0) {
      server('Não possui arquivos para serem baixados');
      console.log('Não possui arquivos para serem baixados');
    } else {
      for await (const folder of filterFiles) {
        server(`Project: ${folder.name}`);
        console.log('Project: ', folder.name);
        const res = await drive.files.list({
          driveId,
          corpora: 'drive',
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
          supportsTeamDrives: true,
          orderBy: 'name',
          pageSize: 1000,
          q: `'${folder.id}' in parents`,
          fields: 'files(id, name, mimeType)',
        });

        const imgs = res.data.files.find(
          (value) => value.name === '06_IMAGENS',
        );

        if (imgs) {
          console.log(imgs.name);
          const res = await drive.files.list({
            driveId,
            corpora: 'drive',
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            supportsTeamDrives: true,
            orderBy: 'name',
            pageSize: 1000,
            q: `'${imgs.id}' in parents`,
            fields: 'files(id, name, mimeType)',
          });

          const versions = res.data.files.filter(
            (value) => value.name !== '_MODELO',
          );

          for await (const version of versions) {
            console.log(version.name);
            const res = await drive.files.list({
              driveId,
              corpora: 'drive',
              includeItemsFromAllDrives: true,
              supportsAllDrives: true,
              supportsTeamDrives: true,
              orderBy: 'name',
              pageSize: 1000,
              q: `'${version.id}' in parents and mimeType = "image/jpeg"`,
              fields: 'files(id, name, mimeType)',
            });

            const filesImages = res.data.files;

            if (filesImages.length === 0) {
              server('Pasta vazia.');
              console.log('Pasta vazia.');
            } else {
              for await (const image of filesImages) {
                let folderIdUpload = '';
                const uploadFolder = `${clientName}/${folder.name}/${imgs.name}/${version.name}`;

                await downloadFile(image.id, './download', image.name)
                  .then(() => {
                    server(
                      `Download concluído com sucesso do arquivo: ${image.name}`,
                    );
                    console.log('Download concluído com sucesso!');
                  })
                  .catch((error) => {
                    server(
                      `Ocorreu um erro durante o download do arquivo: ${image.name}`,
                    );
                    console.error('Ocorreu um erro durante o download:', error);
                  });

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

                    toDelete(`./download/${image.name}`, image.name);
                  });

                if (folderIdUpload.length !== 0) {
                  await toUpload({
                    server,
                    fileName: image.name,
                    folderId: folderIdUpload,
                    filePath: `./download/${image.name}`,
                  });
                }
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Ocorreu um erro', err?.errors?.[0]?.message);
  }
};
