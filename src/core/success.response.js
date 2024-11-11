'use strict'
const UserHeader = require('../configs/user.header.config')
const { StatusCodes, ReasonPhrases } = require('../utils/statuscode/httpStatusCode')
class DefineResponse {
    constructor({message, code, reasonPhase, metadata = {}, options = {}}) {
        this.message = message
        this.reasonPhase = reasonPhase
        this.metadata = metadata
        this.options = options
        this.code = code
    }

    /*
    options = {
        cookies: [
            {
                name: '',
                value: '',
                options: {}
            }
        ] 
    }
    */
    send = (res, options) => {
        const {cookies, clearCookie} = options
        if(![undefined, null].includes(cookies)) {
            cookies.forEach(cookie => {
                res.cookie(cookie.name, cookie.value, cookie.option)
            })
        } 
        else if (clearCookie == true) {
            res.clearCookie(UserHeader.REFRESH_TOKEN)
            res.clearCookie(UserHeader.USERID)
        }
        return res.status(this.code).json({
            metadata:this.metadata,
            options: this.options,
            message: this.message,
            code: this.statusCode,
            status: 'success'
        })
    }
}

class CreatedResponse extends DefineResponse {
    constructor({message, code = StatusCodes.CREATED, reasonPhase = ReasonPhrases.CREATED, metadata = {}, options = {}}) {
        super({message, code, reasonPhase, metadata, options})
    }
}

class OKResponse extends DefineResponse {
    constructor({message, code = StatusCodes.OK, reasonPhase = ReasonPhrases.OK, metadata = {}, options = {}}) {
        super({message, code, reasonPhase, metadata, options})
    }
}

class AcceptedResponse extends DefineResponse {
    constructor({message, code = StatusCodes.ACCEPTED, reasonPhase = ReasonPhrases.ACCEPTED, metadata = {}, options = {}}) {
        super({message, code, reasonPhase, metadata, options})
    }
}

class NonAuthorityResponse extends DefineResponse {
    constructor({message, code = StatusCodes.NON_AUTHORITATIVE_INFORMATION, reasonPhase = ReasonPhrases.NON_AUTHORITATIVE_INFORMATION, metadata = {}, options = {
        cookies: []
    }}) {
        super({message, code, reasonPhase, metadata, options})
    }
}

module.exports = {
    CreatedResponse,
    OKResponse,
    AcceptedResponse
}