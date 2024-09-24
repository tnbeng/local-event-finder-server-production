exports.admin = async (req, res, next) => {
    try {
        if (req.user.role =='admin' ) {
            next();
        }
        else {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }
    } catch (error) {
        console.log("Error occured in the admin middleware",error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}