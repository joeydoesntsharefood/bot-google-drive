import { drive_v3 } from "googleapis";
import { toAuth } from "./toAuth";

export const toListen = async (folderId: string): Promise<Array<drive_v3.Schema$File>> => {
	try {
		const drive = await toAuth();
	
		const response = await drive.files.list({
			q: `'${folderId}' in parents`,
      fields: 'files(name, id, fileExtension)',
      pageSize: 10,
    });

		const files = response.data.files;
		if (files.length) {
      console.log('Arquivos e pastas encontrados:');
      files.forEach((file) => {
        console.log(`Nome: ${file.name}`);
        console.log(`ID: ${file.id}`);
        console.log('---');
      });

      return files;
    } else {
      console.log('Nenhum arquivo ou pasta encontrada no diretório.');
    }
	} catch (err: any) {
		console.log('[Listen]Ocorreu um erro: ', err);
	}
};