import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@core/services';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.auth.getToken();
        let language: string = localStorage.getItem('language');
        language = language ? language : 'de';

        if (req.url.includes('profile-photo') || req.url.includes('member-photo')) {
            var authReq = req.clone({
                setHeaders: {
                    'authorization': authToken,
                    'accept': 'image/webp,*/*'
                },
            });
        } else {
            var authReq = req.clone({
                setHeaders: {
                    'authorization': authToken,
                    'accept': 'application/json',
                    'lang': language,
                },
            });
        }


        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    console.log(error);
                    
                    // Handle 401 Unauthorized error here (e.g., log out the user)
                } else {
                    console.log(error);
                    // Handle other errors or show a generic error message
                }
                return throwError(error);
            })
        );;
    }
}