import { toAuth } from './toAuth';

export const createFolderRecursive = async (
  parentId: string,
  folderPath: string,
) => {
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
};
