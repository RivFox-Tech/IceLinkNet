import {app, BrowserWindow, Menu, Tray} from "electron";
import {fileURLToPath} from "node:url";
import path from "node:path";
import {ipcMain} from "electron";
import express from 'express';
import bodyParser from 'body-parser';
import Notice from "../src/services/notice.ts";
import PubSub from "pubsub-js";

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
        title: "MoonNetwork",
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
    app.setAppUserModelId("MoonNetwork");
    win.webContents.on("did-finish-load", () => {
        win?.webContents.send("main-process-message", (new Date).toLocaleString());
    })
    win.webContents.openDevTools();

    if (VITE_DEV_SERVER_URL) {
        win.loadURL!(VITE_DEV_SERVER_URL);
        webapi();
    } else {
        win.loadFile!(path.join(RENDERER_DIST, "index.html"));
        webapi();
    }
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
        win.close();
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
    tray.setToolTip("MoonNetwork");
    tray.setContextMenu(contextMenu);
    createWindow();
})

// 应用 WEBAPI 服务

function webapi() {
    const api_status = true;

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
            console.log('收到的数据:', data);
            res.json({message: '数据已接收', data});
        });

        api.listen(port, () => {
            Notice.win("已启动 WEBAPI 服务, 注意保管 Authorization, 不提示此通知可在设置关闭");
        });
    }
}