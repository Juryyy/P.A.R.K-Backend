import schemas from "../schemas";
import {RoleEnum} from "@prisma/client";

export default {
    "/auth/register": {
        post: {
            tags: ["Auth"],
            summary: "Register a new user",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: {
                                    type: "string",
                                    format: "email",
                                    example: "bagr@gmail.com"
                                },
                                firstName: {
                                    type: "string",
                                    example: "Bager"
                                },
                                lastName: {
                                    type: "string",
                                    example: "Kaya"
                                },
                                role: {
                                    type: "string",
                                    enum: Object.values(RoleEnum) as string[],
                                    example: "Supervisor"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "User created",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "User created"
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "Bad request",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Bad request"
                                    }
                                }
                            }
                        }
                    }
                },
                409: {
                    description: "User already exists",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "User already exists"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/auth/login": {
        post: {
            tags: ["Auth"],
            summary: "Login",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: {
                                    type: "string",
                                    format: "email",
                                    example: "bagr@gmail.com"
                                },
                                password: {
                                    type: "string",
                                    example: "123456"
                                }
                            }
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: "Login successful",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                message: {
                                    type: "string",
                                    example: "Login successful"
                                }
                            }
                        }
                    }
                }
            },
            400: {
                description: "Bad request",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                message: {
                                    type: "string",
                                    example: "Bad request"
                                }
                            }
                        }
                    }
                }
            },
            401: {
                description: "Unauthorized",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                message: {
                                    type: "string",
                                    example: "Unauthorized"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/auth/logout": {
        post: {
            tags: ["Auth"],
            summary: "Logout",
            responses: {
                200: {
                    description: "Logout successful",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        example: "Logout successful"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

}