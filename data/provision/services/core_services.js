var core_services = [
    {
        "name": "urac",
        "extKeyRequired": true,
        "port": 4001,
        "apis": [
            {
                "l": "Change Email",
                "group": "My Account",
                'v': "/account/changeEmail"
            },
            {
                "l": "Change Password",
                "group": "My Account",
                'v': "/account/changePassword"
            },
            {
                "l": "Edit Profile",
                "group": "My Account",
                'v': "/account/editProfile"
            },
            {
                "l": "Get User Info",
                "group": "My Account",
                "groupMain": true,
                'v': "/account/getUser"
            },
            {
                "l": "Add new User",
                "group": "Administration",
                'v': "/admin/addUser"
            },
            {
                "l": "Change User Status",
                "group": "Administration",
                'v': "/admin/changeUserStatus"
            },
            {
                "l": "Edit User Record",
                "group": "Administration",
                'v': "/admin/editUser"
            },
            {
                "l": "Add new Group",
                "group": "Administration",
                'v': "/admin/group/add"
            },
            {
                "l": "Add Users to Group",
                "group": "Administration",
                'v': "/admin/group/addUsers"
            },
            {
                "l": "Delete Group",
                "group": "Administration",
                'v': "/admin/group/delete"
            },
            {
                "l": "Edit Group",
                "group": "Administration",
                'v': "/admin/group/edit"
            },
            {
                "l": "List Groups",
                "group": "Administration",
                'v': "/admin/group/list"
            },
            {
                "l": "List Users",
                "group": "Administration",
                "groupMain": true,
                'v': "/admin/listUsers"
            },
            {
                "l": "Edit Multiple Groups",
                "group": "Administration",
                'v': "/admin/user/editGroups"
            },
            {
                "l": "Validate Change Email",
                "group": "Guest",
                'v': "/changeEmail/validate"
            },
            {
                "l": "Forgot Password",
                "group": "Guest",
                'v': "/forgotPassword"
            },
            {
                "l": "Register",
                "group": "Guest",
                'v': "/join"
            },
            {
                "l": "Validate Register",
                "group": "Guest",
                'v': "/join/validate"
            },
            {
                "l": "Login",
                "group": "Guest",
                "groupMain": true,
                'v': "/login"
            },
            {
                "l": "Logout",
                "group": "Guest",
                'v': "/logout"
            },
            {
                "l": "Reset Password",
                "group": "Guest",
                'v': "/resetPassword"
            }
        ]
    },
    {
        "name": "dashboard",
        "extKeyRequired": true,
        "port": 4003,
        "apis": [
            {
                'l': "List Environments",
                'v': "/environment/list",
                "group": "Environment",
                "groupMain": true
            },
            {
                'l': "Add Environment",
                'v': "/environment/add",
                "group": "Environment"
            },
            {
                'l': "Delete Environment",
                'v': "/environment/delete",
                "group": "Environment"
            },
            {
                'l': "Update Environment",
                'v': "/environment/update",
                "group": "Environment"
            },

            {
                'l': "Update Product",
                'v': "/product/update",
                "group": "Product"
            },
            {
                'l': "Add Product",
                'v': "/product/add",
                "group": "Product"
            },
            {
                'l': "Delete Product",
                'v': "/product/delete",
                "group": "Product"
            },
            {
                'l': "List Products",
                'v': "/product/list",
                "group": "Product",
                "groupMain": true
            },
            {
                'l': "Get Product",
                'v': "/product/get",
                "group": "Product"
            },

            {
                'l': "Add Product Package",
                'v': "/product/packages/add",
                "group": "Product"
            },
            {
                "l": "Delete Product Package",
                "group": "Product",
                'v': "/product/packages/delete"
            },

            {
                "l": "List Product Packages",
                "group": "Product",
                'v': "/product/packages/list"
            },
            {
                "l": "Update Product Package",
                "group": "Product",
                'v': "/product/packages/update"
            },

            {
                "l": "Get Tenant Info",
                "group": "Tenant",
                'v': "/tenant/get"
            },
            {
                "l": "List Tenants",
                "group": "Tenant",
                "groupMain": true,
                'v': "/tenant/list"
            },
            {
                "l": "Add Tenant",
                "group": "Tenant",
                'v': "/tenant/add"
            },
            {
                "l": "Update Tenant",
                "group": "Tenant",
                'v': "/tenant/update"
            },

            {
                "l": "Add Tenant Application",
                "group": "Tenant Application",
                'v': "/tenant/application/add"
            },
            {
                "l": "List Tenant Applications",
                "group": "Tenant Application",
                'v': "/tenant/application/list"
            },
            {
                "l": "Update Tenant Application",
                "group": "Tenant Application",
                'v': "/tenant/application/update"
            },
            {
                "l": "Delete Tenant Application",
                "group": "Tenant Application",
                'v': "/tenant/delete"
            },
            {
                "l": "Delete Tenant Application",
                "group": "Tenant Application",
                'v': "/tenant/application/delete"
            },

            {
                "l": "Add Tenant Application Key",
                "group": "Tenant Application",
                'v': "/tenant/application/key/add"
            },
            {
                "l": "List Tenant Application Key Configuration",
                "group": "Tenant Application",
                'v': "/tenant/application/key/config/list"
            },

            {
                "l": "Update Tenant Application Key Configuration",
                "group": "Tenant Application",
                'v': "/tenant/application/key/config/update"
            },

            {
                "l": "Delete Tenant Application Key",
                "group": "Tenant Application",
                'v': "/tenant/application/key/delete"
            },
            {
                "l": "Add Tenant Application External Key",
                "group": "Tenant Application",
                'v': "/tenant/application/key/ext/add"
            },
            {
                "l": "Delete Tenant Application External Key",
                "group": "Tenant Application",
                'v': "/tenant/application/key/ext/delete"
            },
            {
                "l": "List Tenant Application External Keys",
                "group": "Tenant Application",
                'v': "/tenant/application/key/ext/list"
            },
            {
                "l": "Update Tenant Application External Key",
                "group": "Tenant Application",
                'v': "/tenant/application/key/ext/update"
            }
            ,
            {
                "l": "List Tenant Application Keys",
                "group": "Tenant Application",
                'v': "/tenant/application/key/list"
            },


            {
                "l": "Add Tenant oAuth Configuration",
                "group": "Tenant oAuth",
                'v': "/tenant/oauth/add"
            },
            {
                "l": "Delete Tenant oAuth Configuration",
                "group": "Tenant oAuth",
                'v': "/tenant/oauth/delete"
            },
            {
                "l": "Get Tenant oAuth Configuration",
                "group": "Tenant oAuth",
                'v': "/tenant/oauth/list"
            },
            {
                "l": "Update Tenant oAuth Configuration",
                "group": "Tenant oAuth",
                'v': "/tenant/oauth/update"
            },
            {
                "l": "Add Tenant oAuth User",
                "group": "Tenant oAuth",
                'v': "/tenant/oauth/users/add"
            },
            {
                "l": "Delete Tenant oAuth User",
                "group": "Tenant oAuth",
                'v': "/tenant/oauth/users/delete"
            },
            {
                "l": "List Tenant oAuth Users",
                "group": "Tenant oAuth",
                'v': "/tenant/oauth/users/list"
            },
            {
                "l": "Update Tenant oAuth User",
                "group": "Tenant oAuth",
                'v': "/tenant/oauth/users/update"
            },

            {
                "l": "List Services",
                "group": "Services",
                'v': "/services/list"
            }
        ]
    },
    {
        "name": "oauth",
        "extKeyRequired": true,
        "port": 4002,
        "apis": []
    },
	{
		"name": "example01",
		"extKeyRequired": false,
		"port": 4010,
		"apis": []
	},
    {
        "name": "example02",
        "extKeyRequired": true,
        "port": 4011,
        "apis": []
    },
	{
		"name": "example03",
		"extKeyRequired": true,
		"port": 4012,
		"apis": []
	},
    {
        "name": "example04",
        "extKeyRequired": true,
        "port": 4013,
        "apis": []
    }
];

var core_hosts = [
];