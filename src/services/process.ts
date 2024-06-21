import child_process from "node:child_process";
import {storeToRefs} from "pinia";
import {useLogs} from "../store/logs.ts";
import path from "node:path";
import {useProcess} from "../store/process.ts";


const p = process;

export default class NewProcess {
    start(args: any, id: string) {
        const { process } = storeToRefs(useProcess());
        const { logs } = storeToRefs(useLogs());
        const options: child_process.SpawnOptions = {
            windowsHide: true, // 隐藏窗口
            stdio: "pipe", // 获取标准输出流
            detached: false, // 不允许后台运行
            windowsVerbatimArguments: true,
        };
        const exeProcess = child_process.spawn(path.join(p.cwd(), "core/frpc.exe"), args, options);
        
        process.value[id] = Number(exeProcess.pid);
        
        exeProcess.stdout?.on('data', (data) => {
            setTimeout(() => {
                logs.value["all"] += this.formatLogMessage(data);
                logs.value[id] += this.formatLogMessage(data);
            }, 250);
        });
        exeProcess.stderr?.on('data', (data) => {
            setTimeout(() => {
                logs.value["all"] += this.formatLogMessage(data);
                logs.value[id] += this.formatLogMessage(data);
            }, 250);
        });
    }
    
    kill(id: string) {
        const { process } = storeToRefs(useProcess());
        const { logs } = storeToRefs(useLogs());
        p.kill(Number(process.value[id]));
        delete process.value[id];
        delete logs.value[id];
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

    getCurrentFormattedTime(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
}