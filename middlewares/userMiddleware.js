import bcrypt from "bcrypt";

export const hashPassword = async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
}

export const comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}
