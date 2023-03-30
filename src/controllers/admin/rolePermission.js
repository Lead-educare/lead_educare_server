const mongoose = require("mongoose");
const rolePermissionService = require("../../services/admin/rolePermissionService");

const getRoles = async (req, res, next) => {
    try {
        const roles = await rolePermissionService.getRoleService();
        res.status(201).json({
            roles
        })
    } catch (e) {
        next(e)
    }
}
const createRole = async (req, res, next) => {
    try {
        const {name} = req.body;
        const role = await rolePermissionService.createNewRoleService({roleName: name});
        res.status(201).json({
            role
        })
    } catch (e) {
        next(e)
    }
}

const deleteRole = async (req, res, next) => {
    try {
        const id = req.params.id;
        const role = await rolePermissionService.deleteRoleService(id);

       if (role.deletedCount === 0){
           return res.status(200).json({
               error: 'Role not delete'
           })
       }
        res.status(200).json({
            message: 'Role Delete successfully'
        })

    } catch (e) {
        next(e)
    }
}

const createPermission = async (req, res, next) => {
    const {permission, roleId} = req.body;
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
        const options = {session};
        const result = await rolePermissionService.createNewPermissionService({
            permissionName: permission,
            roleId,
            options
        });
        await session.commitTransaction();
        session.endSession();
        res.status(200).json(result);
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        next(e)
    }

}

module.exports = {getRoles, createRole, createPermission, deleteRole}