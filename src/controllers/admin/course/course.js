const createCourse = async (req, res, next)=>{
    try {
        const {name, description, regularPrice, sellPrice, teacherId, categoryId, benefit, thumbnail} = req.body;
    }catch (e) {
        next(e)
    }

}
const getAllCourse = async (req, res, next)=>{

    try {

    }catch (e) {
        next(e)
    }

}
const getSingleCourse = async (req, res, next)=>{

    try {

    }catch (e) {
        next(e)
    }

}
const updateCourse = async (req, res, next)=>{

    try {

    }catch (e) {
        next(e)
    }

}
const deleteCourse = async (req, res, next)=>{

    try {

    }catch (e) {
        next(e)
    }

}

module.exports = {createCourse, getAllCourse, getSingleCourse, updateCourse, deleteCourse}