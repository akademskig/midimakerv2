import { Color } from '@material-ui/lab/Alert';
import { useContext } from 'react';
import { NotificationsCtx } from './Notifications.provider';

function useNotify() {
    const timeout = 3000
    const { notify } = useContext(NotificationsCtx)
    return (type: Color, message: string | object, title?: string) => {
        if (typeof message === 'object') {
            message = JSON.stringify(message)
        }

        notify({ type, message, title, timeout });

    };
}

export default useNotify