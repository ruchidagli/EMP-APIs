//A file to support helper functions to validate Input Parameters
module.exports = {
    validateName: function(name){
        if (!name) {
            return "cannot be null";
        }
    
        if (typeof(name) !== "string") {
            return "must be string";
        }
    
        if (name.length < 3) {
            return "must be at least 3 characters";
        }
    
        const letters = /^[A-Za-z ]+$/;
        if (!name.match(letters)) {
            return "must be alphabetic characters";
        }
    
        return ""
    },
    validateHireDate: function(hireDate) {
        if (!hireDate) {
            return "cannot be null";
        }
    
        const hireDateObject = new Date(hireDate)
        if (hireDateObject === NaN) {
            return "cannot be parsed into date";
        }

        const now = new Date();
        if (hireDateObject >= now) {
            return "must be in past";
        }
    
        return ""
    },
    validateRole: function(role) {
        const whitelistRoles = ["CEO", "VP", "MANAGER", "LACKEY"];
        if (!role) {
            return "cannot be null";
        }
    
        if (typeof(role) !== "string") {
            return "must be string";
        }
    
        if (!whitelistRoles.includes(role.toUpperCase())) {
            return `must be one of (${whitelistRoles.join(",")})`;
        }
    
        return ""
    },
    toISODate: function(hireDate) {
        new Date(hireDate).toISOString();
    }
}





