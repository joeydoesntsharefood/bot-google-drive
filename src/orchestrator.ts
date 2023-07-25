import { genToken } from './genToken';
import { downloadFolder } from './toDownload';
import { toListen, drivesList } from './toListen';

export const orchestrator = async (server: any) => {
  await genToken();

  const [zero, jobs, jobsTwo, jobsThree] = await toListen();

  for await (const folder of zero) {
    if (folder.name[0] !== '_') {
      await downloadFolder({
        driveName: '2020',
        server,
        folderId: folder.id,
        driveId: drivesList._JOBS,
        clientName: folder.name,
        driveUploadId: '1xJW6zqjtO1Rlsd8kIfJTHeT1BcVQg4AA',
      });
    }
  }

  for await (const folder of jobs) {
    if (folder.name[0] !== '_') {
      await downloadFolder({
        driveName: '2021',
        server,
        folderId: folder.id,
        driveId: drivesList._JOBS_2022,
        clientName: folder.name,
        driveUploadId: '1xLtHMhW6aLFrdwQBFoubHs56fLConMrL',
      });
    }
  }

  for await (const folder of jobsTwo) {
    if (folder.name[0] !== '_') {
      await downloadFolder({
        driveName: '_JOBS_2022',
        server,
        folderId: folder.id,
        driveId: drivesList._JOBS_2022,
        clientName: folder.name,
        driveUploadId: '1xLjV4rMKjr0BdI9QmoDnYl1MDrD-HDaE',
      });
    }
  }

  for await (const folder of jobsThree) {
    if (folder.name[0] !== '_') {
      await downloadFolder({
        driveName: 'JOBS_2023',
        server,
        folderId: folder.id,
        driveId: drivesList._JOBS_2023,
        clientName: folder.name,
        driveUploadId: '1xLjV4rMKjr0BdI9QmoDnYl1MDrD-HDaE',
      });
    }
  }
};
