import mongoose, { Schema, model, InferSchemaType } from 'mongoose';

/**
 * A single chat message belonging to a Conversation.
 * Supports both plain text and file attachments (fileURL + metadata).
 */
const messageSchema = new Schema(
  {
    conversation: {
      type: Schema.Types.Mixed, // Allow both ObjectId and string
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.Mixed, // Allow both ObjectId and string
      required: true,
    },
    text: {
      type: String,
      default: '',
      trim: true,
    },
    // File attachment fields (optional)
    fileURL: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    fileType: {
      type: String,
      default: '',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt (createdAt = timestamp)
  }
);

export type MessageType = InferSchemaType<typeof messageSchema>;

const Message = mongoose.models.Message || model('Message', messageSchema);

export default Message;
