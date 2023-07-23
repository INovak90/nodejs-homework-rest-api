const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const emailRegexp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      match: emailRegexp,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);
const addPostSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  phone: Joi.number().required(),
  favorite: Joi.boolean(),
});
const addPutSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().pattern(emailRegexp),
  phone: Joi.number(),
  favorite: Joi.boolean(),
}).min(1);

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

contactSchema.post("save", handleMongooseError);

const Contact = model("contact", contactSchema);

const schemas = {
  addPostSchema,
  addPutSchema,
  updateFavoriteSchema,
};

module.exports = { Contact, schemas };
