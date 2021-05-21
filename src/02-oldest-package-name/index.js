const axios = require('axios');
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

 *  With the results from this request, inside "content", return
 *  the "name" of the package that has the oldest "date" value
 */

module.exports = async function oldestPackageName() {
  let name;
  axios
    .post('http://ambush-api.inyourarea.co.uk/ambush/intercept', {
      url: 'https://api.npms.io/v2/search/suggestions?q=react',
      method: 'GET',
      return_payload: true,
    })
    .then(function (response) {
      var json = response.data.content;
      //console.log(json[0].package.date);
      var oldest_date = 20210519;

      var i;
      var temp = 0;
      for (i = 0; i < json.length; i++) {
        // transform date to a string
        var temp_string = json[i].package.date.toString();
        var temp_date = temp_string.replace(/[\"-]/g, '').slice(0, 8);
        // not the cleanest way to do it, but we won't bother with date transformations
        if (temp_date < oldest_date) {
          oldest_date = temp_date;
          temp = i;
        }
      }
      // Voilà
      name = json[temp].package.name;
      console.log(name);
      //console.log(oldest_date);
    });

  return name;
};
