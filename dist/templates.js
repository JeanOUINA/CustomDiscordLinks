"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oEmbed = exports.embed = exports.website = void 0;
var htmlencode_1 = require("htmlencode");
function website(inviteCode) {
    return "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Redirecting to Discord...</title>\n    <script>\n        window.location.href = " + JSON.stringify("https://discord.com/invite/" + inviteCode) + "\n    </script>\n</head>\n<body>\n    <noscript>\n        Please enable javascript for automatic redirection, or click <a href=" + JSON.stringify("https://discord.com/invite/" + inviteCode) + ">here</a>\n    </noscript>\n</body>\n</html>";
}
exports.website = website;
function embed(data, embedColor, oembedURL) {
    var channelMark = [
        "#",
        "@",
        "🔊",
        "👥"
    ][data.channel.type];
    var iconID = data.guild ? data.guild.icon || null : data.channel.icon || null;
    var iconExt = iconID ? iconID.startsWith("a_") ? "gif" : "png" : null;
    var iconURL = data.guild ?
        data.guild.icon ?
            "https://cdn.discordapp.com/icons/" + data.guild.id + "/" + iconID + "." + iconExt + "?size=4096"
            : null
        : data.channel.icon ?
            "https://cdn.discordapp.com/channel-icons/" + data.channel.id + "/" + data.channel.icon + "." + iconExt + "?size=4096"
            : null;
    var embed = {
        title: "" + channelMark + data.channel.name + (data.guild ? "in " + data.guild.name : ""),
        description: data.guild ? "Join " + data.guild.name + " and start chatting in " + channelMark + data.channel.name + " !" :
            "Start chatting in " + channelMark + data.channel.name,
        image: iconURL,
        color: embedColor
    };
    return "<!DOCTYPE html>\n\n<html>\n    <head>\n        " + (embed.title ? "<meta property=\"og:title\" content=\"" + htmlencode_1.htmlEncode(embed.title) + "\">" : "") + "\n        " + (embed.description ? "<meta property=\"og:description\" content=\"" + htmlencode_1.htmlEncode(embed.description) + "\">" : "") + "\n        " + (embed.image ? "<meta property=\"og:image\" content=\"" + htmlencode_1.htmlEncode(embed.image) + "\">" : "") + "\n        " + (embed.color ? "<meta name=\"theme-color\" content=\"#" + embed.color + "\">" : "") + "\n        <link type=\"application/json+oembed\" href=\"" + oembedURL + "\">\n    </head>\n    <body>\n        <script>window.location=\"/\"</script>\n    </body>\n</html>";
}
exports.embed = embed;
function oEmbed(data, config) {
    var channelMark = [
        "#",
        "@",
        "🔊",
        "👥"
    ][data.channel.type];
    return {
        title: "" + channelMark + data.channel.name + (data.guild ? "in " + data.guild.name : ""),
        author_name: data.inviter ? data.inviter.username + "#" + data.inviter.discriminator : "Vanity URL",
        author_url: "https://discord.gg/" + data.code,
        provider_name: config.embed.ProviderName,
        provider_url: config.embed.ProviderURL
    };
}
exports.oEmbed = oEmbed;
