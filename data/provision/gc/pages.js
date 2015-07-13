'use strict';
var gc = {
    "_id": ObjectId('55a3c82b945e350f00a2ab7e'),
    "name": "gc_pages",
    "author": "owner",
    "genericService": {
        "config": {
            "errors": {
                "400": "Database Error",
                "401": "Invalid Page Id Provided"
            },
            "schema": {
                "commonFields": {
                    "id": {
                        "source": [
                            "query.id"
                        ],
                        "validation": {
                            "type": "string"
                        },
                        "required": true
                    },
                    "title": {
                        "source": [
                            "body.title"
                        ],
                        "validation": {
                            "type": "string"
                        },
                        "required": true
                    },
                    "content": {
                        "source": [
                            "body.content"
                        ],
                        "validation": {
                            "type": "string"
                        },
                        "required": true
                    }
                },
                "/list": {
                    "_apiInfo": {
                        "l": "List Entries",
                        "group": "Pages",
                        "groupMain": true
                    }
                },
                "/add": {
                    "_apiInfo": {
                        "l": "Add Page",
                        "group": "Pages"
                    },
                    "commonFields": [
                        "title",
                        "content"
                    ]
                },
                "/update": {
                    "_apiInfo": {
                        "l": "Update Page",
                        "group": "Pages"
                    },
                    "commonFields": [
                        "title",
                        "content",
                        "id"
                    ]
                },
                "/get": {
                    "_apiInfo": {
                        "l": "Get One Page",
                        "group": "Pages"
                    },
                    "commonFields": [
                        "id"
                    ]
                },
                "/delete": {
                    "_apiInfo": {
                        "l": "Delete Page",
                        "group": "Pages"
                    },
                    "commonFields": [
                        "id"
                    ]
                }
            },
            "serviceName": "gc_pages",
            "servicePort": 4500,
            "requestTimeout": 30,
            "requestTimeoutRenewal": 5,
            "awareness": false,
            "extKeyRequired": true
        },
        "options": {
            "multitenant": true,
            "security": true,
            "session": true,
            "acl": true,
            "oauth": false
        }
    },
    "soajsService": {
        "db": {
            "config": {
                "DEV": {
                    "gc_pages": {
                        "tenantSpecific": true,
                        "cluster": "cluster1"
                    }
                }
            },
            "multitenant": true,
            "collection": "data"
        },
        "apis": {
            "/list": {
                "method": "get",
                "mw": {
                    "code": 400
                },
                "type": "list",
                "workflow": {}
            },
            "/add": {
                "method": "post",
                "mw": {
                    "code": 400,
                    "model": "add"
                },
                "type": "add",
                "workflow": {}
            },
            "/update": {
                "method": "post",
                "mw": {
                    "code": 401,
                    "model": "update"
                },
                "type": "update",
                "workflow": {}
            },
            "/get": {
                "method": "get",
                "mw": {
                    "code": 401
                },
                "type": "get",
                "workflow": {}
            },
            "/delete": {
                "method": "get",
                "mw": {
                    "code": 401
                },
                "type": "delete",
                "workflow": {}
            }
        }
    },
    "soajsUI": {
        "list": {
            "columns": [
                {
                    "label": "Title",
                    "name": "title",
                    "field": "fields.title",
                    "filter": []
                }
            ],
            "defaultSortField": "title",
            "defaultSortASC": false
        },
        "form": {
            "add": [
                {
                    "name": "title",
                    "label": "Title",
                    "placeholder": "My Page ...",
                    "tooltip": "Enter the title of the page",
                    "type": "text",
                    "required": true
                },
                {
                    "name": "content",
                    "label": "Content",
                    "placeholder": "",
                    "tooltip": "",
                    "type": "editor",
                    "required": true
                }
            ],
            "update": [
                {
                    "name": "title",
                    "label": "Title",
                    "placeholder": "My Page ...",
                    "tooltip": "Enter the title of the page",
                    "type": "text",
                    "required": true
                },
                {
                    "name": "content",
                    "label": "Content",
                    "placeholder": "",
                    "tooltip": "",
                    "type": "editor",
                    "required": true
                }
            ]
        }
    },
    "v": 1,
    "ts": 1436796971128
};