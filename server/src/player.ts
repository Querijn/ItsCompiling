import * as WebSocket from 'ws';

import { Identifier } from './messages/identifier';

export class Player {
    socket: WebSocket;

    identifier: Identifier = new Identifier();
    listeners: { [id: string] : any[] } = {};

    hasJoined: boolean = false;
    isInGame: boolean = false;

    constructor(socket: WebSocket) {
        this.socket = socket;

        this.socket.on('message', this.onReceive.bind(this));

        this.addListener(1, function (id: string) { 
            this.hasJoined = true;//parseInt(id) == this.identifier.c;
        }.bind(this));
    }

    public addListener(id: number, callback: any) {
        
        let stringId = String(id);
        if (this.listeners.hasOwnProperty(stringId) == false)
            this.listeners[stringId] = [];

        this.listeners[stringId].push(callback);
    }
    
    onReceive(message: string) {
        let msg = JSON.parse(message);
        let stringId = msg.m;

        if (this.listeners.hasOwnProperty(stringId) == false)
            this.listeners[stringId] = [];

        var listenerArray = this.listeners[stringId];
        for (let i = 0; i < listenerArray.length; i++) {
            listenerArray[i](msg.c);
        }
    }

    public send(message: object) {
        this.socket.send(JSON.stringify(message));
    }

    public sendIdentity() {

        this.send(this.identifier);
    }
}
