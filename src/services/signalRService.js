// src/services/signalRService.js
import * as signalR from "@microsoft/signalr";

let connection = null;

export async function startConnection(hubUrl, accessToken = null) {
    connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
            accessTokenFactory: accessToken ? () => accessToken : undefined,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.onreconnecting(error => {
        console.warn("🔄 Reconnecting...", error);
    });

    connection.onreconnected(connectionId => {
        console.info("✅ Reconnected with connectionId:", connectionId);
    });

    connection.onclose(error => {
        console.warn("❌ Connection closed:", error);
    });

    try {
        await connection.start();
        console.log("✅ SignalR Connected!");
    } catch (err) {
        console.error("❌ Connection error:", err);
        setTimeout(() => startConnection(hubUrl, accessToken), 5000);
    }
}

export function onMessage(methodName, callback) {
    if (!connection) return;
    connection.on(methodName, callback);
}

export function sendMessage(methodName, ...args) {
    if (!connection) return;
    connection.invoke(methodName, ...args).catch(err => console.error(err));
}

export function stopConnection() {
    if (connection) connection.stop();
}
