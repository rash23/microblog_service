const yup = require('yup');
const { HTTP_STATUS_CODES } = require('../../utils/constants');

async function validateUserBody(req, resp, next) {
  const { body } = req;

  const schema = yup.object({
    username: yup.string().required().min(3).max(30),
    email: yup.string().required().email(),
  });

  try {
    req.body = await schema.validate(body);
    next(); // Data is valid
  } catch (error) {
    next(error); // Validation error
  }
}

async function validateUserId(req, resp, next) {
  const { userId } = req.params;

  const schema = yup.number().required().positive().integer();

  try {
    req.params.userId = await schema.validate(userId);
    next(); // UserId is valid
  } catch (error) {
    return resp.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: 'Invalid user ID.' });
  }
}

module.exports = {
  validateUserBody,
  validateUserId,
};
