var neodb = require('../lib/neo4jConnection');
var _ = require('underscore');
exports.getRelationsForNode = function(req, res) {
    var query = ['MATCH n-[r]-x ', 'where n.id={nodeId} ' //maaaaaaaagic
        , 'return id(r) as relId,type(r) as relType, x.id as childId, ', 'labels(x) as childLabels, x.name as childName order by relType '
    ].join('\n');
    var params = {
        nodeId: req.params.id
    };
    var relationships = [];
    neodb.db.query(query, params, function(err, r) {
        if (err) {
            console.error('Error retreiving relations from database:', err);
            res.send(404, 'no node at that location');
        } else {
            var allLabels = _.map(r, function(i) {
                return i.childLabels
            });
            var distinctLabels = _.union.apply(_, allLabels);
            var toRet = [];
            _.each(distinctLabels, function(a) {
                var labelToAdd = {
                    'name': a,
                    'relTypes': []
                };
                var labeled = _.filter(r, function(i) {
                    return _.contains(i.childLabels, a);
                });
                var mappedRelTypes = _.map(labeled, function(p) {
                    return p.relType;
                });
                var distinctRelTypes = _.union.apply(_, mappedRelTypes);
                _.each(distinctRelTypes, function(x, y, z) {
                    var relTypeToAdd = {
                        'name': x,
                        'nodes': []
                    };
                    _.chain(labeled).filter(function(i) {
                        return i.relType === x;
                    }).each(function(a) {
                        relTypeToAdd.nodes.push({
                            'id': a.childId,
                            'name': a.childName
                        });
                    });
                    labelToAdd.relTypes.push(relTypeToAdd);
                });
                toRet.push(labelToAdd);
            });
            res.json(toRet);
            //  console.log(toRet);
        }
    });
}
exports.getLabelsForNode = function(req, res) {
    //var query = ['START n=node({nodeId}) ', 'RETURN labels(n)'].join('\n');
    var query = ['MATCH n WHERE n.id ="P2"', 'RETURN labels(n)'].join('\n');
    var params = {
        nodeId: req.params.id
    };
    neodb.db.query(query, params, function(err, results) {
        if (err) {
            console.error('Error retreiving labels from database:', err);
            res.send(404, "No node at that locaton")
        } else {
            if (results[0] != null) {
                res.json(results[0]['labels(n)']);
            }
            else
            {
              res.send(404, "No node at that location");
            }
        }
    });
}
exports.getNodeById = function(req, res) {
     var query = 'MATCH n WHERE n.id ={nodeId} RETURN n'
    var params = {
        nodeId: req.params.id
    };
    //console.log("Query is " + query + " and params are " + req.params.id)
    neodb.db.query(query, params, function(err, results) {
        var nodedata = {};
        if (err) {
            console.error('Error retreiving node from database:', err);
            res.send(404, 'No node at that location');
        } else {
            //console.log("results were" + results);
            if (results[0] != null && results[0]['n'] != null && results[0]['n']['data'] != null) {
                var doohicky = results[0]['n']['data'];               
                //console.log(doohicky);
            
             nodedata.name = doohicky.name;
             nodedata.id = doohicky.id;
             nodedata.attributes = [];
             for (var prop in doohicky) {
                 nodedata.attributes.push({
                     'key': prop,
                     'value': doohicky[prop]
                })
             }
             res.json(nodedata);
            //res.send(404, "there was a node at that location, but you don't get to see it (neener)");
        }
        else
            {
              res.send(404, "No node at that location");
            }
        }
    });
};
exports.searchNodesByString = function(req, res) {
     var query = 'MATCH n WHERE n.name=~{qString} RETURN n'
    var params = {
        qString: req.params.query
    };
    console.log("Query is " + query + " and params are " + req.params.query);
    neodb.db.query(query, params, function(err, results) {
        var nodedata = {};
        if (err) {
            console.error('Error retreiving node from database:', err);
            res.send(404, 'No node at that location');
        } else {
            //console.log("results were" + results);
            if (results[0] != null && results[0]['n'] != null && results[0]['n']['data'] != null) {
                var doohicky = results[0]['n']['data'];               
                console.log(doohicky);
            
             nodedata.name = doohicky.name;
             nodedata.id = doohicky.id;
             nodedata.attributes = [];
             for (var prop in doohicky) {
                 nodedata.attributes.push({
                     'key': prop,
                     'value': doohicky[prop]
                })
             }
             res.json(nodedata);
            //res.send(404, "there was a node at that location, but you don't get to see it (neener)");
        }
        else
            {
              res.send(404, "No node at that location");
            }
        }
    });
};