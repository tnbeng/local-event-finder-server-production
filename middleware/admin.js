exports.admin = async (req, res, next) => {
    const adminEmail = 'btarak398@gmail.com';
    try {
        if (req.user.email == adminEmail) {
            next();
        }
        else {
            res.status(401).json({ message: "Unathorized " })
        }
    } catch (error) {
        console.log("Error occured in the admin middleware",error);
    }
}