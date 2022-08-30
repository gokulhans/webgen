    
    const express = require("express");
    const router = express.Router();
    const hellsController = require("../controllers/hells-controller");

    router.get("/", hellsController.getAllHells);
    router.get('/add', hellsController.getHellAddform);
    router.post("/add", hellsController.addHell);
    router.get('/edit/:id',hellsController.getHellEditform);
    router.post("/edit", hellsController.editHell);
    router.get('/:id', hellsController.getHellById);
    router.get("/delete/:id", hellsController.deleteHell);

    module.exports = router;