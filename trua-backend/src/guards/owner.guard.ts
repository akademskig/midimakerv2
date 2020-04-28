import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class OwnerGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const { user, params } = request;
        return this.isOwner(user.userId, params.id);
    }
    isOwner(userId, paramsId) {
        return userId === paramsId;
    }
}
