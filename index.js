const fs = require('fs');
const jsonschema = require('jsonschema');
const schema = require('./schema.json');
const core = require('@actions/core');
const github = require('@actions/github');


const discussionTitle = core.getInput("title");
const discussionBody = core.getInput("body");
const inputLabels = core.getInput("labels");

let discussionLabels;

if (inputLabels === '') {
  discussionLabels = [];
} else {
  const labels = inputLabels.replace('[', '').replaceAll('"', '').replace(']', '');
  discussionLabels = labels.split(',');
}

console.log("discussionlabels:", discussionLabels);

const promptJson = {
  Title: discussionTitle,
  Labels: discussionLabels,
  Body: discussionBody
};

console.log('Constructed prompt JSON:\n', JSON.stringify(promptJson, null, 2));

const promptJsonString = JSON.stringify(promptJson, null, 2);

const validationResult = jsonschema.validate(promptJson, schema);
let isvalid = '';
if (validationResult.valid) {
  isvalid = 'valid';
  console.log('Generated prompt JSON is valid.');
  fs.writeFileSync('prompt.json', promptJsonString);
} else {
  isvalid = 'invalid';
  console.log('Generated prompt JSON is invalid.');
  console.log('Validation errors:', validationResult.errors);
}
core.setOutput("validation", isvalid);