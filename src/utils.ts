export const baseObjectDownload = (driveId: string) => {
  const objectDownload = (folderId: string) => ({
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

  return objectDownload;
};
