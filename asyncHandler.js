const asyncHandler = fn => async(err, data) => Promise.resolve(fn(err, data).catch(err));

module.exports = asyncHandler;