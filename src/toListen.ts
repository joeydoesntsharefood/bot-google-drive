import { drive_v3 } from "googleapis";
import { toAuth } from "./toAuth";
import { createLogFile } from "./createLogFile";

export const drivesList = {
  "_JOBS_2022": "0AN6yFIGWA7BwUk9PVA",
  "_JOBS_2023": "0AAMenQGp1kxlUk9PVA",
  "_JOBS": "0AIeO0_u-HWo-Uk9PVA",
};

export const toListen = async () => {
	try {
		const drive = await toAuth();
	  
    const baseParams = {
      corpora: "drive",
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      supportsTeamDrives: true,      
      orderBy: "name",
      fields: 'files(id, name, parents, mimeType)',
      pageSize: 1000,
    };

    const filesJOBS = await drive.files.list({ ...baseParams, driveId: drivesList._JOBS, q: `'${drivesList._JOBS}' in parents`  });

    const JOBS_FILES = filesJOBS.data.files;

    const filesJOBSTwo = await drive.files.list({ ...baseParams, driveId: drivesList._JOBS_2022, q: `'${drivesList._JOBS_2022}' in parents` });

    const JOBS_TWO_FILES = filesJOBSTwo.data.files;

    const filesJOBSThree = await drive.files.list({ ...baseParams, driveId: drivesList._JOBS_2023, q: `'${drivesList._JOBS_2023}' in parents`  });

    const JOBS_THREE_FILES = filesJOBSThree.data.files;
    
    return [
      JOBS_FILES,
      JOBS_TWO_FILES,
      JOBS_THREE_FILES,
    ]
	} catch (err: any) {
		console.log('[Listen]Ocorreu um erro: ', err);
	}
};
