const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  const filters = {
    owner,
  };
  if (favorite) {
    filters.favorite = favorite;
  }
  // if (name) {
  //   filters.name = name;
  // }
  const result = await Contact.find(filters, "-createdAt -updatedAt", { skip, limit }).populate(
    "owner",
    "id email subscription"
  );
  res.json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOne({ _id: contactId, owner });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};
const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndRemove({ _id: contactId, owner });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "Contact deleted" });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate({ _id: contactId, owner }, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  return res.json(result);
};

const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findByIdAndUpdate({ _id: contactId, owner }, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  return res.json(result);
};

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
  updateFavorite: ctrlWrapper(updateFavorite),
};
