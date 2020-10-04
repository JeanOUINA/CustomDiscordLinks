import CustomDiscordLinks, { CustomDiscordLinksConfig, InviteData } from ".";
import { htmlEncode } from "htmlencode"

export function website(inviteCode:string){
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting to Discord...</title>
    <script>
        window.location.href = ${JSON.stringify("https://discord.com/invite/"+inviteCode)}
    </script>
</head>
<body>
    <noscript>
        Please enable javascript for automatic redirection, or click <a href=${JSON.stringify("https://discord.com/invite/"+inviteCode)}>here</a>
    </noscript>
</body>
</html>`
}

export function embed(data:InviteData, embedColor:string, oembedURL){
    const channelMark = [
        "#",
        "@",
        "🔊",
        "👥"
    ][data.channel.type]
    const iconID = data.guild ? data.guild.icon || null : data.channel.icon || null
    const iconExt = iconID ? iconID.startsWith("a_") ? "gif" : "png" : null
    const iconURL = data.guild ? 
        data.guild.icon ? 
            `https://cdn.discordapp.com/icons/${data.guild.id}/${iconID}.${iconExt}?size=4096`
            : null
        : data.channel.icon ?
            `https://cdn.discordapp.com/channel-icons/${data.channel.id}/${data.channel.icon}.${iconExt}?size=4096`
            : null
    const embed = {
        title: `${channelMark}${data.channel.name}${data.guild ? `in ${data.guild.name}` : ""}`,
        description: data.guild ? `Join ${data.guild.name} and start chatting in ${channelMark}${data.channel.name} !` :
            `Start chatting in ${channelMark}${data.channel.name}`,
        image: iconURL,
        color: embedColor
    }
    return `<!DOCTYPE html>

<html>
    <head>
        ${embed.title ? `<meta property="og:title" content="${htmlEncode(embed.title)}">` : ""}
        ${embed.description ? `<meta property="og:description" content="${htmlEncode(embed.description)}">` : ""}
        ${embed.image ? `<meta property="og:image" content="${htmlEncode(embed.image)}">` : ""}
        ${embed.color ? `<meta name="theme-color" content="#${embed.color}">` : ""}
        <link type="application/json+oembed" href="${oembedURL}">
    </head>
    <body>
        <script>window.location="/"</script>
    </body>
</html>`
}

export function oEmbed(data:InviteData, config:CustomDiscordLinksConfig):any{
    const channelMark = [
        "#",
        "@",
        "🔊",
        "👥"
    ][data.channel.type]
    return {
        title: `${channelMark}${data.channel.name}${data.guild ? `in ${data.guild.name}` : ""}`,
        author_name: data.inviter ? `${data.inviter.username}#${data.inviter.discriminator}` : "Vanity URL",
        author_url: `https://discord.gg/${data.code}`,
        provider_name: config.embed.ProviderName,
        provider_url: config.embed.ProviderURL
    }
}

interface Embed {
    title:string,
    description:string,
    image:string,
    oembedJSON: string,
    color:string,
    expire: number,
    id: string
}