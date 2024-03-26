const bcrypt = require('bcrypt')

const pwHash = async (pw) => {
    const saltRounds = 12
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(pw, salt)
    console.log(`PW: ${pw} // Hash: ${hash}`)
}

const login = async(pw, hashedPW) => {
    const result = await bcrypt.compare(pw, hashedPW)
    if(result){
        console.log('LOGGED IN!')
    } else {
        console.log('INCORRECT!')
    }
}

// pwHash('MyPassword') 

login('MyPasword', '$2b$12$wmxelCGKrA0sugBlhh4P.eY1nm9U1poRodf/ghuSt3TAmM5f7BwZe')