import { NotificationManager } from 'react-notifications';

function useNotify() {
    const timeout = 3000
    return (type: string,  message: string | object, title?: string) => {
        if(typeof message === 'object'){
            message = JSON.stringify(message)
        }
        switch (type) {
            case 'info':
                NotificationManager.info(message, title, timeout);
                break;
            case 'ok':
                NotificationManager.success(message, title, timeout);
                break;
            case 'warning':
                NotificationManager.warning(message, title, timeout);

                break;
            case 'error':
                NotificationManager.error(message, title, timeout);
                break;
        }
    };
}

export default useNotify