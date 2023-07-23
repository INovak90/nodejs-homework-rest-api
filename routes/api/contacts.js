const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");
const { schemas } = require("../../models/contact");
const { validateBody, isValidId, authenticate } = require("../../middleWares");

router.get("/", authenticate, ctrl.getAllContacts);

router.get("/:contactId", authenticate, isValidId, ctrl.getContactById);

router.post("/", authenticate, validateBody(schemas.addPostSchema), ctrl.addContact);

router.delete("/:contactId", authenticate, isValidId, ctrl.removeContact);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schemas.addPutSchema),
  ctrl.updateContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateFavorite
);

module.exports = router;
