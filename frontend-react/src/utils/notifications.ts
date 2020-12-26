import { useContext } from 'react';
import { NotificationManager } from 'react-notifications';
import { NotificationsCtx } from '../components/common/notifications/Notifications.provider';

function useNotify() {
    const timeout = 3000
    const { notify  } = useContext(NotificationsCtx)
    return (type: string,  message: string | object, title?: string) => {
        if(typeof message === 'object'){
            message = JSON.stringify(message)
        }
        console.log(type)
        switch (type) {
            case 'info':
                notify({message, title, timeout});
                break;
            case 'success':
                NotificationManager.success(message, title, timeout);
                break;
            case 'warning':
                NotificationManager.warning(message, title, timeout);

                break;
            case 'error':
                notify({message, title, timeout, type: 'error'});
                break;
        }
    };
}

export default useNotify