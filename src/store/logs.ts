import { defineStore } from "pinia"

interface LogsState {
    logs: Record<string, string>
}

export const useLogs = defineStore<"logs", LogsState>({
    id: "logs",
    state: () => ({
        logs: {
            "213": ""
        }
    }),
    actions: {
        addLog(name: string) {
            this.logs[name] = "";
        },
        removeLog(name: string) {
            delete this.logs[name]
        },
        hasLog(name: string): boolean {
            return name in this.logs
        }
    }
})