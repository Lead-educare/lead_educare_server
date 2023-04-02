const createService = (dataObj, createModel, options = null)=>{
    if (options !== null){
        const model = new createModel(dataObj);
        return model.save(options);
    }
    const model = new createModel(dataObj);
    return model.save();

}

module.exports = {createService}