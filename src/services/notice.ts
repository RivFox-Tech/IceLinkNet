import {Notification} from "electron"

export default class Notice {
    static win(title: string, body: string) {
        if (!Notification.isSupported()) {
            return 0;
        }

        new Notification({ title: title, body: body}).show();
        return 1;
    }
}