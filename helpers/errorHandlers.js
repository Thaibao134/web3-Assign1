// handle all matching criterias where entities are not found
function handleNotFoundError(res, entity, type, value) {
    return res.status(404).json({
        message: `No ${entity} has been found with the ${type}: ${value}.`
    });
}

/** handle all matching criterias where entities are not found in a specific place
*such as beginning, ending, or including.
**/
function handlePartialMatchError(res, entity, type, match, value) {
    return res.status(404).json({
        message: `No ${entity} has been found with the ${type} ${match} with: ${value}.`
    });
}

/**
 * handle errors involving ranges in years where entities are not found
 */
function handleMultipleYearError(res, entity, start, end) {
    return res.status(400).json({
        message: `No ${entity} has been found within the years ${start} to ${end}.`
    })
}

/*
*Handle errors where start year cannot be greater than end year
*/
function handleYearError(res) {
    return res.status(400).json({
        error: `start year can not be greater than end year`
    });
}

// handle all service errors
function handleServerError(res, message) {
    return res.status(500).json ({
        error: message
    });
}

module.exports = {
    handleNotFoundError,
    handleServerError,
    handlePartialMatchError,
    handleMultipleYearError,
    handleYearError
}