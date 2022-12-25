const jwt = require('jsonwebtoken');
const JWT_SECERT = "qwertyuiop"

const fatchUser = (req, res, next) => {
    const token = req.header('token');
    if (!token) {
        res.status(400).json({ error: "access denaid" })
    } else {
        try {
            const data = jwt.verify(token, JWT_SECERT)
            req.user = data.user
            next()
        } catch (error) {
            res.json({err:"error"})
        }

    }
    
}

module.exports = fatchUser