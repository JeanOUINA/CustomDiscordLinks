import { CustomDiscordLinksConfig, InviteData } from ".";
export declare function website(inviteCode: string): string;
export declare function embed(data: InviteData, embedColor: string, oembedURL: any): string;
export declare function oEmbed(data: InviteData, config: CustomDiscordLinksConfig): any;
