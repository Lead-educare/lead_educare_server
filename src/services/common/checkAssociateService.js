const checkAssociateService = async (query, AssociateModel)=>{
    try {
        const data = await AssociateModel.aggregate([
            {$match: query}
        ]);
        return data.length > 0;
    }catch (e) {
        return false;
    }

}

module.exports = checkAssociateService;