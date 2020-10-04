"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var node_fetch_1 = require("node-fetch");
var templates_1 = require("./templates");
var CustomDiscordLinks = /** @class */ (function (_super) {
    __extends(CustomDiscordLinks, _super);
    function CustomDiscordLinks(config, app) {
        var _this = _super.call(this) || this;
        _this.cache = {};
        _this.promises = {};
        _this.config = config;
        app.get("/:code", _this.get.bind(_this));
        app.get("/:code/oembed.json", _this.get.bind(_this));
        return _this;
    }
    CustomDiscordLinks.prototype.get = function (req, res, next) {
        var _this = this;
        var code = req.params.code;
        if (!code || !this.config.codes[code])
            return next();
        var inviteCode = this.config.codes[code];
        var isDiscord = req.header("User-Agent") &&
            !Array.isArray(req.header("User-Agent")) &&
            req.header("User-Agent").includes("Discordbot");
        if (!isDiscord)
            return res.status(200).send(templates_1.website(inviteCode));
        if (this.cache[inviteCode] === Symbol.for("Unknown Code")) {
            return res.status(404).send({ error: true, message: "Unknown Invite Code. Please try again later.", code: code });
        }
        if (this.cache[inviteCode]) {
            res.type("text/html; charset=UTF-8");
            return res.status(200).send(templates_1.embed(this.cache[inviteCode], this.config.embed.color, "http" + (req.secure ? "s" : "") + "://" + req.hostname + req.baseUrl.split(/[#?]/)[0] + "/oembed.json"));
        }
        if (this.promises[inviteCode]) {
            this.promises[inviteCode].finally(function () {
                _this.get(req, res, next);
            });
            return;
        }
        this.promises[inviteCode] = new Promise(function (resolve, reject) {
            node_fetch_1.default("https://discord.com/api/invites/" + inviteCode, {
                headers: {
                    "User-Agent": "CustomDiscordInvites/1.0"
                }
            }).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (res.status !== 200) {
                                delete this.promises[inviteCode];
                                this.cache[inviteCode] = Symbol.for("Unknown Code");
                                return [2 /*return*/, reject(new Error("Invalid status"))];
                            }
                            return [4 /*yield*/, res.json()];
                        case 1:
                            data = _a.sent();
                            delete this.promises[inviteCode];
                            this.cache[inviteCode] = data;
                            resolve(data);
                            return [2 /*return*/];
                    }
                });
            }); }).catch(function (err) {
                console.error(err);
                delete _this.promises[inviteCode];
                _this.cache[inviteCode] = Symbol.for("Unknown Code");
                reject(err);
            });
        });
        this.promises[inviteCode].finally(function () {
            _this.get(req, res, next);
        });
    };
    CustomDiscordLinks.prototype.getOembed = function (req, res, next) {
        var _this = this;
        var code = req.params.code;
        if (!code)
            return next();
        if (this.cache[code] === Symbol.for("Unknown Code")) {
            return res.status(404).send({ error: true, message: "Unknown Invite Code. Please try again later.", code: code });
        }
        if (this.cache[code]) {
            res.type("text/html; charset=UTF-8");
            return res.status(200).send(templates_1.oEmbed(this.cache[code], this.config));
        }
        if (this.promises[code]) {
            this.promises[code].finally(function () {
                _this.getOembed(req, res, next);
            });
            return;
        }
        res.status(404).send({ error: true, message: "Unknown Invite Code. Please try again later.", code: code });
    };
    return CustomDiscordLinks;
}(events_1.EventEmitter));
exports.default = CustomDiscordLinks;
