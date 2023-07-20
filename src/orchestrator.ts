import { genToken } from './genToken';
import { downloadFolder } from './toDownload';
import { toListen, drivesList } from './toListen';

export const orchestrator = async () => {
  await genToken();

  const [, jobsTwo, jobsThree] = await toListen();

  for await (const folder of jobsThree) {
    if (folder.name[0] !== '_') {
      await downloadFolder(
        folder.id,
        'download',
        drivesList._JOBS_2023,
        folder.name,
      );
    }
  }

  for await (const folder of jobsTwo) {
    if (folder.name[0] !== '_') {
      await downloadFolder(
        folder.id,
        'download',
        drivesList._JOBS_2022,
        folder.name,
      );
    }
  }
};
