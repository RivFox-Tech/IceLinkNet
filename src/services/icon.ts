import {h} from "vue";
import {NIcon} from "naive-ui";

export default function icon(icon: object) {
    return () => h(NIcon, null, {default: () => h(icon)})
}