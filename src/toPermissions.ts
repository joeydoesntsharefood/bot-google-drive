import { toAuth } from './toAuth';

interface IPermissions {
  role: string;
  type: string;
}

interface Props {
  folderId: string;
  permissions: IPermissions;
}

export const anyonePermission: IPermissions = {
  role: 'fileOrganizer',
  type: 'anyone',
};

export const nobodyPermission: IPermissions = {
  role: 'reader',
  type: 'anyone',
};

export const toPermissions = async ({
  folderId: fileId,
  permissions: requestBody,
}: Props) => {
  const drive = await toAuth();

  try {
    const res = await drive.permissions.create({
      fileId,
      requestBody,
      supportsTeamDrives: true,
      supportsAllDrives: true,
    });

    console.log(res);
  } catch (err: any) {
    console.log(err);
  }
};
