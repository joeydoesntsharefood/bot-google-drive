import * as path from "path";
import { folders } from "./configs/google.folders";
import { genToken } from "./genToken";
import { downloadFolder } from "./toDownload";
import { toListen, drivesList } from "./toListen";
import { toUpload } from "./toUpload";
import { toRealocation } from "./toRealocation";
import { toCopy } from "./toCopy";

export const orchestrator = async () => {
  await genToken();

  const [jobs, jobsTwo, jobsThree] = await toListen();
  
  for await (const folder of jobsThree) {
    if (folder.name[0] !== '_') {
      await downloadFolder(folder.id, 'download', drivesList._JOBS_2023, folder.name);
    }
  }

  for await (const folder of jobsTwo) {
    if (folder.name[0] !== '_') {
      console.log(`Client: ${folder.name} de Id: ${folder.id}`);
      await downloadFolder(folder.id, 'download', drivesList._JOBS_2022);
    }
  }  
};
