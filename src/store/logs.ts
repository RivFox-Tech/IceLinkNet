import {defineStore} from "pinia"

interface LogsState {
    logs: Record<string, string>
}

export const useLogs = defineStore<"logs", LogsState>({
    id: "logs",
    state: () => ({
        logs: {
            "all": ""
        }
    })
})