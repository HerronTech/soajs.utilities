'use strict';
var gc = {
    "_id": ObjectId('55a3c82b945e350f00a2ab7e'),
    "name": "gc_articles",
    "author": "owner",
    "genericService": {
        "config": {
            "errors": {
                "400": "Database Error",
                "401": "Invalid Article Id Provided"
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
                        "l": "List Articles",
                        "group": "Articles",
                        "groupMain": true
                    }
                },
                "/add": {
                    "_apiInfo": {
                        "l": "Add Article",
                        "group": "Articles"
                    },
                    "commonFields": [
                        "title",
                        "content"
                    ]
                },
                "/update": {
                    "_apiInfo": {
                        "l": "Update Article",
                        "group": "Articles"
                    },
                    "commonFields": [
                        "title",
                        "content",
                        "id"
                    ]
                },
                "/get": {
                    "_apiInfo": {
                        "l": "Get One Article",
                        "group": "Articles"
                    },
                    "commonFields": [
                        "id"
                    ]
                },
                "/delete": {
                    "_apiInfo": {
                        "l": "Delete Article",
                        "group": "Articles"
                    },
                    "commonFields": [
                        "id"
                    ]
                }
            },
            "serviceName": "gc_articles",
            "servicePort": 4500,
            "requestTimeout": 30,
            "requestTimeoutRenewal": 5,
            "awareness": false,
            "extKeyRequired": true,
            "maxFileUpload": "4096"
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
                    "gc_articles": {
                        "cluster": "dev_cluster",
                        "tenantSpecific": true
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
                    "placeholder": "My Article ...",
                    "tooltip": "Enter the title of the article",
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
                },
                {
                    "name": "picture",
                    "label": "Picture",
                    "limit": 1,
                    "type": "image",
                    "required": false
                },
                {
                    "name": "attachments",
                    "label": "Attachments",
                    "limit": 0,
                    "type": "document",
                    "required": false
                }
            ],
            "update": [
                {
                    "name": "title",
                    "label": "Title",
                    "placeholder": "My Article ...",
                    "tooltip": "Enter the title of the article",
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
                },
                {
                    "name": "picture",
                    "label": "Picture",
                    "limit": 1,
                    "type": "image",
                    "required": false
                },
                {
                    "name": "attachments",
                    "label": "Attachments",
                    "limit": 0,
                    "type": "document",
                    "required": false
                }
            ]
        }
    },
    "v": 1,
    "ts": 1438604213165,
    "modified": 1438604213159
};