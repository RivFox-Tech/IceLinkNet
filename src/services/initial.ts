import fs from "node:fs";
import path from "node:path";

export default class initial {
    static file() {
        // 创建插件存放文件夹
        const pluginsPath = path.join(process.cwd(), "plugins");
        if (!fs.existsSync(pluginsPath)) {
            fs.mkdirSync(pluginsPath);
        }

        // 创建数据存放文件夹
        const dataPath = path.join(process.cwd(), "data");
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath);
        }

        // 创建核心文件夹
        const corePath = path.join(process.cwd(), "core");
        if (!fs.existsSync(corePath)) {
            fs.mkdirSync(corePath);
        }

        // 创建设置文件
        const settingsPath = path.join(process.cwd(), "data/setting.json")
        const settingsData = {
            "help": "https://learn.rivfox.com/docs/moonnetwork/client",
            "theme": "dark",
            "color": {
                "primaryColor": "#70c0e8",
                "primaryColorHover": "#8acbec",
                "primaryColorPressed": "#66AFD3FF",
                "primaryColorSuppl": "rgb(56, 137, 197)"
            },
            "notice": 0,
            "tray": 0
        };
        if (!fs.existsSync(settingsPath)) {
            fs.open(settingsPath, 'w', (err, fd) => {
            });
            fs.writeFile(settingsPath, JSON.stringify(settingsData, null, 2), (err) => {
            });
            fs.close(1);
        }

        // 创建隧道存储文件
        const tunnelPath = path.join(process.cwd(), "data/tunnel.json")
        const tunnelData = {
            "tunnels": []
        }
        if (!fs.existsSync(tunnelPath)) {
            fs.open(tunnelPath, 'w', (err, fd) => {
            });
            fs.writeFile(tunnelPath, JSON.stringify(tunnelData, null, 2), (err) => {
            });
            fs.close(1);
        }

        // 创建节点存储文件
        const nodePath = path.join(process.cwd(), "data/node.json")
        const nodeData = {
            "nodes": []
        }
        if (!fs.existsSync(nodePath)) {
            fs.open(nodePath, 'w', (err, fd) => {
            });
            fs.writeFile(nodePath, JSON.stringify(nodeData, null, 2), (err) => {
            });
            fs.close(1);
        }
    }
}