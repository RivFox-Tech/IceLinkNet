import child_process from "node:child_process";
import {storeToRefs} from "pinia";
import {useLogs} from "../store/logs.ts";

export default class process {
    start(args: any) {
        
        const { logs } = storeToRefs(useLogs())
        const options: child_process.SpawnOptions = {
            windowsHide: true, // 隐藏窗口
            stdio: "pipe", // 获取标准输出流
            detached: false, // 不允许后台运行
            windowsVerbatimArguments: true,
        };
        const exeProcess = child_process.spawn("D:\\env\\frp\\frpc.exe", args, options);
        
        exeProcess.stdout?.on('data', (data) => {
            setTimeout(() => {
                logs.value["213"] += (this.formatLogMessage(data));
            }, 250);
        });
        exeProcess.stderr?.on('data', (data) => {
            setTimeout(() => {
                logs.value["213"] += (this.formatLogMessage(data));
            }, 250);
        });
    }

    formatLogMessage(message: any) {
        message = message.toString();
        return message.split("\n").map((line: any) => {
            if (line.includes("[I]")) {
                return `<span style="color: cornflowerblue">${line}</span>`;
            } else if (line.includes("[W]")) {
                return `<span style="color: orange">${line}</span>`;
            } else if (line.includes("[E]")) {
                return `<span style="color: indianred">${line}</span>`;
            }
            return line;
        }).join("\n");
    }
}