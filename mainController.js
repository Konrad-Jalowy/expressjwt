exports.notFound = function(req, res){
    res.status(404).json({"Error": "Endpoint doesnt exist"});
  };
  