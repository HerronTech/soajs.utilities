var tenants = [
	{
		"_id": '571201d51ebf34041c0b062a',
		"type": "client",
		"code": "JST2",
		"name": "JSConf Tenant 3",
		"description": "JSConf Tenant 3 users Product A / Gold Package",
		"oauth": {},
		"applications": [
			{
				"product": "PRODA",
				"package": "PRODA_GOLD",
				"appId": '571201fa1ebf34041c0b062b',
				"description": "All APIs are accessible by this tenant.",
				"_TTL": 21600000,
				"keys": [
					{
						"key": "155f530f01c5fc73383406f667612dcc",
						"extKeys": [
							{
								"extKey": "d1e3b418bb1a18f35954c590d0cf06ff2d9e1f0b46b5c7d540f038efcde4430862a4ef9f71e74d8d45401441397b1c0be7e765b13266d63f509de3cd72cff059d048b2957d4aff259340f0b14f60823631a39ee57ce242fada8ee6741b594931",
								"device": {},
								"geo": {},
								"env": "TEST"
							}
						],
						"config": {
							"test": {
								"style": "imfv",
								"obj": {
									"name": "mike",
									"email": "team@soajs.org"
								}
							}
						}
					}
				]
			}
		],
		"tag": "jsconf gold"
	},
	{
		"_id": '571200f01ebf34041c0b0626',
		"type": "client",
		"code": "JSTE",
		"name": "JSConf Tenant 1",
		"description": "JSConf Tenant 1 uses Product A / Basic Package",
		"oauth": {
			"secret": "mypassword",
			"redirectURI": null,
			"grants": [
				"password",
				"refresh_token"
			]
		},
		"applications": [
			{
				"product": "PRODA",
				"package": "PRODA_BASIC",
				"appId": '5712013c1ebf34041c0b0628',
				"description": "Only Hello World APIs are accessible by this tenant.",
				"_TTL": 21600000,
				"keys": [
					{
						"key": "69bfdbb0c9ce7830b7e6088bdbd16520",
						"extKeys": [
							{
								"extKey": "9ee308d7b67d2e58a8770b99c8c0320c8d7262a72fc9516e09395bfa39f91b95190bfde9986f4e902ad5ba9de35573dbc5d087c1699c36632c1fccb91663c77529f633c8247366074d399ab326bfdeaa7211ce8c63b968c73cea7aab46296629",
								"device": {},
								"geo": {},
								"env": "TEST"
							}
						],
						"config": {
							"test": {
								"style": "simple"
							}
						}
					}
				]
			}
		],
		"tag": "jsconf basic"
	},
	{
		"_id": '571201101ebf34041c0b0627',
		"type": "client",
		"code": "JST1",
		"name": "JSConf Tenant 2",
		"description": "JSConf Tenant 2 users Product A / Gold Package",
		"oauth": {
			"secret": "oauthsecret",
			"redirectURI": null,
			"grants": [
				"password",
				"refresh_token"
			]
		},
		"applications": [
			{
				"product": "PRODA",
				"package": "PRODA_GOLD",
				"appId": '571201471ebf34041c0b0629',
				"description": "All APIs are accessible by this tenant.",
				"_TTL": 21600000,
				"keys": [
					{
						"key": "9265ab20dd23df0e1b2dcd08f1f1c3a2",
						"extKeys": [
							{
								"extKey": "4f9b4dbc4c8178a3983b8c0d42cd42d30e63f910ac5e4e51843b542c34d1f6790eda4c8b425470cb71ad6eed58787f59d1b9d8abd9cb43ddc1086641779752348c436a5e6d79c74b2aa59feaf4ecf1db868c7f77383d33b30208c8e31729b857",
								"device": {},
								"geo": {},
								"env": "TEST"
							}
						],
						"config": {
							"test": {
								"style": "advanced",
								"obj": {
									"name": "mike"
								}
							}
						}
					}
				]
			}
		],
		"tag": "jsconf gold"
	}
];

module.exports = tenants;
