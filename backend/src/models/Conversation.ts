import mongoose, { Schema, model, InferSchemaType } from 'mongoose';

/**
 * A Conversation (chat room) between exactly two participants.
 * `participantA` and `participantB` store the sorted user IDs so we can
 * reliably find-or-create a 1:1 room regardless of who initiates it.
 */
const conversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.Mixed, // Allow both ObjectId and string
        required: true,
      },
    ],
    participantA: {
      type: Schema.Types.Mixed, // Allow both ObjectId and string
      required: true,
    },
    participantB: {
      type: Schema.Types.Mixed, // Allow both ObjectId and string
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
  },
  {
    timestamps: true,
  }
);

// Ensure a unique 1:1 conversation per pair of participants
conversationSchema.index({ participantA: 1, participantB: 1 }, { unique: true });

export type ConversationType = InferSchemaType<typeof conversationSchema>;

const Conversation =
  mongoose.models.Conversation || model('Conversation', conversationSchema);

export default Conversation;
