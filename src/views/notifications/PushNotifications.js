import notificationTypes from '@/config/notification-types';

export default {
    name: 'PushNotifications',
    async pushNotifications(newNotification) {
        function checkNotificationPromise() {
            try {
                Notification.requestPermission().then();
            } catch (e) {
                return false;
            }

            return true;
        }

        // Let's check if the browser supports notifications
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications.');
        } else if (checkNotificationPromise()) {
            Notification.requestPermission().then((permission) => {
                if (!('permission' in Notification)) {
                    Notification.permission = permission;
                }
                console.log(permission);
            });
        } else {
            Notification.requestPermission(function requestPerm(permission) {
                if (!('permission' in Notification)) {
                    Notification.permission = permission;
                }
                console.log(permission);
            });
        }
        const img = '@/assets/logo.png';
        const title = notificationTypes[newNotification.notif_type].title();
        const text = notificationTypes[newNotification.notif_type].body(newNotification.meta);
        const body = { body: text, icon: img };

        return new Notification(title, body);
    },
};
