export default function system() {
    if (process.platform == "darwin") {
        return "macos";
    }
    if (process.platform == "win32") {
        return "windows";
    }
    if (process.platform == "linux") {
        return "linux";
    }
}