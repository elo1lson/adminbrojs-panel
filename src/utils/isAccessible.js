"use strict";

const _can = ({ currentAdmin, record }) => {
  return (
    currentAdmin &&
    (currentAdmin.role === "admin" || currentAdmin._id === record.param("user"))
  );
};

const canModifyUsers = ({ currentAdmin }) =>
  currentAdmin && currentAdmin.role === "admin";

module.exports = {
  canEdit: _can,
  canDelete: _can,
  canShow: _can,
  canModifyUser: canModifyUsers,
};
