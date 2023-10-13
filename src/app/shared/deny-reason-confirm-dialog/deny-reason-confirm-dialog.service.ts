import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable() export class DenyReasonConfirmDialogService {
    private subject = new Subject<any>();
    message:any;
    remove_deny_update = new Subject<any>();

    confirmThis(message: string,sectionId:number,section, yesFn: () => void, noFn: () => void): any {

        this.setConfirmation(message,sectionId,section, yesFn, noFn);
    }

    setConfirmation(message: string, sectionId:number,section:string ,yesFn: () => void, noFn: () => void): any {
        console.log('innnnn');

        const that:this = this;
        this.subject.next({type: 'confirm', text: message, id:sectionId, section:section,
            yesFn(): any {
                    that.subject.next(); // This will close the modal
                    that.remove_deny_update.next(message);
                    yesFn();
                },
            noFn(): any {
                that.subject.next();
                noFn();
            }
        });
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
