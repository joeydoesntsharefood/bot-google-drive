import * as fs from "fs";
import { toAuth } from "./toAuth";
import * as path from 'path';

async function createFolderRecursive(parentId: string, folderPath: string) {
  const drive = await toAuth();
   
  const folderNames = folderPath.split('/');
  let currentFolderId = parentId;

  for (const folderName of folderNames) {
    const existingFolder = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${currentFolderId}' in parents`,
      fields: 'files(id)',
    });

    if (existingFolder.data.files && existingFolder.data.files.length > 0) {
      // A pasta já existe, atualiza o ID da pasta atual
      currentFolderId = existingFolder.data.files[0].id;
    } else {
      // Cria a nova pasta
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [currentFolderId],
      };

      const response = await drive.files.create({
        requestBody: folderMetadata,
        fields: 'id',
      });

      currentFolderId = response.data?.id || '';
    }
  }

  return currentFolderId;
}

async function downloadFile(fileId: string, outputPath: string, fileName: string) {
  try {
    const drive = await toAuth();
    
    const res = await drive.files.get(
      {
        fileId,
        alt: "media"
      },
      {
        responseType: "stream"
      }
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
    console.log("Download incompleto: ", err);
  }
}

  export async function downloadFolder(folderId: string, downloadDir: string, driveId: string, clientName: string) {
    try {
      const drive = await toAuth();

      const res = await drive.files.list({
        driveId,
        corpora: "drive",
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        supportsTeamDrives: true,      
        orderBy: "name",
        pageSize: 1000,    
        q: `'${folderId}' in parents`,
        fields: 'files(id, name, mimeType)',
      });
      
      const filterFiles = res.data.files.filter(value => value.name[0] !== '_');

      if (filterFiles.length === 0) {
        console.log('Não possui arquivos para serem baixados');
      } else {
        for await (const folder of filterFiles) {
          console.log("Project: ", folder.name)
          const res = await drive.files.list({
            driveId,
            corpora: "drive",
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            supportsTeamDrives: true,      
            orderBy: "name",
            pageSize: 1000,    
            q: `'${folder.id}' in parents`,
            fields: 'files(id, name, mimeType)',
          });
          
          const imgs = res.data.files.find(value => value.name === '06_IMAGENS');

          if (imgs) {
            console.log(imgs.name);
            const res = await drive.files.list({
              driveId,
              corpora: "drive",
              includeItemsFromAllDrives: true,
              supportsAllDrives: true,
              supportsTeamDrives: true,      
              orderBy: "name",
              pageSize: 1000,    
              q: `'${imgs.id}' in parents`,
              fields: 'files(id, name, mimeType)',
            });

            const versions = res.data.files.filter(value => value.name !== "_MODELO");

            for await (const version of versions) {
              console.log(version.name);
              const res = await drive.files.list({
                driveId,
                corpora: "drive",
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
                supportsTeamDrives: true,      
                orderBy: "name",
                pageSize: 1000,    
                q: `'${version.id}' in parents and mimeType = "image/jpeg"`,
                fields: 'files(id, name, mimeType)',
              });

              const filesImages = res.data.files;

              for await (const image of filesImages) {
                let folderIdUpload = "";
                const uploadFolder = `${clientName}/${folder.name}/${imgs.name}/${version.name}/${image.name}`;

                downloadFile(image.id, './download', image.name)
                  .then(() => {
                    console.log('Download concluído com sucesso!');
                  })
                  .catch((error) => {
                    console.error('Ocorreu um erro durante o download:', error);
                  });

                createFolderRecursive(driveId, uploadFolder)
                  .then((folderId) => {
                    console.log('Pasta criada com sucesso. ID:', folderId)
                    folderIdUpload = folderId 
                  })
                  .catch((error) => {
                    console.error('Ocorreu um erro ao criar a pasta:', error);
                  });                
                  
                  await toUpload({ fileName: image.name, folderId: folderIdUpload, filePath: "./download" });
              }
            }      
          }          
        }
      }
  } catch (err) {
    console.error('Ocorreu um erro', err?.errors?.[0]?.message);
  }
}

