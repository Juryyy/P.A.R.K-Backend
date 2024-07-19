export default {
    Settings: {
        type: "object",
        properties: {
            userId: {
                type: "number",
                example: 1,
                description: "id of user (1: 1 relation)"
            },
            email_notification: {
                type: "boolean",
                example: true
            },
            push_notification: {
                type: "boolean",
                example: true
            }
        }
    },
    Reward_system: {
        type: "object",
        properties: {
            userId: {
                type: "number",
                example: 1,
                description: "id of user (1: 1 relation)"
            },
            xp: {
                type: "number",
                example: 0
            },
            level: {
                type: "number",
                example: 1
            }
        }
    },
    User: {
        type: "object",
        properties: {
            id: {
                type: "number",
                example: 1
            },
            full_name: {
                type: "string",
                example: "Jan Novák"
            },
            email: {
                type: "string",
                example: "John@example.com"
            },
            password: {
                type: "string",
                example: "heslo"
            },
            role: {
                type: "string",
                example: "coach"
            },
            date_of_birth: {
                type: "string",
                example: "1989-04-10T22:00:00.000Z"
            },
            last_signed_in: {
                type: "string",
                example: "2023-02-23T15:32:32.548Z"
            },
            facebook: {
                type: "string",
                example: "https://www.facebook.com/FlekDavid/"
            },
            instagram: {
                type: "string",
                example: "https://www.instagram.com/FlekDavid/"
            },
            settings: {
                $ref: "#/components/schemas/Settings"
            },
            reward_system: {
                $ref: "#/components/schemas/Reward_system"
            }
        }
    },
    parameters: {
        path: {
            userId: {
                in: "path",
                name: "userId",
                schema: {
                    type: "number",
                    example: 1
                }
            },
        },
        query: {
            idArray: {
                in: "query",
                name: "idArray",
                schema: {
                    type: "array",
                    items: {
                        type: "number",
                        example: 1
                    }
                }
            },
            page: {
                in: "query",
                name: "page",
                required: false,
                default: 1,
            },
            limit: {
                in: "query",
                name: "limit",
                required: false,
                default: 10,
            },
        }
    }
}