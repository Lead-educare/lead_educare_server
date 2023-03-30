const Role = require("../../models/Role");
const error = require("../../helpers/error");
const Permission = require("../../models/Permission");
const checkAssociateService = require('../common/checkAssociateService');
const roleFindByProperty = (key, value)=>{
    if (key === '_id'){
        return Role.findById(value);
    }
    return Role.findOne({[key]: value});
}

const getRoleService = ()=>{
    return Role.aggregate([
        {$match: {}}
    ])
}
const createNewRoleService = async ({roleName})=>{
    const role = new Role({name: roleName});
    return await role.save();
}

const deleteRoleService = async (id)=>{
    const role = await Role.findById(id);
    if (role?.permissions.length > 0)throw error("You can't delete. role associate with permission", 400);
    return Role.deleteOne({_id: id});

}
const createNewPermissionService = async ({permissionName, roleId, options})=>{

    const role = await Role.findById(roleId);
    if (!role)throw error('Role not found', 400);

    const permission = new Permission({name: permissionName});
    await permission.save(options);

    const updateRole = await Role.findByIdAndUpdate(roleId, {$addToSet: {permissions: permission._id}}, {options});

    return {permission, role: updateRole}
}

module.exports = {getRoleService,createNewPermissionService, createNewRoleService, roleFindByProperty, deleteRoleService}