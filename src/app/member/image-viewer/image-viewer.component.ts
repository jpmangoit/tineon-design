import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent implements OnInit {

    @Input() open: boolean;
    @Input() imageURL: string;
    @Output() close: EventEmitter<any> = new EventEmitter();

    isImage:boolean = false;

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit(): void {
        this.isImage = true;
        // let ext:string[] = this.imageURL.split(".");
        // let docExt:string = ext[(ext.length) - 1];
        // if (docExt == 'png' || docExt == 'jpg' || docExt == 'jpeg') {
        //     this.isImage = true;
        // }
        // else {
        //     this.isImage = false;
        // }
    }

    sanitizeImageUrl(imageUrl: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
    }
}
