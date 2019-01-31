const request = require('request');
const  fs = require('fs');
// sending request
function send_request(Dirty , cb) {
  const uri = 'https://www.htmlwasher.com/paste/ajax/';
  const method = 'POST';
  const formData = {Dirty};
  request({ uri, method, formData }, (err, res, body) => {
    if (err) { console.log('error:' + err); }
    cb(body);
  });
}

// extracting output
function extract_output(output) {   
   return /<textarea.*>(.*?)<\/textarea>/g.exec(output)[1];
}


// readfile
function readfile(path, cb) {
  fs.readFile(path, 'utf8', function(err, contents) {
     cb(contents);
  });
}

// decode
var entities = {
  'amp': '&',
  'apos': '\'',
  '#x27': '\'',
  '#x2F': '/',
  '#39': '\'',
  '#47': '/',
  'lt': '<',
  'gt': '>',
  'nbsp': ' ',
  'quot': '"',
  '#xD': ' ',
  '#xA': ' ',
  '#xFFFD': ' '
}

function decodeHTMLEntities (text) {
  return text.replace(/&([^;]+);/gm, function (match, entity) {
    return entities[entity] || match
  }).replace(/\s+/g,'').replace(/[\,|\.|\"|\*]+/g,'');
}



readfile('./files/R0071015a.html', (input) => {
  send_request(input, (output) => {
    const out = extract_output(output)
    console.log(decodeHTMLEntities(out));
  });
});



