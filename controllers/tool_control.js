const express = require('express')
const router = express.Router();
module.exports = router;

const db = require('../models');

//index route
router.get('/', (req, res) => {
    //res.send('tools index page');
    db.Tool.find({}, (err, toolsArray) => {
        if(err) return res.send("index route error: "+err);
        context = {allTools: toolsArray};
        res.render('tool/index.ejs', context);
    })
})

//new route
router.get('/newTool', (req, res) => {
    db.Category.find({}, (err1, catsArray) => {
        if(err1) return res.send("create route categories error: "+err1);
        context = {
            allCats: catsArray,
            catId: null,
        };
        res.render('tool/new.ejs', context);
    })
})

//new route prepopulated
router.get('/newTool/:catId', (req, res) => {
    db.Category.find({}, (err1, catsArray) => {
        if(err1) return res.send("create route categories error: "+err1);
        context = {
            allCats: catsArray,
            catId: req.params.catId,
        };
        res.render('tool/new.ejs', context);
    })
})



//create route
router.post('/', async (req, res) => {
    try {
        const createdTool = await db.Tool.create(req.body);
        const allCats = await db.Category.find({});
        for(eachCat of allCats){
            catId = eachCat._id;
            if(req.body["category_"+catId] === 'on'){
                console.log('got here');
                await createdTool.categories.push(eachCat);
                eachCat.tools.push(createdTool);
                eachCat.save();
            }
        }
        createdTool.save();
        res.redirect('/tools');
    }
    catch (err) {
        res.send("update route error: "+err);
    }

})


//show route
router.get('/:toolId', (req, res) => {
    db.Tool.findById(req.params.toolId)
    .populate('categories')
    .exec( (err, foundTool) => {
        if(err) return res.send("show route error: "+err);
        //console.log('req.params.toolId:', req.params.toolId);
        //console.log('foundTool:', foundTool);
        context = {oneTool: foundTool};
        res.render('tool/show.ejs', context);
    })
})


//edit route
router.get('/:toolId/edit', (req, res) => {
    db.Category.find({}, (err1, catsArray) => {
        if(err1) return res.send("edit route categories error: "+err1)
        db.Tool.findById(req.params.toolId, (err, foundTool) => {
            if(err) return res.send("edit route error: "+err);
            context = {
                oneTool: foundTool,
                allCats: catsArray,
            };
            res.render('tool/edit.ejs', context);
        })

    })
    
})



//update route
router.put('/:toolId', async (req, res) => {
    try{

        const allCats = await db.Category.find({});
        const oldTool = await db.Tool.findById(req.params.toolId);
        
        for(eachCat of allCats){
            catId = eachCat._id;
            const checkedCategory = req.body["category_"+catId] === 'on';
            const alreadyInCategory = oldTool.categories.includes(String(catId));

            const isCategoryAdded = checkedCategory && !(alreadyInCategory);
            const isCategoryRemoved = alreadyInCategory && !(checkedCategory);

            if(isCategoryAdded){
                await oldTool.categories.push(eachCat);
                eachCat.tools.push(oldTool);
                eachCat.save();
            } else
            if(isCategoryRemoved){
                await oldTool.categories.remove(eachCat);
                eachCat.tools.remove(oldTool);
                eachCat.save();
            }
        }
        await oldTool.save();
        
        const updatedTool = await db.Tool.findByIdAndUpdate(req.params.toolId, req.body, {new: true});

        res.redirect('/tools/'+req.params.toolId);

    }
    catch(err){
        res.send("update route error: "+err);
    }

})




//delete route
router.delete('/:toolId', async (req, res) => {
    try {
        const doomedTool = await db.Tool.findById(req.params.toolId).populate('categories').exec();
        const parentCats = doomedTool.categories;
        //console.log('parentCats:', parentCats);
        for(eachCat of parentCats){
            eachCat.tools.remove(doomedTool);
            eachCat.save();
        }
        doomedTool.deleteOne();
    }
    catch (error) {
        res.send('tool deletion route error: '+error);
    }
    res.redirect('/tools');
})
