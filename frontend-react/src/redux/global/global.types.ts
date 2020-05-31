export type Notification = {
    id: string,
    type: NotificationTypes, 
    message: string
}

enum NotificationTypes {
    SUCCESS = "SUCCESS"
}