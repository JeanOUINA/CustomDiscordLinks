import { EventEmitter } from "events";
import e = require("express");
import fetch from "node-fetch";
import { embed, oEmbed, website } from "./templates";

export default class CustomDiscordLinks extends EventEmitter {
    constructor(config:CustomDiscordLinksConfig, app:e.Express|e.IRouter){
        super()
        this.config = config
        app.get("/:code", this.get.bind(this))
        app.get("/:code/oembed.json", this.get.bind(this))
    }
    config:CustomDiscordLinksConfig
    cache:{
        [key:string]: InviteData
    } = {}
    promises:{
        [key:string]: Promise<InviteData>
    } = {}

    get(req:e.Request, res:e.Response, next:e.NextFunction){
        const code = req.params.code
        if(!code || !this.config.codes[code])return next()
        const inviteCode = this.config.codes[code]
        const isDiscord = req.header("User-Agent") && 
            !Array.isArray(req.header("User-Agent")) && 
            req.header("User-Agent").includes("Discordbot")
        if(!isDiscord)return res.status(200).send(website(inviteCode))
        if(this.cache[inviteCode] === Symbol.for("Unknown Code") as any){
            return res.status(404).send({error: true, message: "Unknown Invite Code. Please try again later.", code})
        }
        if(this.cache[inviteCode]){
            return res.status(200).send(embed(this.cache[inviteCode], this.config.embed.color, `http${req.secure?"s":""}://${req.hostname}${req.baseUrl.split(/[#?]/)[0]}/oembed.json`))
        }
        if(this.promises[inviteCode]){
            this.promises[inviteCode].finally(() => {
                this.get(req, res, next)
            })
            return
        }
        this.promises[inviteCode] = new Promise((resolve, reject) => {
            fetch(`https://discord.com/api/invites/${inviteCode}`, {
                headers: {
                    "User-Agent": "CustomDiscordInvites/1.0"
                }
            }).then(async res => {
                if(res.status !== 200){
                    delete this.promises[inviteCode]
                    this.cache[inviteCode] = Symbol.for("Unknown Code") as any
                    return reject(new Error("Invalid status"))
                }
                const data = await res.json()
                delete this.promises[inviteCode]
                this.cache[inviteCode] = data
                resolve(data)
            }).catch(err => {
                console.error(err)
                delete this.promises[inviteCode]
                this.cache[inviteCode] = Symbol.for("Unknown Code") as any
                reject(err)
            })
        })
        this.promises[inviteCode].finally(() => {
            this.get(req, res, next)
        })
    }

    getOembed(req:e.Request, res:e.Response, next:e.NextFunction){
        const code = req.params.code
        
        if(!code)return next()
        if(this.cache[code] === Symbol.for("Unknown Code") as any){
            return res.status(404).send({error: true, message: "Unknown Invite Code. Please try again later.", code})
        }
        if(this.cache[code]){
            return res.status(200).send(oEmbed(this.cache[code], this.config))
        }
        if(this.promises[code]){
            this.promises[code].finally(() => {
                this.getOembed(req, res, next)
            })
            return
        }
        res.status(404).send({error: true, message: "Unknown Invite Code. Please try again later.", code})
    }
}

export interface CustomDiscordLinksConfig {
    embed: {
        color: string,
        ProviderName: string,
        ProviderURL: string
    },
    codes: {
        [key:string]:string
    }
}
export interface InviteData {
    code: string,
    guild?: {
        id: string,
        name: string,
        splash?: string,
        banner?: string,
        description: string,
        icon?: string,
        features: string[],
        verification_level: number,
        vanity_url_code?: string
    },
    channel: {
        icon?: string,
        id: string,
        name: string,
        type: number,
        recipients?: {
            username: string
        }[]
    },
    inviter?: {
        id: string,
        username: string,
        avatar: string,
        discriminator: string
    },
    target_user?: {
        id: string,
        username: string,
        avatar: string,
        discriminator: string
    },
    target_user_type?: number,
    approximate_presence_count?: number,
    approximate_member_count?: number
  }