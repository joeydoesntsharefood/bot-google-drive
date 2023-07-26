import { toAuth } from './toAuth';

// let watchList = [];

interface Props {
  folderId: string;
  webhookUrl: string;
}

export const toWatch = async ({ folderId: fileId, webhookUrl }: Props) => {
  const drive = await toAuth();

  try {
    const res = await drive.files.watch({
      fileId,
      supportsAllDrives: true,
      supportsTeamDrives: true,
      requestBody: {
        type: 'web_hook',
        id: webhookUrl,
      },
    });

    console.log(res);
  } catch (err: any) {
    console.log(err);
  }
};
