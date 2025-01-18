'use strict';
require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { tls: true })

const issueSchema = new mongoose.Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: { type: String },
  updated_on: { type: String },
  created_by: { type: String, required: true },
  assigned_to: { type: String },
  open: { type: Boolean, default: true },
  status_text: { type: String },
  project: { type: String }
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      var query = { project: project };
      if (req.query._id){
        query._id = req.query._id;
      }
      if (req.query.issue_title){
        query.issue_title = req.query.issue_title;
      }
      if (req.query.issue_text){
        query.issue_text = req.query.issue_text;
      }
      if (req.query.created_by){
        query.created_by = req.query.created_by;
      }
      if (req.query.assigned_to){
        query.assigned_to = req.query.assigned_to;
      }
      if (req.query.status_text){
        query.status_text = req.query.status_text;
      }
      if (req.query.open){
        query.open = req.query.open;
      }
      console.log(query)

      Issue.find(query).then(data => {
        console.log(data.length)
        res.json( data )
      })
    })
    
    .post(function (req, res){
      const project = req.params.project;
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by){
        res.json({
          error: 'required field(s) missing'
        });
      }else{
        var date = (new Date()).toISOString();
        var newIssue = new Issue({
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_on: date,
          updated_on: date,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to || '', 
          status_text: req.body.status_text || '',
          project: project
        });
        newIssue.save().then(writeResult => {
          res.json({
            assigned_to: req.body.assigned_to || '',
            status_text: req.body.status_text || '',
            open: true,
            _id: writeResult._id,
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_by: req.body.created_by,
            created_on: date,
            updated_on: date
          })
        })
        
        
      }
    })
    
    .put(function (req, res){
      let project = req.params.project;
      if (!req.body._id){
        res.json({
          error: 'missing _id'
        })
      }else if (req.body.issue_title || req.body.issue_text || req.body.created_by || req.body.assigned_to || req.body.status_text || req.body.open){
        var date = (new Date()).toISOString();
        var update = { updated_on: date };
        if (req.body.issue_title){
          update.issue_title = req.body.issue_title;
        }
        if (req.body.issue_text){
          update.issue_text = req.body.issue_text;
        }
        if (req.body.created_by){
          update.created_by = req.body.created_by;
        }
        if (req.body.assigned_to){
          update.assigned_to = req.body.assigned_to;
        }
        if (req.body.status_text){
          update.status_text = req.body.status_text;
        }
        if (req.body.open){
          update.open = false;
        }
        if (req.body._id.length != 24){
          res.json({
            error: 'could not update', '_id': req.body._id
          })
        }else {
          Issue.updateOne({ _id: req.body._id }, update).then((response) => {
            if (response.modifiedCount === 1){
              res.json({ 
                result: 'successfully updated', 
                '_id': req.body._id 
              })
            }else {
              res.json({
                error: 'could not update', '_id': req.body._id
              })
            }
          })
        }
      }else {
        res.json({
          error: 'no update field(s) sent', 
          '_id': req.body._id
        })
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      if (!req.body._id){
        res.json({
          error: 'missing _id'
        })
      }else if (req.body._id.length != 24){
        res.json({
          error: 'could not delete', 
          '_id': req.body._id
        })
      }else {
        Issue.deleteOne({ _id: req.body._id }).then(result => {
          if (result.deletedCount === 1){
            res.json({
              result: 'successfully deleted', 
              '_id': req.body._id
            })
          }else {
            res.json({
              error: 'could not delete', 
              '_id': req.body._id
            })
          }
        })
      }
    });
    
};
