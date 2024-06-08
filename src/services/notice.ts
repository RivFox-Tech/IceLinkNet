import {Notification} from "electron"
import path from "node:path";
import {useMessage} from "naive-ui";

export default class Notice {
    static win(body: string) {
        if (!Notification.isSupported()) {
            return 0;
        }

        new Notification({ title: "MoonNetwork", body: body}).show();
        return 1;
    }

    static app(body: string, type: string = "info") {
        const m = useMessage();
        if (type === "info") {
            
        }
    }
}