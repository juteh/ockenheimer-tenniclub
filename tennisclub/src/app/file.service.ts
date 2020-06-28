import {Injectable} from '@angular/core';
import {IpcRenderer} from 'electron';

@Injectable({providedIn: 'root'})
export class FileService {
  private ipc: IpcRenderer;

  constructor() {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (error) {
        throw error;
      }
    } else {
      console.warn('Could not load electron ipc');
    }
  }

  async getFiles() {
    return new Promise<string[]>((resolve, reject) => {
      this.ipc.once('getFilesResponse', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('getFiles');
    });
  }

  async getFile(path: string) {
    return new Promise<string>((resolve, reject) => {
      this.ipc.once('getFileResponse', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('getFile', path);
    });
  }

  async updateFile(path: string, fileAsText: string) {
    return new Promise<string>((resolve, reject) => {
      this.ipc.once('updateFileResponse', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('updateFile', path, fileAsText);
    });
  }
}
