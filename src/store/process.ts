import { defineStore } from "pinia"

interface processState {
    process: Record<string, string>
}

export const useProcess = defineStore<"logs", processState>({
    id: "logs",
    state: () => ({
        process: {
            "213": ""
        }
    }),
    actions: {
        addProcess(name: string, key: string) {
            this.process[name] = key;
        },
        removeProcess(name: string) {
            delete this.process[name]
        },
        hasProcess(name: string): boolean {
            return name in this.process
        }
    }
})