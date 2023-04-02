const findOneByProperty = (key, value, model, projection = null) => {
    if (key === '_id'){
        if (projection !== null){
            return model.findById(value, projection);
        }
        return model.findById(value);
    }
    if (projection !== null){
        return model.findOne({[key]: value}, projection);
    }
    return model.findOne({[key]: value});

}

module.exports = findOneByProperty