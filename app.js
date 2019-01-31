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
function decodeHTMLEntities (text) {
  const entities = {
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
  return text.replace(/&([^;]+);/gm, function (match, entity) {
    return entities[entity] || match
  }).replace(/\s+/g,'').replace(/[\,|\.|\"|\*]+/g,'');
}

// save
function wirteFile(name, content) {
  fs.writeFile('./out/' + name, content, function(err) {
      if(err) {
          return console.log(err);
      }

      console.log(`The file ${name} was saved!`);
  }); 
}

const folder = './files/';

fs.readdirSync(folder).forEach(file => {
 
  readfile(folder + file, (input) => {
    send_request(input, (output) => {
      const decoded = decodeHTMLEntities(extract_output(output));
      wirteFile(file, decoded);
    });
  });
})



