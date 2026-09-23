const mongoose = require("mongoose");
const env = require("../config/env");
const connectDB = require("../config/db");
const Permission = require("../models/Permission");
const Role = require("../models/role");

//create persmission

const persmissions = [
    {
        code: "USER_READ",
        name: "VIEW Users",
        description: "Allows viewing users",
        module: "user",
        action: "read",
    },
    {
        code: "USER_CREATE",
        name: "create Users",
        description: "Allows creating users",
        module: "user",
        action: "update",
    },
    {
        code: "USER_UPDATE",
        name: "UPDATE Users",
        description: "Allows updating users",
        module: "user",
        action: "update",
    },
    {
        code: "USER_DELETE",
        name: "DELETE Users",
        description: "Allows deleting users",
        module: "user",
        action: "delete",
    },
    {
        code: "JOB_READ",
        name: "VIEW Jobs",
        description: "Allows viewing Jobs",
        module: "job",
        action: "read",
    },
    {
        code: "JOB_CREATE",
        name: "create Jobs",
        description: "Allows creating jobs",
        module: "job",
        action: "update",
    },
    {
        code: "JOB _UPDATE",
        name: "UPDATE Jobs",
        description: "Allows updating jobs",
        module: "job",
        action: "update",
    },
    {
        code: "JOB_DELETE",
        name: "DELETE Job",
        description: "Allows deleting jobs",
        module: "job",
        action: "delete",
    },
    {
        code: "JOB_PUBLISH",
        name: "Publish jobs",
        description: "Allows publishing jobs",
        module: "job",
        action: "publish",
    },
    {
        code: "CANDIDATE_READ",
        name: "View Candidate",
        description: "Allows Viewing candidate profile ",
        module: "candidate",
        action: "read",
    },
    {
        code: "CANDIDATE_CREATE",
        name: "Create Candidate",
        description: "Allows Create candidate profile ",
        module: "candidate",
        action: "create",
    },
    {
        code: "CANDIDATE_UPDATE",
        name: "Update Candidate",
        description: "Allows Updating candidate profile ",
        module: "candidate",
        action: "update",
    },
    {
        code: "CANDIDATE_DELETE",
        name: "Delete Candidate",
        description: "Allows Deleting candidate profile ",
        module: "candidate",
        action: "delete",
    },
    {
        code: "APPLICATION_READ",
        name: "View Application",
        description: "Allows Viewing application ",
        module: "application",
        action: "read",
    },
    {
        code: "APPLICATION_CREATE",
        name: "Create Application",
        description: "Allows create application ",
        module: "application",
        action: "create",
    },
    {
        code: "APPLICATION_UPDATE",
        name: "Update Application",
        description: "Allows Updating application ",
        module: "application",
        action: "update",
    },
    {
        code: "APPLICATION_DELETE",
        name: "Delete Application",
        description: "Allows Deleting application ",
        module: "application",
        action: "delete",
    },
    {
        code: "INTERVIEW_READ",
        name: "View interview",
        description: "Allows viewing interviews ",
        module: "interview",
        action: "read",
    },
    {
        code: "INTERVIEW_CREATE",
        name: "View interview",
        description: "Allows creating interviews ",
        module: "interview",
        action: "create",
    },
    {
        code: "INTERVIEW_UPDATE",
        name: "Update interview",
        description: "Allows Updating interviews ",
        module: "interview",
        action: "update",
    },
    {
        code: "INTERVIEW_DELETE",
        name: "Delete interview",
        description: "Allows Deleting interviews ",
        module: "interview",
        action: "delete",
    },
    {
        code: "REPORT_READ",
        name: "View Reports",
        description: "Allows viewing recruitment reports",
        module: "report",
        action: "read",
    },
    {
        code: "AUDIT_READ",
        name: "View Audit Logs",
        description: "Allows viewing adute logs",
        module: "audit",
        action: "read",
    },
    {
        code: "AI_ANALYSIS_READ",
        name: "View AI Analysis",
        description: "Allows viewing AI candidate analysis",
        module: "ai",
        action: "read",
    },
];

const roles = [
    {
        name: "ADMIN",
        description: "Full System administrator",
        isSystemRole: " true",
    },
    {
        name: "RECRUITER",
        description: "Recruitement and hiring operations",
        isSystemRole: "true",
    },
    {
        name: "HIRING_MANAGER",
        description: " Hiring manager responsible for job decision",
        isSystemRole: "true",
    },
    {
        name: "INTERVIEWER",
        description: "Conducts candidate system role",
        isSystemRole: "true",
    },
    {
        name: "CANDIDATE",
        description: "Job applicant",
        isSystemRole: "true",
    },
];

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log("Starting database seed.....");

        //add Permission
        const PermissionDocument = await Permission.insertMany(
            persmissions.map((permission) => ({
                ...permission,
                isActive: true,
            })),
            {
                ordered: false,
            },
        ).catch(async (error) => {
            if (error.code === 11000) {
                console.log(
                    "Some permission already exist.Updating existingh permissions...",
                );
                const results = [];
                for (const permission of persmissions) {
                    const result = await Permission.findOneAndUpdate(
                        {
                            code: permission.code,
                        },
                        permission,
                        {
                            new: true,
                            upsert: true,
                            setDefaultsOnInsert: true,
                        },
                    );
                    results.push(result);
                }
                return results;
            }
            throw error;
        });

        //map permission
        const permissionMap = {};

        PermissionDocument.forEach((permission) => {
            permissionMap[permission.code] = permission._id;
        });

        console.log(`Permission processed ${PermissionDocument.length}`);

        //Role
        const adminPermissions = Object.values(permissionMap); //assign to admin all permission

        //recuriter permission
        const recuriterPermissionCode = [
            "JOB_READ",
            "JOB_CREATE",
            "JOB_UPDATE",
            "JOB_PUBLISH",
            "CANDIDATE_READ",
            "CANDIDATE_CREATE",
            "CANDIDATE_UPDATE",
            "APPLICATION_READ",
            "APPLICATION_UPDATE",
            "INTERVIEW_READ",
            "INTERVIEW_UPDATE",
            "INTERVIEW_CREATE",
            "REPORT_READ",
            "AI_ANALYSIS_READ",
        ];

        //HiringManager permission
        const hiringMangerPermissionCodes = [
            "JOB_READ",
            "CANDIDATE_READ",
            "APPLICATION_READ",
            "APPLICATION_UPDATE",
            "INTERVIEW_READ",
            "REPORT_READ",
            "AI_ANALYSIS_READ",
        ];

        //Interviews permission

        const interviewerPermissioncode = [
            "CANDIDATE_READ",
            "APPLICATION_READ",
            "INTERVIEW_READ",
            "INTERVIEW_UPDATE",
            "AI_ANALYSIS_READ",
        ];

        //Candidate permissions

        const candidatePermissionCode = [
            "CANDIDATE_READ",
            "CANDIDATE_CREATE",
            "JOB_READ",
            "CANDIDATE_UPDATE",
            "APPLICATION_READ",
        ];

        //Role permission

        const rolePermissions = {
            ADMIN: adminPermissions,
            RECRUITER: recuriterPermissionCode.map((code) => permissionMap[code]),
            HIRING_MANAGER: hiringMangerPermissionCodes.map(
                (code) => permissionMap[code],
            ),
            INTERVIEWER: interviewerPermissioncode.map((code) => permissionMap[code]),
            CANDIDATE: candidatePermissionCode.map((code) => permissionMap[code]),
        };

        for (const role of roles) {
            await Role.findOneAndUpdate(
                {
                    name: role.name,
                },
                {
                    ...role,
                    permission: rolePermissions[role.name],
                },
                {
                    upsert:true,
                    new:true,
                    setDefaultsOnInsert:true
                }
            );
        }
        console.log(`Role processed ${roles.length}`);
        console.log(`Database seed completed succuessfully!`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error(err.name);
        console.error("Database seed failed",err.message);
       await mongoose.connection.close();
       process.exist(1);
    }
};

seedDatabase();