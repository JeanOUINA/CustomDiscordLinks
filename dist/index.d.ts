/// <reference types="node" />
import { EventEmitter } from "events";
import e = require("express");
export default class CustomDiscordLinks extends EventEmitter {
    constructor(config: CustomDiscordLinksConfig, app: e.Express | e.IRouter);
    config: CustomDiscordLinksConfig;
    cache: {
        [key: string]: InviteData;
    };
    promises: {
        [key: string]: Promise<InviteData>;
    };
    get(req: e.Request, res: e.Response, next: e.NextFunction): void | e.Response<any>;
    getOembed(req: e.Request, res: e.Response, next: e.NextFunction): void | e.Response<any>;
}
export interface CustomDiscordLinksConfig {
    embed: {
        color: string;
        ProviderName: string;
        ProviderURL: string;
    };
    codes: {
        [key: string]: string;
    };
}
export interface InviteData {
    code: string;
    guild?: {
        id: string;
        name: string;
        splash?: string;
        banner?: string;
        description: string;
        icon?: string;
        features: string[];
        verification_level: number;
        vanity_url_code?: string;
    };
    channel: {
        icon?: string;
        id: string;
        name: string;
        type: number;
        recipients?: {
            username: string;
        }[];
    };
    inviter?: {
        id: string;
        username: string;
        avatar: string;
        discriminator: string;
    };
    target_user?: {
        id: string;
        username: string;
        avatar: string;
        discriminator: string;
    };
    target_user_type?: number;
    approximate_presence_count?: number;
    approximate_member_count?: number;
}
