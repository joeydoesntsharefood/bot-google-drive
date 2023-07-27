import * as fs from 'fs';
import { toAuth } from './toAuth';
import * as path from 'path';
import { toMove } from './toMove';
import { drive_v3 } from 'googleapis';
import { auth } from 'google-auth-library';

export const downloadFile = async (
  fileId: string,
  outputPath: string,
  fileName: string,
  // drive: drive_v3.Drive,
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

    const fileSize = parseInt(res.headers['content-length'] || '0', 10);

    let downloadedBytes = 0;

    res.data.on('data', (chunk: Buffer) => {
      downloadedBytes += chunk.length;
      const progress = ((downloadedBytes / fileSize) * 100).toFixed(2);
      process.stdout.write(`Progresso do download: ${progress}%\r`);
    });

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
}: // drive,
{
  server: any;
  folderId: string;
  driveId: string;
  clientName: string;
  driveUploadId: string;
  // drive: drive_v3.Drive;
}) => {
  try {
    const drive = await toAuth();

    const folderIdUpload = '';

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
        let breakLoop = false;

        // const clientUploadFolder = `${clientName}/${folder.name}/${imgs.name}/${version.name}`;

        // Cliente pastas de fora;

        let uploadFolder = `${clientName}`;

        await toMove({
          // drive,
          driveUploadId,
          file: folder,
          folderIdUpload,
          server,
          uploadFolder,
          onFinish: () => {
            console.log(`Loop finalizado: ${folder.name}`);
            breakLoop = true;
          },
        });

        if (!breakLoop) {
          console.log(`Continuando o loop: ${folder.name}`);

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

          // const folderType = '07_VIDEO';

          const imgs = res.data.files;

          for (const img of imgs) {
            if (imgs) {
              uploadFolder = `${clientName}/${folder.name}`;

              await toMove({
                // drive,
                driveUploadId,
                file: img,
                folderIdUpload,
                server,
                uploadFolder,
                onFinish: () => {
                  console.log(`Loop finalizado: ${img.name}`);
                  breakLoop = true;
                },
              });

              if (!breakLoop) {
                console.log(`Continuando o loop: ${img.name}`);

                console.log('Tipo de arquivo: ', img.name);

                const res = await drive.files.list({
                  driveId,
                  corpora: 'drive',
                  includeItemsFromAllDrives: true,
                  supportsAllDrives: true,
                  supportsTeamDrives: true,
                  orderBy: 'name',
                  pageSize: 1000,
                  q: `'${img.id}' in parents`,
                  fields: 'files(id, name, mimeType)',
                });

                const versions = res.data.files.filter(
                  (value) => value.name !== '_MODELO',
                );

                for await (const version of versions) {
                  const versionQuery = `'${version.id}' in parents`;

                  uploadFolder = `${clientName}/${folder.name}/${img.name}`;

                  await toMove({
                    // drive,
                    driveUploadId,
                    file: version,
                    folderIdUpload,
                    server,
                    uploadFolder,
                    onFinish: () => {
                      console.log(`Loop finalizado: ${version.name}`);
                      breakLoop = true;
                    },
                  });

                  if (!breakLoop) {
                    console.log(`Continuando o loop: ${version.name}`);

                    console.log('Pasta de versão', version.name);

                    const res = await drive.files.list({
                      driveId,
                      corpora: 'drive',
                      includeItemsFromAllDrives: true,
                      supportsAllDrives: true,
                      supportsTeamDrives: true,
                      orderBy: 'name',
                      pageSize: 1000,
                      q: versionQuery,
                      fields: 'files(id, name, mimeType, parents)',
                    });

                    const filterImages = (value: drive_v3.Schema$File) =>
                      value.mimeType === 'video/x-msvideo' ||
                      value.mimeType === 'video/mov' ||
                      value.mimeType === 'video/mp4';

                    const filesImages = res.data.files.filter(filterImages);

                    if (filesImages.length === 0) {
                      console.log('Pasta vazia.');
                      server('Pasta vazia.');
                    } else {
                      for await (const image of filesImages) {
                        uploadFolder = `${clientName}/${folder.name}/${img.name}/${version.name}`;

                        await toMove({
                          // drive,
                          driveUploadId,
                          folderIdUpload,
                          file: image,
                          server,
                          uploadFolder,
                          onFinish: () => {
                            console.log(`Loop finalizado: ${image.name}`);
                          },
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.log('Download Error:', err);

    console.error('Ocorreu um erro', err?.errors?.[0]?.message);
  }
};
