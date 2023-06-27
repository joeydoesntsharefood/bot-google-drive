import { toAuth } from "./toAuth";
import * as fs from 'fs';

const DESTINATION_FOLDER = 'download';

export const toDownload = async (fileId: string, fileName: string) => {
  if (!fs.existsSync(DESTINATION_FOLDER)) {
    fs.mkdirSync(DESTINATION_FOLDER, { recursive: true });
  }

  try {
    const drive = await toAuth();

    const response = await drive.files.get({
      alt: 'media',
      fileId
    }, { responseType: 'stream' });

    const destStream = fs.createWriteStream(`${DESTINATION_FOLDER}/${fileName}`);

    const onFinish = () => {
      console.log(`O arquivo ${fileName} foi baixado e salvo em: ${DESTINATION_FOLDER}`);
    };
    destStream.on('finish', onFinish);

    response.data
      .on('end', () => {
        destStream.end();
      })
      .on('error', (err) => {
        console.error('Ocorreu um erro ao baixar o arquivo:', err);
      })
      .pipe(destStream);
  } catch (err: any) {
    console.log('[Download] Ocorreu um erro: ', err);
  }
}