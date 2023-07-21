import { toAuth } from './toAuth';

export const createFolderRecursive = async (
  parentId: string,
  folderPath: string,
) => {
  const drive = await toAuth();

  console.log('Pasta Pai:', parentId);
  console.log('Caminho a ser criado:', folderPath);

  const folderNames = folderPath.split('/');
  let currentFolderId = parentId;

  for (const folderName of folderNames) {
    const existingFolder = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${currentFolderId}' in parents`,
      fields: 'files(id)',
      supportsAllDrives: true,
    });

    if (existingFolder.data.files && existingFolder.data.files.length > 0) {
      currentFolderId = existingFolder.data.files[0].id;
    } else {
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [currentFolderId],
      };

      const response = await drive.files.create({
        requestBody: folderMetadata,
        fields: 'id',
        supportsAllDrives: true,
      });

      currentFolderId = response.data?.id || '';
    }
  }

  return currentFolderId;
};
