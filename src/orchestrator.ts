import { downloadFolder } from './toDownload';
import { toListen, drivesList } from './toListen';
import { toAuth } from './toAuth';
import { genToken } from './genToken';

const uploadVideoId = {
  zero: '1ZpieLGljwxEIH_K2bYDOKsbCdwBgckAQ',
  one: '1YApBq6KK6gZjyvdHdE2_FRHMrWtjcA3X',
  two: '1BetCY6B4NSGslVCD02l4mE8aE_iOeTqF',
  three: '1qQGRRzi-dZpF7x-ztMlpp9ZDDxK7kJkp',
};

export const orchestrator = async (server: any) => {
  await genToken();

  const [zero, jobs, jobsTwo, jobsThree] = await toListen();

  console.log(
    'Rodando 2020------------------------------------------------------------------------------------------',
  );
  server('Rodando 2020');

  // for await (const folder of zero) {
  //   if (folder.name[0] !== '_') {
  //     console.log(folder.name);

  //     await downloadFolder({
  //       server,
  //       folderId: folder.id,
  //       driveId: drivesList._JOBS,
  //       clientName: folder.name,
  //       driveUploadId: uploadVideoId.zero,
  //     });
  //   }
  // }

  console.log(
    'Rodando 2021------------------------------------------------------------------------------------------',
  );
  server('Rodando 2021');

  // for await (const folder of jobs) {
  //   if (folder.name[0] !== '_') {
  //     await downloadFolder({
  //       server,
  //       folderId: folder.id,
  //       driveId: drivesList._JOBS_2022,
  //       clientName: folder.name,
  //       driveUploadId: uploadVideoId.one,
  //     });
  //   }
  // }

  console.log(
    'Rodando 2022------------------------------------------------------------------------------------------',
  );
  server('Rodando 2022');

  // for await (const folder of jobsTwo) {
  //   if (folder.name[0] !== '_') {
  //     await downloadFolder({
  //       server,
  //       folderId: folder.id,
  //       driveId: drivesList._JOBS_2022,
  //       clientName: folder.name,
  //       driveUploadId: uploadVideoId.two,
  //     });
  //   }
  // }

  console.log(
    'Rodando 2023------------------------------------------------------------------------------------------',
  );
  server('Rodando 2023');

  for await (const folder of jobsThree) {
    if (folder.name[0] !== '_') {
      await downloadFolder({
        server,
        folderId: folder.id,
        driveId: drivesList._JOBS_2023,
        clientName: folder.name,
        driveUploadId: uploadVideoId.three,
      });
    }
  }
};
