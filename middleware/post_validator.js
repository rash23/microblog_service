const yup = require('yup');

async function postValidator(req, _resp, next) {
  const { body } = req;

  const postMetadataSchema = yup.object({
    title: yup.string('custom error message').required().min(3, 'custom error message'),
    description: yup.string(),
  });

  try {
    const data = await postMetadataSchema.validate(body);
    req.body = data;

    next(); // success - data is valid
  } catch (err) {
    next(err); // fail
  }
}

module.exports = {
  postValidator,
};
