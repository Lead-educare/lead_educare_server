const findOneByProperty = require("../../common/findOneByProperty");
const CourseCategoryModel = require('../../../models/CourseCategory');
const error = require('../../../helpers/error');
const {createService} = require("../../common/createService");
const mongoose = require('mongoose');
const updateService = require("../../common/updateService");
const ObjectId = mongoose.Types.ObjectId;
const FormHelper = require('../../../helpers/FormHelper');
const checkAssociateService = require("../../common/checkAssociateService");
const CourseModel = require('../../../models/Course');
const deleteService = require("../../common/deleteServide");
const slugify = require("slugify");

const createCategory = async ({name})=>{
        const isCategory = await findOneByProperty('name', name, CourseCategoryModel);
        if (isCategory) throw error('category already exits', 400);
        return createService({name}, CourseCategoryModel);
}

const getCategories = ()=>{
       return CourseCategoryModel.aggregate([
                {$lookup: {from: 'courses', localField: '_id', foreignField: 'courseId', as: 'course'}}
        ])
}

const updateCategory = async (catId, name)=>{
    if (!FormHelper.isIdValid(catId)) throw error('id is not valid', 400);
    const isCategory = await CourseCategoryModel.findOne({name: name.toLowerCase(), _id: {$ne: new ObjectId(catId)} });
    if (isCategory) throw error('category already exits', 400);
    const slug = slugify(name);
    return updateService({'_id': new ObjectId(catId)}, {name, slug}, CourseCategoryModel);
}

const deleteCategory = async (catId)=>{
    if (!FormHelper.isIdValid(catId)) throw error('id is not valid', 400);

    const isAssociate = await checkAssociateService({categoryId: new ObjectId(catId)}, CourseModel);
    if (isAssociate) throw error("You can't delete. Category associate with course");

    return deleteService({'_id': new ObjectId(catId)}, CourseCategoryModel);
}

module.exports = {createCategory, getCategories, updateCategory, deleteCategory}