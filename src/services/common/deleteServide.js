const deleteService = async (query, Model)=>{
    return await Model.deleteOne(query);
}

module.exports = deleteService