import {app, BrowserWindow, ipcMain, Menu, Tray} from "electron";
import {fileURLToPath} from "node:url";
import path from "node:path";
import express from "express";
import bodyParser from "body-parser";
import Notice from "../src/services/notice.ts";
import axios from "axios";
import * as fs from "node:fs";

// 一堆神奇的初始化

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
// export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;

let win: BrowserWindow | null;

// 创建窗口
function createWindow() {
    win = new BrowserWindow({
        title: "IceLinkNet",
        icon: path.join(process.env.VITE_PUBLIC, "logo.png"),
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
            nodeIntegration: true,
            contextIsolation: false,
        },
        width: 1020,
        height: 600,
        minWidth: 700,
        minHeight: 400,
        frame: false,
        useContentSize: true,
    });
    
    win.webContents.openDevTools();
    
    app.setAppUserModelId("IceLinkNet");
    win.webContents.on("did-finish-load", () => {
        win?.webContents.send("main-process-message", (new Date).toLocaleString());
    })
    
    if (VITE_DEV_SERVER_URL) {
        win.loadURL!(VITE_DEV_SERVER_URL);
        webapi();
    } else {
        win.loadFile!(path.join(RENDERER_DIST, "index.html"));
        webapi();
    }

    ipcMain.handle("downloadFile", async (event, downloadUrl, savePath) => {
        const writer = fs.createWriteStream(savePath);
        const response = await axios({
            url: downloadUrl,
            method: "GET",
            responseType: "stream",
        });

        const totalLength = response.headers["content-length"];
        let downloadedLength = 0;

        response.data.on("data", (chunk: any) => {
            downloadedLength += chunk.length;
            const progress = (downloadedLength / totalLength) * 100;
            if(win) win.webContents.send("downloadProgress", progress);
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on("finish", () => resolve(savePath));
            writer.on("error", reject);
        });
    });
}

// 三大金刚 - 最小化、最大化、关闭
ipcMain.on("minimize", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        win.minimize();
    }
});
ipcMain.on("maximize", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    }
});
ipcMain.on("close", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        const settingPath = path.join(process.cwd(), "data/setting.json");
        const data = JSON.parse(fs.readFileSync(settingPath, "utf-8"));
        if (data.tray === 0) {
            win.hide();
        } else {
            win.close();
        }
    }
});

// 托盘
app.whenReady().then(() => {
    let tray = new Tray(path.join(process.env.VITE_PUBLIC, "logo.png")) //path.join(__dirname, "/public/logo.png")
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "打开应用", type: "normal", click: () => {
                if (win) {
                    win.show()
                } else {
                    createWindow()
                }
            }
        },
        {
            label: "退出应用", type: "normal", click: () => {
                app.quit()
            }
        },
    ]);
    tray.on("click", () => {
        if (win) {
            win.show()
        } else {
            createWindow()
        }
    });
    tray.setToolTip("IceLinkNet");
    tray.setContextMenu(contextMenu);
    createWindow();
})

// 应用 WEBAPI 服务
function webapi() {
    const api_status = false;

    if (api_status) {
        const api = express();
        const port = 3000;
        api.use(bodyParser.json());

        api.get("/", (req, res) => {
            res.json({
                "code": 200,
                "message": "Hello MoonNetwork, Docs: https://moonnetwork.rivfox.com/docs"
            });
        });

        api.post("/api/tunnel", (req, res) => {
            const data = req.body;
            console.log("收到的数据:", data);
            res.json({message: "数据已接收", data});
        });

        api.listen(port, () => {
            Notice.win("WEBAPI", "已启动 WEBAPI 服务, 注意保管 Authorization, 不提示此通知可在设置关闭");
        });
    }
}