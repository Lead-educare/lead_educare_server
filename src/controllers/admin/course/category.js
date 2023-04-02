const courseCategoryService = require('../../../services/admin/course/courseCategoryService');
const FormHelper = require('../../../helpers/FormHelper');
const createCategory = async (req, res, next)=>{
    try {
        const {name} = req.body;
        if (FormHelper.isEmpty(name)){
            return res.status(400).json({
                error: 'Category is required'
            })
        }
        const category = await courseCategoryService.createCategory({name});
        res.status(201).json({
            category
        })

    }catch (e) {
        next(e);
    }
}

const getCategories = async (req, res, next)=>{
    try {
        const categories = await courseCategoryService.getCategories();
        res.status(200).json({categories});
    }catch (e) {
        next(e);
    }
}
const updateCategory = async (req, res, next)=>{
    try {
        const catId = req.params.id;
        const {name} = req.body;
        if (FormHelper.isEmpty(name)){
            res.status(400).json({
                error: 'Category is required'
            })
        }

        const category = await courseCategoryService.updateCategory(catId, name);
        res.status(200).json({category});
    }catch (e) {
        next(e);
    }
}

const deleteCategory = async (req, res, next)=>{
    try {
        const catId = req.params.id;
        const category = await courseCategoryService.deleteCategory(catId);
        res.status(200).json({category});
    }catch (e) {
        next(e);
    }
}

module.exports = {createCategory, getCategories, updateCategory, deleteCategory}