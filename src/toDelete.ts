import * as fs from 'fs';

export const toDelete = (filePath: string, fileName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (error) => {
      if (error) {
        return reject(error);
      }

      console.log(`Arquivo ${fileName} deletado.`);
      resolve();
    });
  });
};
