import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminOrOwnerGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const { user, params } = request;
        return this.check(user, params);
    }

    check(user, params) {
        return this.isOwner(user.userId, params.id) || this.isAdmin(user);
    }
    isOwner(userId, paramsId) {
        return userId === paramsId;
    }
    isAdmin({ role }) {
        return role === 'admin';
    }
}
