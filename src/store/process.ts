import {defineStore} from "pinia"

interface processState {
    process: Record<string, number>
}

export const useProcess = defineStore<"process", processState>({
    id: "process",
    state: () => ({
        process: {}
    })
})