"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionAnalysis = void 0;
const typeorm_1 = require("typeorm");
const Profile_1 = require("./Profile");
let InteractionAnalysis = class InteractionAnalysis {
};
exports.InteractionAnalysis = InteractionAnalysis;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InteractionAnalysis.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], InteractionAnalysis.prototype, "analysis", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], InteractionAnalysis.prototype, "medicationIds", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], InteractionAnalysis.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Profile_1.Profile, profile => profile.interactionAnalyses),
    __metadata("design:type", Profile_1.Profile)
], InteractionAnalysis.prototype, "profile", void 0);
exports.InteractionAnalysis = InteractionAnalysis = __decorate([
    (0, typeorm_1.Entity)()
], InteractionAnalysis);
