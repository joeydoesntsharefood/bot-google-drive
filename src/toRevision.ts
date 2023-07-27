import { toAuth } from './toAuth';

interface Props {
  folderIdUpload: string;
  fileName: string;
  onRevision(value: boolean): void;
}

export const toRevision = async ({
  fileName,
  folderIdUpload,
  onRevision,
}: Props) => {
  try {
    const drive = await toAuth();

    const res = await drive.files.list({
      q: `name = '${fileName}' and '${folderIdUpload}' in parents`,
      supportsAllDrives: true,
      supportsTeamDrives: true,
      includeItemsFromAllDrives: true,
      includeTeamDriveItems: true,
    });

    if (res.data.files.length > 0) {
      console.log(`Ignorando o arquivo: ${fileName}`);
      onRevision(true);
    } else {
      console.log(`Continuando o progresso do arquivo: ${fileName}`);
      onRevision(false);
    }
  } catch (err: any) {
    console.log('Error[Revision]', err);
  }
};
