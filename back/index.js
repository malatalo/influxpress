const express = require("express");
const Influx = require("influx");

const influx = new Influx.InfluxDB({
    host    : 'localhost',
    database: 'testdb',
    schema  : [
        {
            measurement: 'temp',
            fields     : {
                loc : Influx.FieldType.STRING,
                temp: Influx.FieldType.FLOAT
            },
            tags: [
                'temp'
            ]
        }
    ]
});

const back        = express();
let   endpoints   = { get: [], post: [] };
      addEndpoint = (type, url, desc) => {
    endpoints[type].push({ url, desc });
}

influx.getDatabaseNames()
    .then(names => {
        if (!names.includes('testdb')) {
            return influx.createDatabase('testdb');
        }
    })
    .then(() => {
        back.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })

addEndpoint("get", "/", "get endpoints");
back.get('/', (req, res) => {
    let s = "";
    [endpoints.get, endpoints.post].map(ep =>
        ep.map(e => {
            s += e.url + " - " + e.desc + "\n\n";
        })
    )
    res.send(s)
});

addEndpoint("get", "/temps", "get 50 latest measurements");
back.get('/temps', (req, res) => {
    influx.query(`
        select * from temp
        order by time desc
        limit 50
    `).then(result => {
            res.json(result)
        }).catch(err => {
            console.log("\n\n\n\n\n", err.stack);
            res.status(500).send("rip")
        })
});