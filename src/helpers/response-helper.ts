import Ajv from 'ajv';
const ajv = new Ajv();

const responseSchema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            dayofExamsId: {type: 'number'},
            response: {type: 'string'},
        },
        required: ['dayofExamsId', 'response'],
        additionalProperties: false
    }
};

function validateResponses(responses: any) {
    const validate = ajv.compile(responseSchema);
    const valid = validate(responses);
    return valid;
}

export default {
    validateResponses, responseSchema
}