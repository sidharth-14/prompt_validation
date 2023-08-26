import fs from 'fs';
import * as jsonschema from 'jsonschema';
import schema from './schema.json' assert { type: 'json' };
import core from '@actions/core';
import github from '@actions/github';

const discussionTitle = core.getInput("disc_title");
const discussionBody = core.getInput("disc_body");
const inputLabels = core.getInput("disc_labels");

const labels = inputLabels.replace('[','').replaceAll('"','').replace(']','')
const discussionLabels= labels.split(',');
console.log("discussionlabels:",discussionLabels);

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