import _ from 'lodash'
import SanitizeHTML from 'sanitize-html'
class Errors {
  parseError (error: ValidationError | NestError) {
    let messages = ''
    if (Array.isArray(error.message)) {
      error.message.map((message: Message) => {
        _.forEach(message.constraints, (val, key) => {
          messages = messages.concat(val, '</br>')
        })
      })
    } else if (typeof error.message === 'string') {
      messages = error.message
    }
    return {
      statusCode: error.statusCode,
      message: SanitizeHTML(messages)
    }
  }
}

export default new Errors()

interface ValidationError {
  statusCode: number;
  message: Message | Message[];
}

interface NestError {
  statusCode: number;
  message: string;
}

type Message = {
  constraints: [];
}
