import * as path from "path";
import { folders } from "./configs/google.folders";
import { genToken } from "./genToken";
import { toDownload } from "./toDownload";
import { toListen } from "./toListen";
import { toUpload } from "./toUpload";

const FILE_EXTENSION = 'jpeg'

export const orchestrator = async () => {
  await genToken();

  const files = await toListen(folders.DRIVE_TEST);

  const filterFiles = files.filter(value => value.fileExtension === FILE_EXTENSION);

  for await (const file of filterFiles) {
    await toDownload(file.id, file.name);
  }
  
  for await (const file of filterFiles) {
    await toUpload({
      fileName: file.name,
      filePath: path.join('download', file.name),
      folderId: folders.DRIVE_TEST_UPLOAD
    })
  }
};