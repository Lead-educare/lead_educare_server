const updateService = (query, updateObj, model, options = null) => {
    if (options !== null){
        return model.updateOne(query, updateObj, options);
    }
    return model.updateOne(query, updateObj);
}

module.exports = updateService;