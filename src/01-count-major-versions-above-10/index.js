const axios = require('axios');
const compareVersions = require('compare-versions');

/**
 * Make the following POST request with either axios or node-fetch:

POST url: http://ambush-api.inyourarea.co.uk/ambush/intercept
BODY: {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
}

 *******

The results should have this structure:
{
    "status": 200.0,
    "location": [
      ...
    ],
    "from": "CACHE",
    "content": [
      ...
    ]
}

 ******

 *  With the results from this request, inside "content", count
 *  the number of packages that have a MAJOR semver version
 *  greater than 10.x.x
 */

module.exports = async function countMajorVersionsAbove10() {
  let version_number;
  axios
    .post('http://ambush-api.inyourarea.co.uk/ambush/intercept', {
      url: 'https://api.npms.io/v2/search/suggestions?q=react',
      method: 'GET',
      return_payload: true,
    })
    .then(function (response) {
      var json = response.data.content;
      // console.log(json[0].package.version);

      var i;
      for (i = 0; i < json.length; i++) {
        // transform JSON to string
        var json_string = JSON.stringify(json[i].package.version);
        // console.log(temp_string);
        version_number = json_string.replace(/[\"]/g, '');
        // console.log(version_number);

        // We use compareVersion to simplify comparing versions
        if (compareVersions.compare(version_number, '10.0.0', '>')) {
          // Voilà
          console.log(version_number);
        }
      }
    });

  return version_number;
};
