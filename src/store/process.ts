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
        addRrocess(name: string, key: string) {
            this.process[name] = key;
        },
        removeRrocess(name: string) {
            delete this.process[name]
        },
        hasRrocess(name: string): boolean {
            return name in this.process
        }
    }
})