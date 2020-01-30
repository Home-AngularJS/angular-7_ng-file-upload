import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { moveItemInArray, transferArrayItem, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';

class ItemFile {
  file: File;
  uploadProgress: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  items: ItemFile[] = [];
  imageUrls: string[] = [];
  favourites: string[] = [];
  message: string = null;

  constructor(private http: HttpClient) { }

  selectFiles = (event) => {
    this.items = [];
    let files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      // if (files.item(i).name.match(/\.(jpg|jpeg|png|gif)$/)) {
        this.items.push({file: files.item(i), uploadProgress: '0'});
      // }
    }
    this.message = `${this.items.length} valid image(s) selected`;
  }

  uploadFiles() {
    this.items.map((item, index) => {
      const formData = new FormData();
      formData.append('image', item.file, item.file.name);
      return this.http.post('http://localhost:5000/upload', formData, {
        reportProgress: true,
        observe: 'events'
      })
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress ) {
            item.uploadProgress = `${(event.loaded / event.total * 100)}%`;
          }
          if (event.type === HttpEventType.Response) {
            // this.imageUrls.push(event.body.imageUrl);
          }
        });
    });
  }

  uploadFile(item) {
    const formData = new FormData();
    formData.append('image', item.file, item.file.name);
    return this.http.post('http://localhost:5000/upload', formData, {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress ) {
          item.uploadProgress = `${(event.loaded / event.total * 100)}%`;
        }
        if (event.type === HttpEventType.Response) {
          // this.imageUrls.push(event.body.imageUrl);
        }
      });
  }

  removeFile(item: ItemFile) {
      this.items.splice(this.items.indexOf(item),1);
  }
}
