import { Injectable, computed, signal } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { GlobalConstants as gData } from '../data/global-constants';

export interface User {
    id: number;
    loginId: string;
    image: string | null;
    phone: string | null;
    email: string | null;
}

@Injectable({
    providedIn: 'root',
})
export class UserStateService {
    public user = signal<User | null>(null);
    isLogin = signal(false);
    constructor(public _authService: AuthService) {}

    isLoginTrue() {
        this.isLogin.set(true);
    }

    isLoginFalse() {
        this.isLogin.set(false);
    }

    loadUserState() {
        if (this.isLogin() == true) {
            this._authService.userData().subscribe((res) => {
                let img = gData.assetsBaseURL + res.data.image;
                this.user.set({
                    id: res.data.id,
                    loginId: res.data.login_id,
                    image: img,
                    phone: res.data.phone,
                    email: res.data.email,
                });
            });
        }
    }
}
