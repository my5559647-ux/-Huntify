"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
/**
 * A Conversation (chat room) between exactly two participants.
 * `participantA` and `participantB` store the sorted user IDs so we can
 * reliably find-or-create a 1:1 room regardless of who initiates it.
 */
const conversationSchema = new mongoose_1.Schema({
    participants: [
        {
            type: mongoose_1.Schema.Types.Mixed, // Allow both ObjectId and string
            required: true,
        },
    ],
    participantA: {
        type: mongoose_1.Schema.Types.Mixed, // Allow both ObjectId and string
        required: true,
    },
    participantB: {
        type: mongoose_1.Schema.Types.Mixed, // Allow both ObjectId and string
        required: true,
    },
    // Tracks the last active message for the sidebar preview
    lastMessage: {
        type: String,
        default: '',
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
// Ensure a unique 1:1 conversation per pair of participants
conversationSchema.index({ participantA: 1, participantB: 1 }, { unique: true });
const Conversation = mongoose_1.default.models.Conversation || (0, mongoose_1.model)('Conversation', conversationSchema);
exports.default = Conversation;
