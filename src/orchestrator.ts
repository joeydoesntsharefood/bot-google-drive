import { genToken } from './genToken';
import { downloadFolder } from './toDownload';
import { toListen, drivesList } from './toListen';

const folderTest = {
  jobs: '1kwlmto7ZdQJN5Gm04yKQpQP-TtQVuSb7',
  jobsTwo: '1GCIyZEyY9ZozbAaSXm1vmiIYeiGRUhR9',
  jobsThree: '1jHbhgcMCAld0VEjJVhD10MuT_XQh6_vM',
};

export const orchestrator = async () => {
  await genToken();

  const [, jobsTwo, jobsThree] = await toListen();

  for await (const folder of jobsTwo) {
    if (folder.name[0] !== '_') {
      await downloadFolder({
        folderId: folder.id,
        driveId: drivesList._JOBS_2022,
        clientName: folder.name,
        driveUploadId: '1xLjV4rMKjr0BdI9QmoDnYl1MDrD-HDaE',
        // driveUploadId: folderTest.jobsTwo,
      });
    }
  }

  for await (const folder of jobsThree) {
    if (folder.name[0] !== '_') {
      await downloadFolder({
        folderId: folder.id,
        driveId: drivesList._JOBS_2023,
        clientName: folder.name,
        driveUploadId: '1xPMRFLpTzyA_I88W9z2ZPYXadXYyle-n',
        // driveUploadId: folderTest.jobsThree,
      });
    }
  }
};
